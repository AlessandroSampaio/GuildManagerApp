import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual obrigatória"),
    newPassword: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .max(128, "Senha muito longa"),
    confirmNewPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "A nova senha deve ser diferente da atual",
    path: ["newPassword"],
  });

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
