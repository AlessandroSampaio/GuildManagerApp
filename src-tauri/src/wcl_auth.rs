use std::sync::Arc;

use crate::{events::AppEventTrigger, AppState};

use tauri::{AppHandle, Manager};
use tokio::sync::Mutex;

// WclAuthApi - Warcraftlogs OAuth window management
#[taurpc::ipc_type]
#[derive(Debug)]
pub struct WclWindowResult {
    // Whether the window was successfully opened (not whether auth was successful)
    pub opened: bool,
    // Human readable status / error message
    pub message: String,
}

#[taurpc::procedures(path = "wcl_auth", export_to = "../src/ipc/bindings.ts")]
pub trait WclAuthApi {
    // Opens an embedded WebviewWindow pointing at the WarcraftLogs OAuth
    // authorization URL. The frontend should listen for the `AppEvents.wcl_auth_complete`
    // event to know when the callback has been received by the API server.
    async fn open_auth_window(url: String) -> WclWindowResult;

    // Called by the frontend (or the callback redirect page) to signal that
    // the OAuth flow completed. Closes the `wcl-oauth` window if still open
    // and emits the `AppEvents.wcl_auth_complete` event to all other windows.
    async fn notify_auth_complete();

    // Closes the `wcl-oauth` window if it exists, regardless of auth state.
    async fn close_auth_window();

    // Returns `true` if the `wcl-oauth` window is currently open.
    async fn is_auth_window_open() -> bool;
}

#[derive(Clone)]
pub struct WclAuthApiImpl {
    // Populated in `setup()` before any IPC call can arrive.
    pub app_slot: Arc<Mutex<Option<AppHandle>>>,
    pub state: AppState,
}

impl WclAuthApiImpl {
    /// Panics only if called before `setup()` runs — which Tauri guarantees
    /// never happens because setup completes before the event loop starts.
    async fn app(&self) -> AppHandle {
        self.app_slot
            .lock()
            .await
            .clone()
            .expect("AppHandle not yet initialized — called before setup()?")
    }
}

#[taurpc::resolvers]
impl WclAuthApi for WclAuthApiImpl {
    async fn open_auth_window(self, url: String) -> WclWindowResult {
        let app = self.app().await;

        if let Some(existing) = app.get_webview_window("wcl-oauth") {
            let _ = existing.close();
            tokio::time::sleep(tokio::time::Duration::from_millis(150)).await;
        }

        let parsed = match url.parse::<tauri::Url>() {
            Ok(u) => u,
            Err(e) => {
                return WclWindowResult {
                    opened: false,
                    message: format!("Invalid URL: {e}"),
                }
            }
        };

        match tauri::WebviewWindowBuilder::new(
            &app,
            "wcl-oauth",
            tauri::WebviewUrl::External(parsed),
        )
        .title("WarcraftLogs — Autorizar Acesso")
        .inner_size(540.0, 700.0)
        .min_inner_size(400.0, 500.0)
        .center()
        .resizable(true)
        .always_on_top(true)
        .build()
        {
            Ok(_) => {
                *self.state.wcl_window_open.lock().await = true;
                WclWindowResult {
                    opened: true,
                    message: "Window opened successfully.".into(),
                }
            }
            Err(e) => WclWindowResult {
                opened: false,
                message: format!("Fail to open window: {e}"),
            },
        }
    }

    async fn notify_auth_complete(self) {
        let app = self.app().await;

        // Close OAuth windows
        if let Some(win) = app.get_webview_window("wcl-oauth") {
            let _ = win.close();
        }

        // Update inner status
        *self.state.wcl_window_open.lock().await = false;

        // Emit typed event to the main window via TauRPC event trigger
        let trigger = AppEventTrigger::new(app);
        let _ = trigger.wcl_auth_complete(true);
    }

    async fn close_auth_window(self) {
        let app = self.app().await;

        if let Some(win) = app.get_webview_window("wcl-oauth") {
            let _ = win.close();
        }
        *self.state.wcl_window_open.lock().await = false;
    }

    async fn is_auth_window_open(self) -> bool {
        self.app().await.get_webview_window("wcl-oauth").is_some()
    }
}
