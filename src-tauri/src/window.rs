// Native window controls

use tauri::{Runtime, WebviewWindow};

#[taurpc::procedures(path = "window", export_to = "../src/ipc/bindings.ts")]
pub trait WindowApi {
    // Minimize the main application window
    async fn minimize<R: Runtime>(window: WebviewWindow<R>);
    // Toggle between maximized and restored state
    async fn toggle_maximize<R: Runtime>(window: WebviewWindow<R>);
    // Close the main application window
    async fn close<R: Runtime>(window: WebviewWindow<R>);
    // Returns `true` when the window is currently maximized.
    async fn is_maximized<R: Runtime>(window: WebviewWindow<R>) -> bool;
}

#[derive(Clone, Debug)]
pub struct WindowApiImpl;

#[taurpc::resolvers]
impl WindowApi for WindowApiImpl {
    async fn minimize<R: Runtime>(self, window: WebviewWindow<R>) {
        let _ = window.minimize();
    }

    async fn toggle_maximize<R: Runtime>(self, window: WebviewWindow<R>) {
        let is_maximized = window.is_maximized().unwrap_or(false);
        if is_maximized {
            let _ = window.unmaximize();
        } else {
            let _ = window.maximize();
        }
    }

    async fn close<R: Runtime>(self, window: WebviewWindow<R>) {
        let _ = window.close();
    }

    async fn is_maximized<R: Runtime>(self, window: WebviewWindow<R>) -> bool {
        window.is_maximized().unwrap_or(false)
    }
}
