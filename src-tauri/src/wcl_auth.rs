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

        let win = match tauri::WebviewWindowBuilder::new(
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
            Ok(w) => w,
            Err(e) => {
                return WclWindowResult {
                    opened: false,
                    message: format!("Falha ao abrir janela: {e}"),
                }
            }
        };

        *self.state.wcl_window_open.lock().await = true;

        let state_ref = self.state.clone();
        let app_ref = app.clone();

        win.on_window_event(move |event| {
            if !matches!(event, tauri::WindowEvent::Destroyed) {
                return;
            }

            // `blocking_lock` is acceptable here: this closure runs on Tauri's
            // event-loop thread and the critical section is a single flag read.
            let mut open = state_ref.wcl_window_open.try_lock().unwrap();
            if !*open {
                // Flag already cleared by notify_auth_complete() — window was
                // closed as part of a successful auth flow. Nothing to emit.
                return;
            }

            // Flag still set → user closed the window manually before the
            // OAuth callback page could call notify_auth_complete().
            *open = false;
            drop(open); // release before emitting

            let trigger = AppEventTrigger::new(app_ref.clone());
            let _ = trigger.wcl_auth_cancelled();
        });

        return WclWindowResult {
            opened: true,
            message: "Janela WarcraftLogs aberta.".into(),
        };
    }

    async fn notify_auth_complete(self) {
        let app = self.app().await;

        *self.state.wcl_window_open.lock().await = false;

        if let Some(win) = app.get_webview_window("wcl-oauth") {
            let _ = win.close();
        }

        let trigger = AppEventTrigger::new(app);
        let _ = trigger.wcl_auth_complete(true);
    }

    async fn close_auth_window(self) {
        let app = self.app().await;

        *self.state.wcl_window_open.lock().await = false;

        if let Some(win) = app.get_webview_window("wcl-oauth") {
            let _ = win.close();
        }
    }

    async fn is_auth_window_open(self) -> bool {
        self.app().await.get_webview_window("wcl-oauth").is_some()
    }
}
