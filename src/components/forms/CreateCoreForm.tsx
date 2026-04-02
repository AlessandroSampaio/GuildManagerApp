import { ApiError } from "@/api/client";
import { useCreateCore } from "@/lib/queries/core";
import { useAllGuilds } from "@/lib/queries/guild";
import { Component, createSignal, For, Show } from "solid-js";
import { Spinner } from "../ui/Spinner";

export const CreateCoreForm: Component<{
  onCreated: (id: number) => void;
}> = (props) => {
  const createMut = useCreateCore();
  const guilds = useAllGuilds();

  const [open, setOpen] = createSignal(false);
  const [name, setName] = createSignal("");
  const [guildId, setGuildId] = createSignal<number | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  function handleSubmit(e: Event) {
    e.preventDefault();
    const n = name().trim();
    const gid = guildId();
    if (!n || gid === null) return;
    setError(null);
    createMut.mutate(
      { name: n, guildId: gid },
      {
        onSuccess: (core) => {
          setOpen(false);
          setName("");
          setGuildId(null);
          props.onCreated(core.id);
        },
        onError: (err) =>
          setError(
            err instanceof ApiError ? err.message : "Falha ao criar core.",
          ),
      },
    );
  }

  return (
    <Show
      when={open()}
      fallback={
        <button
          onClick={() => setOpen(true)}
          class="btn-primary text-xs py-2 w-full flex items-center justify-center gap-2"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <line x1="6" y1="1" x2="6" y2="11" stroke-linecap="round" />
            <line x1="1" y1="6" x2="11" y2="6" stroke-linecap="round" />
          </svg>
          Novo Core
        </button>
      }
    >
      <div class="border border-ember-900/60 bg-forge-900/30 p-3 space-y-3 animate-fade-in">
        <p class="label-xs">Novo Core</p>
        <form onSubmit={handleSubmit} class="space-y-2">
          <input
            type="text"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            placeholder="Nome do core"
            autocomplete="off"
            spellcheck={false}
            class="w-full bg-void-800 border border-void-600 focus:border-ember-700
                   px-3 py-2 font-mono text-xs text-stone-200 placeholder:text-stone-600
                   outline-none transition-colors"
          />

          <select
            value={guildId() ?? ""}
            onChange={(e) => {
              const v = e.currentTarget.value;
              setGuildId(v ? Number(v) : null);
            }}
            class="w-full bg-void-800 border border-void-600 focus:border-ember-700
                   px-3 py-2 font-mono text-xs text-stone-200 outline-none transition-colors
                   appearance-none"
          >
            <option value="" disabled selected>
              Selecionar guilda…
            </option>
            <Show when={guilds.isLoading}>
              <option disabled>Carregando…</option>
            </Show>
            <Show when={guilds.isSuccess}>
              <For each={guilds.data?.data ?? []}>
                {(g) => (
                  <option value={g.id}>{g.name} — {g.server}</option>
                )}
              </For>
            </Show>
          </select>

          <Show when={error()}>
            <p class="font-mono text-xs text-red-400">{error()}</p>
          </Show>

          <div class="flex gap-2">
            <button
              type="submit"
              disabled={createMut.isPending || !name().trim() || guildId() === null}
              class="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Show when={createMut.isPending}>
                <Spinner size={12} />
              </Show>
              Criar
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setName("");
                setGuildId(null);
                setError(null);
              }}
              class="btn-ghost flex-1 text-xs py-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Show>
  );
};
