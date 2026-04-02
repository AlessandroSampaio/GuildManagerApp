import { PagedResult } from "@/types/common";
import { CoreCreateRequest, CoreDetailDto, CoreDto, CoreUpdateRequest } from "@/types/core";
import { req } from "./client";

export const coresApi = {
  list: (page = 1, pageSize = 20) =>
    req<PagedResult<CoreDto>>(`/api/cores?page=${page}&pageSize=${pageSize}`),
  get: (id: number) => req<CoreDetailDto>(`/api/cores/${id}`),
  create: (body: CoreCreateRequest) =>
    req<CoreDetailDto>("/api/cores", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: number, body: CoreUpdateRequest) =>
    req<CoreDetailDto>(`/api/cores/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (id: number) => req<void>(`/api/cores/${id}`, { method: "DELETE" }),
  addPlayer: (id: number, playerId: number) =>
    req<CoreDetailDto>(`/api/cores/${id}/players/${playerId}`, {
      method: "POST",
    }),
  removePlayer: (id: number, playerId: number) =>
    req<CoreDetailDto>(`/api/cores/${id}/players/${playerId}`, {
      method: "DELETE",
    }),
};
