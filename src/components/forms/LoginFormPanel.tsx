import { type LoginForm, loginSchema } from "@/schemas/loginSchema";
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

const LoginFormPanel: Component = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = createSignal<string | null>(null);

  const [form, { Form, Field }] = createForm<LoginForm>({
    validate: zodForm(loginSchema),
  });

  const handleSubmit: SubmitHandler<LoginForm> = async (values: LoginForm) => {
    try {
      const data = await authApi.login(values);
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
      <Field name="password">
        {(field, fieldProps) => (
          <PasswordField
            field={field}
            fieldProps={fieldProps}
            label="Senha"
            autocomplete="current-password"
          />
        )}
      </Field>

      <FormError message={serverError()} />

      <SubmitButton
        submitting={form.submitting}
        label="Entrar no Sistema"
        loadingLabel="Autenticando..."
      />
    </Form>
  );
};

export default LoginFormPanel;
