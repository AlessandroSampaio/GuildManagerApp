import { ApiError } from "@/api/client";
import { useCreatePlayer } from "@/lib/queries/player";
import { PlayerNameForm, playerNameSchema } from "@/schemas/playersSchema";
import { createForm, zodForm } from "@modular-forms/solid";
import { Component, createSignal, Show } from "solid-js";
import { FormError, SubmitButton, TextField } from "../ui/TextField";

export const CreatePlayerForm: Component<{
  onCreated: (id: number) => void;
}> = (props) => {
  const createMut = useCreatePlayer();
  const [error, setError] = createSignal<string | null>(null);
  const [open, setOpen] = createSignal(false);

  const [_, { Form, Field }] = createForm<PlayerNameForm>({
    validate: zodForm(playerNameSchema),
  });

  function handleSubmit(values: PlayerNameForm) {
    setError(null);
    createMut.mutate(values.name.trim(), {
      onSuccess: (player) => {
        setOpen(false);
        props.onCreated(player.id);
      },
      onError: (err) =>
        setError(
          err instanceof ApiError ? err.message : "Falha ao criar jogador.",
        ),
    });
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
          Novo Player
        </button>
      }
    >
      <div class="border border-ember-900/60 bg-forge-900/30 p-3 space-y-3 animate-fade-in">
        <p class="label-xs">Novo Player</p>
        <Form onSubmit={handleSubmit} class="space-y-2">
          <Field name="name">
            {(field, fieldProps) => (
              <TextField
                field={field}
                fieldProps={fieldProps}
                label=""
                placeholder="Battle-tag ou apelido"
                autocomplete="off"
              />
            )}
          </Field>
          <FormError message={error()} />
          <div class="flex gap-2">
            <SubmitButton
              submitting={createMut.isPending}
              label="Criar"
              loadingLabel="Criando..."
              class="btn-primary flex-1 text-xs py-2"
            />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              class="btn-ghost flex-1 text-xs py-2"
            >
              Cancelar
            </button>
          </div>
        </Form>
      </div>
    </Show>
  );
};
