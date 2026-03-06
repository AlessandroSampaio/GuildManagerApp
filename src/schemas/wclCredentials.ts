import { z } from "zod";

export const wclCredentialsSchema = z.object({
  clientId: z
    .string()
    .min(1, "ClientId is required")
    .max(128, "ClientId must be 128 characters or less")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid ClientId"),
  clientSecret: z
    .string()
    .min(1, "ClientSecret is required")
    .max(256, "ClientSecret must be 256 characters or less"),
  label: z.string().max(128, "Label must be 128 characters or less").optional(),
});

export type WclCredentialsForm = z.infer<typeof wclCredentialsSchema>;
