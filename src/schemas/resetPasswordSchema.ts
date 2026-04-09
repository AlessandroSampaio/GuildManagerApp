import { z } from "zod";

export const resetPasswordSchema = z.object({
  username: z
    .string()
    .min(3, "Mínimo de 3 caracteres")
    .max(32, "Máximo de 32 caracteres"),
  email: z.string().email("E-mail inválido"),
  newPassword: z
    .string()
    .min(8, "Mínimo de 8 caracteres")
    .max(20, "Senha muito longa"),
});

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
