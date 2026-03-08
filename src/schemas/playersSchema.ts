import z from "zod";

export const playerNameSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(64, "Máx 64 caracteres"),
});

export type PlayerNameForm = z.infer<typeof playerNameSchema>;

export const characterIdSchema = z.object({
  characterId: z
    .string()
    .min(1, "ID obrigatório")
    .regex(/^\d+$/, "ID deve ser numérico"),
});
export type CharacterIdForm = z.infer<typeof characterIdSchema>;

export const playerSchema = z.object({
  name: playerNameSchema,
  characters: z.array(characterIdSchema),
});

export type PlayerForm = z.infer<typeof playerSchema>;
