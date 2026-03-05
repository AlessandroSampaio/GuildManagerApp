import { roleClass } from "@/helpers";
import { useReportPerformance } from "@/lib";
import { PerformanceEntry } from "@/types/reports";
import { Component, For, Show } from "solid-js";
import { RankBar } from "./RankBar";
import { SkeletonList } from "./Skeleton";

const PerformanceTable: Component<{
  fightId: number;
  reportCode: string;
  importStatus: () => string | undefined;
}> = (props) => {
  const perf = useReportPerformance(
    () => props.reportCode,
    () => props.fightId,
    props.importStatus,
  );

  return (
    <Show when={!perf.isLoading} fallback={<SkeletonList rows={5} />}>
      <Show when={perf.isError}>
        <div class="text-center py-10">
          <p class="text-red-400 text-sm font-semibold mb-1">
            Erro ao carregar performance
          </p>
          <p class="text-stone-600 font-mono text-xs">{String(perf.error)}</p>
        </div>
      </Show>
      <Show when={!perf.isError}>
        <Show
          when={(perf.data?.length ?? 0) > 0}
          fallback={
            <div class="text-center py-10">
              <p class="text-stone-600 text-sm font-mono">
                Sem dados de performance para este fight.
              </p>
            </div>
          }
        >
          {/* Column headers */}
          <div
            class="grid grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr] gap-3 px-4 py-2"
            aria-hidden="true"
          >
            {["Jogador / Spec", "Role", "Qtd", "Rank %", "Melhor %"].map(
              (h) => (
                <p class="label-xs">{h}</p>
              ),
            )}
          </div>

          {/* Entries — data is pre-sorted desc by amount from useReportPerformance */}
          <div class="space-y-1" role="list">
            <For each={perf.data}>
              {(entry: PerformanceEntry, i) => (
                <div
                  role="listitem"
                  class="grid grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr] gap-3 px-4 py-3
                               bg-void-800 border border-void-700 hover:border-void-600
                               transition-colors items-center animate-fade-in"
                  style={`animation-delay:${i() * 25}ms`}
                >
                  <div class="min-w-0">
                    <p class="font-semibold text-sm text-stone-200 truncate">
                      {entry.characterName}
                    </p>
                    <p class="font-mono text-[10px] text-stone-600">
                      {entry.spec}
                    </p>
                  </div>

                  <span class={roleClass(entry.role)}>{entry.role}</span>

                  <p class="font-mono text-xs text-stone-300">
                    {entry.amount >= 1000
                      ? `${(entry.amount / 1000).toFixed(1)}k`
                      : entry.amount.toFixed(0)}
                  </p>

                  <RankBar value={entry.rankPercent} />
                  <RankBar value={entry.bestPercent} />
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </Show>
  );
};

export default PerformanceTable;
