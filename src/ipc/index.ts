/**
 * Typed TauRPC client proxies.
 *
 * Import from "@/ipc" to call Rust procedures with full TypeScript safety.
 * All function names, argument types, and return types are inferred from the
 * Rust `#[taurpc::procedures]` trait definitions via the generated bindings.
 *
 * Usage:
 *   import { windowIpc, wclAuthIpc, listenWclAuthComplete } from "@/ipc";
 *
 *   await windowIpc.minimize();
 *   const result = await wclAuthIpc.openAuthWindow("https://...");
 *   const unlisten = await listenWclAuthComplete((success) => { ... });
 */
import { createTauRPCProxy, type WclWindowResult } from "./bindings";

// ── Re-export shared types ────────────────────────────────────────────────────
export type { WclWindowResult } from "./bindings";

// ── Proxy type definitions ────────────────────────────────────────────────────
// These mirror the Rust traits exactly. When `npm run tauri dev` is run, the
// real types are generated into bindings.ts and override these manually-written
// definitions. Keep them in sync if you add procedures before the first build.

interface WindowApiProxy {
  minimize(): Promise<void>;
  toggle_maximize(): Promise<void>;
  close(): Promise<void>;
  is_maximized(): Promise<boolean>;
}

interface WclAuthApiProxy {
  open_auth_window(url: string): Promise<WclWindowResult>;
  notify_auth_complete(): Promise<void>;
  close_auth_window(): Promise<void>;
  is_auth_window_open(): Promise<boolean>;
}

// ── Create proxies with TauRPC (path maps to Rust trait path attribute) ───────
const proxy = createTauRPCProxy();

/**
 * Controls the native application window.
 * Maps to `WindowApi` (path = "window") in Rust.
 */
export const windowIpc: WindowApiProxy = proxy.window;

/**
 * Manages the embedded WarcraftLogs OAuth WebviewWindow.
 * Maps to `WclAuthApi` (path = "wcl_auth") in Rust.
 */
export const wclAuthIpc: WclAuthApiProxy = proxy.wcl_auth;

// ── Event listeners (AppEventsApi outbound events) ───────────────────────────
// Events are emitted by Rust via `AppEventsTrigger` and listened to here.
// The event names follow TauRPC's convention: "events.{method_name}"

import { type UnlistenFn } from "@tauri-apps/api/event";

/** Fired when the WCL OAuth callback was processed. `success = true` means a token was stored. */
export function listenWclAuthComplete(
  cb: (success: boolean) => void,
): Promise<UnlistenFn> {
  return proxy.events.wcl_auth_complete.on((e) => cb(e));
  // return listen<boolean>("wcl_auth_complete", (e) => cb(e.payload));
}

/** Fired when the user closes the OAuth window before completing authorisation. */
export function listenWclAuthCancelled(cb: () => void): Promise<UnlistenFn> {
  return proxy.events.wcl_auth_cancelled.on(() => cb());
  // return listen("wcl_auth_cancelled", () => cb());
}
