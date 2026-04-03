import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { bnetApi } from "@/api/bnet";

const BNET_STATUS_KEY = ["bnet", "status"] as const;

export function useBNetStatus() {
  return useQuery(() => ({
    queryKey: BNET_STATUS_KEY,
    queryFn: () => bnetApi.getStatus(),
    staleTime: 30 * 1000,
  }));
}

export function useRevokeBNet() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: () => bnetApi.revoke(),
    onSuccess: () => qc.invalidateQueries({ queryKey: BNET_STATUS_KEY }),
  }));
}

export function useLinkBNetCharacters() {
  return useMutation(() => ({
    mutationFn: () => bnetApi.linkCharacters(),
  }));
}
