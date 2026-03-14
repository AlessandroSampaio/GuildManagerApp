import { ApiError } from "@/api/client";
import {
  useDeletePenaltyEvent,
  useUpdatePenaltyEvent,
} from "@/lib/queries/penalty";
import { authStore } from "@/stores/auth";
import { PenaltyEvent } from "@/types/penalty";
import { Component, Show, createSignal } from "solid-js";
import { Spinner } from "./Spinner";

// Row: view mode + inline edit
export const EventRow: Component<{ event: PenaltyEvent }> = (props) => {
  const isAdmin = () => authStore.user()?.role?.toUpperCase() === "ADMIN";
  const updateMut = useUpdatePenaltyEvent();
  const deleteMut = useDeletePenaltyEvent();

  const [editing, setEditing] = createSignal(false);
  const [desc, setDesc] = createSignal("");
  const [pts, setPts] = createSignal(0);
  const [confirmDel, setConfirmDel] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  function startEdit() {
    setDesc(props.event.description ?? "");
    setPts(props.event.points);
    setError(null);
    setEditing(true);
  }

  function save() {
    if (!desc().trim()) {
      setError("Descrição obrigatória.");
      return;
    }
    if (pts() < 0) {
      setError("Pontos devem ser ≥ 0.");
      return;
    }
    setError(null);
    updateMut.mutate(
      { id: props.event.id, description: desc().trim(), points: pts() },
      {
        onSuccess: () => setEditing(false),
        onError: (err) =>
          setError(
            err instanceof ApiError ? err.message : "Falha ao atualizar.",
          ),
      },
    );
  }

  function remove() {
    deleteMut.mutate(props.event.id, {
      onError: () => setConfirmDel(false),
    });
  }

  return (
    <div class="border border-void-600 bg-void-800/40">
      <Show
        when={editing()}
        fallback={
          <div class="flex items-center gap-3 px-4 py-3">
            <div class="flex-1 min-w-0">
              <span class="font-mono text-xs text-stone-200">
                {props.event.description}
              </span>
            </div>
            <span class="font-mono text-xs text-red-400 bg-red-950/40 border border-red-900/40 px-2 py-0.5 shrink-0">
              -{props.event.points} pts
            </span>
            <Show when={isAdmin()}>
              <Show
                when={!confirmDel()}
                fallback={
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="font-mono text-[10px] text-stone-500">
                      Remover?
                    </span>
                    <button
                      onClick={remove}
                      disabled={deleteMut.isPending}
                      class="font-mono text-[10px] text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                    >
                      <Show when={deleteMut.isPending}>
                        <Spinner size={10} />
                      </Show>
                      Sim
                    </button>
                    <button
                      onClick={() => setConfirmDel(false)}
                      class="font-mono text-[10px] text-stone-600 hover:text-stone-400 transition-colors"
                    >
                      Não
                    </button>
                  </div>
                }
              >
                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={startEdit}
                    class="btn-ghost text-[10px] py-1 px-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setConfirmDel(true)}
                    class="text-stone-600 hover:text-red-400 transition-colors"
                    title="Remover"
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <line
                        x1="2"
                        y1="2"
                        x2="9"
                        y2="9"
                        stroke-linecap="round"
                      />
                      <line
                        x1="9"
                        y1="2"
                        x2="2"
                        y2="9"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </Show>
            </Show>
          </div>
        }
      >
        {/* Edit mode */}
        <div class="px-4 py-3 space-y-2 animate-fade-in">
          <div class="flex gap-2">
            <input
              type="text"
              value={desc()}
              onInput={(e) => setDesc(e.currentTarget.value)}
              placeholder="Descrição…"
              maxlength="256"
              class="flex-1 bg-void-900 border border-void-600 px-3 py-1.5 font-mono text-xs text-stone-200 focus:outline-none focus:border-ember-700 transition-colors"
            />
            <input
              type="number"
              value={pts()}
              onInput={(e) => setPts(Number(e.currentTarget.value))}
              min="0"
              placeholder="Pts"
              class="w-20 bg-void-900 border border-void-600 px-3 py-1.5 font-mono text-xs text-stone-200 focus:outline-none focus:border-ember-700 transition-colors text-center"
            />
          </div>
          <Show when={error()}>
            <p class="font-mono text-xs text-red-400">{error()}</p>
          </Show>
          <div class="flex gap-2">
            <button
              onClick={save}
              disabled={updateMut.isPending}
              class="btn-primary text-xs py-1.5 px-4 flex items-center gap-2"
            >
              <Show when={updateMut.isPending}>
                <Spinner size={12} />
              </Show>
              Salvar
            </button>
            <button
              onClick={() => setEditing(false)}
              class="btn-ghost text-xs py-1.5 px-3"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
};
