import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { penaltyKeys } from "../query-keys";
import { penaltyApi } from "@/api/penalty";

export function usePenaltyEvents() {
  return useQuery(() => ({
    queryKey: penaltyKeys.events(),
    queryFn: () => penaltyApi.listEvents(),
    staleTime: 5 * 60 * 1000,
  }));
}

export function useWeekPenalties(weekId: () => number) {
  return useQuery(() => ({
    queryKey: penaltyKeys.weekPenalties(weekId()),
    queryFn: () => penaltyApi.listWeekPenalties(weekId()),
    staleTime: 30 * 1000,
  }));
}

export function useAddWeekPenalty() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({
      weekId,
      playerId,
      penaltyEventId,
      note,
    }: {
      weekId: number;
      playerId: number;
      penaltyEventId: number;
      note?: string;
    }) => penaltyApi.addPenalty(weekId, playerId, penaltyEventId, note),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: penaltyKeys.weekPenalties(vars.weekId) });
    },
  }));
}

export function useRemoveWeekPenalty() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({ weekId, penaltyId }: { weekId: number; penaltyId: number }) =>
      penaltyApi.removePenalty(weekId, penaltyId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: penaltyKeys.weekPenalties(vars.weekId) });
    },
  }));
}
