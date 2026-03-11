import { ApiError } from "@/api/client";
import { wclAuthApi } from "@/api/wcl-auth";
import {
  listenWclAuthCancelled,
  listenWclAuthComplete,
  wclAuthIpc,
} from "@/ipc";
import { useRevokeWcl, useWclStatus } from "@/lib";
import { UnlistenFn } from "@tauri-apps/api/event";
import { Component, createSignal, Show } from "solid-js";
import { Spinner } from "./ui/Spinner";

async function runWclOAuthFlow(
  authorizeUrl: string,
): Promise<"authorized" | "cancelled" | "error"> {
  return new Promise(async (resolve) => {
    let unlistenComplete: UnlistenFn | null = null;
    let unlistenCancelled: UnlistenFn | null = null;
    let settled = false;

    function settle(r: "authorized" | "cancelled" | "error") {
      console.log(`settle : ${r}`);
      if (settled) return;
      settled = true;
      unlistenComplete?.();
      unlistenCancelled?.();
      resolve(r);
    }

    unlistenComplete = await listenWclAuthComplete((ok) => {
      console.log(`listenWclAuthComplete : ${ok}`);
      settle(ok ? "authorized" : "error");
    });
    unlistenCancelled = await listenWclAuthCancelled(() => {
      console.log(`listenWclAuthCancelled`);
      settle("cancelled");
    });

    const result = await wclAuthIpc.open_auth_window(authorizeUrl);
    if (!result.opened) {
      settle("error");
      return;
    }

    setTimeout(() => settle("cancelled"), 120_000);
  });
}

const WclOAuthCard: Component = () => {
  /*
   * useWclStatus — createQuery wrapping wclAuthApi.getStatus().
   * staleTime: 30s so status refreshes quickly after OAuth flow completes.
   * select: syncs authStore.wclAuthorized reactively.
   */
  const statusQuery = useWclStatus();
  const revokeMutation = useRevokeWcl();

  const [authLoad, setAuthLoad] = createSignal(false);
  const [feedback, setFeedback] = createSignal<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const isAuthorized = () => statusQuery.data?.isAuthorized ?? false;

  async function handleAuthorize() {
    setAuthLoad(true);
    setFeedback(null);
    try {
      const { authorizeUrl } = await wclAuthApi.getAuthorizeUrl();
      const outcome = await runWclOAuthFlow(authorizeUrl);

      // Invalidate and refetch status — useWclStatus will update reactively
      await statusQuery.refetch();

      if (outcome === "authorized" && statusQuery.data?.isAuthorized) {
        setFeedback({
          kind: "ok",
          text: "WarcraftLogs conectado! Reports privados via /api/v2/user.",
        });
      } else if (outcome === "cancelled") {
        setFeedback({
          kind: "err",
          text: "Autorização cancelada antes de ser concluída.",
        });
      } else {
        setFeedback({
          kind: "err",
          text: "Falha na autorização WCL. Tente novamente.",
        });
      }
    } catch (err) {
      setFeedback({
        kind: "err",
        text: err instanceof ApiError ? err.message : "Erro inesperado.",
      });
    } finally {
      setAuthLoad(false);
    }
  }

  function handleRevoke() {
    setFeedback(null);
    revokeMutation.mutate(undefined, {
      onSuccess: () =>
        setFeedback({
          kind: "ok",
          text: "Acesso WCL revogado. Próximas importações usarão /api/v2/client.",
        }),
      onError: () =>
        setFeedback({ kind: "err", text: "Falha ao revogar o token." }),
    });
  }

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
          <Show
            when={!statusQuery.isLoading}
            fallback={<Spinner class="text-stone-600" size={14} />}
          >
            <div
              class={`w-2 h-2 rounded-full transition-all duration-300 ${
                isAuthorized()
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                  : "bg-void-500"
              }`}
              aria-hidden="true"
            />
            <span class="font-mono text-[11px] text-stone-500 tracking-wider whitespace-nowrap">
              {isAuthorized() ? "CONECTADO" : "DESCONECTADO"}
            </span>
          </Show>
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

      {/* Error from status query */}
      <Show when={statusQuery.isError}>
        <div
          role="alert"
          class="mb-4 bg-red-950/60 border border-red-900 px-4 py-3 font-mono text-xs text-red-400"
        >
          Falha ao verificar status WCL. Tente recarregar a página
        </div>
      </Show>

      {/* Action feedback */}
      <Show when={feedback()}>
        <div
          role={feedback()!.kind === "ok" ? "status" : "alert"}
          class={`mb-4 flex items-start gap-3 px-4 py-3 border animate-fade-in font-mono text-xs ${
            feedback()!.kind === "ok"
              ? "bg-emerald-950/60 border-emerald-800 text-emerald-400"
              : "bg-red-950/60 border-red-900 text-red-400"
          }`}
        >
          {feedback()!.text}
        </div>
      </Show>

      {/* Action buttons */}
      <div class="flex items-center  justify-center gap-3 flex-wrap">
        <Show
          when={isAuthorized()}
          fallback={
            <button
              onClick={handleAuthorize}
              disabled={authLoad() || statusQuery.isLoading}
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

      {/* TauRPC diagnostics */}
      <div class="mt-5 pt-4 border-t border-void-700">
        <p class="label-xs mb-3">Diagnóstico TauRPC</p>
        <div class="flex gap-2">
          <button
            onClick={async () => {
              const open = await wclAuthIpc.is_auth_window_open();
              setFeedback({
                kind: open ? "ok" : "err",
                text: `Janela wcl-oauth: ${open ? "aberta" : "fechada"}`,
              });
            }}
            class="btn-ghost text-xs py-1.5 px-3"
          >
            Verificar janela
          </button>
          <button
            onClick={async () => {
              await wclAuthIpc.close_auth_window();
              setFeedback({
                kind: "ok",
                text: "Janela WCL forçada a fechar via TauRPC.",
              });
            }}
            class="btn-ghost text-xs py-1.5 px-3"
          >
            Forçar fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WclOAuthCard;
