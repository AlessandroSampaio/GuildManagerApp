import { ApiError } from "@/api/client";
import {
  useDeletePlayer,
  usePlayerDetail,
  useRemoveCharacterFromPlayer,
  useUpdatePlayer,
} from "@/lib/queries/player";
import { PlayerNameForm, playerNameSchema } from "@/schemas/playersSchema";
import { createForm, zodForm } from "@modular-forms/solid";
import { Component, createSignal, For, Show } from "solid-js";
import { SkeletonList } from "./ui/Skeleton";
import { FormError, SubmitButton, TextField } from "./ui/TextField";
import { fmtDate } from "@/helpers";
import { Spinner } from "./ui/Spinner";
import { CharacterRow } from "./CharacterRow";
import { AddCharacterForm } from "./forms/AddCharacterForm";

export const PlayerPanel: Component<{
  playerId: number;
  onDeleted: () => void;
}> = (props) => {
  const detail = usePlayerDetail(() => props.playerId);
  const updateMut = useUpdatePlayer();
  const deleteMut = useDeletePlayer();
  const removeMut = useRemoveCharacterFromPlayer();

  const [editing, setEditing] = createSignal(false);
  const [removingId, setRemovingId] = createSignal<number | null>(null);
  const [confirmDel, setConfirmDel] = createSignal(false);
  const [renameError, setRenameError] = createSignal<string | null>(null);

  const [_, { Form: RenameForm, Field: RenameField }] =
    createForm<PlayerNameForm>({ validate: zodForm(playerNameSchema) });

  function handleRename(values: PlayerNameForm) {
    setRenameError(null);
    updateMut.mutate(
      { id: props.playerId, name: values.name.trim() },
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
    deleteMut.mutate(props.playerId, { onSuccess: props.onDeleted });
  }

  function handleRemoveChar(characterId: number) {
    setRemovingId(characterId);
    removeMut.mutate(
      { playerId: props.playerId, characterId },
      { onSettled: () => setRemovingId(null) },
    );
  }

  return (
    <div class="flex flex-col h-full overflow-y-auto">
      <Show when={detail.isLoading}>
        <div class="p-6 space-y-4">
          <SkeletonList rows={5} />
        </div>
      </Show>

      <Show when={detail.isSuccess && detail.data}>
        <div class="px-6 py-5 border-b border-void-700">
          <Show
            when={!editing()}
            fallback={
              <RenameForm onSubmit={handleRename} class="space-y-3">
                <RenameField name="name">
                  {(field, fieldProps) => (
                    <TextField
                      field={field}
                      fieldProps={fieldProps}
                      label="Nome do jogador"
                      placeholder={detail.data!.name}
                    />
                  )}
                </RenameField>
                <FormError message={renameError()} />
                <div class="flex gap-2">
                  <SubmitButton
                    submitting={updateMut.isPending}
                    label="Salvar"
                    loadingLabel="Salvando..."
                    class="btn-primary text-xs py-1.5 px-4"
                  />
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
              </RenameForm>
            }
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="label-xs mb-0.5">Player</p>
                <h2 class="font-display text-xl text-stone-100 tracking-wide truncate">
                  {detail.data!.name}
                </h2>
                <p class="font-mono text-[10px] text-stone-600 mt-1">
                  ID #{detail.data!.id} · criado{" "}
                  {fmtDate(detail.data!.createdAt)}
                </p>
              </div>

              <div class="flex items-center gap-1.5 shrink-0 mt-1">
                <button
                  onClick={() => setEditing(true)}
                  class="p-1.5 text-stone-600 hover:text-stone-200
                  hover:bg-void-700 transition-colors"
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
                  class="p-1.5 text-stone-600 hover:text-red-400 hover:bg-red-950/20
                                         transition-colors"
                  aria-label="Excluir jogador"
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
            <div
              class="mt-3 bg-red-950/30 border border-red-900/50 px-3 py-3
                                     flex items-center gap-3 animate-fade-in"
            >
              <p class="font-mono text-xs text-red-400 flex-1">
                Excluir <span class="font-bold">{detail.data?.name}</span>?
                Characters serão desvinculados.
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

        <div class="flex-1 overscroll-y-auto px-6 py-4 space-y-4">
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-void-700/40 border border-void-600 px-3 py-2">
              <p class="label-xs mb-0.5">Characters</p>
              <p class="font-display text-lg text-stone-100">
                {detail.data!.characters.length}
              </p>
            </div>
            <div class="bg-void-700/40 border border-void-600 px-3 py-2">
              <p class="label-xs mb-0.5">Última alteração</p>
              <p class="font-mono text-xs text-stone-300">
                {fmtDate(detail.data!.updatedAt)}
              </p>
            </div>
          </div>

          <div>
            <p class="label-xs mb-2">Characters vinculados</p>
            <Show
              when={detail.data!.characters.length > 0}
              fallback={
                <div
                  class="bg-void-800/50 border border-void-700 border-dashed
                                       px-4 py-6 text-center"
                >
                  <p class="font-mono text-xs text-stone-600">
                    Nenhum character vinculado
                  </p>
                  <p class="font-mono text-[10px] text-stone-700 mt-1">
                    Use o campo abaixo para adicionar pelo ID
                  </p>
                </div>
              }
            >
              <div class="space-y-px">
                <For each={detail.data!.characters}>
                  {(char) => (
                    <CharacterRow
                      char={char}
                      playerId={props.playerId}
                      onRemove={handleRemoveChar}
                      removing={removingId() === char.id}
                    />
                  )}
                </For>
              </div>
            </Show>
          </div>

          <div class="relative">
            <AddCharacterForm playerId={props.playerId} />
          </div>
        </div>
      </Show>

      <Show when={detail.isError}>
        <div class="p-6">
          <p class="font-mono text-xs text-red-400">
            Erro ao carregar jogador.
          </p>
        </div>
      </Show>
    </div>
  );
};
