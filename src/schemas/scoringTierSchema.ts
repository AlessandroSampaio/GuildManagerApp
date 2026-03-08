import { z } from "zod";

const tierItemSchema = z.object({
  minPercent: z
    .number({ invalid_type_error: "Número obrigatório" })
    .min(0, "Mínimo 0")
    .max(100, "Máximo 100"),
  maxPercent: z
    .number({ invalid_type_error: "Número obrigatório" })
    .min(0, "Mínimo 0")
    .max(100, "Máximo 100"),
  points: z
    .number({ invalid_type_error: "Número obrigatório" })
    .min(0, "Mínimo 0"),
  label: z.string().max(64, "Máximo 64 caracteres").optional(),
});

export const scoringTiersSchema = z
  .object({
    tiers: z.array(tierItemSchema).min(1, "Ao menos uma faixa é necessária"),
  })
  .superRefine(({ tiers }, ctx) => {
    if (tiers.length === 0) return;

    tiers.forEach((t, i) => {
      if (t.minPercent >= t.maxPercent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Min % deve ser menor que Max %",
          path: [`tiers`, i, "maxPercent"],
        });
      }
    });

    const sorted = [...tiers].sort((a, b) => a.minPercent - b.minPercent);

    if (sorted[0].minPercent !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Primeira faixa deve começar em 0% (começa em ${sorted[0].minPercent}%)`,
        path: ["tiers", 0, "minPercent"],
      });
    }

    const last = sorted[sorted.length - 1];
    if (last.maxPercent !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Última faixa deve terminar em 100% (termina em ${last.maxPercent}%)`,
        path: ["tiers", tiers.indexOf(last), "maxPercent"],
      });
    }

    for (let i = 0; i < sorted.length - 1; i++) {
      const cur = sorted[i];
      const next = sorted[i + 1];

      if (cur.maxPercent > next.minPercent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Sobreposição: [${cur.minPercent}–${cur.maxPercent}] com [${next.minPercent}–${next.maxPercent}]`,
          path: ["tiers", tiers.indexOf(next), "minPercent"],
        });
      } else if (cur.maxPercent < next.minPercent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Gap entre ${cur.maxPercent}% e ${next.minPercent}%`,
          path: ["tiers", tiers.indexOf(next), "minPercent"],
        });
      }
    }
  });

export type ScoringTiersForm = z.infer<typeof scoringTierSchema>;
