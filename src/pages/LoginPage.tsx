import LoginFormPanel from "@/components/forms/LoginFormPanel";
import RegisterFormPanel from "@/components/forms/RegisterFormPanel";
import ResetPasswordFormPanel from "@/components/forms/ResetPasswordFormPanel";
import { appVersion } from "@/lib/version";
import { Component, createSignal, Show } from "solid-js";

type Tab = "login" | "register" | "reset";

const RuneCorner: Component<{ class?: string }> = (p) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class={p.class}>
    <path d="M1 10 V1 H10" stroke="#c8741c" stroke-width="1" opacity="0.6" />
    <circle cx="1" cy="1" r="1.5" fill="#c8741c" opacity="0.5" />
  </svg>
);

const LoginPage: Component = () => {
  const [tab, setTab] = createSignal<Tab>("login");

  return (
    <div class="flex-1 overflow-y-auto relative bg-void-900">
      {/* Background grid — fixed so it stays visible while scrolling */}
      <div
        class="fixed inset-0 opacity-20 pointer-events-none"
        aria-hidden="true"
        style="background-image:linear-gradient(rgba(200,116,28,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(200,116,28,0.15) 1px,transparent 1px);background-size:40px 40px"
      />
      <div
        class="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style="background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(200,116,28,0.12) 0%,transparent 70%)"
      />
      <div
        class="fixed inset-x-0 h-[2px] animate-scan pointer-events-none"
        aria-hidden="true"
        style="background:linear-gradient(90deg,transparent,rgba(200,116,28,0.3),transparent)"
      />

      {/* Centering wrapper — min-h-full keeps the panel centered when there's room */}
      <div class="relative min-h-full flex items-center justify-center py-8">

      {/* Panel */}
      <div class="relative w-full max-w-[360px] mx-6 animate-slide-up">
        <RuneCorner class="absolute -top-1 -left-1" />
        <RuneCorner class="absolute -top-1 -right-1 rotate-90" />
        <RuneCorner class="absolute -bottom-1 -left-1 -rotate-90" />
        <RuneCorner class="absolute -bottom-1 -right-1 rotate-180" />

        <div class="bg-void-800/95 border border-void-600 backdrop-blur-sm">
          {/* Logo */}
          <div class="text-center pt-9 pb-6 border-b border-void-700 relative overflow-hidden">
            <div
              class="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style="background:radial-gradient(ellipse 80% 60% at 50% 100%,rgba(200,116,28,0.1) 0%,transparent 70%)"
            />
            <div class="flex justify-center mb-5" aria-hidden="true">
              <div class="relative w-14 h-14 flex items-center justify-center">
                <div class="absolute inset-0 border-2 border-ember-700 rotate-45 animate-ember-pulse" />
                <div class="absolute inset-2 bg-forge-800 border border-ember-800 rotate-45" />
                <svg
                  class="relative z-10"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 2L18 10L10 18L2 10Z"
                    stroke="#e08c28"
                    stroke-width="1.2"
                    fill="none"
                  />
                  <circle cx="10" cy="10" r="2.5" fill="#c8741c" />
                </svg>
              </div>
            </div>
            <h1 class="font-display text-sm text-ember-600 tracking-[0.22em]">
              Guild Manager
            </h1>
            <p class="font-mono text-[10px] text-stone-600 tracking-[0.2em] mt-1 uppercase">
              Desktop Client
            </p>
          </div>

          {/* Tabs — hidden on reset view */}
          <Show when={tab() !== "reset"}>
            <div class="flex border-b border-void-700" role="tablist">
              <button
                role="tab"
                aria-selected={tab() === "login"}
                onClick={() => setTab("login")}
                class={`flex-1 py-2.5 font-mono text-[11px] tracking-widest uppercase transition-colors duration-150 ${
                  tab() === "login"
                    ? "text-ember-500 border-b-2 border-ember-600 -mb-px bg-void-800/60"
                    : "text-stone-600 hover:text-stone-400 border-b-2 border-transparent -mb-px"
                }`}
              >
                Entrar
              </button>
              <button
                role="tab"
                aria-selected={tab() === "register"}
                onClick={() => setTab("register")}
                class={`flex-1 py-2.5 font-mono text-[11px] tracking-widest uppercase transition-colors duration-150 ${
                  tab() === "register"
                    ? "text-ember-500 border-b-2 border-ember-600 -mb-px bg-void-800/60"
                    : "text-stone-600 hover:text-stone-400 border-b-2 border-transparent -mb-px"
                }`}
              >
                Registrar
              </button>
            </div>
          </Show>

          {/* Reset header */}
          <Show when={tab() === "reset"}>
            <div class="border-b border-void-700 px-6 py-2.5">
              <p class="font-mono text-[11px] tracking-widest uppercase text-ember-500">
                Redefinir Senha
              </p>
            </div>
          </Show>

          <div role="tabpanel">
            <Show when={tab() === "login"}>
              <LoginFormPanel onForgotPassword={() => setTab("reset")} />
            </Show>
            <Show when={tab() === "register"}>
              <RegisterFormPanel />
            </Show>
            <Show when={tab() === "reset"}>
              <ResetPasswordFormPanel
                onBack={() => setTab("login")}
                onSuccess={() => setTab("login")}
              />
            </Show>
          </div>
        </div>

        <p class="text-center font-mono text-[10px] text-stone-700 mt-4 tracking-widest">
          GUILD MANAGER DESKTOP CLIENT · v{appVersion()}
        </p>
      </div>

      </div>
    </div>
  );
};

export default LoginPage;
