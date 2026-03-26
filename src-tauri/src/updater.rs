use std::sync::Arc;
use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;
use tokio::sync::Mutex;

/// Serializable info about an available update, returned to the frontend.
#[taurpc::ipc_type]
#[derive(Debug)]
pub struct UpdateInfo {
    pub version: String,
    pub body: Option<String>,
}

#[taurpc::procedures(path = "updater", export_to = "../src/ipc/bindings.ts")]
pub trait UpdaterApi {
    async fn check_update() -> Option<UpdateInfo>;

    async fn install_update();
}

#[derive(Clone)]
pub struct UpdaterApiImpl {
    pub app_slot: Arc<Mutex<Option<AppHandle>>>,
}

#[taurpc::resolvers]
impl UpdaterApi for UpdaterApiImpl {
    /// Check if a newer version is available. Returns `None` when up-to-date.
    async fn check_update(self) -> Option<UpdateInfo> {
        let slot = self.app_slot.lock().await;
        let handle = slot.as_ref()?;

        let updater = handle.updater().ok()?;
        let update = updater.check().await.ok()??;

        Some(UpdateInfo {
            version: update.version.clone(),
            body: update.body.clone(),
        })
    }

    /// Download and install the latest update, then restart the app.
    /// Should only be called after `check_update` returned `Some`.
    async fn install_update(self) {
        let slot = self.app_slot.lock().await;
        let Some(handle) = slot.as_ref() else {
            return;
        };

        let Ok(updater) = handle.updater() else {
            return;
        };

        let Ok(Some(update)) = updater.check().await else {
            return;
        };

        // download_and_install(on_chunk, on_download_finish)
        // Progress events can be forwarded to the frontend via Tauri events if needed.
        let _ = update
            .download_and_install(|_chunk, _total| {}, || {})
            .await;
    }
}
