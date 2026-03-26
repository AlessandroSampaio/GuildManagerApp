import { createSignal, onMount, Show } from "solid-js";
import { createTauRPCProxy } from "@/ipc/bindings";

type UpdateInfo = { version: string; body: string | null };

export default function UpdateNotification() {
  const [update, setUpdate] = createSignal<UpdateInfo | null>(null);
  const [installing, setInstalling] = createSignal(false);
  const taurpc = createTauRPCProxy();

  onMount(async () => {
    try {
      const info = await taurpc.updater.check_update();
      if (info) setUpdate(info);
    } catch {
      // silently ignore update check failures
    }
  });

  const handleInstall = async () => {
    setInstalling(true);
    try {
      await taurpc.updater.install_update();
    } catch {
      setInstalling(false);
    }
  };

  return (
    <Show when={update()}>
      {(info) => (
        <div class="fixed bottom-4 right-4 z-50 bg-void-800 border border-amber-500/40 rounded-lg p-4 shadow-xl max-w-sm">
          <p class="text-sm font-semibold text-amber-400">
            Nova versão disponível: v{info().version}
          </p>
          <Show when={info().body}>
            {(body) => (
              <p class="text-xs text-neutral-400 mt-1 line-clamp-2">{body()}</p>
            )}
          </Show>
          <div class="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              disabled={installing()}
              class="text-xs bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold px-3 py-1.5 rounded transition-colors"
            >
              {installing() ? "Instalando..." : "Atualizar agora"}
            </button>
            <button
              onClick={() => setUpdate(null)}
              class="text-xs text-neutral-400 hover:text-neutral-200 px-3 py-1.5 rounded transition-colors"
            >
              Depois
            </button>
          </div>
        </div>
      )}
    </Show>
  );
}
