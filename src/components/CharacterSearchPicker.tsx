import { ApiError } from "@/api/client";
import { backgroundClassColor, classColor, WOW_CLASSES } from "@/helpers";
import { useCharacterSearch } from "@/lib";
import { useAddCharacterToPlayer } from "@/lib/queries/player";
import { CharacterSearchResult } from "@/types/characters";
import { Component, createSignal, For, onCleanup, Show } from "solid-js";
import { Spinner } from "./ui/Spinner";

export const CharacterSearchPicker: Component<{
  playerId: number;
  linkedIds: Set<number>;
}> = (props) => {
  const addMut = useAddCharacterToPlayer();

  const [query, setQuery] = createSignal("");
  const [classFilter, setClass] = createSignal("");
  const [open, setOpen] = createSignal(false);
  const [addingId, setAddingId] = createSignal<number | null>(null);
  const [successId, setSuccessId] = createSignal<number | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [debouncedQ, setDebouncedQ] = createSignal("");

  let containerRef!: HTMLDivElement;

  let debounceTimer: ReturnType<typeof setTimeout>;

  function handleInput(val: string) {
    setQuery(val);
    setOpen(true);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setDebouncedQ(val), 280);
  }

  const searchQ = useCharacterSearch(debouncedQ, classFilter);
  const results = () => searchQ.data?.data ?? [];
  const showDropdown = () =>
    open() && (debouncedQ().length >= 1 || classFilter().length >= 1);

  onCleanup(() => clearTimeout(debounceTimer));

  function selectCharacter(char: CharacterSearchResult) {
    if (addingId() !== null) return;
    setError(null);
    setAddingId(char.id);

    addMut.mutate(
      { playerId: props.playerId, characterId: char.id },
      {
        onSuccess: () => {
          setSuccessId(char.id);
          setTimeout(() => setSuccessId(null), 2000);
          setOpen(false);
          setQuery("");
          setDebouncedQ("");
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.status === 409)
              setError(`${char.name} já está vinculado a outro jogador.`);
            else setError(err.message);
          } else {
            setError("Falha ao vincular character.");
          }
        },
        onSettled: () => setAddingId(null),
      },
    );
  }

  return (
    <div ref={containerRef} class="space-y-2">
      <p class="label-xs">Adicionar Character</p>

      {/* Search input */}
      <div class="relative space-y-2">
        <div
          class="flex items-center gap-1.5 bg-void-800 border border-void-600
                    focus-within:border-ember-700 transition-colors px-3 py-2"
        >
          {/* Search icon */}
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
            value={query()}
            onInput={(e) => handleInput(e.currentTarget.value)}
            onFocus={() => setOpen(true)}
            placeholder="Buscar por nome…"
            autocomplete="off"
            spellcheck={false}
            class="flex-1 bg-transparent font-mono text-xs text-stone-200
                   placeholder:text-stone-600 outline-none min-w-0"
          />

          {/* Clear */}
          <Show when={query()}>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDebouncedQ("");
                setOpen(false);
              }}
              class="text-stone-600 hover:text-stone-300 transition-colors shrink-0"
            >
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
            </button>
          </Show>

          {/* Loading */}
          <Show when={searchQ.isFetching}>
            <Spinner size={10} class="text-stone-600 shrink-0" />
          </Show>
        </div>
        {/* ── Class filter chips ── */}
        <div class="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => {
              setClass("");
              setOpen(true);
            }}
            class={`px-2 py-0.5 font-mono text-[9px] border transition-colors
                    ${
                      classFilter() === ""
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
                onClick={() => {
                  setClass(classFilter() === cls ? "" : cls);
                  setOpen(true);
                }}
                class={`px-2 py-0.5 font-mono text-[9px] border transition-colors
                        ${
                          classFilter() === cls
                            ? `border-current bg-void-700 ${classColor(cls)}`
                            : `bg-transparent border-void-700 text-stone-600
                             hover:border-void-500 hover:text-stone-400`
                        }`}
              >
                {cls}
              </button>
            )}
          </For>
        </div>

        {/* ── Dropdown results ── */}
        <Show when={showDropdown()}>
          <div
            class="absolute z-50 left-0 right-0 top-full mt-0.5
                      bg-void-800 border border-void-600 shadow-xl
                      max-h-56 overflow-y-auto animate-fade-in"
          >
            {/* No results */}
            <Show when={!searchQ.isFetching && results().length === 0}>
              <div class="px-4 py-5 text-center">
                <p class="font-mono text-[11px] text-stone-600">
                  Nenhum character encontrado
                </p>
              </div>
            </Show>

            {/* Result rows */}
            <For each={results()}>
              {(char) => {
                const isLinked = () => props.linkedIds.has(char.id);
                const isAdding = () => addingId() === char.id;
                const isSuccess = () => successId() === char.id;
                const isTaken = () => !isLinked() && char.playerId !== null;

                return (
                  <button
                    type="button"
                    disabled={isLinked() || isTaken() || addingId() !== null}
                    onClick={() =>
                      !isLinked() && !isTaken() && selectCharacter(char)
                    }
                    class={`w-full flex items-center gap-3 px-3 py-2.5 text-left
                            border-b border-void-700 last:border-0
                            transition-colors
                            ${
                              isLinked() || isTaken()
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-void-700 cursor-pointer"
                            }`}
                  >
                    {/* Class dot */}
                    <div
                      class={`w-1.5 h-1.5 rounded-full shrink-0 ${backgroundClassColor(char.class)}`}
                    />

                    {/* Name + meta */}
                    <div class="flex-1 min-w-0">
                      <p
                        class={`font-semibold text-xs truncate ${classColor(char.class)}`}
                      >
                        {char.name}
                        <span class="font-normal text-stone-600 ml-1">·</span>
                        <span class="font-normal text-stone-500 ml-1">
                          {char.server}
                        </span>
                      </p>
                      <p class="font-mono text-[9px] text-stone-600 truncate">
                        {char.class}
                        {char.guildName ? ` · ${char.guildName}` : ""}
                      </p>
                    </div>

                    {/* Right side badge */}
                    <div class="shrink-0">
                      <Show when={isAdding()}>
                        <Spinner size={12} />
                      </Show>
                      <Show when={isSuccess()}>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="#34d399"
                          stroke-width="2"
                        >
                          <path
                            d="M2 6.5l3 3 5-5.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </Show>
                      <Show when={isLinked() && !isAdding() && !isSuccess()}>
                        <span class="font-mono text-[9px] text-emerald-700">
                          vinculado
                        </span>
                      </Show>
                      <Show when={isTaken() && !isLinked()}>
                        <span class="font-mono text-[9px] text-stone-600">
                          {char.playerName}
                        </span>
                      </Show>
                      <Show
                        when={
                          !isAdding() &&
                          !isSuccess() &&
                          !isLinked() &&
                          !isTaken()
                        }
                      >
                        <span class="font-mono text-[9px] text-stone-700">
                          #{char.id}
                        </span>
                      </Show>
                    </div>
                  </button>
                );
              }}
            </For>
          </div>
        </Show>
      </div>

      {/* Error */}
      <Show when={error()}>
        <p class="font-mono text-[10px] text-red-400 animate-fade-in">
          {error()}
        </p>
      </Show>
    </div>
  );
};
