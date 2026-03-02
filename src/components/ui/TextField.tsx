/**
 * Reusable field components for @modular-forms/solid v0.23.
 *
 * Design contract:
 *   - The `Field` render prop from createForm gives (field, fieldProps).
 *   - `fieldProps` already contains { name, ref, onInput, onChange, onBlur }.
 *   - We spread `fieldProps` DIRECTLY onto <input> — no proxy, no wrapper.
 *   - `field` gives us { value, error, dirty, touched } for UI decoration.
 *
 * Usage:
 *   <MyField name="email">
 *     {(field, props) => (
 *       <TextField field={field} fieldProps={props} label="E-mail" type="email" />
 *     )}
 *   </MyField>
 */

import { Component, JSX, Show, splitProps } from "solid-js";
import type {
  FieldStore,
  FieldElementProps,
  FieldValues,
  FieldPath,
} from "@modular-forms/solid";

// ── Shared types ──────────────────────────────────────────────────────────────

export type FieldComponentProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
> = {
  /** The reactive field store from modular-forms (value, error, dirty…). */
  field: FieldStore<TFieldValues, TFieldName>;
  /** The spread-ready props from modular-forms (name, ref, onInput, onBlur…). */
  fieldProps: FieldElementProps<TFieldValues, TFieldName>;
  /** Visible label text above the input. */
  label: string;
  placeholder?: string;
  class?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const hasError = <T extends FieldValues, N extends FieldPath<T>>(
  f: FieldStore<T, N>,
) => !!f.error;

const isValid = <T extends FieldValues, N extends FieldPath<T>>(
  f: FieldStore<T, N>,
) => f.dirty && !f.error;
const strValue = <T extends FieldValues, N extends FieldPath<T>>(
  f: FieldStore<T, N>,
) => (f.value as string) ?? "";

// ── FieldWrapper — label + error message container ────────────────────────────

const FieldWrapper: Component<{
  label: string;
  name: string;
  error?: string;
  class?: string;
  children: JSX.Element;
}> = (p) => (
  <div class={`space-y-1.5 ${p.class ?? ""}`}>
    <label for={p.name} class="label-xs block">
      {p.label}
    </label>
    {p.children}
    <Show when={p.error}>
      <p
        id={`${p.name}-error`}
        role="alert"
        class="flex items-center gap-1.5 font-mono text-[10px] text-red-400 animate-fade-in"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          aria-hidden="true"
        >
          <circle cx="5" cy="5" r="4" />
          <line x1="5" y1="3" x2="5" y2="5.5" />
          <circle cx="5" cy="7" r="0.4" fill="currentColor" />
        </svg>
        {p.error}
      </p>
    </Show>
  </div>
);

// ── Icon overlays ─────────────────────────────────────────────────────────────

const ValidIcon = () => (
  <span
    class="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none"
    aria-hidden="true"
  >
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
    >
      <path
        d="M2 6.5l3 3 5-5.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
);

const ErrorIcon = () => (
  <span
    class="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none"
    aria-hidden="true"
  >
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <line x1="2" y1="2" x2="9" y2="9" stroke-linecap="round" />
      <line x1="9" y1="2" x2="2" y2="9" stroke-linecap="round" />
    </svg>
  </span>
);

// ── Base input class resolver ─────────────────────────────────────────────────

function inputClass(error: boolean, valid: boolean, extra = ""): string {
  const state = error
    ? "border-red-700   focus:border-red-600   bg-red-950/10"
    : valid
      ? "border-emerald-800 focus:border-emerald-700"
      : "border-void-500   focus:border-ember-700";
  return `input transition-all duration-200 ${state} ${extra}`.trim();
}

// ── TextField ─────────────────────────────────────────────────────────────────

export function TextField<T extends FieldValues, N extends FieldPath<T>>(
  props: FieldComponentProps<T, N> & {
    type?: "text" | "email" | "search";
    autocomplete?: string;
    spellcheck?: boolean;
    maxLength?: number;
  },
): JSX.Element {
  const [local, rest] = splitProps(props, [
    "field",
    "fieldProps",
    "label",
    "placeholder",
    "class",
    "type",
    "autocomplete",
    "spellcheck",
    "maxLength",
  ]);

  const error = () => hasError(local.field);
  const valid = () => isValid(local.field);

  return (
    <FieldWrapper
      label={local.label}
      name={String(local.fieldProps.name)}
      error={local.field.error}
      class={local.class}
    >
      <div class="relative">
        <input
          {...local.fieldProps} // ← name, ref, onInput, onChange, onBlur
          id={String(local.fieldProps.name)}
          type={local.type ?? "text"}
          placeholder={local.placeholder}
          value={strValue(local.field)}
          autocomplete={local.autocomplete}
          spellcheck={local.spellcheck}
          maxLength={local.maxLength}
          class={inputClass(error(), valid(), "pr-8")}
          aria-invalid={error()}
          aria-describedby={
            error() ? `${String(local.fieldProps.name)}-error` : undefined
          }
        />
        <Show when={valid()}>
          <ValidIcon />
        </Show>
        <Show when={error()}>
          <ErrorIcon />
        </Show>
      </div>
    </FieldWrapper>
  );
}

// ── PasswordStrength meter ────────────────────────────────────────────────────

function calcStrength(v: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!v) return { score: 0, label: "", color: "bg-void-600" };
  if (v.length < 8) return { score: 1, label: "Fraca", color: "bg-red-600" };
  const pts =
    (/[A-Z]/.test(v) ? 1 : 0) +
    (/[0-9]/.test(v) ? 1 : 0) +
    (/[^a-zA-Z0-9]/.test(v) ? 1 : 0) +
    (v.length >= 12 ? 1 : 0);
  if (pts <= 1) return { score: 2, label: "Razoável", color: "bg-amber-600" };
  if (pts <= 2) return { score: 3, label: "Boa", color: "bg-amber-400" };
  return { score: 4, label: "Forte", color: "bg-emerald-500" };
}

