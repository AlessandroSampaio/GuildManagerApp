import { ApiError } from "@/api/client";
import { bnetApi } from "@/api/bnet";
import { listenWclAuthCancelled, wclAuthIpc } from "@/ipc";
import { useBNetStatus, useRevokeBNet } from "@/lib/queries/bnet";
import { UnlistenFn } from "@tauri-apps/api/event";
import { Component, createSignal, Show } from "solid-js";
import { Spinner } from "./ui/Spinner";

async function runBNetOAuthFlow(
  authorizeUrl: string,
): Promise<"authorized" | "cancelled" | "error"> {
  return new Promise(async (resolve) => {
    let unlisten: UnlistenFn | null = null;
    let settled = false;

    function settle(r: "authorized" | "cancelled" | "error") {
      if (settled) return;
      settled = true;
      unlisten?.();
      resolve(r);
    }

    unlisten = await listenWclAuthCancelled(() => settle("cancelled"));

    const result = await wclAuthIpc.open_auth_window(authorizeUrl);
    if (!result.opened) {
      settle("error");
      return;
    }

    // Timeout de segurança — BNet não emite evento de conclusão dedicado,
    // o status será verificado após o fechamento da janela.
    setTimeout(() => settle("cancelled"), 120_000);
  });
}

const BNetOAuthCard: Component = () => {
  const statusQuery = useBNetStatus();
  const revokeMutation = useRevokeBNet();

  const [authLoad, setAuthLoad] = createSignal(false);
  const [feedback, setFeedback] = createSignal<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const isAuthorized = () => statusQuery.data?.isAuthorized ?? false;
  const battleTag = () => statusQuery.data?.battleTag ?? null;

  async function handleAuthorize() {
    setAuthLoad(true);
    setFeedback(null);
    try {
      const { authorizeUrl } = await bnetApi.getAuthorizeUrl();
      console.log({ authorizeUrl });
      if (!authorizeUrl) throw new Error("URL de autorização não disponível.");

      const outcome = await runBNetOAuthFlow(authorizeUrl);
      await statusQuery.refetch();

      if (outcome === "cancelled") {
        setFeedback({
          kind: "err",
          text: "Autorização cancelada antes de ser concluída.",
        });
      } else if (statusQuery.data?.isAuthorized) {
        setFeedback({
          kind: "ok",
          text: `Battle.net conectado! BattleTag: ${statusQuery.data.battleTag ?? "—"}`,
        });
      } else if (outcome === "error") {
        setFeedback({
          kind: "err",
          text: "Falha ao abrir a janela de autorização.",
        });
      } else {
        setFeedback({
          kind: "err",
          text:
            statusQuery.data?.message ??
            "Autorização não concluída. Tente novamente.",
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
          text: "Acesso Battle.net revogado com sucesso.",
        }),
      onError: () =>
        setFeedback({
          kind: "err",
          text: "Falha ao revogar o token Battle.net.",
        }),
    });
  }

  return (
    <div class="card animate-fade-in" style={{ "animation-delay": "0.1s" }}>
      {/* Header */}
      <div class="flex items-start justify-between mb-5">
        <div class="flex-1 min-w-0 pr-4">
          <p class="label-xs mb-1">Battle.net</p>
          <h3 class="font-display text-base text-stone-100 tracking-wide">
            Conta Battle.net
          </h3>
          <p class="text-stone-500 text-sm mt-1.5 leading-relaxed">
            Conecte sua conta Battle.net para que o sistema possa buscar dados
            de personagens via{" "}
            <span class="text-stone-300 font-semibold">Blizzard API</span>.
          </p>
        </div>

        {/* Status badge */}
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

      {/* BattleTag display when authorized */}
      <Show when={isAuthorized() && battleTag()}>
        <div class="flex items-center gap-3 bg-void-700/40 border border-void-600/60 px-4 py-3 mb-5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            class="text-ember-700 shrink-0"
            aria-hidden="true"
          >
            <circle cx="7" cy="5" r="3" />
            <path d="M1 13c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          </svg>
          <div>
            <p class="label-xs mb-0.5">BattleTag</p>
            <p class="font-mono text-sm text-stone-200 font-semibold">
              {battleTag()}
            </p>
          </div>
        </div>
      </Show>

      {/* Flow explanation */}
      <Show when={!isAuthorized()}>
        <div class="bg-void-700/40 border border-void-600/60 p-4 mb-5">
          <p class="label-xs mb-3">Como conectar</p>
          <ol class="space-y-2.5">
            {[
              { n: "1", t: 'Clique em "Conectar Battle.net"' },
              {
                n: "2",
                t: "Uma janela será aberta com a página de login da Blizzard",
              },
              {
                n: "3",
                t: "Faça login e clique em Autorizar na página da Blizzard",
              },
              {
                n: "4",
                t: "O sistema registrará sua conta e exibirá seu BattleTag",
              },
            ].map((s) => (
              <li class="flex items-start gap-3">
                <span
                  class="font-mono text-[10px] w-4 h-4 flex items-center justify-center
                         shrink-0 mt-0.5 border text-ember-700 bg-forge-900/60 border-forge-600"
                  aria-hidden="true"
                >
                  {s.n}
                </span>
                <span class="text-stone-500 text-xs leading-relaxed">
                  {s.t}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Show>

      {/* Status query error */}
      <Show when={statusQuery.isError}>
        <div
          role="alert"
          class="mb-4 bg-red-950/60 border border-red-900 px-4 py-3 font-mono text-xs text-red-400"
        >
          Falha ao verificar status Battle.net. Tente recarregar a página.
        </div>
      </Show>

      {/* Action feedback */}
      <Show when={feedback()}>
        <div
          role={feedback()!.kind === "ok" ? "status" : "alert"}
          class={`mb-4 px-4 py-3 border animate-fade-in font-mono text-xs ${
            feedback()!.kind === "ok"
              ? "bg-emerald-950/60 border-emerald-800 text-emerald-400"
              : "bg-red-950/60 border-red-900 text-red-400"
          }`}
        >
          {feedback()!.text}
        </div>
      </Show>

      {/* Action buttons */}
      <div class="flex items-center gap-3 flex-wrap">
        <Show
          when={isAuthorized()}
          fallback={
            <button
              onClick={handleAuthorize}
              disabled={authLoad() || statusQuery.isLoading}
              class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={authLoad()}
            >
              <Show
                when={authLoad()}
                fallback={
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
                }
              >
                <Spinner />
              </Show>
              {authLoad() ? "Aguardando autorização..." : "Conectar Battle.net"}
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
              Conta Battle.net vinculada
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

export default BNetOAuthCard;
