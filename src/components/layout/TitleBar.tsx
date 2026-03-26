/**
 * Frameless application titlebar.
 *
 * Window controls (minimize, maximize, close) are called via the TauRPC
 * `windowIpc` proxy — fully typed, no raw `invoke()` strings.
 */
import { appVersion } from "@/lib/version";
import { Component, createSignal, onMount } from "solid-js";
import { createTauRPCProxy } from "@/ipc/bindings";

const TitleBar: Component = () => {
  const [maximized, setMaximized] = createSignal(false);
  const rpc = createTauRPCProxy();

  onMount(async () => {
    setMaximized(await rpc.window.is_maximized());
  });

  async function handleToggleMax() {
    await rpc.window.toggle_maximize();
    setMaximized(await rpc.window.is_maximized());
  }

  return (
    <div class="flex items-center h-8 bg-void-950 border-b border-void-700 shrink-0 drag select-none">
      {/* Logo mark + app name */}
      <div class="flex items-center gap-2.5 px-4 h-full border-r border-void-700">
        <div class="relative w-3.5 h-3.5 shrink-0">
          <div class="absolute inset-0 border border-ember-700 rotate-45 bg-forge-900" />
          <div class="absolute inset-[3px] bg-ember-700 rotate-45" />
        </div>
        <span class="font-display text-[9px] tracking-[0.3em] text-ember-700 uppercase">
          Guild Manager v{appVersion()}
        </span>
      </div>

      {/* Drag region */}
      <div class="flex-1 h-full" />

      {/* Window controls — no-drag so clicks reach the buttons */}
      <div class="flex items-center h-full no-drag">
        {/* Minimize */}
        <button
          title="Minimizar"
          onClick={() => rpc.window.minimize()}
          class="w-10 h-full flex items-center justify-center text-stone-500
                     hover:text-stone-200 hover:bg-void-700 transition-colors duration-150"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect
              x="3"
              y="7.5"
              width="10"
              height="1"
              rx="0.5"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Maximize / restore — icon changes based on state */}
        <button
          title={maximized() ? "Restaurar" : "Maximizar"}
          onClick={handleToggleMax}
          class="w-10 h-full flex items-center justify-center text-stone-500
                     hover:text-stone-200 hover:bg-void-700 transition-colors duration-150"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.1"
          >
            {maximized() ? (
              /* Restore icon: overlapping squares */
              <>
                <rect x="5.5" y="2.5" width="8" height="8" rx="0.5" />
                <path d="M2.5 5.5v8h8" />
              </>
            ) : (
              /* Maximize icon: single square */
              <rect x="2.5" y="2.5" width="11" height="11" rx="0.5" />
            )}
          </svg>
        </button>

        {/* Close */}
        <button
          title="Fechar"
          onClick={() => rpc.window.close()}
          class="w-10 h-full flex items-center justify-center text-stone-500
                     hover:text-white hover:bg-red-800 transition-colors duration-150"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            stroke="currentColor"
            stroke-width="1.3"
          >
            <line x1="4" y1="4" x2="12" y2="12" stroke-linecap="round" />
            <line x1="12" y1="4" x2="4" y2="12" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
