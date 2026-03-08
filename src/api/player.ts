import { PagedResult } from "@/types/common";
import { Player, PlayerDetail } from "@/types/player";
import { req } from "./client";

export const playersApi = {
  list: (page = 1, pageSize = 20) =>
    req<PagedResult<Player>>(`/api/players?page=${page}&pageSize=${pageSize}`),
  get: (id: number) => req<PlayerDetail>(`/api/players/${id}`),
  create: (name: string) =>
    req<PlayerDetail>("/api/players", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  update: (id: number, name: string) =>
    req<PlayerDetail>(`/api/players/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),
  delete: (id: number) => req<void>(`/api/players/${id}`, { method: "DELETE" }),
  addCharacter: (playerId: number, characterId: number) =>
    req<PlayerDetail>(`/api/players/${playerId}/characters/${characterId}`, {
      method: "POST",
    }),
  removeCharacter: (playerId: number, characterId: number) =>
    req<PlayerDetail>(`/api/players/${playerId}/characters/${characterId}`, {
      method: "DELETE",
    }),
};
