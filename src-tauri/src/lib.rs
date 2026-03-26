mod events;
mod file_ops;
mod updater;
mod wcl_auth;
mod window;

use events::{AppEventsApi, AppEventsApiImpl};
use file_ops::{FileOpsApi, FileOpsApiImpl};
use std::sync::Arc;
use tauri::AppHandle;
use taurpc::Router;
use tokio::sync::Mutex;
use updater::{UpdaterApi, UpdaterApiImpl};
use wcl_auth::{WclAuthApi, WclAuthApiImpl};
use window::{WindowApi, WindowApiImpl};

#[derive(Clone, Default)]
struct AppState {
    /// Tracks whether the WCL OAuth window is currently open.
    wcl_window_open: Arc<Mutex<bool>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let state = AppState::default();

    // AppHandle is not available when invoke_handler is registered, but
    // TauRPC impl structs are cloned per-call so we can seed the handle
    // into a shared slot inside setup() before any IPC call arrives.
    let app_slot: Arc<Mutex<Option<AppHandle>>> = Arc::new(Mutex::new(None));

    let router = Router::new()
        .merge(
            FileOpsApiImpl {
                app_slot: app_slot.clone(),
            }
            .into_handler(),
        )
        .merge(AppEventsApiImpl.into_handler())
        .merge(WindowApiImpl.into_handler())
        .merge(
            UpdaterApiImpl {
                app_slot: app_slot.clone(),
            }
            .into_handler(),
        )
        .merge(
            WclAuthApiImpl {
                app_slot: app_slot.clone(),
                state: state.clone(),
            }
            .into_handler(),
        );

    let app_slot_setup = app_slot.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(move |app| {
            // Seed the handle into the shared slot; all subsequent IPC calls
            // will find it populated since setup runs before the event loop.
            let handle = app.handle().clone();

            let _ = tokio::task::spawn_blocking(move || {
                // This shall block until the `lock` is released.
                let mut slot = app_slot_setup.blocking_lock();
                *slot = Some(handle.clone());
            });

            Ok(())
        })
        .invoke_handler(router.into_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
