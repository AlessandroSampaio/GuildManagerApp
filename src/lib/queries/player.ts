import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { playerKeys } from "../query-keys";
import { playersApi } from "@/api/player";

export function usePlayerList(page: () => number) {
  return useQuery(() => ({
    queryKey: playerKeys.list(page()),
    queryFn: () => playersApi.list(page(), 20),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev: any) => prev,
  }));
}

export function usePlayerDetail(id: () => number | null) {
  return useQuery(() => ({
    queryKey: playerKeys.detail(id()!),
    queryFn: () => playersApi.get(id()!),
    staleTime: 2 * 60 * 1000,
    enabled: () => id() !== null,
  }));
}

export function useCreatePlayer() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: (name: string) => playersApi.create(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: playerKeys.lists() }),
  }));
}

export function useUpdatePlayer() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      playersApi.update(id, name),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: playerKeys.lists() });
      qc.setQueryData(playerKeys.detail(data.id), data);
    },
  }));
}

export function useDeletePlayer() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: (id: number) => playersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: playerKeys.lists() }),
  }));
}

export function useAddCharacterToPlayer() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({
      playerId,
      characterId,
    }: {
      playerId: number;
      characterId: number;
    }) => playersApi.addCharacter(playerId, characterId),
    onSuccess: (data) => {
      qc.setQueryData(playerKeys.detail(data.id), data);
      qc.invalidateQueries({ queryKey: playerKeys.lists() });
    },
  }));
}

export function useRemoveCharacterFromPlayer() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({
      playerId,
      characterId,
    }: {
      playerId: number;
      characterId: number;
    }) => playersApi.removeCharacter(playerId, characterId),
    onSuccess: (data) => {
      qc.setQueryData(playerKeys.detail(data.id), data);
      qc.invalidateQueries({ queryKey: playerKeys.lists() });
    },
  }));
}
