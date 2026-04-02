import { ApiError } from "@/api/client";
import {
  useBNetCredentialStatus,
  useSaveBNetCredentials,
} from "@/lib/queries/admin";
import {
  BNetCredentialsForm,
  bnetCredentialsSchema,
} from "@/schemas/bnetCredentials";
import { createForm, SubmitHandler, zodForm } from "@modular-forms/solid";
import { Component, createSignal, Show } from "solid-js";
import { Spinner } from "./ui/Spinner";
import {
  FormError,
  PasswordField,
  SubmitButton,
  TextField,
} from "./ui/TextField";

const BNetCredentialsCard: Component = () => {
  const statusQuery = useBNetCredentialStatus();
  const saveMutation = useSaveBNetCredentials();

  const [showForm, setShowForm] = createSignal(false);
  const [serverError, setServerError] = createSignal<string | null>(null);

  const isConfigured = () => statusQuery.data?.configured ?? false;

  const [, { Form, Field }] = createForm<BNetCredentialsForm>({
    validate: zodForm(bnetCredentialsSchema),
  });

  const handleSubmit: SubmitHandler<BNetCredentialsForm> = (values) => {
    setServerError(null);
    saveMutation.mutate(
      {
        clientId: values.clientId.trim(),
        clientSecret: values.clientSecret.trim(),
        label: values.label?.trim() || undefined,
      },
      {
        onSuccess: () => setShowForm(false),
        onError: (err) =>
          setServerError(
            err instanceof ApiError
              ? err.message
              : "Falha ao salvar as credenciais.",
          ),
      },
    );
  };

  return (
    <div class="card animate-fade-in">
      {/* Header */}
      <div class="flex items-start justify-between mb-5">
        <div class="flex-1 min-w-0 pr-4">
          <div class="flex items-center gap-2 mb-1">
            <p class="label-xs">Battle.net — Aplicação</p>
            <span
              class="font-mono text-[9px] text-amber-500 bg-amber-950/40
                     border border-amber-800/60 px-1.5 py-0.5 tracking-wider"
            >
              ADMIN
            </span>
          </div>
          <h3 class="font-display text-base text-stone-100 tracking-wide">
            Credenciais OAuth da API
          </h3>
          <p class="text-stone-500 text-sm mt-1.5 leading-relaxed">
            Configure o{" "}
            <code
              class="font-mono text-[11px] text-ember-700 bg-forge-900/50
                     px-1.5 py-0.5 border border-forge-700/40"
            >
              ClientId
            </code>{" "}
            e{" "}
            <code
              class="font-mono text-[11px] text-ember-700 bg-forge-900/50
                     px-1.5 py-0.5 border border-forge-700/40"
            >
              ClientSecret
            </code>{" "}
            da sua aplicação Blizzard. Os valores são cifrados com{" "}
            <span class="text-stone-400 font-medium">AES-256-GCM</span> antes de
            serem armazenados.
          </p>
        </div>

        {/* Status badge */}
        <div class="flex items-center gap-2 shrink-0 mt-1" aria-live="polite">
          <Show
            when={!statusQuery.isLoading}
            fallback={<Spinner class="text-stone-600" size={14} />}
          >
            <div
              class={`w-2 h-2 rounded-full transition-all duration-300 ${
                isConfigured()
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                  : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]"
              }`}
              aria-hidden="true"
            />
            <span class="font-mono text-[11px] text-stone-500 tracking-wider whitespace-nowrap">
              {isConfigured() ? "CONFIGURADO" : "NÃO CONFIGURADO"}
            </span>
          </Show>
        </div>
      </div>

      {/* Configured status row */}
      <Show when={statusQuery.isSuccess && isConfigured() && !showForm()}>
        <div
          class="bg-emerald-950/30 border border-emerald-900/50 px-4 py-3 mb-5
                 flex items-center gap-3"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class="text-emerald-400 shrink-0"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="6" />
            <path
              d="M4 7l2 2 4-4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="flex-1 min-w-0">
            <p class="font-mono text-xs text-emerald-400">
              Credenciais configuradas
            </p>
            <Show when={statusQuery.data?.label}>
              <p class="font-mono text-[10px] text-stone-600 mt-0.5">
                Rótulo: {statusQuery.data!.label}
              </p>
            </Show>
            <Show when={statusQuery.data?.updatedAt}>
              <p class="font-mono text-[10px] text-stone-600">
                Atualizado em:{" "}
                {new Date(statusQuery.data!.updatedAt!).toLocaleDateString(
                  "pt-BR",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </p>
            </Show>
          </div>
          <button
            onClick={() => setShowForm(true)}
            class="btn-ghost text-xs py-1.5 px-3 shrink-0"
          >
            Rotacionar
          </button>
        </div>
      </Show>

      {/* Not configured alert */}
      <Show when={statusQuery.isSuccess && !isConfigured() && !showForm()}>
        <div
          class="bg-amber-950/30 border border-amber-900/50 px-4 py-3 mb-5
                 flex items-start gap-3"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class="text-amber-400 shrink-0 mt-0.5"
            aria-hidden="true"
          >
            <path d="M7 2L13 12H1L7 2z" stroke-linejoin="round" />
            <line x1="7" y1="6" x2="7" y2="9" stroke-linecap="round" />
            <circle cx="7" cy="10.5" r="0.5" fill="currentColor" />
          </svg>
          <div class="flex-1">
            <p class="font-mono text-xs text-amber-400 font-medium mb-0.5">
              Credenciais não configuradas
            </p>
            <p class="font-mono text-[10px] text-stone-600 leading-relaxed">
              Sem ClientId e ClientSecret a API não consegue autenticar com a
              Blizzard. A sincronização de personagens via Battle.net falhará.
            </p>
          </div>
        </div>
      </Show>

      {/* Status query error */}
      <Show when={statusQuery.isError}>
        <div
          role="alert"
          class="mb-4 bg-red-950/60 border border-red-900 px-4 py-3
                 font-mono text-xs text-red-400"
        >
          Falha ao verificar status. Você tem permissão de Admin?
        </div>
      </Show>

      {/* Success after save */}
      <Show when={saveMutation.isSuccess && !showForm()}>
        <div
          role="status"
          class="mb-4 flex items-center gap-2 bg-emerald-950/60 border
                 border-emerald-800 px-4 py-3 font-mono text-xs
                 text-emerald-400 animate-fade-in"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path
              d="M2 6l2.5 3L10 3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Credenciais salvas. ClientId e ClientSecret estão cifrados no servidor.
        </div>
      </Show>

      {/* Form */}
      <Show when={showForm() || (!isConfigured() && !statusQuery.isLoading)}>
        <div class="border border-void-600 bg-void-700/30 p-4 space-y-4">
          <div class="flex items-center justify-between">
            <p class="label-xs">
              {isConfigured() ? "Rotacionar credenciais" : "Configurar credenciais"}
            </p>
            <Show when={isConfigured()}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setServerError(null);
                }}
                class="text-stone-600 hover:text-stone-300 transition-colors"
                aria-label="Cancelar"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.3"
                  aria-hidden="true"
                >
                  <line x1="3" y1="3" x2="11" y2="11" stroke-linecap="round" />
                  <line x1="11" y1="3" x2="3" y2="11" stroke-linecap="round" />
                </svg>
              </button>
            </Show>
          </div>

          <div class="bg-void-800/60 border border-void-600 px-3 py-2.5">
            <p class="font-mono text-[10px] text-stone-500 leading-relaxed">
              Obtenha as credenciais em{" "}
              <span class="text-ember-700">develop.battle.net/access/clients</span>.
              Crie uma nova aplicação e copie o{" "}
              <span class="text-stone-400">Client ID</span> e o{" "}
              <span class="text-stone-400">Client Secret</span>.
            </p>
          </div>

          <Form onSubmit={handleSubmit} class="space-y-3">
            <Field name="clientId">
              {(field, fieldProps) => (
                <TextField
                  field={field}
                  fieldProps={fieldProps}
                  label="Client ID"
                  placeholder="ex: a1b2c3d4e5f6..."
                  autocomplete="off"
                  spellcheck={false}
                />
              )}
            </Field>

            <Field name="clientSecret">
              {(field, fieldProps) => (
                <PasswordField
                  field={field}
                  fieldProps={fieldProps}
                  label="Client Secret"
                  autocomplete="new-password"
                />
              )}
            </Field>

            <Field name="label">
              {(field, fieldProps) => (
                <TextField
                  field={field}
                  fieldProps={fieldProps}
                  label="Rótulo (opcional)"
                  placeholder="ex: prod-2025-06"
                  autocomplete="off"
                />
              )}
            </Field>

            <FormError message={serverError()} />

            <div class="flex gap-2 pt-1">
              <SubmitButton
                submitting={saveMutation.isPending}
                label={isConfigured() ? "Rotacionar" : "Salvar credenciais"}
                loadingLabel="Salvando..."
                class="btn-primary flex items-center justify-center gap-2 flex-1"
              />
              <Show when={isConfigured()}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setServerError(null);
                  }}
                  class="btn-ghost flex-1 text-sm"
                >
                  Cancelar
                </button>
              </Show>
            </div>
          </Form>

          <div class="flex items-start gap-2 pt-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              class="text-stone-700 mt-0.5 shrink-0"
              aria-hidden="true"
            >
              <rect x="2" y="5" width="8" height="6" rx="0.5" />
              <path d="M4 5V3.5a2 2 0 014 0V5" />
              <circle cx="6" cy="8" r="0.75" fill="currentColor" />
            </svg>
            <p class="font-mono text-[10px] text-stone-700 leading-relaxed">
              O Client Secret é transmitido via HTTPS e cifrado com AES-256-GCM
              no servidor. O texto claro não é armazenado.
            </p>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default BNetCredentialsCard;
