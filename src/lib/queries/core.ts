import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { coresApi } from "@/api/core";
import { coreKeys } from "../query-keys";
import { CoreCreateRequest, CoreUpdateRequest } from "@/types/core";

export function useCoreList(page: () => number) {
  return useQuery(() => ({
    queryKey: coreKeys.list(page()),
    queryFn: () => coresApi.list(page(), 20),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev: any) => prev,
  }));
}

export function useCoreDetail(id: () => number | null) {
  return useQuery(() => ({
    queryKey: coreKeys.detail(id()!),
    queryFn: () => coresApi.get(id()!),
    staleTime: 2 * 60 * 1000,
    enabled: () => id() !== null,
  }));
}

export function useCreateCore() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: (body: CoreCreateRequest) => coresApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: coreKeys.lists() }),
  }));
}

export function useUpdateCore() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({ id, body }: { id: number; body: CoreUpdateRequest }) =>
      coresApi.update(id, body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: coreKeys.lists() });
      qc.setQueryData(coreKeys.detail(data.id), data);
    },
  }));
}

export function useDeleteCore() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: (id: number) => coresApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: coreKeys.lists() }),
  }));
}

export function useAddPlayerToCore() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({ id, playerId }: { id: number; playerId: number }) =>
      coresApi.addPlayer(id, playerId),
    onSuccess: (data) => {
      qc.setQueryData(coreKeys.detail(data.id), data);
      qc.invalidateQueries({ queryKey: coreKeys.lists() });
    },
  }));
}

export function useRemovePlayerFromCore() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({ id, playerId }: { id: number; playerId: number }) =>
      coresApi.removePlayer(id, playerId),
    onSuccess: (data) => {
      qc.setQueryData(coreKeys.detail(data.id), data);
      qc.invalidateQueries({ queryKey: coreKeys.lists() });
    },
  }));
}
