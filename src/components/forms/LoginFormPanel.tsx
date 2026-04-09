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

interface Props {
  onForgotPassword: () => void;
}

const LoginFormPanel: Component<Props> = (props) => {
  const navigate = useNavigate();
  const [serverError, setServerError] = createSignal<string | null>(null);
  const [rememberMe, setRememberMe] = createSignal(false);

  const [form, { Form, Field }] = createForm<LoginForm>({
    validate: zodForm(loginSchema),
  });

  const handleSubmit: SubmitHandler<LoginForm> = async (values: LoginForm) => {
    console.log("[auth] login attempt", {
      username: values.username,
      rememberMe: rememberMe(),
    });
    try {
      const data = await authApi.login(values);
      console.log("[auth] login success", {
        user: data.user.username,
        role: data.user.role,
      });
      authStore.loginWithRemember(
        data.accessToken,
        data.refreshToken,
        data.user,
        rememberMe(),
      );
      if (rememberMe()) {
        console.log("[auth] refresh token queued for stronghold persist");
      }
      navigate("/app/dashboard");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Não foi possível conectar ao servidor.";
      console.error("[auth] login failed", { error: message });
      setServerError(message);
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

      {/* Remember me */}
      <label class="flex items-center gap-2.5 cursor-pointer select-none w-fit">
        <input
          type="checkbox"
          checked={rememberMe()}
          onChange={(e) => setRememberMe(e.currentTarget.checked)}
          class="w-3.5 h-3.5 accent-amber-500 cursor-pointer"
        />
        <span class="font-mono text-xs text-stone-500">
          Mantenha-me Conectado
        </span>
      </label>

      <div class="flex justify-end">
        <button
          type="button"
          onClick={props.onForgotPassword}
          class="font-mono text-[11px] text-stone-600 hover:text-ember-500 transition-colors duration-150"
        >
          Esqueci minha senha
        </button>
      </div>

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
