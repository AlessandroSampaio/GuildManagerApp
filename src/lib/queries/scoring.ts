import { adminApi } from "@/api/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { scoringKeys } from "../query-keys";
import { ScoringTierRequest } from "@/types/scoring";

export function useScoringSettings() {
  return useQuery(() => ({
    queryKey: scoringKeys.settings(),
    queryFn: () => adminApi.getScoringSettings(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  }));
}

export function useSaveScoringSettings() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: (tiers: ScoringTierRequest[]) =>
      adminApi.saveScoringSettings(tiers),
    onSuccess: (data) => {
      qc.setQueryData(scoringKeys.settings(), data);
    },
  }));
}

export function useDeleteScoringSettings() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: () => adminApi.deleteScoringSettings(),
    onSuccess: () => {
      qc.removeQueries({ queryKey: scoringKeys.settings() });
    },
  }));
}
