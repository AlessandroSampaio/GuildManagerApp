import FightRow from "@/components/ui/FightRow";
import ImportStatusBanner from "@/components/ui/ImportStatusBanner";
import PerformanceTable from "@/components/ui/PerformanceTable";
import { SkeletonList } from "@/components/ui/Skeleton";
import { fmtMs } from "@/helpers";
import { useReportDetail } from "@/lib";
import { isImportPending } from "@/lib/queries/report";
import { Fight } from "@/types/reports";
import { A, useParams } from "@solidjs/router";
import { createSignal, For, Match, Show, Switch } from "solid-js";

const ReportDetailPage = () => {
  const params = useParams<{ code: string }>();
  const [importDone, setImportDone] = createSignal(false);
  const [selectedFight, setSelectedFight] = createSignal<Fight | null>(null, {
    equals: (a, b) => a?.id === b?.id,
  });

  const report = useReportDetail(() => params.code);
  const importStatus = () => report.data?.importStatus;
  const showBanner = () => !importDone() && isImportPending(report.data);

  return (
    <div class="flex-1 flex min-h-0">
      {/* ── Left: fight list ── */}
      <div class="w-72 border-r border-void-700 flex flex-col shrink-0">
        {/* Report header */}
        <div class="px-4 py-4 border-b border-void-700">
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

            {/* Import status badge */}
            <Show when={report.data!.importStatus !== "Done"}>
              <div class="mt-2">
                <Switch>
                  <Match when={report.data!.importStatus === "Queued"}>
                    <span
                      class="inline-flex items-center gap-1.5 font-mono text-[9px]
                                   text-amber-500 bg-amber-950/40 border border-amber-900/50
                                   px-2 py-0.5"
                    >
                      <div class="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                      Na fila
                    </span>
                  </Match>
                  <Match when={report.data!.importStatus === "Importing"}>
                    <span
                      class="inline-flex items-center gap-1.5 font-mono text-[9px]
                                   text-ember-500 bg-forge-950/40 border border-ember-900/50
                                   px-2 py-0.5"
                    >
                      <div class="w-1 h-1 rounded-full bg-ember-500 animate-pulse" />
                      Importando
                    </span>
                  </Match>
                  <Match when={report.data!.importStatus === "Failed"}>
                    <span
                      class="inline-flex items-center gap-1.5 font-mono text-[9px]
                                   text-red-400 bg-red-950/40 border border-red-900/50
                                   px-2 py-0.5"
                    >
                      Falha na importação
                    </span>
                  </Match>
                </Switch>
              </div>
            </Show>
          </Show>
        </div>

        {/* Fight list */}
        <div class="flex-1 overflow-y-auto py-1.5 space-y-px">
          <Show when={report.isLoading}>
            <SkeletonList rows={6} />
          </Show>

          <Show when={report.isSuccess}>
            <Show
              when={(report.data!.fights?.length ?? 0) > 0}
              fallback={
                <Show when={isImportPending(report.data)}>
                  {/* Skeleton enquanto importa */}
                  <div class="px-4 py-3 space-y-px opacity-40">
                    <SkeletonList rows={4} />
                  </div>
                </Show>
              }
            >
              <For each={report.data!.fights}>
                {(fight) => (
                  <FightRow
                    fight={fight}
                    selected={selectedFight()?.id === fight.id}
                    onClick={() => {
                      setSelectedFight(null);
                      setSelectedFight(fight);
                    }}
                  />
                )}
              </For>
            </Show>
          </Show>
        </div>
      </div>

      {/* ── Right: banner + performance ── */}
      <div class="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Import progress banner — visível enquanto pendente */}
        <Show when={showBanner() && report.isSuccess}>
          <ImportStatusBanner
            reportCode={params.code}
            importStatus={importStatus() ?? "Queued"}
            onDone={() => setImportDone(true)}
          />
        </Show>

        {/* Performance area */}
        <div class="flex-1 p-6">
          <Show
            when={selectedFight()}
            fallback={
              <Show
                when={!isImportPending(report.data)}
                fallback={
                  /* Placeholder enquanto importa */
                  <div class="h-full flex flex-col items-center justify-center text-center">
                    <div
                      class="w-10 h-10 rounded-full border border-ember-900/50
                                   bg-forge-950/30 flex items-center justify-center mb-4"
                    >
                      <svg
                        class="animate-spin w-5 h-5 text-ember-800"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        aria-hidden="true"
                      >
                        <path
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          opacity="0.2"
                        />
                        <path d="M21 12a9 9 0 00-9-9" />
                      </svg>
                    </div>
                    <p class="text-stone-600 font-semibold text-sm">
                      Importando dados...
                    </p>
                    <p class="text-stone-700 text-xs font-mono mt-1">
                      Os fights aparecerão quando a importação concluir
                    </p>
                  </div>
                }
              >
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
              </Show>
            }
          >
            <div>
              {/* Fight header */}
              <div class="flex items-center justify-between mb-5">
                <div>
                  <p class="label-xs mb-1">{selectedFight()!.name}</p>
                  <div class="flex items-center gap-2">
                    <h3 class="font-display text-lg text-stone-100 tracking-wide">
                      Performance
                    </h3>
                    {selectedFight()!.kill ? (
                      <span class="tag-kill">Kill</span>
                    ) : (
                      <span class="tag-wipe">Wipe</span>
                    )}
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-mono text-[10px] text-stone-600 mb-0.5">
                    Duração
                  </p>
                  <p class="font-mono text-sm text-stone-300">
                    {fmtMs(selectedFight()!.durationMs)}
                  </p>
                </div>
              </div>

              <PerformanceTable
                fightId={selectedFight()!.id}
                reportCode={params.code}
                importStatus={importStatus}
              />
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};
export default ReportDetailPage;
