import { WclAuthorizeResponse, WclStatus } from "@/types/wcl-auth";
import { req } from "./client";

export const wclAuthApi = {
  getAuthorizeUrl: () => req<WclAuthorizeResponse>("/api/wcl-auth/authorize"),
  getStatus: () => req<WclStatus>("/api/wcl-auth/status"),
  revoke: () => req<void>("/api/wcl-auth/revoke", { method: "DELETE" }),
};
