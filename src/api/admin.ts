import { BNetCredentialRequest, BNetCredentialStatus } from "@/types/bnet";
import { WclCredentialRequest, WclCredentialStatus } from "@/types/wcl-auth";
import { req } from "./client";
import {
  ScoreCalculationResult,
  ScoringSettings,
  ScoringTierRequest,
} from "@/types/scoring";

export const adminApi = {
  getWclCredentialStatus: () =>
    req<WclCredentialStatus>("/api/admin/wcl-credentials/status"),

  saveWclCredentials: (body: WclCredentialRequest) =>
    req<WclCredentialStatus>("/api/admin/wcl-credentials", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  getBNetCredentialStatus: () =>
    req<BNetCredentialStatus>("/api/admin/bnet-credentials/status"),

  saveBNetCredentials: (body: BNetCredentialRequest) =>
    req<BNetCredentialStatus>("/api/admin/bnet-credentials", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  getScoringSettings: () => req<ScoringSettings>("/api/admin/scoring-settings"),
  saveScoringSettings: (tiers: ScoringTierRequest[]) =>
    req<ScoringSettings>("/api/admin/scoring-settings", {
      method: "PUT",
      body: JSON.stringify({ tiers }),
    }),
  deleteScoringSettings: () =>
    req<void>("/api/admin/scoring-settings", { method: "DELETE" }),
  calculateScore: (rankPercent: number) =>
    req<ScoreCalculationResult>(
      `/api/admin/scoring-settings/calculate?rankPercent=${rankPercent}`,
    ),
};
