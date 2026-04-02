import { adminApi } from "@/api/admin";
import { useQueryClient, useMutation, useQuery } from "@tanstack/solid-query";
import { adminKeys } from "../query-keys";

export function useSaveWclCredentials() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: adminApi.saveWclCredentials,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.wclCredentialsStatus() });
    },
  }));
}

export function useWclCredentialStatus() {
  return useQuery(() => ({
    queryKey: adminKeys.wclCredentialsStatus(),
    queryFn: () => adminApi.getWclCredentialStatus(),
    staleTime: 30 * 1000,
    retry: 1,
  }));
}

export function useBNetCredentialStatus() {
  return useQuery(() => ({
    queryKey: adminKeys.bnetCredentialsStatus(),
    queryFn: () => adminApi.getBNetCredentialStatus(),
    staleTime: 30 * 1000,
    retry: 1,
  }));
}

export function useSaveBNetCredentials() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: adminApi.saveBNetCredentials,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.bnetCredentialsStatus() });
    },
  }));
}
