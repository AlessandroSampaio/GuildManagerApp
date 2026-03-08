import { isTuesday, nextTuesday } from "@/helpers";
import { useCreateRaidWeek } from "@/lib/queries/raid-week";
import { Component, Show, createSignal } from "solid-js";
import { Spinner } from "../ui/Spinner";
import { ApiError } from "@/api/client";

export const NewWeekForm: Component<{ onClose: () => void }> = (p) => {
  const createMut = useCreateRaidWeek();
  const [label, setLabel] = createSignal("");
  const [startsAt, setStartsAt] = createSignal(nextTuesday());
  const [error, setError] = createSignal<string | null>(null);

  function submit() {
    if (!label().trim()) {
      setError("O rótulo é obrigatório.");
      return;
    }
    if (!isTuesday(startsAt())) {
      setError(
        `A data deve ser uma Terça-Feira. ${new Date(startsAt()).toLocaleDateString("pt-BR", { weekday: "long" })} não é válido.`,
      );
      return;
    }
    setError(null);
    createMut.mutate(
      { label: label().trim(), startsAt: startsAt() },
      {
        onSuccess: () => p.onClose(),
        onError: (err) =>
          setError(
            err instanceof ApiError ? err.message : "Falha ao criar semana.",
          ),
      },
    );
  }

  return (
    <div class="border border-void-600 bg-void-700/30 p-4 space-y-3 animate-fade-in">
      <div class="flex items-center justify-between">
        <p class="label-xs">Nova Semana</p>
        <button
          onClick={p.onClose}
          class="text-stone-600 hover:text-stone-300 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
          >
            <line x1="3" y1="3" x2="11" y2="11" stroke-linecap="round" />
            <line x1="11" y1="3" x2="3" y2="11" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="space-y-2">
        <div>
          <label class="label-xs block mb-1">Rótulo</label>
          <input
            type="text"
            value={label()}
            onInput={(e) => setLabel(e.currentTarget.value)}
            placeholder="ex: S2W1 — Nerub-ar Palace"
            maxlength="128"
            class="w-full bg-void-800 border border-void-600 px-3 py-2 font-mono text-xs text-stone-200 focus:outline-none focus:border-ember-700 transition-colors"
          />
        </div>

        <div>
          <label class="label-xs block mb-1">
            Data de Início <span class="text-stone-600">(Terça-Feira)</span>
          </label>
          <input
            type="date"
            value={startsAt()}
            onInput={(e) => setStartsAt(e.currentTarget.value)}
            class="w-full bg-void-800 border border-void-600 px-3 py-2 font-mono text-xs text-stone-200 focus:outline-none focus:border-ember-700 transition-colors"
          />
          <Show when={startsAt() && !isTuesday(startsAt())}>
            <p class="font-mono text-[10px] text-amber-500 mt-1">
              ⚠{" "}
              {new Date(startsAt()).toLocaleDateString("pt-BR", {
                weekday: "long",
              })}{" "}
              — selecione uma Terça-Feira
            </p>
          </Show>
        </div>
      </div>

      <Show when={error()}>
        <p class="font-mono text-xs text-red-400 bg-red-950/40 border border-red-900 px-3 py-2">
          {error()}
        </p>
      </Show>

      <div class="flex gap-2 pt-1">
        <button
          onClick={submit}
          disabled={createMut.isPending}
          class="btn-primary text-xs py-1.5 px-4 flex items-center gap-2"
        >
          <Show when={createMut.isPending}>
            <Spinner size={12} />
          </Show>
          Criar Semana
        </button>
        <button onClick={p.onClose} class="btn-ghost text-xs py-1.5 px-3">
          Cancelar
        </button>
      </div>
    </div>
  );
};
