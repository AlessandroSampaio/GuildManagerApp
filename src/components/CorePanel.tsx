import { ApiError } from "@/api/client";
import {
  useAddPlayerToCore,
  useCoreDetail,
  useDeleteCore,
  useRemovePlayerFromCore,
  useUpdateCore,
} from "@/lib/queries/core";
import { useAllPlayers } from "@/lib/queries/player";
import { Component, createMemo, createSignal, For, Show } from "solid-js";
import { SkeletonList } from "./ui/Skeleton";
import { Spinner } from "./ui/Spinner";
import { fmtDate } from "@/helpers";

export const CorePanel: Component<{
  coreId: number;
  onDeleted: () => void;
}> = (props) => {
  const detail = useCoreDetail(() => props.coreId);
  const updateMut = useUpdateCore();
  const deleteMut = useDeleteCore();
  const addPlayerMut = useAddPlayerToCore();
  const removePlayerMut = useRemovePlayerFromCore();
  const allPlayers = useAllPlayers();

  const [editing, setEditing] = createSignal(false);
  const [renameValue, setRenameValue] = createSignal("");
  const [renameError, setRenameError] = createSignal<string | null>(null);
  const [confirmDel, setConfirmDel] = createSignal(false);
  const [removingId, setRemovingId] = createSignal<number | null>(null);
  const [playerSearch, setPlayerSearch] = createSignal("");

  function startEditing() {
    setRenameValue(detail.data?.name ?? "");
    setRenameError(null);
    setEditing(true);
  }

  function handleRename(e: Event) {
    e.preventDefault();
    const name = renameValue().trim();
    if (!name) return;
    setRenameError(null);
    updateMut.mutate(
      { id: props.coreId, body: { name } },
      {
        onSuccess: () => setEditing(false),
        onError: (err) =>
          setRenameError(
            err instanceof ApiError ? err.message : "Falha ao renomear.",
          ),
      },
    );
  }

  function handleDelete() {
    deleteMut.mutate(props.coreId, { onSuccess: props.onDeleted });
  }

  function handleRemovePlayer(playerId: number) {
    setRemovingId(playerId);
    removePlayerMut.mutate(
      { id: props.coreId, playerId },
      { onSettled: () => setRemovingId(null) },
    );
  }

  function handleAddPlayer(playerId: number) {
    addPlayerMut.mutate({ id: props.coreId, playerId });
    setPlayerSearch("");
  }

  const linkedPlayerIds = () =>
    new Set((detail.data?.players ?? []).map((p) => p.playerId));

  const availablePlayers = createMemo(() => {
    const search = playerSearch().toLowerCase();
    const linked = linkedPlayerIds();
    return (allPlayers.data?.data ?? []).filter(
      (p) =>
        !linked.has(p.id) &&
        (search === "" || p.name.toLowerCase().includes(search)),
    );
  });

  return (
    <div class="flex flex-col h-full overflow-y-auto">
      <Show when={detail.isLoading}>
        <div class="p-6 space-y-4">
          <SkeletonList rows={5} />
        </div>
      </Show>

      <Show when={detail.isError}>
        <div class="p-6">
          <p class="font-mono text-xs text-red-400">Erro ao carregar core.</p>
        </div>
      </Show>

      <Show when={detail.isSuccess && detail.data}>
        {/* Header */}
        <div class="px-6 py-5 border-b border-void-700">
          <Show
            when={!editing()}
            fallback={
              <form onSubmit={handleRename} class="space-y-3">
                <p class="label-xs">Renomear Core</p>
                <input
                  type="text"
                  value={renameValue()}
                  onInput={(e) => setRenameValue(e.currentTarget.value)}
                  placeholder="Nome do core"
                  autocomplete="off"
                  spellcheck={false}
                  class="w-full bg-void-800 border border-void-600 focus:border-ember-700
                         px-3 py-2 font-mono text-xs text-stone-200 outline-none transition-colors"
                />
                <Show when={renameError()}>
                  <p class="font-mono text-xs text-red-400">{renameError()}</p>
                </Show>
                <div class="flex gap-2">
                  <button
                    type="submit"
                    disabled={updateMut.isPending}
                    class="btn-primary text-xs py-1.5 px-4 flex items-center gap-2"
                  >
                    <Show when={updateMut.isPending}>
                      <Spinner size={12} />
                    </Show>
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setRenameError(null);
                    }}
                    class="btn-ghost text-xs py-1.5 px-4"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            }
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="label-xs mb-0.5">Core</p>
                <h2 class="font-display text-xl text-stone-100 tracking-wide truncate">
                  {detail.data!.name ?? "—"}
                </h2>
                <p class="font-mono text-[10px] text-stone-600 mt-1">
                  {detail.data!.guildName} · ID #{detail.data!.id} · criado{" "}
                  {fmtDate(detail.data!.createdAt)}
                </p>
              </div>

              <div class="flex items-center gap-1.5 shrink-0 mt-1">
                <button
                  onClick={startEditing}
                  class="p-1.5 text-stone-600 hover:text-stone-200 hover:bg-void-700 transition-colors"
                  title="Renomear"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.4"
                  >
                    <path d="M8 2l2 2-6.5 6.5H1.5V9L8 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setConfirmDel(true)}
                  class="p-1.5 text-stone-600 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                  title="Excluir core"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.4"
                  >
                    <path d="M2 3h8M5 3V1.5h2V3M4 3v7h4V3" />
                  </svg>
                </button>
              </div>
            </div>
          </Show>

          <Show when={confirmDel()}>
            <div class="mt-3 bg-red-950/30 border border-red-900/50 px-3 py-3 flex items-center gap-3 animate-fade-in">
              <p class="font-mono text-xs text-red-400 flex-1">
                Excluir <span class="font-bold">{detail.data?.name}</span>?
              </p>
              <button
                onClick={handleDelete}
                disabled={deleteMut.isPending}
                class="btn-danger text-xs py-1 px-3 shrink-0"
              >
                <Show when={deleteMut.isPending} fallback="Confirmar">
                  <Spinner size={12} />
                </Show>
              </button>
              <button
                onClick={() => setConfirmDel(false)}
                class="btn-ghost text-xs py-1 px-3 shrink-0"
              >
                Cancelar
              </button>
            </div>
          </Show>
        </div>

        {/* Stats */}
        <div class="px-6 py-4 border-b border-void-700 shrink-0">
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-void-700/40 border border-void-600 px-3 py-2">
              <p class="label-xs mb-0.5">Players</p>
              <p class="font-display text-lg text-stone-100">
                {(detail.data!.players ?? []).length}
              </p>
            </div>
            <div class="bg-void-700/40 border border-void-600 px-3 py-2">
              <p class="label-xs mb-0.5">Última alteração</p>
              <p class="font-mono text-xs text-stone-300">
                {fmtDate(detail.data!.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Add player */}
        <div class="px-6 py-4 border-b border-void-700 shrink-0 space-y-2">
          <p class="label-xs">Adicionar player</p>
          <div class="flex items-center gap-1.5 bg-void-800 border border-void-600 focus-within:border-ember-700 transition-colors px-3 py-2">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class="text-stone-600 shrink-0"
            >
              <circle cx="5" cy="5" r="3.5" />
              <line x1="8" y1="8" x2="11" y2="11" stroke-linecap="round" />
            </svg>
            <input
              type="text"
              value={playerSearch()}
              onInput={(e) => setPlayerSearch(e.currentTarget.value)}
              placeholder="Buscar player…"
              autocomplete="off"
              spellcheck={false}
              class="flex-1 bg-transparent font-mono text-xs text-stone-200 placeholder:text-stone-600 outline-none min-w-0"
            />
          </div>

          <Show when={playerSearch().length > 0}>
            <div class="border border-void-600 bg-void-800 max-h-40 overflow-y-auto">
              <Show
                when={availablePlayers().length > 0}
                fallback={
                  <p class="px-3 py-2 font-mono text-[10px] text-stone-600">
                    Nenhum player disponível
                  </p>
                }
              >
                <For each={availablePlayers()}>
                  {(player) => (
                    <button
                      onClick={() => handleAddPlayer(player.id)}
                      disabled={addPlayerMut.isPending}
                      class="w-full text-left px-3 py-2 font-mono text-xs text-stone-300
                             hover:bg-void-700 hover:text-stone-100 transition-colors
                             flex items-center justify-between gap-2"
                    >
                      <span>{player.name}</span>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        class="text-stone-600 shrink-0"
                      >
                        <line x1="5" y1="1" x2="5" y2="9" stroke-linecap="round" />
                        <line x1="1" y1="5" x2="9" y2="5" stroke-linecap="round" />
                      </svg>
                    </button>
                  )}
                </For>
              </Show>
            </div>
          </Show>
        </div>

        {/* Players list */}
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-px">
          <p class="label-xs mb-2">Players no core</p>
          <Show
            when={(detail.data!.players ?? []).length > 0}
            fallback={
              <div class="bg-void-800/50 border border-void-700 border-dashed px-4 py-6 text-center">
                <p class="font-mono text-xs text-stone-600">
                  Nenhum player no core
                </p>
                <p class="font-mono text-[10px] text-stone-700 mt-1">
                  Use o campo acima para adicionar
                </p>
              </div>
            }
          >
            <For each={detail.data!.players ?? []}>
              {(player) => (
                <div class="flex items-center justify-between gap-2 px-3 py-2.5 bg-void-800/50 border border-void-700 hover:border-void-600 transition-colors group">
                  <span class="font-mono text-xs text-stone-300 truncate">
                    {player.name ?? "—"}
                  </span>
                  <button
                    onClick={() => handleRemovePlayer(player.playerId)}
                    disabled={removePlayerMut.isPending && removingId() === player.playerId}
                    class="p-1 text-stone-700 hover:text-red-400 hover:bg-red-950/20
                           transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                    title="Remover do core"
                  >
                    <Show
                      when={removingId() === player.playerId && removePlayerMut.isPending}
                      fallback={
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                        >
                          <line x1="2" y1="2" x2="8" y2="8" stroke-linecap="round" />
                          <line x1="8" y1="2" x2="2" y2="8" stroke-linecap="round" />
                        </svg>
                      }
                    >
                      <Spinner size={10} />
                    </Show>
                  </button>
                </div>
              )}
            </For>
          </Show>
        </div>
      </Show>
    </div>
  );
};
