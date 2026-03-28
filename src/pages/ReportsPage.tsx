import ImportReportModal from "@/components/ImportReportModal";
import { EmptyState } from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";
import { SkeletonList } from "@/components/ui/Skeleton";
import { fmtDate } from "@/helpers";
import { useReportList, useResyncReport } from "@/lib";
import { ImportAccepted } from "@/types/reports";
import { A } from "@solidjs/router";
import { Component, createSignal, For, Show } from "solid-js";

const ReportsPage: Component = () => {
  const [showModal, setShowModal] = createSignal(false);
  const [page, setPage] = createSignal(1);
  const [resyncingId, setResyncingId] = createSignal<string | null>(null);
  const [resyncAccepted, setResyncAccepted] = createSignal<ImportAccepted | null>(null);

  const resync = useResyncReport();

  const handleResync = (id: string) => {
    setResyncingId(id);
    resync.mutate(id, {
      onSuccess: (accepted) => {
        setResyncingId(null);
        setResyncAccepted(accepted);
      },
      onError: () => setResyncingId(null),
    });
  };

  const reports = useReportList(page);

  const isFetching = () => reports.isFetching && !reports.isLoading;

  return (
    <div class="flex-1 overflow-y-auto p-8 relative">
      <SectionHeader
        label="Reports"
        title="Todos os Reports"
        action={
          <div class="flex items-center gap-3">
            <Show when={isFetching()}>
              <svg
                class="animate-spin w-3.5 h-3.5 text-stone-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-label="Atualizando"
              >
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25" />
                <path d="M21 12a9 9 0 00-9-9" />
              </svg>
            </Show>
            <button
              onClick={() => setShowModal(true)}
              class="btn-primary text-xs py-2"
            >
              + Importar Report
            </button>
          </div>
        }
      />

      <Show when={reports.isLoading}>
        <SkeletonList rows={8} />
      </Show>

      <Show when={reports.isError}>
        <div class="card text-center py-10">
          <p class="text-red-400 font-semibold text-sm mb-1">
            Erro ao carregar reports
          </p>
          <p class="text-stone-600 font-mono text-xs">
            {String(reports.error)}
          </p>
        </div>
      </Show>

      <Show when={reports.isSuccess || reports.isPlaceholderData}>
        <Show
          when={(reports.data?.length ?? 0) > 0}
          fallback={
            <EmptyState
              title="Nenhum report importado"
              subtitle="Use o botão acima para importar um report do WarcraftLogs"
            />
          }
        >
          <div
            class="grid grid-cols-[1fr_120px_80px_80px_100px] gap-2
                        px-4 py-2 mb-1"
            aria-hidden="true"
          >
            {["Report / Guilda", "Data", "Fights", "Kills", "Duração"].map(
              (h) => (
                <p class="label-xs">{h}</p>
              ),
            )}
          </div>

          <div class="space-y-1.5" role="list">
            <For each={reports.data}>
              {(r, i) => {
                const dur = Math.round(
                  (new Date(r.endTime ?? r.startTime).getTime() -
                    new Date(r.startTime).getTime()) /
                    60000,
                );
                return (
                  <div
                    role="listitem"
                    class="relative card-interactive"
                    style={`animation-delay:${i() * 30}ms`}
                  >
                    <A
                      href={`/app/reports/${r.id}`}
                      class="grid grid-cols-[1fr_120px_80px_80px_100px]
                               gap-2 items-center py-3.5 pr-12"
                    >
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <p
                            class="font-semibold text-stone-200 text-sm truncate
                                       group-hover:text-ember-500 transition-colors"
                          >
                            {r.title}
                          </p>
                          {r.importStatus === "Queued" && (
                            <span
                              class="shrink-0 inline-flex items-center gap-1
                                           font-mono text-[9px] text-amber-500
                                           bg-amber-950/40 border border-amber-900/50 px-1.5 py-0.5"
                            >
                              <div class="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                              fila
                            </span>
                          )}
                          {r.importStatus === "Importing" && (
                            <span
                              class="shrink-0 inline-flex items-center gap-1
                                           font-mono text-[9px] text-ember-500
                                           bg-forge-950/40 border border-ember-900/50 px-1.5 py-0.5"
                            >
                              <div class="w-1 h-1 rounded-full bg-ember-500 animate-pulse" />
                              importando
                            </span>
                          )}
                          {r.importStatus === "Failed" && (
                            <span
                              class="shrink-0 font-mono text-[9px] text-red-400
                                           bg-red-950/40 border border-red-900/50 px-1.5 py-0.5"
                            >
                              falha
                            </span>
                          )}
                        </div>
                        <p class="font-mono text-[10px] text-stone-600 truncate">
                          {r.id} · {r.guildName ?? "sem guilda"}
                        </p>
                      </div>
                      <p class="font-mono text-xs text-stone-400">
                        {fmtDate(r.startTime)}
                      </p>
                      <p class="font-mono text-xs text-stone-400">
                        {r.fightCount}
                      </p>
                      <p class="font-mono text-xs text-emerald-500">
                        {r.killCount ?? "—"}
                      </p>
                      <p class="font-mono text-xs text-stone-500">
                        {dur > 0 ? `${dur}m` : "—"}
                      </p>
                    </A>
                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                      <button
                        onClick={() => handleResync(r.id)}
                        disabled={resyncingId() === r.id}
                        title="Ressincronizar"
                        aria-label={`Ressincronizar ${r.title}`}
                        class="p-1.5 text-stone-600 hover:text-stone-300
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 transition-colors"
                      >
                        <Show
                          when={resyncingId() === r.id}
                          fallback={
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M21 2v6h-6" />
                              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                              <path d="M3 22v-6h6" />
                              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                            </svg>
                          }
                        >
                          <svg
                            class="animate-spin"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            aria-hidden="true"
                          >
                            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25" />
                            <path d="M21 12a9 9 0 00-9-9" />
                          </svg>
                        </Show>
                      </button>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
          <nav class="flex items-center gap-3 mt-6" aria-label="Paginação">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page() <= 1}
              class="btn-ghost text-xs py-1.5 px-4 disabled:opacity-30"
            >
              ← Anterior
            </button>
            <span class="font-mono text-xs text-stone-600" aria-live="polite">
              Página {page()}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(reports.data?.length ?? 0) < 20}
              class="btn-ghost text-xs py-1.5 px-4 disabled:opacity-30"
            >
              Próxima →
            </button>
          </nav>
        </Show>
      </Show>

      <Show when={showModal()}>
        <ImportReportModal onClose={() => setShowModal(false)} />
      </Show>

      <Show when={resyncAccepted() !== null}>
        <ImportReportModal
          initialAccepted={resyncAccepted()!}
          onClose={() => setResyncAccepted(null)}
        />
      </Show>
    </div>
  );
};

export default ReportsPage;
