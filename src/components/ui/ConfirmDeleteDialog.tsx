import { Component, Show } from "solid-js";
import { Spinner } from "./Spinner";

export const ConfirmDeleteDialog: Component<{
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}> = (p) => (
  <div class="border border-red-900 bg-red-950/40 p-5 space-y-4 animate-fade-in">
    <p class="font-mono text-sm text-red-400">
      Remover toda a configuração de scoring?
    </p>
    <p class="text-stone-500 text-xs leading-relaxed">
      O cálculo de pontos por semana deixará de funcionar até uma nova
      configuração ser salva.
    </p>
    <div class="flex gap-3">
      <button
        onClick={p.onConfirm}
        disabled={p.isPending}
        class="btn-danger text-xs py-1.5 px-4 flex items-center gap-2"
      >
        <Show when={p.isPending}>
          <Spinner size={12} />
        </Show>
        Confirmar remoção
      </button>
      <button onClick={p.onCancel} class="btn-ghost text-xs py-1.5 px-4">
        Cancelar
      </button>
    </div>
  </div>
);
