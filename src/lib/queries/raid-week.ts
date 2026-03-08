import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { raidWeekKeys } from "../query-keys";
import { raidWeeksApi } from "@/api/raid-week";

export function useRaidWeekList(page: () => number) {
  return useQuery(() => ({
    queryKey: raidWeekKeys.list(page()),
    queryFn: () => raidWeeksApi.list(page(), 20),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev: any) => prev,
  }));
}

export function useRaidWeekDetail(id: () => number | null) {
  return useQuery(() => ({
    queryKey: raidWeekKeys.detail(id()!),
    queryFn: () => raidWeeksApi.get(id()!),
    staleTime: 2 * 60 * 1000,
    enabled: () => id() !== null,
  }));
}

export function useCreateRaidWeek() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({
      label,
      startsAt,
      reportCodes,
    }: {
      label: string;
      startsAt: string;
      reportCodes?: string[];
    }) => raidWeeksApi.create(label, startsAt, reportCodes),
    onSuccess: () => qc.invalidateQueries({ queryKey: raidWeekKeys.lists() }),
  }));
}

export function useUpdateRaidWeek() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({
      id,
      label,
      startsAt,
    }: {
      id: number;
      label: string;
      startsAt: string;
    }) => raidWeeksApi.update(id, label, startsAt),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: raidWeekKeys.lists() });
      qc.setQueryData(raidWeekKeys.detail(data.id), data);
    },
  }));
}

export function useDeleteRaidWeek() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: (id: number) => raidWeeksApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: raidWeekKeys.lists() }),
  }));
}

export function useAddReportToWeek() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({ id, reportCode }: { id: number; reportCode: string }) =>
      raidWeeksApi.addReport(id, reportCode),
    onSuccess: (data) => {
      qc.setQueryData(raidWeekKeys.detail(data.id), data);
      qc.invalidateQueries({ queryKey: raidWeekKeys.lists() });
    },
  }));
}

export function useRemoveReportFromWeek() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: ({ id, reportCode }: { id: number; reportCode: string }) =>
      raidWeeksApi.removeReport(id, reportCode),
    onSuccess: (data) => {
      qc.setQueryData(raidWeekKeys.detail(data.id), data);
      qc.invalidateQueries({ queryKey: raidWeekKeys.lists() });
    },
  }));
}
