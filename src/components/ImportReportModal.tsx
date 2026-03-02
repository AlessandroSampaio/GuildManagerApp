import { ApiError } from "@/api/client";
import { useImportReport } from "@/lib";
import { ImportReportForm, importReportSchema } from "@/schemas/importReport";
import { authStore } from "@/stores/auth";
import { ImportResult } from "@/types/reports";
import { createForm, SubmitHandler, zodForm } from "@modular-forms/solid";
import { A } from "@solidjs/router";
import { Component, Show } from "solid-js";
import {
  FormError,
  FormSuccess,
  SubmitButton,
  TextField,
} from "./ui/TextField";

const ImportReportModal: Component<{
  onClose: () => void;
  onSuccess: (r: ImportResult) => void;
}> = (p) => {
  const importMutation = useImportReport();

  const [form, { Form, Field }] = createForm<ImportReportForm>({
    validate: zodForm(importReportSchema),
  });

  const handleSubmit: SubmitHandler<ImportReportForm> = async (values) => {
    importMutation.mutate(values.code.trim(), {
      onSuccess: (r) => p.onSuccess(r),
    });
  };

  const serverError = () =>
    importMutation.isError
      ? importMutation.error instanceof ApiError
        ? importMutation.error.message
        : "Falha ao importar o report."
      : null;

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center
             bg-void-950/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      <div class="w-full max-w-md bg-void-800 border border-void-600 animate-slide-up">
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
            onClick={p.onClose}
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
          {/* ── Success summary ── */}
          <Show
            when={!importMutation.isSuccess}
            fallback={
              <div class="space-y-4">
                <FormSuccess message="Report importado com sucesso!" />
                <dl class="space-y-0">
                  {(
                    [
                      ["Título", importMutation.data!.title],
                      [
                        "Fights importados",
                        importMutation.data!.fightsImported,
                      ],
                      ["Kills", importMutation.data!.killsImported],
                      ["Jogadores", importMutation.data!.playersImported],
                      [
                        "Entradas perf.",
                        importMutation.data!.performanceEntriesSaved,
                      ],
                      ["Guilda", importMutation.data!.guildName ?? "—"],
                    ] as [string, string | number][]
                  ).map(([k, v]) => (
                    <div
                      class="flex items-center justify-between py-2.5
                                border-b border-void-700 last:border-0"
                    >
                      <dt class="label-xs">{k}</dt>
                      <dd class="font-mono text-xs text-stone-200">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div class="flex gap-2 pt-1">
                  <A
                    href={`/app/reports/${importMutation.data!.reportCode}`}
                    class="btn-primary flex-1 text-center text-xs"
                  >
                    Ver Report
                  </A>
                  <button onClick={p.onClose} class="btn-ghost flex-1 text-xs">
                    Fechar
                  </button>
                </div>
              </div>
            }
          >
            {/* ── Import form ── */}
            <Form onSubmit={handleSubmit} class="space-y-4">
              {/* WCL route indicator */}
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

              <FormError message={serverError()} />

              <div class="flex gap-2 pt-1">
                <SubmitButton
                  submitting={importMutation.isPending}
                  label="Importar"
                  loadingLabel="Importando..."
                  class="btn-primary flex-1 flex items-center justify-center gap-2"
                />
                <button
                  type="button"
                  onClick={p.onClose}
                  class="btn-ghost flex-1 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </Form>
          </Show>
        </div>
      </div>
    </div>
  );
};
export default ImportReportModal;
