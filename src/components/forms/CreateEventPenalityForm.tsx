import { ApiError } from "@/api/client";
import { useCreatePenaltyEvent } from "@/lib/queries/penalty";
import { Component, createSignal, Show } from "solid-js";
import { Spinner } from "../ui/Spinner";

export const CreateEventPenalityForm: Component = () => {
  const createMut = useCreatePenaltyEvent();
  const [desc, setDesc] = createSignal("");
  const [pts, setPts] = createSignal<number | "">(0);
  const [error, setError] = createSignal<string | null>(null);

  function submit() {
    if (!desc().trim()) {
      setError("Descrição obrigatória.");
      return;
    }
    if (pts() === "" || Number(pts()) < 0) {
      setError("Pontos devem ser ≥ 0.");
      return;
    }
    setError(null);
    createMut.mutate(
      { description: desc().trim(), points: Number(pts()) },
      {
        onSuccess: () => {
          setDesc("");
          setPts(0);
        },
        onError: (err) =>
          setError(
            err instanceof ApiError ? err.message : "Falha ao criar evento.",
          ),
      },
    );
  }

  return (
    <div class="card space-y-3">
      <p class="label-xs">Novo Evento</p>
      <div class="flex gap-2">
        <input
          type="text"
          value={desc()}
          onInput={(e) => setDesc(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Descrição da penalidade…"
          maxlength="256"
          class="flex-1 bg-void-800 border border-void-600 px-3 py-2 font-mono text-xs text-stone-200 focus:outline-none focus:border-ember-700 transition-colors"
        />
        <input
          type="number"
          value={pts()}
          onInput={(e) =>
            setPts(
              e.currentTarget.value === "" ? "" : Number(e.currentTarget.value),
            )
          }
          min="0"
          placeholder="Pts"
          class="w-24 bg-void-800 border border-void-600 px-3 py-2 font-mono text-xs text-stone-200 focus:outline-none focus:border-ember-700 transition-colors text-center"
        />
        <button
          onClick={submit}
          disabled={createMut.isPending || !desc().trim()}
          class="btn-primary text-xs py-2 px-4 flex items-center gap-2 disabled:opacity-40 shrink-0"
        >
          <Show when={createMut.isPending}>
            <Spinner size={12} />
          </Show>
          Criar
        </button>
      </div>
      <Show when={error()}>
        <p class="font-mono text-xs text-red-400">{error()}</p>
      </Show>
    </div>
  );
};
