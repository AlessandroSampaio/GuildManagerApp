import { useMutation, useQuery } from "@tanstack/solid-query";
import { guildsApi } from "@/api/guild";
import { guildKeys } from "../query-keys";

export function useGuildList(page: () => number) {
  return useQuery(() => ({
    queryKey: guildKeys.list(page()),
    queryFn: () => guildsApi.list(page(), 20),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev: any) => prev,
  }));
}

export function useGuildRoster(id: () => number | null) {
  return useQuery(() => ({
    queryKey: guildKeys.roster(id()!),
    queryFn: () => guildsApi.roster(id()!),
    staleTime: 2 * 60 * 1000,
    enabled: () => id() !== null,
  }));
}

/**
 * Enfileira a sincronização de membros de uma guilda.
 * O POST retorna { message, wsUrl } — o progresso real chega via WebSocket.
 * A invalidação do roster é responsabilidade do consumidor (via useGuildSyncWs).
 */
export function useSyncGuildCharacters() {
  return useMutation(() => ({
    mutationFn: (guildId: number) => guildsApi.syncCharacters(guildId),
  }));
}
