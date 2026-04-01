import { classColor } from "@/helpers/colors";
import { WOW_CLASSES } from "@/helpers";
import {
  useGuildList,
  useGuildRoster,
  useSyncGuildCharacters,
} from "@/lib/queries/guild";
import { useGuildSyncWs } from "@/lib/useGuildSyncWs";
import { guildKeys } from "@/lib/query-keys";
import { Component, createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { useQueryClient } from "@tanstack/solid-query";
import { SkeletonList } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { GuildRow } from "@/components/GuildRow";
import { CharacterRow } from "@/components/CharacterRow";
import { GuildSyncProgress } from "@/components/GuildSyncProgress";

const GuildsPage: Component = () => {
  const [page, setPage] = createSignal(1);
  const [selectedId, setSelectedId] = createSignal<number | null>(null);
  const [nameFilter, setNameFilter] = createSignal("");
  const [classFilter, setClassFilter] = createSignal("");

  const qc = useQueryClient();
  const list = useGuildList(page);
  const roster = useGuildRoster(selectedId);
  const syncMutation = useSyncGuildCharacters();
  const syncWs = useGuildSyncWs();

  const filteredRoster = createMemo(() => {
    const chars = roster.data ?? [];
    const name = nameFilter().toLowerCase();
    const cls = classFilter();
    return chars
      .filter(
        (c) =>
          (name === "" || c.characterName.toLowerCase().includes(name)) &&
          (cls === "" || c.class === cls),
      )
      .sort((a, b) => a.characterName.localeCompare(b.characterName));
  });

  // Quando a sincronização concluir, invalida o roster para recarregar a lista
  createEffect(() => {
    if (syncWs.isCompleted()) {
      const id = selectedId();
      if (id !== null) {
        qc.invalidateQueries({ queryKey: guildKeys.roster(id) });
      }
    }
  });

  const isFetching = () => list.isFetching && !list.isLoading;
  const selectedGuild = () =>
    list.data?.data.find((g) => g.id === selectedId()) ?? null;

  // true enquanto o POST ou o WS ainda estão em andamento
  const isSyncing = () =>
    syncMutation.isPending || (syncWs.phase() !== null && syncWs.isPending());

  function handleSync() {
    const id = selectedId();
    if (id === null || isSyncing()) return;
    syncWs.reset();
    syncMutation.mutate(id, {
      onSuccess: (accepted) => syncWs.connect(accepted.wsUrl),
    });
  }

  return (
    <div class="flex-1 flex min-h-0">
      {/* Left column — guild list */}
      <div class="w-72 border-r border-void-700 flex flex-col shrink-0">
        <div class="p-4 border-b border-void-700">
          <div class="flex items-center justify-between mb-0.5">
            <div>
              <p class="label-xs mb-0.5">Comunidade</p>
              <h2 class="font-display text-base text-stone-100 tracking-wide">
                Guildas
              </h2>
            </div>
            <Show when={isFetching()}>
              <Spinner class="text-stone-600" size={14} />
            </Show>
          </div>
          <Show when={list.isSuccess}>
            <p class="font-mono text-[10px] text-stone-600">
              {list.data?.total ?? 0} guilda
              {(list.data?.total ?? 0) !== 1 ? "s" : ""} registrada
              {(list.data?.total ?? 0) !== 1 ? "s" : ""}
            </p>
          </Show>
        </div>

        <div class="flex-1 overflow-y-auto py-1 space-y-px">
          <Show when={list.isLoading}>
            <div class="px-4 py-2">
              <SkeletonList rows={5} />
            </div>
          </Show>

          <Show when={list.isError}>
            <p class="px-4 py-3 font-mono text-xs text-red-400">
              Erro ao carregar guildas.
            </p>
          </Show>

          <Show when={list.isSuccess}>
            <Show
              when={(list.data?.data.length ?? 0) > 0}
              fallback={
                <div class="px-4 py-8 text-center">
                  <p class="font-mono text-xs text-stone-600">
                    Nenhuma guilda encontrada
                  </p>
                </div>
              }
            >
              <For each={list.data?.data}>
                {(guild) => (
                  <GuildRow
                    guild={guild}
                    selected={selectedId() === guild.id}
                    onClick={() => {
                      setSelectedId(guild.id);
                      setNameFilter("");
                      setClassFilter("");
                      syncWs.reset();
                    }}
                  />
                )}
              </For>
            </Show>
          </Show>
        </div>

        <Show when={(list.data?.total ?? 0) > 20}>
          <div class="px-4 py-3 border-t border-void-700 flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page() <= 1}
              class="btn-ghost text-xs py-1 px-3 disabled:opacity-30 flex-1"
            >
              ← Ant.
            </button>
            <span class="font-mono text-[10px] text-stone-600 shrink-0">
              {page()}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(list.data?.data.length ?? 0) < 20}
              class="btn-ghost text-xs py-1 px-3 disabled:opacity-30 flex-1"
            >
              Próx. →
            </button>
          </div>
        </Show>
      </div>

      {/* Right panel — roster */}
      <div class="flex-1 min-h-0 flex flex-col">
        <Show
          when={selectedId() !== null}
          fallback={
            <div class="h-full flex flex-col items-center justify-center text-center px-8">
              <div class="w-16 h-16 border border-void-600 flex items-center justify-center mb-5">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="0.8"
                  class="text-void-500"
                  aria-hidden="true"
                >
                  <path d="M14 3L4 8v7c0 5 4.5 9.5 10 10 5.5-.5 10-5 10-10V8z" />
                  <path
                    d="M10 14l3 3 5-5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <p class="text-stone-600 font-semibold text-sm">
                Selecione uma guilda
              </p>
              <p class="text-stone-700 text-xs font-mono mt-1 leading-relaxed max-w-xs">
                para visualizar o roster e sincronizar personagens
              </p>
            </div>
          }
        >
          {/* Header */}
          <div class="p-4 border-b border-void-700 flex items-start justify-between gap-4 shrink-0">
            <div>
              <p class="label-xs mb-0.5">Roster</p>
              <h2 class="font-display text-base text-stone-100 tracking-wide">
                {selectedGuild()?.name ?? "—"}
              </h2>
              <p class="font-mono text-[10px] text-stone-600 mt-0.5">
                {selectedGuild()?.server} · {selectedGuild()?.region}
              </p>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing()}
              class="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 disabled:opacity-50 shrink-0"
              title={isSyncing() ? "Sincronização em andamento…" : "Sincronizar membros via WarcraftLogs"}
            >
              <Show
                when={isSyncing()}
                fallback={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  >
                    <path d="M10 6A4 4 0 1 1 6 2" />
                    <path d="M6 1v2.5L7.5 2" />
                  </svg>
                }
              >
                <Spinner size={12} />
              </Show>
              Sincronizar
            </button>
          </div>

          {/* Sync progress bar */}
          <GuildSyncProgress syncWs={syncWs} isSyncing={isSyncing} />

          {/* Filter bar */}
          <div class="px-4 py-3 border-b border-void-700 shrink-0 space-y-2">
            {/* Name search */}
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
                value={nameFilter()}
                onInput={(e) => setNameFilter(e.currentTarget.value)}
                placeholder="Buscar por nome…"
                autocomplete="off"
                spellcheck={false}
                class="flex-1 bg-transparent font-mono text-xs text-stone-200 placeholder:text-stone-600 outline-none min-w-0"
              />
              <Show when={nameFilter()}>
                <button
                  type="button"
                  onClick={() => setNameFilter("")}
                  class="text-stone-600 hover:text-stone-300 transition-colors shrink-0"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5">
                    <line x1="2" y1="2" x2="8" y2="8" stroke-linecap="round" />
                    <line x1="8" y1="2" x2="2" y2="8" stroke-linecap="round" />
                  </svg>
                </button>
              </Show>
            </div>

            {/* Class chips */}
            <div class="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setClassFilter("")}
                class={`px-2 py-0.5 font-mono text-[9px] border transition-colors
                  ${classFilter() === ""
                    ? "bg-void-600 border-void-500 text-stone-200"
                    : "bg-transparent border-void-700 text-stone-600 hover:border-void-500 hover:text-stone-400"
                  }`}
              >
                Todas
              </button>
              <For each={WOW_CLASSES}>
                {(cls) => (
                  <button
                    type="button"
                    onClick={() => setClassFilter(classFilter() === cls ? "" : cls)}
                    class={`px-2 py-0.5 font-mono text-[9px] border transition-colors
                      ${classFilter() === cls
                        ? `border-current bg-void-700 ${classColor(cls)}`
                        : "bg-transparent border-void-700 text-stone-600 hover:border-void-500 hover:text-stone-400"
                      }`}
                  >
                    {cls}
                  </button>
                )}
              </For>
            </div>
          </div>

          {/* Roster list */}
          <div class="flex-1 overflow-y-auto p-4 space-y-px">
            <Show when={roster.isLoading}>
              <SkeletonList rows={8} />
            </Show>

            <Show when={roster.isError}>
              <p class="font-mono text-xs text-red-400">
                Erro ao carregar roster.
              </p>
            </Show>

            <Show when={roster.isSuccess}>
              <Show
                when={(roster.data?.length ?? 0) > 0}
                fallback={
                  <div class="flex flex-col items-center justify-center py-16 text-center">
                    <p class="text-stone-600 font-semibold text-sm">
                      Roster vazio
                    </p>
                    <p class="text-stone-700 text-xs font-mono mt-1 max-w-xs leading-relaxed">
                      Clique em "Sincronizar" para importar os membros desta
                      guilda via WarcraftLogs
                    </p>
                  </div>
                }
              >
                <div class="mb-2">
                  <span class="font-mono text-[10px] text-stone-600">
                    {filteredRoster().length} personagens
                    {(nameFilter() !== "" || classFilter() !== "") &&
                      filteredRoster().length !== (roster.data?.length ?? 0) &&
                      ` (de ${roster.data?.length ?? 0})`}
                  </span>
                </div>
                <Show
                  when={filteredRoster().length > 0}
                  fallback={
                    <div class="flex flex-col items-center justify-center py-12 text-center">
                      <p class="text-stone-600 font-semibold text-sm">
                        Nenhum resultado
                      </p>
                      <p class="text-stone-700 text-xs font-mono mt-1">
                        Ajuste os filtros acima
                      </p>
                    </div>
                  }
                >
                  <For each={filteredRoster()}>
                    {(char) => (
                    <CharacterRow
                      characterId={char.characterId}
                      name={char.characterName}
                      class={char.class}
                      server={char.server}
                      displayId={char.id}
                      playerName={char.playerName}
                      playerId={char.playerId}
                      href={`/app/characters/${char.characterId}`}
                    />
                  )}
                  </For>
                </Show>
              </Show>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default GuildsPage;
