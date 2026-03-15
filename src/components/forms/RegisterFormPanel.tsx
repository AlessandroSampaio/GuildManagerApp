import { type RegisterForm, registerSchema } from "@/schemas/registerSchema";
import { createForm, SubmitHandler, zodForm } from "@modular-forms/solid";
import { Component, createSignal } from "solid-js";
import {
  FormError,
  PasswordField,
  SubmitButton,
  TextField,
} from "../ui/TextField";
import { useNavigate } from "@solidjs/router";
import { authApi } from "@/api/auth";
import { authStore } from "@/stores/auth";
import { ApiError } from "@/api/client";

const RegisterFormPanel: Component = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = createSignal<string | null>(null);

  const [form, { Form, Field }] = createForm<RegisterForm>({
    validate: zodForm(registerSchema),
  });

  const handleSubmit: SubmitHandler<RegisterForm> = async (values) => {
    setServerError(null);
    try {
      const data = await authApi.register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      authStore.setTokens(data.accessToken, data.refreshToken, data.user);
      navigate("/app/dashboard");
    } catch (err) {
      setServerError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível conectar ao servidor.",
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit} class="p-6 space-y-4">
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
      <Field name="password">
        {(field, fieldProps) => (
          <PasswordField
            field={field}
            fieldProps={fieldProps}
            label="Senha"
            autocomplete="new-password"
          />
        )}
      </Field>
      <Field name="confirmPassword">
        {(field, fieldProps) => (
          <PasswordField
            field={field}
            fieldProps={fieldProps}
            label="Confirmar Senha"
            autocomplete="new-password"
          />
        )}
      </Field>

      <FormError message={serverError()} />

      <SubmitButton
        submitting={form.submitting}
        label="Criar Conta"
        loadingLabel="Registrando..."
      />
    </Form>
  );
};

export default RegisterFormPanel;
