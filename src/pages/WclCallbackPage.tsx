import { FailureIcon } from "@/components/icons/FailureIcon";
import { SuccessIcon } from "@/components/icons/SuccessIcon";
import { CountdownArc } from "@/components/ui/CountdownArc";
import { DELAY_FAILURE, DELAY_SUCCESS, sleep } from "@/helpers";
import { wclAuthIpc, windowIpc } from "@/ipc";
import { useSearchParams } from "@solidjs/router";
import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";

const WclCallbackPage: Component = () => {
  const [params] = useSearchParams();

  // useSearchParams already decodes URI components — no manual decode needed
  const success = () => params.success === "true";
  const message = () =>
    params.message ||
    (success()
      ? "Autorização concluída com sucesso."
      : "Ocorreu um erro durante a autorização.");

  const total = () => (success() ? DELAY_SUCCESS : DELAY_FAILURE);

  const [ready, setReady] = createSignal(false);
  const [countdown, setCountdown] = createSignal(total());

  onMount(async () => {
    await sleep(2500);

    if (success()) {
      try {
        // Rust will: close wcl-oauth window + emit wcl_auth_complete(true) to main
        await wclAuthIpc.notify_auth_complete();
      } catch {
        // Outside Tauri (browser dev) — fall through to manual close
      }
    }

    setReady(true);

    let left = total();
    const id = setInterval(() => {
      left -= 1;
      setCountdown(left);
      if (left <= 0) {
        clearInterval(id);
        if (!success()) {
          windowIpc.close().catch(() => {});
        }
      }
    }, 1000);

    onCleanup(() => clearInterval(id));
  });

  return (
    <div
      class="flex flex-col h-screen bg-void-950 overflow-hidden select-none"
      style="animation:pageFadeIn 0.25s ease both"
    >
      <style>{`
        @keyframes pageFadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        /* Referenced by icon SVGs above */
        @keyframes strokeCircle {
          from { stroke-dashoffset: 226; }
          to   { stroke-dashoffset: 0;   }
        }
      `}</style>

      {/* Minimal drag-only title bar */}
      <div class="h-8 bg-void-950 border-b border-void-800/60 flex items-center px-4 drag shrink-0">
        <div class="flex items-center gap-2">
          <div class="relative w-3 h-3 shrink-0">
            <div class="absolute inset-0 border border-ember-700 rotate-45 bg-forge-900" />
            <div class="absolute inset-[2px] bg-ember-700 rotate-45" />
          </div>
          <span class="font-mono text-[9px] tracking-[0.28em] text-ember-800 uppercase">
            WarcraftLogs
          </span>
        </div>
      </div>

      {/* Content */}
      <div class="flex-1 flex flex-col items-center justify-center gap-7">
        {/* Animated icon */}
        <Show when={success()} fallback={<FailureIcon />}>
          <SuccessIcon />
        </Show>

        {/* Text block — appears after TauRPC call resolves */}
        <Show when={ready()}>
          <div
            class="text-center space-y-2.5 max-w-[240px]"
            style="animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both"
          >
            <p
              class={`font-display text-base tracking-wide ${
                success() ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {success() ? "Autorizado!" : "Falha na autorização"}
            </p>

            <p class="font-mono text-[11px] text-stone-500 leading-relaxed">
              {message()}
            </p>
          </div>

          {/* Countdown */}
          <div
            class="flex items-center gap-2.5"
            style="animation:slideUp 0.35s 0.08s both"
          >
            <CountdownArc
              remaining={countdown()}
              total={total()}
              success={success()}
            />
            <span class="font-mono text-[10px] text-stone-600">
              Fechando em {countdown()}s
            </span>
          </div>
        </Show>
      </div>

      {/* Bottom accent */}
      <div class={`h-px ${success() ? "bg-emerald-900/50" : "bg-red-950"}`} />
    </div>
  );
};

export default WclCallbackPage;
