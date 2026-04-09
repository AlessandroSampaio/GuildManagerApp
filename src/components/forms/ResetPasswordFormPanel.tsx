import {
  type ResetPasswordForm,
  resetPasswordSchema,
} from "@/schemas/resetPasswordSchema";
import { createForm, SubmitHandler, zodForm } from "@modular-forms/solid";
import { Component, createSignal } from "solid-js";
import {
  FormError,
  PasswordField,
  SubmitButton,
  TextField,
} from "../ui/TextField";
import { authApi } from "@/api/auth";
import { ApiError } from "@/api/client";

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const ResetPasswordFormPanel: Component<Props> = (props) => {
  const [serverError, setServerError] = createSignal<string | null>(null);

  const [form, { Form, Field }] = createForm<ResetPasswordForm>({
    validate: zodForm(resetPasswordSchema),
  });

  const handleSubmit: SubmitHandler<ResetPasswordForm> = async (values) => {
    setServerError(null);
    try {
      await authApi.resetPassword(values);
      props.onSuccess();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Não foi possível conectar ao servidor.";
      setServerError(message);
    }
  };

  return (
    <Form onSubmit={handleSubmit} class="p-6 space-y-4">
      <div class="space-y-1">
        <p class="font-mono text-[11px] text-stone-400 leading-relaxed">
          Informe seu usuário, e-mail e a nova senha para redefinir o acesso.
        </p>
      </div>

      <Field name="username">
        {(field, fieldProps) => (
          <TextField
            field={field}
            fieldProps={fieldProps}
            label="Usuário"
            placeholder="Usuário"
            autocomplete="username"
          />
        )}
      </Field>

      <Field name="email">
        {(field, fieldProps) => (
          <TextField
            field={field}
            fieldProps={fieldProps}
            label="E-mail"
            placeholder="seu@email.com"
            autocomplete="email"
            type="email"
          />
        )}
      </Field>

      <Field name="newPassword">
        {(field, fieldProps) => (
          <PasswordField
            field={field}
            fieldProps={fieldProps}
            label="Nova Senha"
            autocomplete="new-password"
            showStrength
          />
        )}
      </Field>

      <FormError message={serverError()} />

      <SubmitButton
        submitting={form.submitting}
        label="Redefinir Senha"
        loadingLabel="Redefinindo..."
      />

      <button
        type="button"
        onClick={props.onBack}
        class="w-full font-mono text-[11px] text-stone-600 hover:text-stone-400 transition-colors duration-150 text-center py-1"
      >
        Voltar ao login
      </button>
    </Form>
  );
};

export default ResetPasswordFormPanel;
