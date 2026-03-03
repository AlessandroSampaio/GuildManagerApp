import FightRow from "@/components/ui/FightRow";
import PerformanceTable from "@/components/ui/PerformanceTable";
import { SkeletonList } from "@/components/ui/Skeleton";
import { fmtMs } from "@/helpers";
import { useReportDetail } from "@/lib";
import { Fight } from "@/types/reports";
import { A, useParams } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";

const ReportDetailPage = () => {
  const params = useParams<{ code: string }>();
  const [selectedFight, setSelectedFight] = createSignal<Fight | null>(null, {
    equals: (a, b) => a?.id === b?.id,
  });

  const report = useReportDetail(() => params.code);

  return (
    <div class="flex-1 flex min-h-0">
      <div class="w-72 border-r border-void-700 flex flex-col shrink-0">
        <div class="p-4 border-b border-void-700">
          <A
            href="/app/reports"
            class="flex items-center gap-1.5 font-mono text-[10px] text-stone-600
           hover:text-ember-600 transition-colors mb-3"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
              aria-hidden="true"
            >
              <path d="M7 2L3 5l4 3" />
            </svg>
            Todos os reports
          </A>

          <Show when={report.isLoading}>
            <div class="space-y-2 animate-pulse">
              <div class="h-3 bg-void-700 rounded w-3/4" />
              <div class="h-2 bg-void-700 rounded w-1/2" />
            </div>
          </Show>

          <Show when={report.isError}>
            <p class="text-red-400 text-xs font-mono">
              Erro: {String(report.error)}
            </p>
          </Show>

          <Show when={report.isSuccess}>
            <p class="font-semibold text-stone-100 text-sm leading-snug">
              {report.data!.title}
            </p>
            <p class="font-mono text-[10px] text-stone-600 mt-1">
              {report.data!.id} · {report.data!.guild?.name ?? "sem guilda"}
            </p>
          </Show>
        </div>

        <div class="flex-1 overflow-y-auto py-1.5 space-y-px">
          <Show when={report.isLoading}>
            <SkeletonList rows={6} />
          </Show>
          <Show when={report.isSuccess}>
            <For each={report.data!.fights}>
              {(fight) => (
                <FightRow
                  fight={fight}
                  selected={selectedFight()?.id === fight.id}
                  // don't touch this
                  onClick={() => {
                    setSelectedFight(null);
                    setSelectedFight(fight);
                  }}
                />
              )}
            </For>
          </Show>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <Show
          when={selectedFight()}
          fallback={
            <div class="h-full flex flex-col items-center justify-center text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                stroke-width="0.8"
                class="text-void-600 mb-4"
                aria-hidden="true"
              >
                <rect x="4" y="4" width="40" height="40" rx="2" />
                <path d="M16 24h16M24 16v16" />
              </svg>
              <p class="text-stone-600 font-semibold text-sm">
                Selecione um fight
              </p>
              <p class="text-stone-700 text-xs font-mono mt-1">
                na lista à esquerda para ver a performance
              </p>
            </div>
          }
        >
          <div>
            <div class="flex items-center justify-between mb-5">
              <div>
                <p class="label-xs mb-1">
                  {selectedFight()!.name} ({selectedFight()!.id})
                </p>
                <div class="flex items-center gap-2">
                  <h3 class="font-display text-lg text-stone-100 tracking-wide">
                    Performance
                  </h3>
                  <span class="tag-kill">Kill</span>
                </div>
              </div>
              <div class="text-right">
                <p class="font-mono text-[10px] text-stone-600">Duração</p>
                <p class="font-mono text-sm text-stone-300">
                  {fmtMs(selectedFight()!.durationMs)}
                </p>
              </div>
            </div>

            <PerformanceTable
              fightId={selectedFight()!.id}
              reportCode={params.code}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};
export default ReportDetailPage;
