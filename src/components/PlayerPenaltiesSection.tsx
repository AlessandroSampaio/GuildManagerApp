import { usePlayerWeekPenalties } from "@/lib/queries/penalty";
import { Component, createSignal, For, Show } from "solid-js";

interface Props {
  raidWeekId: number;
  playerId: number;
  fetchEnabled: () => boolean;
}

export const PlayerPenaltiesSection: Component<Props> = (p) => {
  const [open, setOpen] = createSignal(false);

  const query = usePlayerWeekPenalties(
    () => p.raidWeekId,
    () => p.playerId,
    p.fetchEnabled,
  );

  const penalties = () => query.data ?? [];
  const total = () => penalties().reduce((sum, pen) => sum + pen.points, 0);

  return (
    <div class="border border-void-700">
      <button
        onClick={() => setOpen((v) => !v)}
        class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-void-800/30 transition-colors text-left"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          class={`text-stone-600 shrink-0 transition-transform duration-150 ${open() ? "rotate-90" : ""}`}
        >
          <path
            d="M4 2l4 4-4 4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span class="text-red-400 font-semibold text-sm flex-1">
          Penalidades
        </span>

        <Show when={query.isLoading}>
          <span class="font-mono text-[10px] text-stone-600 animate-pulse">
            carregando…
          </span>
        </Show>

        <Show when={!query.isLoading}>
          <span class="font-mono text-[10px] text-stone-500">
            {penalties().length} registro{penalties().length !== 1 ? "s" : ""}
          </span>
          <span
            class={`font-mono text-xs font-bold ml-2 w-20 text-right ${total() < 0 ? "text-red-400" : "text-stone-400"}`}
          >
            {total()} pts
          </span>
        </Show>
      </button>

      <Show when={open()}>
        <div class="border-t border-void-700 bg-void-900/20 animate-fade-in">
          <Show when={penalties().length === 0 && !query.isLoading}>
            <p class="px-4 py-3 font-mono text-[11px] text-stone-600">
              Nenhuma penalidade registrada.
            </p>
          </Show>

          <For each={penalties()}>
            {(pen) => (
              <div class="grid grid-cols-[1fr_auto] gap-x-3 px-4 py-2 border-b border-void-700/50 last:border-0">
                <div class="min-w-0">
                  <p class="text-stone-200 text-xs font-semibold truncate">
                    {pen.penaltyDescription}
                  </p>
                  <p class="font-mono text-[10px] text-stone-500 mt-0.5">
                    {pen.playerName}
                    <Show when={pen.note}>
                      <span class="ml-2 text-stone-600">· {pen.note}</span>
                    </Show>
                  </p>
                </div>
                <span
                  class={`font-mono text-xs font-bold self-center ${pen.points < 0 ? "text-red-400" : "text-stone-400"}`}
                >
                  {pen.points} pts
                </span>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
