import { BNetAuthorizeResponse, BNetStatusDto } from "@/types/bnet";
import { req } from "./client";

export const bnetApi = {
  getAuthorizeUrl: () => req<BNetAuthorizeResponse>("/api/profile/bnet/authorize"),
  getStatus: () => req<BNetStatusDto>("/api/profile/bnet/status"),
  revoke: () => req<void>("/api/profile/bnet/revoke", { method: "DELETE" }),
};
