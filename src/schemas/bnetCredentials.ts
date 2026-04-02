import { z } from "zod";

export const bnetCredentialsSchema = z.object({
  clientId: z
    .string()
    .min(1, "ClientId é obrigatório")
    .max(128, "ClientId deve ter no máximo 128 caracteres"),
  clientSecret: z
    .string()
    .min(1, "ClientSecret é obrigatório")
    .max(256, "ClientSecret deve ter no máximo 256 caracteres"),
  label: z.string().max(128, "Rótulo deve ter no máximo 128 caracteres").optional(),
});

export type BNetCredentialsForm = z.infer<typeof bnetCredentialsSchema>;
