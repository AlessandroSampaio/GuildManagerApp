import { ApiError } from "@/api/client";
import { useAddCharacterToPlayer } from "@/lib/queries/player";
import { CharacterIdForm, characterIdSchema } from "@/schemas/playersSchema";
import { createForm, SubmitHandler, zodForm } from "@modular-forms/solid";
import { Component, createSignal, Show } from "solid-js";
import { SubmitButton, TextField } from "../ui/TextField";

export const AddCharacterForm: Component<{
  playerId: number;
}> = (props) => {
  const addMutation = useAddCharacterToPlayer();
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal(false);

  const [_, { Form, Field }] = createForm<CharacterIdForm>({
    validate: zodForm(characterIdSchema),
  });

  const handleSubmit: SubmitHandler<CharacterIdForm> = (values, event) => {
    setError(null);
    setSuccess(false);
    addMutation.mutate(
      {
        playerId: props.playerId,
        characterId: parseInt(values.characterId, 10),
      },
      {
        onSuccess: () => {
          setSuccess(true);
          // Reset o formulário limpando os valores manualmente
          (event.target as HTMLFormElement).reset();
          setTimeout(() => setSuccess(false), 2000);
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.status === 409)
              setError("Este character já está vinculado a outro jogador.");
            else if (err.status === 404)
              setError("Character não encontrado. Verifique o ID.");
            else setError(err.message);
          } else {
            setError("Falha ao vincular character.");
          }
        },
      },
    );
  };

  return (
    <Form onSubmit={handleSubmit} class="flex gap-2 items-end">
      <div class="flex-1">
        <Field name="characterId">
          {(field, fieldProps) => (
            <TextField
              field={field}
              fieldProps={fieldProps}
              label="Vincular Character"
              placeholder="ID numérico"
              autocomplete="off"
            />
          )}
        </Field>
      </div>
      <SubmitButton
        submitting={addMutation.isPending}
        label="+"
        loadingLabel="…"
        class="btn-primary px-3 py-2 text-sm mb-[1px] shrink-0"
      />
      <Show when={error()}>
        <p class="absolute mt-16 font-mono text-[10px] text-red-400">
          {error()}
        </p>
      </Show>
      <Show when={success()}>
        <p class="absolute mt-16 font-mono text-[10px] text-emerald-400">
          Vinculado!
        </p>
      </Show>
    </Form>
  );
};
