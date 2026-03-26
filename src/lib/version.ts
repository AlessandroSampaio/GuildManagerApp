import { getVersion } from "@tauri-apps/api/app";
import { createSignal } from "solid-js";

// Populated once at module load from the Tauri runtime.
// Source of truth: package.json → tauri.conf.json → Tauri API.
const [appVersion, setAppVersion] = createSignal("...");

getVersion()
  .then(setAppVersion)
  .catch(() => setAppVersion("?.?.?"));

export { appVersion };
