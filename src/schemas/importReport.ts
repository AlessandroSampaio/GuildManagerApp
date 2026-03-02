import { z } from "zod";

export const importReportSchema = z.object({
  code: z
    .string()
    .min(1, "Código obrigatório")
    .max(16, "Código deve ter no máximo 16 caracteres")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Código inválido — apenas letras e números (ex: aAbBcCdDeE)",
    ),
});

export type ImportReportForm = z.infer<typeof importReportSchema>;
