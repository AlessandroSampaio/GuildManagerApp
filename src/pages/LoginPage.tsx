import LoginFormPanel from "@/components/forms/LoginFormPanel";
import { Component, createSignal, Show } from "solid-js";

// Decorative rune corner SVG
const RuneCorner: Component<{ class?: string }> = (p) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class={p.class}>
    <path d="M1 10 V1 H10" stroke="#c8741c" stroke-width="1" opacity="0.6" />
    <circle cx="1" cy="1" r="1.5" fill="#c8741c" opacity="0.5" />
  </svg>
);

const LoginPage: Component = () => {
  const [mode, setMode] = createSignal<"login" | "register">("login");
  const [loading] = createSignal(false);

  return (
    <div class="flex-1 flex items-center justify-center relative overflow-hidden bg-void-900">
      {/* Background grid */}
      <div
        class="absolute inset-0 opacity-20"
        aria-hidden="true"
        style="background-image:linear-gradient(rgba(200,116,28,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(200,116,28,0.15) 1px,transparent 1px);background-size:40px 40px"
      />
      <div
        class="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style="background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(200,116,28,0.12) 0%,transparent 70%)"
      />
      <div
        class="absolute inset-x-0 h-[2px] animate-scan pointer-events-none"
        aria-hidden="true"
        style="background:linear-gradient(90deg,transparent,rgba(200,116,28,0.3),transparent)"
      />

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
              WarcraftLogs
            </h1>
            <p class="font-mono text-[10px] text-stone-600 tracking-[0.2em] mt-1 uppercase">
              Desktop Client
            </p>
          </div>

          {/* Mode tabs */}
          <div class="flex border-b border-void-700" role="tablist">
            {(["login", "register"] as const).map((m) => (
              <button
                role="tab"
                aria-selected={mode() === m}
                onClick={() => setMode(m)}
                class={`flex-1 py-3 font-body font-bold text-xs tracking-[0.18em] uppercase
                            transition-all duration-200
                            ${
                              mode() === m
                                ? "text-ember-600 border-b-2 border-ember-700 -mb-px bg-forge-900/30"
                                : "text-stone-600 hover:text-stone-300 hover:bg-void-700"
                            }`}
              >
                {m === "login" ? "Entrar" : "Criar Conta"}
              </button>
            ))}
          </div>

          {/*
                Show/fallback causes full unmount+remount on mode change,
                which resets each FormStore independently — intentional.
              */}
          <div role="tabpanel">
            <Show when={mode() === "login"} fallback={<p>Register Form</p>}>
              <LoginFormPanel />
            </Show>
          </div>
        </div>

        <p class="text-center font-mono text-[10px] text-stone-700 mt-4 tracking-widest">
          GUILD MANAGER DESKTOP CLIENT · v1.1
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
