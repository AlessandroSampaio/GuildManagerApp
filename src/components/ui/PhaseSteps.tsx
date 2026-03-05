import { PHASE_LABELS, phaseIndex } from "@/lib/useImportWs";
import { ImportPhase } from "@/types/reports";
import { Component, For, Match, Show, Switch } from "solid-js";

const VISIBLE_PHASES: ImportPhase[] = [
  "FetchingReport",
  "SavingReport",
  "FetchingRankings",
  "SavingPerformance",
  "Completed",
];

const PhaseSteps: Component<{
  current: () => ImportPhase | null; // accessor — reativo
  failed: boolean;
}> = (p) => {
  const currentIdx = () => {
    if (p.failed) return -1;
    const c = p.current();
    if (!c) return -1;
    return phaseIndex(c);
  };

  return (
    <ol class="space-y-2" aria-label="Progresso da importação">
      <For each={VISIBLE_PHASES}>
        {(phase) => {
          const idx = phaseIndex(phase);
          const curIdx = currentIdx();
          const isDone = () => !p.failed && curIdx > idx;
          const isActive = () => !p.failed && curIdx === idx;
          const isPending = () => !p.failed && curIdx < idx;

          return (
            <li class="flex items-center gap-3">
              {/* Step indicator */}
              <div
                class={`w-5 h-5 rounded-full flex items-center justify-center
                         shrink-0 transition-all duration-300 ${
                           p.failed && phase === "Completed"
                             ? "bg-red-950 border border-red-800"
                             : isDone()
                               ? "bg-emerald-900 border border-emerald-700"
                               : isActive()
                                 ? "bg-ember-900 border border-ember-700 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                                 : "bg-void-700 border border-void-600"
                         }`}
                aria-hidden="true"
              >
                <Switch>
                  <Match when={isDone()}>
                    {/* Checkmark */}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
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
                    {/* Spinning dot */}
                    <div class="w-1.5 h-1.5 rounded-full bg-ember-500 animate-pulse" />
                  </Match>
                  <Match when={p.failed && phase === "Completed"}>
                    {/* X mark */}
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
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
                  <Match when={isPending()}>
                    <div class="w-1 h-1 rounded-full bg-void-500" />
                  </Match>
                </Switch>
              </div>

              {/* Label */}
              <span
                class={`font-mono text-xs transition-colors duration-200 ${
                  p.failed && phase === "Completed"
                    ? "text-red-400"
                    : isDone()
                      ? "text-emerald-500"
                      : isActive()
                        ? "text-stone-100"
                        : "text-stone-600"
                }`}
              >
                {phase === "Completed" && p.failed
                  ? "Falha"
                  : PHASE_LABELS[phase]}
              </span>

              {/* Active spinner */}
              <Show when={isActive()}>
                <svg
                  class="animate-spin w-3 h-3 text-ember-700 ml-auto shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.2" />
                  <path d="M21 12a9 9 0 00-9-9" />
                </svg>
              </Show>
            </li>
          );
        }}
      </For>
    </ol>
  );
};

export default PhaseSteps;
