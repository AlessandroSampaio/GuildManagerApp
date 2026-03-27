import { EmptyState } from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";
import { SkeletonList } from "@/components/ui/Skeleton";
import { fmtDate } from "@/helpers";
import { useAuditLogList } from "@/lib/queries/audit-log";
import { AuditLogDto } from "@/types/audit-log";
import { Component, createEffect, createSignal, For, on, Show } from "solid-js";

// ── detail dialog ─────────────────────────────────────────────────────────────

function AuditLogDetailDialog(props: {
  log: AuditLogDto;
  onClose: () => void;
}) {
  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-void-950/80 backdrop-blur-sm animate-fade-in"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && props.onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-dialog-title"
        class="w-full max-w-lg bg-void-800 border border-void-600 shadow-2xl"
      >
        {/* Header */}
        <div class="flex items-center justify-between px-6 py-4 border-b border-void-700">
          <div>
            <p class="label-xs mb-0.5">Audit Log</p>
            <h2
              id="audit-dialog-title"
              class="font-display text-base text-stone-100 tracking-wide"
            >
              Detalhes do Evento
            </h2>
          </div>
          <button
            onClick={props.onClose}
            aria-label="Fechar"
            class="text-stone-600 hover:text-stone-300 transition-colors p-1"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <line x1="2" y1="2" x2="12" y2="12" stroke-linecap="round" />
              <line x1="12" y1="2" x2="2" y2="12" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <dl class="divide-y divide-void-700 px-6 py-2">
          <Row label="ID">
            <span class="font-mono text-xs text-stone-400">#{props.log.id}</span>
          </Row>

          <Row label="Ocorrido em">
            <span class="font-mono text-xs text-stone-300">
              {fmtDate(props.log.occurredAt)}
            </span>
          </Row>

          <Row label="Ação">
            <ActionBadge action={props.log.action} />
          </Row>

          <Row label="Entidade">
            <span class="text-xs text-stone-300 font-semibold">
              {props.log.entityType}
            </span>
            <Show when={props.log.entityId}>
              <span class="font-mono text-[10px] text-stone-600 ml-2">
                #{props.log.entityId}
              </span>
            </Show>
          </Row>

          <Row label="Usuário">
            <span class="text-xs text-stone-300">
              {props.log.actorUsername ?? "—"}
            </span>
            <Show when={props.log.actorId}>
              <span class="font-mono text-[10px] text-stone-600 ml-2">
                id:{props.log.actorId}
              </span>
            </Show>
          </Row>

          <Row label="Detalhes">
            <Show
              when={props.log.details}
              fallback={
                <span class="text-xs text-stone-600">—</span>
              }
            >
              <p class="text-xs text-stone-400 whitespace-pre-wrap break-words leading-relaxed">
                {props.log.details}
              </p>
            </Show>
          </Row>
        </dl>

        {/* Footer */}
        <div class="flex justify-end px-6 py-4 border-t border-void-700">
          <button onClick={props.onClose} class="btn-ghost text-xs py-1.5 px-4">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function Row(props: { label: string; children: any }) {
  return (
    <div class="flex items-start gap-4 py-3">
      <dt class="label-xs w-24 shrink-0 pt-0.5">{props.label}</dt>
      <dd class="flex-1 min-w-0 flex flex-wrap items-baseline gap-1">
        {props.children}
      </dd>
    </div>
  );
}

function ActionBadge(props: { action: string }) {
  const a = props.action.toUpperCase();
  const style = a.includes("ADDED")
    ? "text-emerald-400 bg-emerald-950/40 border-emerald-900/50"
    : a.includes("STARTED")
      ? "text-amber-400 bg-amber-950/40 border-amber-900/50"
      : a.includes("REMOVED")
        ? "text-red-400 bg-red-950/40 border-red-900/50"
        : "text-stone-400 bg-void-800 border-void-600";

  return (
    <span
      class={`inline-block font-mono text-[9px] tracking-wider px-1.5 py-0.5 border ${style}`}
    >
      {props.action}
    </span>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

const COLS = "grid-cols-[160px_160px_180px_130px_1fr]";

const AuditLogPage: Component = () => {
  const [page, setPage] = createSignal(1);
  const [from, setFrom] = createSignal("");
  const [to, setTo] = createSignal("");
  const [selectedLog, setSelectedLog] = createSignal<AuditLogDto | null>(null);

  // Reset to page 1 whenever filters change (defer avoids firing on mount)
  createEffect(on([from, to], () => setPage(1), { defer: true }));

  const filters = () => ({
    from: from() || undefined,
    to: to() || undefined,
  });
  const hasFilters = () => !!from() || !!to();

  const result = useAuditLogList(page, filters);

  const isFetching = () => result.isFetching && !result.isLoading;
  const hasNext = () => page() * PAGE_SIZE < (result.data?.total ?? 0);

  return (
    <div class="flex-1 overflow-y-auto p-8 relative">
      <SectionHeader
        label="Admin"
        title="Audit Log"
        action={
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
        }
      />

      {/* Filter bar */}
      <div class="card flex items-end gap-4 p-4 mb-6">
        <div class="flex flex-col gap-1">
          <label class="label-xs">De</label>
          <input
            type="datetime-local"
            value={from()}
            onInput={(e) => setFrom(e.currentTarget.value)}
            class="input-field text-xs"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="label-xs">Até</label>
          <input
            type="datetime-local"
            value={to()}
            onInput={(e) => setTo(e.currentTarget.value)}
            class="input-field text-xs"
          />
        </div>
        <Show when={hasFilters()}>
          <button
            onClick={() => {
              setFrom("");
              setTo("");
            }}
            class="btn-ghost text-xs py-2 px-3 self-end"
          >
            Limpar
          </button>
        </Show>
      </div>

      <Show when={result.isLoading}>
        <SkeletonList rows={10} />
      </Show>

      <Show when={result.isError}>
        <div class="card text-center py-10">
          <p class="text-red-400 font-semibold text-sm mb-1">
            Erro ao carregar audit log
          </p>
          <p class="text-stone-600 font-mono text-xs">{String(result.error)}</p>
        </div>
      </Show>

      <Show when={result.isSuccess || result.isPlaceholderData}>
        <Show
          when={(result.data?.data.length ?? 0) > 0}
          fallback={
            <EmptyState
              title="Nenhum registro encontrado"
              subtitle="As ações administrativas registradas aparecerão aqui"
            />
          }
        >
          {/* Header row */}
          <div class={`grid ${COLS} gap-3 px-4 py-2 mb-1`} aria-hidden="true">
            {["Data / Hora", "Ação", "Entidade", "Usuário", "Detalhes"].map(
              (h) => (
                <p class="label-xs">{h}</p>
              ),
            )}
          </div>

          {/* Data rows */}
          <div class="space-y-1.5" role="list">
            <For each={result.data?.data}>
              {(log: AuditLogDto, i) => (
                <div
                  role="listitem"
                  class={`card grid ${COLS} gap-3 items-start py-3 px-4 cursor-pointer hover:border-void-500 hover:bg-void-700/40 transition-colors`}
                  style={`animation-delay:${i() * 20}ms`}
                  onClick={() => setSelectedLog(log)}
                  title="Clique para ver detalhes"
                >
                  {/* Data/hora */}
                  <p class="font-mono text-[11px] text-stone-500 leading-relaxed">
                    {fmtDate(log.occurredAt)}
                  </p>

                  {/* Ação */}
                  <div>
                    <ActionBadge action={log.action} />
                  </div>

                  {/* Entidade */}
                  <div class="min-w-0">
                    <p class="text-xs text-stone-300 font-semibold truncate">
                      {log.entityType}
                    </p>
                    <Show when={log.entityId}>
                      <p class="font-mono text-[10px] text-stone-600 truncate">
                        #{log.entityId}
                      </p>
                    </Show>
                  </div>

                  {/* Usuário */}
                  <p class="text-xs text-stone-400 truncate">
                    {log.actorUsername ?? "—"}
                  </p>

                  {/* Detalhes */}
                  <p
                    class="text-xs text-stone-500 truncate"
                    title={log.details ?? undefined}
                  >
                    {log.details ?? "—"}
                  </p>
                </div>
              )}
            </For>
          </div>

          {/* Paginação */}
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
              <Show when={result.data?.total}>
                {(total) => (
                  <span class="text-stone-700"> · {total()} registros</span>
                )}
              </Show>
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext()}
              class="btn-ghost text-xs py-1.5 px-4 disabled:opacity-30"
            >
              Próxima →
            </button>
          </nav>
        </Show>
      </Show>

      {/* Detail dialog */}
      <Show when={selectedLog()}>
        {(log) => (
          <AuditLogDetailDialog
            log={log()}
            onClose={() => setSelectedLog(null)}
          />
        )}
      </Show>
    </div>
  );
};

export default AuditLogPage;
