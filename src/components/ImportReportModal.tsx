import { ApiError } from "@/api/client";
import { useImportReport } from "@/lib";
import { useInvalidateReport } from "@/lib/queries/report";
import { useImportWs } from "@/lib/useImportWs";
import { ImportReportForm, importReportSchema } from "@/schemas/importReport";
import { authStore } from "@/stores/auth";
import { createForm, SubmitHandler, zodForm } from "@modular-forms/solid";
import { A } from "@solidjs/router";
import { Component, createEffect, createSignal, Match, Switch } from "solid-js";
import ImportSummary from "./ui/ImportSummary";
import PhaseSteps from "./ui/PhaseSteps";
import { FormError, SubmitButton, TextField } from "./ui/TextField";

type ModalView = "form" | "progress" | "done" | "error";

const ImportReportModal: Component<{
  onClose: () => void;
}> = (p) => {
  const importMutation = useImportReport();
  const invalidateReport = useInvalidateReport();
  const ws = useImportWs();

  const [view, setView] = createSignal<ModalView>("form");
  const [reportCode, setReportCode] = createSignal("");
  const [submitError, setSubmitError] = createSignal<string | null>(null);

  const [_, { Form, Field }] = createForm<ImportReportForm>({
    validate: zodForm(importReportSchema),
  });

  const handleSubmit: SubmitHandler<ImportReportForm> = async (values) => {
    setSubmitError(null);
    const code = values.code.trim();

    importMutation.mutate(code, {
      onSuccess: (accepted) => {
        setReportCode(accepted.reportCode);
        setView("progress");
        ws.connect(accepted.reportCode);
      },
      onError: (err) => {
        const msg =
          err instanceof ApiError
            ? err.message
            : "Falha ao enfileirar importação.";
        setSubmitError(msg);
      },
    });
  };

  createEffect(() => {
    const phase = ws.phase();
    if (phase === "Completed") {
      invalidateReport(reportCode());
      setView("done");
    } else if (phase === "Failed") {
      invalidateReport(reportCode());
      setView("error");
    }
  });

  const handleClose = () => {
    ws.disconnect();
    p.onClose();
  };

  const handleRetry = () => {
    ws.reset();
    setView("form");
    setSubmitError(null);
    setReportCode("");
  };

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center
               bg-void-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      <div class="w-full max-w-md bg-void-800 border border-void-600">
        {/* Header */}
        <div class="flex items-center justify-between px-6 py-4 border-b border-void-700">
          <div>
            <p class="label-xs mb-0.5">Reports</p>
            <h3
              id="import-modal-title"
              class="font-display text-sm text-stone-100 tracking-wide"
            >
              Importar Report
            </h3>
          </div>
          <button
            onClick={handleClose}
            class="text-stone-600 hover:text-stone-200 transition-colors"
            aria-label="Fechar modal"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
              aria-hidden="true"
            >
              <line x1="3" y1="3" x2="13" y2="13" stroke-linecap="round" />
              <line x1="13" y1="3" x2="3" y2="13" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <Switch>
            <Match when={view() === "form"}>
              <Form onSubmit={handleSubmit} class="space-y-4">
                <div
                  class="flex items-center gap-2 bg-void-700/50 border border-void-600 px-3 py-2.5"
                  aria-live="polite"
                >
                  <div
                    class={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      authStore.wclAuthorized()
                        ? "bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                        : "bg-void-500"
                    }`}
                    aria-hidden="true"
                  />
                  <p class="font-mono text-[10px] text-stone-500 tracking-wider">
                    {authStore.wclAuthorized()
                      ? "Rota privada: /api/v2/user — reports privados disponíveis"
                      : "Rota pública: /api/v2/client — apenas reports públicos"}
                  </p>
                </div>

                <Field name="code">
                  {(field, fieldProps) => (
                    <TextField
                      field={field}
                      fieldProps={fieldProps}
                      label="Código do Report"
                      placeholder="ex: aAbBcCdDeE"
                      autocomplete="off"
                      spellcheck={false}
                      maxLength={16}
                    />
                  )}
                </Field>

                <p class="font-mono text-[10px] text-stone-600 -mt-1">
                  Encontre em:{" "}
                  <span class="text-stone-500">warcraftlogs.com/reports/</span>
                  <span class="text-ember-800">CÓDIGO</span>
                </p>

                <FormError message={submitError()} />

                <div class="flex gap-2 pt-1">
                  <SubmitButton
                    submitting={importMutation.isPending}
                    label="Importar"
                    loadingLabel="Enfileirando..."
                    class="btn-primary flex-1 flex items-center justify-center gap-2"
                  />
                  <button
                    type="button"
                    onClick={handleClose}
                    class="btn-ghost flex-1 text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </Form>
            </Match>

            {/* ── VIEW: progress ── */}
            <Match when={view() === "progress"}>
              <div class="space-y-6">
                {/* Report code */}
                <div class="flex items-center gap-2">
                  <div
                    class="w-1.5 h-1.5 rounded-full bg-ember-600
                                 shadow-[0_0_6px_rgba(245,158,11,0.6)] animate-pulse shrink-0"
                  />
                  <p class="font-mono text-[10px] text-stone-500 tracking-wider">
                    {reportCode()}
                  </p>
                </div>
                <PhaseSteps current={ws.phase} failed={false} />

                <div
                  class="bg-void-700/40 border border-void-600 px-3 py-2.5"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p class="font-mono text-[10px] text-stone-400 leading-relaxed">
                    {ws.message()}
                  </p>
                </div>

                {/* Connection status */}
                <div class="flex items-center gap-2">
                  <div
                    class={`w-1 h-1 rounded-full ${
                      ws.isActive()
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-void-500"
                    }`}
                    aria-hidden="true"
                  />
                  <p class="font-mono text-[10px] text-stone-700">
                    {ws.isActive()
                      ? "WebSocket conectado"
                      : "Aguardando conexão..."}
                  </p>
                </div>

                <button onClick={handleClose} class="btn-ghost w-full text-xs">
                  Fechar (importação continua em background)
                </button>
              </div>
            </Match>

            <Match when={view() === "done" && ws.result() !== null}>
              <ImportSummary
                reportCode={reportCode()}
                title={ws.result()!.title}
                fightsImported={ws.result()!.fightsImported}
                killsImported={ws.result()!.killsImported}
                playersImported={ws.result()!.playersImported}
                performanceEntriesSaved={ws.result()!.performanceEntriesSaved}
                guildName={ws.result()!.guildName}
                onClose={handleClose}
              />
            </Match>

            {/* ── VIEW: done (sem result no WS — fallback simples) ── */}
            <Match when={view() === "done" && ws.result() === null}>
              <div class="space-y-4 animate-fade-in">
                <div class="flex items-center gap-3 bg-emerald-950/40 border border-emerald-900 px-4 py-3">
                  <p class="font-mono text-xs text-emerald-400">
                    Report importado com sucesso.
                  </p>
                </div>
                <div class="flex gap-2">
                  <A
                    href={`/app/reports/${reportCode()}`}
                    class="btn-primary flex-1 text-center text-xs"
                    onClick={handleClose}
                  >
                    Ver Report
                  </A>
                  <button
                    onClick={handleClose}
                    class="btn-ghost flex-1 text-xs"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </Match>

            {/* ── VIEW: error ── */}
            <Match when={view() === "error"}>
              <div class="space-y-4 animate-fade-in">
                {/* Failed header */}
                <div class="flex items-center gap-3 bg-red-950/40 border border-red-900 px-4 py-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    class="text-red-400 shrink-0"
                  >
                    <circle cx="7" cy="7" r="6" />
                    <line
                      x1="7"
                      y1="4"
                      x2="7"
                      y2="7.5"
                      stroke-linecap="round"
                    />
                    <circle cx="7" cy="10" r="0.5" fill="currentColor" />
                  </svg>
                  <p class="font-mono text-xs text-red-400">
                    Importação falhou
                  </p>
                </div>

                {/* Phase steps with failure indicator */}
                <PhaseSteps current={ws.phase} failed={true} />

                {/* Error message */}
                <div class="bg-red-950/20 border border-red-900/50 px-3 py-2.5">
                  <p class="font-mono text-[10px] text-red-400/80 leading-relaxed">
                    {ws.message()}
                  </p>
                </div>

                <div class="flex gap-2 pt-1">
                  <button
                    onClick={handleRetry}
                    class="btn-primary flex-1 text-xs"
                  >
                    Tentar novamente
                  </button>
                  <button
                    onClick={handleClose}
                    class="btn-ghost flex-1 text-xs"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
};
export default ImportReportModal;
