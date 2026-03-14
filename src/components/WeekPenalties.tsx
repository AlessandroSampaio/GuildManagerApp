import { ApiError } from "@/api/client";
import {
  useAddWeekPenalty,
  usePenaltyEvents,
  useRemoveWeekPenalty,
  useWeekPenalties,
} from "@/lib/queries/penalty";
import { useAllPlayers } from "@/lib/queries/player";
import { authStore } from "@/stores/auth";
import { Component, For, Show, createSignal } from "solid-js";
import { Spinner } from "./ui/Spinner";

export const WeekPenalties: Component<{ weekId: number }> = (props) => {
  const isAdmin = () => authStore.user()?.role?.toUpperCase() === "ADMIN";

  const penaltiesQ = useWeekPenalties(() => props.weekId);
  const eventsQ = usePenaltyEvents();
  const playersQ = useAllPlayers();
  const addMut = useAddWeekPenalty();
  const removeMut = useRemoveWeekPenalty();

  const [playerId, setPlayerId] = createSignal<number | null>(null);
  const [penaltyEventId, setPenaltyEventId] = createSignal<number | null>(null);
  const [note, setNote] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [confirmRemove, setConfirmRemove] = createSignal<number | null>(null);

  function submit() {
    if (!playerId() || !penaltyEventId()) {
      setError("Selecione o player e o tipo de penalidade.");
      return;
    }
    setError(null);
    addMut.mutate(
      {
        weekId: props.weekId,
        playerId: playerId()!,
        penaltyEventId: penaltyEventId()!,
        note: note().trim() || undefined,
      },
      {
        onSuccess: () => {
          setPlayerId(null);
          setPenaltyEventId(null);
          setNote("");
        },
        onError: (err) =>
          setError(
            err instanceof ApiError
              ? err.message
              : "Falha ao aplicar penalidade.",
          ),
      },
    );
  }

  function removePenalty(id: number) {
    removeMut.mutate(
      { weekId: props.weekId, penaltyId: id },
      {
        onSuccess: () => setConfirmRemove(null),
        onError: () => setConfirmRemove(null),
      },
    );
  }

  return (
    <div class="card space-y-4">
      <p class="label-xs">Penalidades</p>

      {/* Add form — admin only */}
      <Show when={isAdmin()}>
        <div class="space-y-2 pt-1 border-t border-void-700">
          <p class="font-mono text-[10px] text-stone-600 uppercase tracking-wider">
            Aplicar penalidade
          </p>

          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {/* Player select */}
            <select
              value={playerId() ?? ""}
              onChange={(e) =>
                setPlayerId(
                  e.currentTarget.value ? Number(e.currentTarget.value) : null,
                )
              }
              class="bg-void-800 border border-void-600 px-3 py-2 font-mono text-xs text-stone-200 focus:outline-none focus:border-ember-700 transition-colors"
            >
              <option value="">Selecionar player…</option>
              <Show when={playersQ.isLoading}>
                <option disabled>Carregando…</option>
              </Show>
              <For each={playersQ.data?.data}>
                {(player) => <option value={player.id}>{player.name}</option>}
              </For>
            </select>

            {/* Penalty event select */}
            <select
              value={penaltyEventId() ?? ""}
              onChange={(e) =>
                setPenaltyEventId(
                  e.currentTarget.value ? Number(e.currentTarget.value) : null,
                )
              }
              class="bg-void-800 border border-void-600 px-3 py-2 font-mono text-xs text-stone-200 focus:outline-none focus:border-ember-700 transition-colors"
            >
              <option value="">Tipo de penalidade…</option>
              <Show when={eventsQ.isLoading}>
                <option disabled>Carregando…</option>
              </Show>
              <For each={eventsQ.data}>
                {(ev) => (
                  <option value={ev.id}>
                    {ev.description} (-{ev.points} pts)
                  </option>
                )}
              </For>
            </select>
          </div>

          {/* Note */}
          <input
            type="text"
            value={note()}
            onInput={(e) => setNote(e.currentTarget.value)}
            placeholder="Observação (opcional)…"
            maxlength="256"
            class="w-full bg-void-800 border border-void-600 px-3 py-2 font-mono text-xs text-stone-200 focus:outline-none focus:border-ember-700 transition-colors"
          />

          <Show when={error()}>
            <p class="font-mono text-xs text-red-400">{error()}</p>
          </Show>

          <button
            onClick={submit}
            disabled={addMut.isPending || !playerId() || !penaltyEventId()}
            class="btn-danger text-xs py-1.5 px-4 flex items-center gap-2 disabled:opacity-40"
          >
            <Show when={addMut.isPending}>
              <Spinner size={12} />
            </Show>
            Aplicar Penalidade
          </button>
        </div>
      </Show>

      {/* List */}
      <Show
        when={(penaltiesQ.data?.length ?? 0) > 0}
        fallback={
          <p class="font-mono text-xs text-stone-600 py-1">
            Nenhuma penalidade registrada para esta semana.
          </p>
        }
      >
        <div class="space-y-1.5">
          <For each={penaltiesQ.data}>
            {(p) => (
              <div class="flex items-start justify-between px-3 py-2 bg-void-800/60 border border-void-600 gap-3">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-mono text-xs text-stone-200">
                      {p.playerName}
                    </span>
                    <span class="font-mono text-[10px] text-red-400 bg-red-950/40 border border-red-900/40 px-1.5 py-0.5">
                      -{p.points} pts
                    </span>
                    <span class="font-mono text-[10px] text-stone-400">
                      {p.penaltyDescription}
                    </span>
                  </div>
                  <Show when={p.note}>
                    <p class="font-mono text-[10px] text-stone-600 mt-0.5 truncate">
                      {p.note}
                    </p>
                  </Show>
                </div>

                <Show when={isAdmin()}>
                  <Show
                    when={confirmRemove() === p.id}
                    fallback={
                      <button
                        onClick={() => setConfirmRemove(p.id)}
                        class="text-stone-600 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                        title="Remover penalidade"
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
                    }
                  >
                    <div class="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => removePenalty(p.id)}
                        disabled={removeMut.isPending}
                        class="font-mono text-[10px] text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                      >
                        <Show when={removeMut.isPending}>
                          <Spinner size={10} />
                        </Show>
                        Remover
                      </button>
                      <button
                        onClick={() => setConfirmRemove(null)}
                        class="font-mono text-[10px] text-stone-600 hover:text-stone-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </Show>
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
