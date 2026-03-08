import { PlayerCharacterScore } from "@/types/player-scoring";
import { Component, createSignal, For, Show } from "solid-js";
import { RankBar } from "./ui/RankBar";
import { FightRow } from "./FightRow";

export const CharacterSection: Component<{ char: PlayerCharacterScore }> = (
  p,
) => {
  const [open, setOpen] = createSignal(false);
  const c = p.char;

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
        <span class="text-stone-200 font-semibold text-sm flex-1">
          {c.characterName}
        </span>
        <span class="font-mono text-[10px] text-stone-600">
          {c.class} · {c.server}
        </span>
        <Show when={c.averageRankPercent !== null}>
          <div class="w-20">
            <RankBar value={c.averageRankPercent} />
          </div>
        </Show>
        <span class="font-mono text-xs font-bold text-stone-200 ml-2 w-20 text-right">
          {c.totalPoints} pts
        </span>
      </button>

      {/* Fight details */}
      <Show when={open()}>
        <div class="border-t border-void-700 bg-void-900/20 animate-fade-in">
          {/* Sub-header */}
          <div class="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 px-4 py-1.5 border-b border-void-700 bg-void-800/30">
            <span class="label-xs">Boss</span>
            <span class="label-xs">Spec</span>
            <span class="label-xs">Perf.</span>
            <span class="label-xs w-24">Rank %</span>
            <span class="label-xs w-16 text-right">Pontos</span>
          </div>
          <For each={c.fights}>{(fight) => <FightRow entry={fight} />}</For>
        </div>
      </Show>
    </div>
  );
};
