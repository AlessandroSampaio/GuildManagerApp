import { WclCredentialRequest, WclCredentialStatus } from "@/types/wcl-auth";
import { req } from "./client";

export const adminApi = {
  getWclCredentialStatus: () =>
    req<WclCredentialStatus>("/api/admin/wcl-credentials/status"),

  saveWclCredentials: (body: WclCredentialRequest) =>
    req<WclCredentialStatus>("/api/admin/wcl-credentials", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};
