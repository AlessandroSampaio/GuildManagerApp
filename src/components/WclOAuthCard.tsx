import { Component, createSignal, Show } from "solid-js";
import { Spinner } from "./ui/Spinner";

const WclOAuthCard: Component = () => {
  const [authLoad, setAuthLoad] = createSignal(false);
  const [isAuthorized, setIsAuthorized] = createSignal(false);
  const [feedback, setFeedback] = createSignal<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  return (
    <div class="card animate-fade-in" style={{ "animation-delay": "0.05s" }}>
      {/* Header with a Status Badge */}
      <div class="flex items-start justify-between mb-5">
        <div class="flex-1 min-w-0 pr-4">
          <p class="label-xs mb-1">Warcraft Logs</p>
          <h3 class="font-display text-base text-stone-100 tracking-wide"></h3>
          <p class="text-stone-500 text-sm mt-1.5 leading-relaxed">
            Conecte sua conta do WCL para importar{" "}
            <span class="text-stone-300 font-semibold">dados privados</span> via{" "}
            <code class="font-mono text-ember-700 text-xs bg-forge-900/50 px-1.5 py-1.5 border border-forge-700/40">
              /api/v2/user
            </code>
          </p>
        </div>

        {/* Status Badge */}
        <div class="flex items-center gap-2 shrink-0 mt-1" aria-live="polite">
          <div
            class="size-2 rounded-full transition-all duration-300 bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
            aria-hidden
          />
          <span class="font-mono text-[11px] text-stone-500 tracking-wider whitespace-nowrap">
            Conectado
          </span>
        </div>
      </div>

      {/* Flow explanation */}
      <div class="bg-void-700/40 border border-void-600/60 p-4 mb-5">
        <p class="label-xs mb-3">Fluxo — TauRPC + TanStack Query</p>
        <ol class="space-y-2.5">
          {[
            { n: "1", t: 'Clique em "Autorizar WarcraftLogs"', code: null },
            {
              n: "2",
              t: "Uma janela será aberta para que a autorização seja realizada no WCL",
              code: "https://warcraftlogs.com",
            },
            {
              n: "3",
              t: "Faça login no WCL e clique em Authorize",
              code: null,
            },
            {
              n: "4",
              t: "O sistema processará a autorização retornada e atualizará suas informações",
              code: null,
            },
            {
              n: "5",
              t: "Pronto, a partir de agora você poderá acessar seus dados privados no WCL",
              code: null,
            },
          ].map((s) => (
            <li class="flex items-start gap-3">
              <span
                class="font-mono text-[10px] w-4 h-4 flex items-center justify-center
                             shrink-0 mt-0.5 border
                             text-ember-700 bg-forge-900/60 border-forge-600"
                aria-hidden="true"
              >
                {s.n}
              </span>
              <span class="text-stone-500 text-xs leading-relaxed flex-1">
                {s.t}
                {s.code && (
                  <code
                    class="ml-1.5 font-mono text-[10px] text-ember-700/80
                                     bg-forge-900/40 px-1 border border-forge-800/40"
                  >
                    {s.code}
                  </code>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Action buttons */}
      <div class="flex items-center  justify-center gap-3 flex-wrap">
        <Show
          when={isAuthorized()}
          fallback={
            <button
              // onClick={handleAuthorize}
              // disabled={authLoad() || statusQuery.isLoading}
              class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={authLoad()}
            >
              <Show when={authLoad()}>
                <Spinner />
              </Show>
              <Show when={!authLoad()}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.3"
                  aria-hidden="true"
                >
                  <rect x="1.5" y="5.5" width="11" height="7" rx="0.5" />
                  <path d="M4.5 5.5V3.5a3.5 3.5 0 017 0v2" />
                  <circle cx="7" cy="9" r="1" fill="currentColor" />
                </svg>
              </Show>
              {authLoad()
                ? "Aguardando autorização..."
                : "Autorizar WarcraftLogs"}
            </button>
          }
        >
          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M2 7l3.5 4L12 3" />
              </svg>
              Conta WCL vinculada
            </div>
            <button
              onClick={handleRevoke}
              disabled={revokeMutation.isPending}
              aria-busy={revokeMutation.isPending}
              class="btn-danger flex items-center gap-1.5 text-xs py-1.5 px-3"
            >
              <Show when={revokeMutation.isPending}>
                <Spinner size={12} />
              </Show>
              {revokeMutation.isPending ? "Revogando..." : "Revogar acesso"}
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default WclOAuthCard;
