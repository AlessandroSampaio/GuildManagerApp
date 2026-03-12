use std::sync::Arc;
use tokio::sync::Mutex;

use tauri::{AppHandle, Manager};

#[taurpc::procedures(path = "file_ops", export_to = "../src/ipc/bindings.ts")]
pub trait FileOpsApi {
    async fn get_download_dir() -> Result<String, String>;
    async fn save_bytes(path: String, data: Vec<u8>) -> Result<(), String>;
}

#[derive(Clone, Debug)]
pub struct FileOpsApiImpl {
    pub app_slot: Arc<Mutex<Option<AppHandle>>>,
}

impl FileOpsApiImpl {
    async fn app(&self) -> AppHandle {
        self.app_slot
            .lock()
            .await
            .clone()
            .expect("AppHandle not yet initialized — called before setup()?")
    }
}

#[taurpc::resolvers]
impl FileOpsApi for FileOpsApiImpl {
    async fn get_download_dir(self) -> Result<String, String> {
        let app = self.app().await;
        app.path()
            .download_dir()
            .map(|p| p.to_string_lossy().to_string())
            .map_err(|e| e.to_string())
    }

    async fn save_bytes(self, path: String, data: Vec<u8>) -> Result<(), String> {
        println!("Writing {:?} bytes to {:?}", data.len(), path);
        std::fs::write(&path, data).map_err(|e| e.to_string())
    }
}
