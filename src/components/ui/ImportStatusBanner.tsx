import { useInvalidateReport } from "@/lib/queries/report";
import { PHASE_LABELS, phaseIndex, useImportWs } from "@/lib/useImportWs";
import { ImportPhase } from "@/types/reports";
import { Component, createEffect, For, Match, Show, Switch } from "solid-js";

const VISIBLE_PHASES: ImportPhase[] = [
  "FetchingReport",
  "SavingReport",
  "FetchingRankings",
  "SavingPerformance",
  "Completed",
];

const ImportStatusBanner: Component<{
  reportCode: string;
  importStatus: string;
  onDone: () => void;
}> = (p) => {
  const ws = useImportWs();
  const invalidateReport = useInvalidateReport();

  // Reconectar ao WS sempre que o status for pendente
  // createEffect é reativo: re-executa quando p.importStatus muda
  createEffect(() => {
    if (p.importStatus === "Queued" || p.importStatus === "Importing") {
      ws.reconnect(p.reportCode);
    }
  });

  // Reagir às fases terminais do WS
  createEffect(() => {
    const phase = ws.phase();
    if (phase === "Completed" || phase === "Failed") {
      invalidateReport(p.reportCode);
      // Chamar onDone após a invalidação para que o detalhe já carregue atualizado
      if (phase === "Completed") p.onDone();
    }
  });

  const isFailed = () => ws.phase() === "Failed" || p.importStatus === "Failed";

  const currentIdx = () => {
    if (isFailed()) return -1;
    const ph = ws.phase();
    // Se o WS ainda não conectou, inferir fase a partir do status REST
    if (!ph) {
      return p.importStatus === "Importing" ? phaseIndex("FetchingReport") : 0;
    }
    return phaseIndex(ph);
  };

  return (
    <div
      class={`mx-6 mt-5 border px-4 py-4 space-y-4 animate-fade-in ${
        isFailed()
          ? "bg-red-950/30 border-red-900/60"
          : "bg-forge-950/50 border-ember-900/60"
      }`}
      aria-live="polite"
      aria-label="Status de importação"
    >
      {/* Header row */}
      <div class="flex items-center gap-3">
        <Show
          when={!isFailed()}
          fallback={
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class="text-red-400 shrink-0"
              aria-hidden="true"
            >
              <circle cx="7" cy="7" r="6" />
              <line x1="7" y1="4" x2="7" y2="7.5" stroke-linecap="round" />
              <circle cx="7" cy="10" r="0.5" fill="currentColor" />
            </svg>
          }
        >
          <div
            class="w-2 h-2 rounded-full bg-ember-600
                       shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse shrink-0"
            aria-hidden="true"
          />
        </Show>

        <p
          class={`font-mono text-xs font-medium ${
            isFailed() ? "text-red-400" : "text-ember-500"
          }`}
        >
          {isFailed()
            ? "Importação falhou"
            : p.importStatus === "Queued"
              ? "Aguardando na fila..."
              : "Importando report..."}
        </p>

        {/* WS connection indicator */}
        <Show when={!isFailed()}>
          <div class="ml-auto flex items-center gap-1.5">
            <div
              class={`w-1 h-1 rounded-full transition-colors ${
                ws.isActive()
                  ? "bg-emerald-500 shadow-[0_0_4px_rgba(52,211,153,0.8)]"
                  : "bg-void-500"
              }`}
              aria-hidden="true"
            />
            <p class="font-mono text-[10px] text-stone-600">
              {ws.isActive() ? "live" : "polling"}
            </p>
          </div>
        </Show>
      </div>

      {/* Phase steps — layout horizontal compacto */}
      <ol class="flex items-center gap-0" aria-label="Etapas da importação">
        <For each={VISIBLE_PHASES}>
          {(phase, i) => {
            const idx = phaseIndex(phase);
            const curIdx = currentIdx();
            const isDone = () => !isFailed() && curIdx > idx;
            const isActive = () => !isFailed() && curIdx === idx;

            return (
              <>
                {/* Step circle */}
                <li class="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    class={`w-6 h-6 rounded-full flex items-center justify-center
                             transition-all duration-300 ${
                               isFailed() && phase === "Completed"
                                 ? "bg-red-950 border border-red-800"
                                 : isDone()
                                   ? "bg-emerald-900 border border-emerald-700"
                                   : isActive()
                                     ? "bg-forge-900 border border-ember-700 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                                     : "bg-void-800 border border-void-600"
                             }`}
                    aria-hidden="true"
                  >
                    <Switch>
                      <Match when={isDone()}>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          class="text-emerald-400"
                        >
                          <path
                            d="M2 5l2.5 2.5L8 3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </Match>
                      <Match when={isActive()}>
                        <div class="w-1.5 h-1.5 rounded-full bg-ember-500 animate-pulse" />
                      </Match>
                      <Match when={isFailed() && phase === "Completed"}>
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 8 8"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          class="text-red-400"
                        >
                          <line
                            x1="1.5"
                            y1="1.5"
                            x2="6.5"
                            y2="6.5"
                            stroke-linecap="round"
                          />
                          <line
                            x1="6.5"
                            y1="1.5"
                            x2="1.5"
                            y2="6.5"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Match>
                      <Match when={true}>
                        <div class="w-1 h-1 rounded-full bg-void-500" />
                      </Match>
                    </Switch>
                  </div>

                  <span
                    class={`font-mono text-[9px] leading-none transition-colors ${
                      isFailed() && phase === "Completed"
                        ? "text-red-500"
                        : isDone()
                          ? "text-emerald-600"
                          : isActive()
                            ? "text-stone-300"
                            : "text-stone-700"
                    }`}
                  >
                    {phase === "Completed" && isFailed()
                      ? "Falha"
                      : PHASE_LABELS[phase]}
                  </span>
                </li>

                {/* Connector line between steps */}
                <Show when={i() < VISIBLE_PHASES.length - 1}>
                  <div
                    class={`flex-1 h-px mx-1 transition-colors duration-500 ${
                      !isFailed() && currentIdx() > phaseIndex(phase)
                        ? "bg-emerald-800"
                        : "bg-void-700"
                    }`}
                    aria-hidden="true"
                  />
                </Show>
              </>
            );
          }}
        </For>
      </ol>

      {/* Live message */}
      <Show when={ws.message()}>
        <p
          class={`font-mono text-[10px] leading-relaxed ${
            isFailed() ? "text-red-400/70" : "text-stone-500"
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          {ws.message()}
        </p>
      </Show>
    </div>
  );
};

export default ImportStatusBanner;
