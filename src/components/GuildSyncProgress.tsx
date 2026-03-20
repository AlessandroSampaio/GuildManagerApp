import { GuildSyncWsState } from "@/lib/useGuildSyncWs";
import { Component, Show } from "solid-js";

export const GuildSyncProgress: Component<{
  syncWs: GuildSyncWsState;
  isSyncing: () => boolean;
}> = (p) => (
  <Show when={p.syncWs.phase() !== null}>
    <div
      class={`px-4 py-2.5 border-b shrink-0 transition-colors
        ${p.syncWs.isFailed()
          ? "border-red-900/60 bg-red-950/20"
          : p.syncWs.isCompleted()
            ? "border-emerald-900/60 bg-emerald-950/20"
            : "border-void-700 bg-void-800/60"
        }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="flex items-center gap-2">
        {/* Status icon */}
        <Show when={p.isSyncing()}>
          <div class="w-1.5 h-1.5 rounded-full bg-ember-600 shadow-[0_0_6px_rgba(245,158,11,0.6)] animate-pulse shrink-0" />
        </Show>
        <Show when={p.syncWs.isCompleted()}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="#34d399"
            stroke-width="2"
            class="shrink-0"
          >
            <path
              d="M2 6.5l3 3 5-5.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Show>
        <Show when={p.syncWs.isFailed()}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class="text-red-400 shrink-0"
          >
            <circle cx="6" cy="6" r="5" />
            <line x1="6" y1="3.5" x2="6" y2="6.5" stroke-linecap="round" />
            <circle cx="6" cy="8.5" r="0.5" fill="currentColor" stroke="none" />
          </svg>
        </Show>

        {/* Message */}
        <p
          class={`font-mono text-[10px] leading-relaxed flex-1 truncate
            ${p.syncWs.isFailed()
              ? "text-red-400"
              : p.syncWs.isCompleted()
                ? "text-emerald-400"
                : "text-stone-400"
            }`}
        >
          {p.syncWs.message()}
        </p>

        {/* Final count */}
        <Show when={p.syncWs.isCompleted() && p.syncWs.charactersSynced() !== null}>
          <span class="font-mono text-[9px] text-emerald-600 shrink-0">
            {p.syncWs.charactersSynced()} sincronizados
          </span>
        </Show>

        {/* WS live dot */}
        <Show when={p.syncWs.isActive()}>
          <div
            class="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shrink-0"
            title="WebSocket conectado"
          />
        </Show>
      </div>
    </div>
  </Show>
);
