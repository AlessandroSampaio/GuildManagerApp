import { penaltyApi } from "@/api/penalty";
import { penaltyKeys } from "@/lib/query-keys";
import { PlayerScore } from "@/types/player-scoring";
import { useQueryClient } from "@tanstack/solid-query";
import { Component, createSignal, For, Show } from "solid-js";
import { CharacterSection } from "./CharacterSection";
import { PlayerPenaltiesSection } from "./PlayerPenaltiesSection";
import { RankBar } from "./ui/RankBar";

export const PlayerCard: Component<{
  player: PlayerScore;
  rank: number;
  raidWeekId: number;
}> = (p) => {
  const [expanded, setExpanded] = createSignal(false);
  const [fetchPenalties, setFetchPenalties] = createSignal(false);
  const qc = useQueryClient();
  const pl = p.player;

  let hoverTimer: ReturnType<typeof setTimeout> | undefined;

  const onMouseEnter = () => {
    hoverTimer = setTimeout(() => {
      qc.prefetchQuery({
        queryKey: penaltyKeys.playerPenalties(p.raidWeekId, pl.playerId),
        queryFn: () =>
          penaltyApi.listPlayerWeekPenalties(p.raidWeekId, pl.playerId),
        staleTime: 30 * 1000,
      });
    }, 300);
  };

  const onMouseLeave = () => {
    clearTimeout(hoverTimer);
  };

  const rankBadgeClass = () => {
    if (p.rank === 1) return "text-amber-300 border-amber-700 bg-amber-950/50";
    if (p.rank === 2) return "text-stone-300 border-stone-600 bg-stone-900/50";
    if (p.rank === 3)
      return "text-amber-700 border-amber-900/60 bg-amber-950/30";
    return "text-stone-500 border-void-600 bg-void-800/30";
  };

  return (
    <div
      class="card !p-0 overflow-hidden animate-fade-in"
      style={`animation-delay:${(p.rank - 1) * 40}ms`}
    >
      {/* Player header */}
      <button
        onClick={() => {
          setFetchPenalties(true);
          setExpanded((v) => !v);
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        class="w-full flex items-center gap-4 px-5 py-4 hover:bg-void-800/30 transition-colors text-left"
      >
        {/* Rank badge */}
        <div
          class={`font-mono text-sm font-bold w-8 h-8 flex items-center justify-center border shrink-0 ${rankBadgeClass()}`}
        >
          {p.rank}
        </div>

        {/* Player name */}
        <div class="flex-1 min-w-0">
          <p class="text-stone-100 font-display text-base tracking-wide">
            {pl.playerName}
          </p>
          <p class="font-mono text-[10px] text-stone-600 mt-0.5">
            {pl.characters.length} character
            {pl.characters.length !== 1 ? "s" : ""}
            <Show when={pl.unscoredEntries > 0}>
              <span class="ml-2 text-amber-700">
                · {pl.unscoredEntries} sem ranking
              </span>
            </Show>
          </p>
        </div>

        {/* Avg rank */}
        <Show when={pl.averageRankPercent !== null}>
          <div class="w-28 hidden sm:block">
            <p class="label-xs mb-1">Média rank %</p>
            <RankBar value={pl.averageRankPercent} />
          </div>
        </Show>

        {/* Total points */}
        <div class="text-right shrink-0">
          <p class="font-display text-2xl font-bold text-stone-100">
            {pl.totalPoints}
          </p>
          <p class="label-xs">pontos</p>
        </div>

        {/* Expand chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          class={`text-stone-600 shrink-0 transition-transform duration-200 ${expanded() ? "rotate-180" : ""}`}
        >
          <path
            d="M3 5l4 4 4-4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      {/* Characters + Penalties */}
      <Show when={expanded()}>
        <div class="border-t border-void-700 animate-fade-in">
          <For each={pl.characters}>
            {(char) => <CharacterSection char={char} />}
          </For>
          <PlayerPenaltiesSection
            raidWeekId={p.raidWeekId}
            playerId={pl.playerId}
            fetchEnabled={fetchPenalties}
          />
        </div>
      </Show>
    </div>
  );
};
