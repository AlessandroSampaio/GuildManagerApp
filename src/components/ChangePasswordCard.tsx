import { ApiError } from "@/api/client";
import { useChangePassword } from "@/lib/queries/auth";
import {
  ChangePasswordForm,
  changePasswordSchema,
} from "@/schemas/changePasswordSchema";
import { createForm, SubmitHandler, zodForm } from "@modular-forms/solid";
import {
  FormError,
  FormSuccess,
  PasswordField,
  SubmitButton,
} from "./ui/TextField";
import { Show } from "solid-js";

const ChangePasswordCard = () => {
  const mutation = useChangePassword();

  const [form, { Form, Field }] = createForm<ChangePasswordForm>({
    validate: zodForm(changePasswordSchema),
  });

  const handleSubmit: SubmitHandler<ChangePasswordForm> = (values) => {
    mutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const serverError = () =>
    mutation.isError
      ? mutation.error instanceof ApiError
        ? mutation.error.message
        : "Falha ao alterar a senha."
      : null;

  return (
    <div class="card animate-fade-in" style={{ "animation-delay": "0.08s" }}>
      <p class="label-xs mb-1">Segurança</p>
      <h3 class="font-display text-base text-stone-100 tracking-wide mb-5">
        Alterar Senha
      </h3>
      <Form
        onSubmit={handleSubmit}
        class="space-y-4 max-w-sm"
        aria-label="Formulário para alteração de senha"
      >
        <Field name="currentPassword">
          {(field, fieldProps) => (
            <PasswordField
              field={field}
              fieldProps={fieldProps}
              label="Senha Atual"
              autocomplete="current-password"
            />
          )}
        </Field>
        <Field name="newPassword">
          {(field, fieldProps) => (
            <PasswordField
              field={field}
              fieldProps={fieldProps}
              label="Nova senha"
              autocomplete="new-password"
              showStrength
            />
          )}
        </Field>
        <Field name="confirmNewPassword">
          {(field, fieldProps) => (
            <PasswordField
              field={field}
              fieldProps={fieldProps}
              label="Confirmar nova senha"
              autocomplete="new-password"
            />
          )}
        </Field>
        <FormError message={serverError()} />
        <Show when={mutation.isSuccess}>
          <FormSuccess message="Senha alterada. Faça login novamente." />
        </Show>
        <SubmitButton
          submitting={mutation.isPending}
          label="Alterar Senha"
          loadingLabel="Alterando..."
          class="btn-primary flex items-center justify-center gap-2"
        />
      </Form>
    </div>
  );
};

export default ChangePasswordCard;
