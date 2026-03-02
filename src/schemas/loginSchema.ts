/**
 * Zod schemas for login in the application.
 *
 * One source of truth for validation rules — shared between form definitions
 * (@modular-forms) and the API layer. Import only what you need.
 */
import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Mínimo de 3 caracteres")
    .max(32, "Máximo de 32 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Apenas letras, números e _"),
  password: z
    .string()
    .min(8, "Minimo de 8 caracteres")
    .max(20, "Senha muito longa"),
});

export type LoginForm = z.infer<typeof loginSchema>;
