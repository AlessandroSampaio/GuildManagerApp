import { PagedResult } from "@/types/common";
import { Guild, RosterCharacter, SyncAccepted } from "@/types/guild";
import { req } from "./client";

export const guildsApi = {
  list: (page = 1, pageSize = 20) =>
    req<PagedResult<Guild>>(`/api/guilds?page=${page}&pageSize=${pageSize}`),
  roster: (id: number) =>
    req<RosterCharacter[]>(`/api/guilds/${id}/roster`),
  syncCharacters: (id: number) =>
    req<SyncAccepted>(`/api/guilds/${id}/sync-characters`, { method: "POST" }),
  connectSyncWs(wsUrl: string, token: string | null): WebSocket {
    const url = token
      ? `${wsUrl}${wsUrl.includes("?") ? "&" : "?"}access_token=${encodeURIComponent(token)}`
      : wsUrl;
    return new WebSocket(url);
  },
};
