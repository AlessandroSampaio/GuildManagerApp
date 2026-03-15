import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Mínimo de 3 caracteres")
      .max(32, "Máximo de 32 caracteres")
      .regex(/^[a-zA-Z0-9_]+$/, "Apenas letras, números e _"),
    email: z.string().email("E-mail inválido"),
    password: z
      .string()
      .min(8, "Mínimo de 8 caracteres")
      .max(20, "Senha muito longa"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterForm = z.infer<typeof registerSchema>;
