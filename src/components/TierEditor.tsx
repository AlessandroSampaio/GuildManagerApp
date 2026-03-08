import { ApiError } from "@/api/client";
import { useSaveScoringSettings } from "@/lib/queries/scoring";
import {
  type ScoringTiersForm,
  scoringTiersSchema,
} from "@/schemas/scoringTierSchema";
import {
  createForm,
  insert,
  remove,
  SubmitHandler,
  zodForm,
} from "@modular-forms/solid";
import { Component, createSignal, Index, JSX, Show } from "solid-js";
import { FormError, FormSuccess, SubmitButton } from "./ui/TextField";

interface TierEditorProps {
  initialTiers: ScoringTiersForm["tiers"];
  onSuccess: () => void;
  onCancel: () => void;
}

export const TierEditor: Component<TierEditorProps> = (p) => {
  const saveMut = useSaveScoringSettings();
  const [serverError, setServerError] = createSignal<string | null>(null);

  const [form, { Form, Field, FieldArray }] = createForm<ScoringTiersForm>({
    validate: zodForm(scoringTiersSchema),
    initialValues: { tiers: p.initialTiers },
  });

  const handleSubmit: SubmitHandler<ScoringTiersForm> = (values) => {
    setServerError(null);
    saveMut.mutate(values.tiers, {
      onSuccess: () => p.onSuccess(),
      onError: (err) =>
        setServerError(
          err instanceof ApiError
            ? err.message
            : "Falha ao salvar configuração.",
        ),
    });
  };

  function addTier() {
    insert(form, "tiers", {
      value: { minPercent: 0, maxPercent: 100, points: 50, label: "" },
    });
  }

  const baseCls =
    "w-full bg-void-800 border px-2 py-1.5 font-mono text-xs text-stone-200 " +
    "focus:outline-none transition-colors";
  const okBorder = "border-void-600 focus:border-ember-700";
  const errBorder = "border-red-700  focus:border-red-600 bg-red-950/10";

  return (
    <Form onSubmit={handleSubmit} class="space-y-5">
      <div class="grid grid-cols-[1fr_1fr_1fr_2fr_auto] gap-2">
        <span class="label-xs">Min %</span>
        <span class="label-xs">Max %</span>
        <span class="label-xs">Pontos</span>
        <span class="label-xs">Rótulo</span>
        <span class="w-7" />
      </div>

      {/* FieldArray — one row per tier */}
      <FieldArray name="tiers">
        {(fieldArray) => (
          <div class="space-y-2">
            <Index each={fieldArray.items}>
              {(_, index) => (
                <div class="grid grid-cols-[1fr_1fr_1fr_2fr_auto] gap-2 items-start">
                  {/* minPercent */}
                  <Field name={`tiers.${index}.minPercent`} type="number">
                    {(
                      field: {
                        value: number;
                        error:
                          | number
                          | boolean
                          | Node
                          | JSX.ArrayElement
                          | (string & {})
                          | null
                          | undefined;
                      },
                      props: JSX.IntrinsicAttributes &
                        JSX.InputHTMLAttributes<HTMLInputElement>,
                    ) => (
                      <div class="space-y-0.5">
                        <input
                          {...props}
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          placeholder="0"
                          value={(field.value as number) ?? ""}
                          class={`${baseCls} ${field.error ? errBorder : okBorder}`}
                          aria-invalid={!!field.error}
                        />
                        <Show when={field.error}>
                          <p class="font-mono text-[9px] text-red-400 leading-tight px-0.5">
                            {field.error}
                          </p>
                        </Show>
                      </div>
                    )}
                  </Field>

                  {/* maxPercent */}
                  <Field name={`tiers.${index}.maxPercent`} type="number">
                    {(
                      field: {
                        value: number;
                        error:
                          | number
                          | boolean
                          | Node
                          | JSX.ArrayElement
                          | (string & {})
                          | null
                          | undefined;
                      },
                      props: JSX.IntrinsicAttributes &
                        JSX.InputHTMLAttributes<HTMLInputElement>,
                    ) => (
                      <div class="space-y-0.5">
                        <input
                          {...props}
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          placeholder="100"
                          value={(field.value as number) ?? ""}
                          class={`${baseCls} ${field.error ? errBorder : okBorder}`}
                          aria-invalid={!!field.error}
                        />
                        <Show when={field.error}>
                          <p class="font-mono text-[9px] text-red-400 leading-tight px-0.5">
                            {field.error}
                          </p>
                        </Show>
                      </div>
                    )}
                  </Field>

                  {/* points */}
                  <Field name={`tiers.${index}.points`} type="number">
                    {(
                      field: {
                        value: number;
                        error:
                          | number
                          | boolean
                          | Node
                          | JSX.ArrayElement
                          | (string & {})
                          | null
                          | undefined;
                      },
                      props: JSX.IntrinsicAttributes &
                        JSX.InputHTMLAttributes<HTMLInputElement>,
                    ) => (
                      <div class="space-y-0.5">
                        <input
                          {...props}
                          type="number"
                          min="0"
                          step="1"
                          placeholder="50"
                          value={(field.value as number) ?? ""}
                          class={`${baseCls} ${field.error ? errBorder : okBorder}`}
                          aria-invalid={!!field.error}
                        />
                        <Show when={field.error}>
                          <p class="font-mono text-[9px] text-red-400 leading-tight px-0.5">
                            {field.error}
                          </p>
                        </Show>
                      </div>
                    )}
                  </Field>

                  {/* label */}
                  <Field name={`tiers.${index}.label`}>
                    {(
                      field: {
                        value: string;
                        error:
                          | number
                          | boolean
                          | Node
                          | JSX.ArrayElement
                          | (string & {})
                          | null
                          | undefined;
                      },
                      props: JSX.IntrinsicAttributes &
                        JSX.InputHTMLAttributes<HTMLInputElement>,
                    ) => (
                      <div class="space-y-0.5">
                        <input
                          {...props}
                          type="text"
                          placeholder="ex: Lendário, Épico…"
                          maxlength="64"
                          value={(field.value as string) ?? ""}
                          class={`${baseCls} ${field.error ? errBorder : okBorder}`}
                        />
                        <Show when={field.error}>
                          <p class="font-mono text-[9px] text-red-400 leading-tight px-0.5">
                            {field.error}
                          </p>
                        </Show>
                      </div>
                    )}
                  </Field>

                  {/* Remove row */}
                  <button
                    type="button"
                    onClick={() => remove(form, "tiers", { at: index })}
                    class="w-7 h-[34px] flex items-center justify-center
                           text-stone-600 hover:text-red-400 transition-colors shrink-0"
                    title="Remover faixa"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <line
                        x1="2"
                        y1="2"
                        x2="10"
                        y2="10"
                        stroke-linecap="round"
                      />
                      <line
                        x1="10"
                        y1="2"
                        x2="2"
                        y2="10"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </Index>

            {/* Array-level error (e.g. "ao menos uma faixa é necessária") */}
            <Show when={fieldArray.error}>
              <p class="font-mono text-xs text-red-400 animate-fade-in">
                {fieldArray.error}
              </p>
            </Show>
          </div>
        )}
      </FieldArray>

      {/* Add tier */}
      <button
        type="button"
        onClick={addTier}
        class="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-200 transition-colors py-1"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <line x1="6" y1="2" x2="6" y2="10" stroke-linecap="round" />
          <line x1="2" y1="6" x2="10" y2="6" stroke-linecap="round" />
        </svg>
        Adicionar faixa
      </button>

      {/* Hint */}
      <div class="bg-void-700/40 border border-void-600 px-3 py-2.5">
        <p class="font-mono text-[10px] text-stone-600 leading-relaxed">
          As faixas devem cobrir <span class="text-stone-400">0% a 100%</span>{" "}
          de forma contínua — sem gaps nem sobreposições. A validação acontece
          ao submeter.
        </p>
      </div>

      <FormError message={serverError()} />

      <Show when={saveMut.isSuccess}>
        <FormSuccess message="Configuração salva com sucesso." />
      </Show>

      <div class="flex gap-3 pt-1">
        <SubmitButton
          submitting={saveMut.isPending}
          label="Salvar Configuração"
          loadingLabel="Salvando..."
          class="btn-primary flex items-center justify-center gap-2"
        />
        <button type="button" onClick={p.onCancel} class="btn-ghost">
          Cancelar
        </button>
      </div>
    </Form>
  );
};