// ── PasswordField ─────────────────────────────────────────────────────────────

export function PasswordField<T extends FieldValues, N extends FieldPath<T>>(
  props: FieldComponentProps<T, N> & {
    showStrength?: boolean;
    autocomplete?: string;
  },
): JSX.Element {
  const [local, rest] = splitProps(props, [
    "field",
    "fieldProps",
    "label",
    "placeholder",
    "class",
    "showStrength",
    "autocomplete",
  ]);

  const error = () => hasError(local.field);
  const valid = () => isValid(local.field);
  const val = () => strValue(local.field);
  const strength = () => calcStrength(val());

  return (
    <FieldWrapper
      label={local.label}
      name={String(local.fieldProps.name)}
      error={local.field.error}
      class={local.class}
    >
      <div class="relative">
        <input
          {...local.fieldProps} // ← name, ref, onInput, onChange, onBlur
          id={String(local.fieldProps.name)}
          type="password"
          placeholder={local.placeholder ?? "••••••••••"}
          value={val()}
          autocomplete={local.autocomplete}
          class={inputClass(error(), valid(), "pr-8")}
          aria-invalid={error()}
          aria-describedby={
            error() ? `${String(local.fieldProps.name)}-error` : undefined
          }
        />
        <Show when={valid()}>
          <ValidIcon />
        </Show>
        <Show when={error() && !valid()}>
          <ErrorIcon />
        </Show>
      </div>

      {/* Strength meter — only shown when showStrength=true and field has content */}
      <Show when={local.showStrength && val().length > 0}>
        <div
          class="mt-2 space-y-1 animate-fade-in"
          aria-label={`Força da senha: ${strength().label}`}
        >
          <div
            class="flex gap-1"
            role="progressbar"
            aria-valuenow={strength().score}
            aria-valuemin={0}
            aria-valuemax={4}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                class={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= strength().score ? strength().color : "bg-void-600"
                }`}
              />
            ))}
          </div>
          <p
            class={`font-mono text-[10px] transition-colors duration-200 ${
              strength().score <= 1
                ? "text-red-500"
                : strength().score <= 2
                  ? "text-amber-600"
                  : strength().score <= 3
                    ? "text-amber-400"
                    : "text-emerald-500"
            }`}
          >
            {strength().label}
          </p>
        </div>
      </Show>
    </FieldWrapper>
  );
}

// ── FormError — server-side error banner ──────────────────────────────────────

export const FormError: Component<{ message: string | null | undefined }> = (
  p,
) => (
  <Show when={p.message}>
    <div
      role="alert"
      class="flex items-start gap-3 bg-red-950/60 border border-red-900 px-4 py-3 animate-fade-in"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="#f87171"
        stroke-width="1.3"
        class="shrink-0 mt-0.5"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="5.5" />
        <line x1="7" y1="4.5" x2="7" y2="7.5" />
        <circle cx="7" cy="9.5" r="0.5" fill="#f87171" />
      </svg>
      <p class="font-mono text-xs text-red-400 leading-relaxed">{p.message}</p>
    </div>
  </Show>
);

// ── FormSuccess — server-side success banner ──────────────────────────────────

export const FormSuccess: Component<{ message: string | null | undefined }> = (
  p,
) => (
  <Show when={p.message}>
    <div
      role="status"
      class="flex items-start gap-3 bg-emerald-950/60 border border-emerald-800 px-4 py-3 animate-fade-in"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="#34d399"
        stroke-width="1.4"
        class="shrink-0 mt-0.5"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="5.5" />
        <path
          d="M4.5 7l2 2 3-3.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <p class="font-mono text-xs text-emerald-400 leading-relaxed">
        {p.message}
      </p>
    </div>
  </Show>
);

// ── SubmitButton ──────────────────────────────────────────────────────────────

export const SubmitButton: Component<{
  submitting: boolean;
  label: string;
  loadingLabel?: string;
  class?: string;
  disabled?: boolean;
}> = (p) => (
  <button
    type="submit"
    disabled={p.submitting || p.disabled}
    aria-busy={p.submitting}
    class={`btn-primary flex items-center justify-center gap-2 ${p.class ?? "w-full"}`}
  >
    <Show when={p.submitting}>
      <svg
        class="animate-spin w-4 h-4 shrink-0"
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
    {p.submitting ? (p.loadingLabel ?? "Aguarde...") : p.label}
  </button>
);
