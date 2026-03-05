import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { reportKeys } from "../query-keys";
import { reportsApi } from "@/api/reports";
import { PerformanceEntry, ReportDetail } from "@/types/reports";

export const reportListOptions = (page: () => number) =>
  queryOptions({
    queryKey: reportKeys.list(page()),
    queryFn: () => reportsApi.list(page(), 20),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

export const reportDetailOptions = (code: () => string) =>
  queryOptions({
    queryKey: reportKeys.detail(code()),
    queryFn: () => reportsApi.get(code()),
    staleTime: 5 * 60 * 1000,
    enabled: () => !!code(),
    refetchInterval: (query) => {
      const data = query.state.data as ReportDetail | undefined;
      return isImportPending(data) ? 3_000 : false;
    },
  });

export const reportPerformanceOptions = (
  code: () => string,
  importStatus?: () => string | undefined,
) =>
  queryOptions<Record<number, PerformanceEntry[]>, Error, PerformanceEntry[]>({
    queryKey: reportKeys.performance(code()),
    queryFn: () => reportsApi.getPerformance(code()),
    staleTime: 10 * 60 * 1000,
    enabled: () => !!code() && (importStatus?.() ?? "Done") === "Done",
  });

export function isImportPending(detail: ReportDetail | undefined): boolean {
  if (!detail) return false;
  return (
    detail.importStatus === "Queued" || detail.importStatus === "Importing"
  );
}

export function useReportList(page: () => number) {
  return useQuery(() => reportListOptions(page));
}

export function useReportDetail(code: () => string) {
  return useQuery(() => reportDetailOptions(code));
}

export function useReportPerformance(
  code: () => string,
  fightId: () => number | null,
) {
  console.log(`new fightId ${fightId() ?? "null"}`);
  return useQuery(() => ({
    ...reportPerformanceOptions(code),
    enabled: () => !!code() && fightId() !== null,
    select: (data: Record<number, PerformanceEntry[]>): PerformanceEntry[] => {
      var rawFightId: number = fightId()!;
      return (data[rawFightId!] ?? [])
        .slice()
        .sort((a, b) => b.amount - a.amount);
    },
  }));
}

export function useImportReport() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: (code: string) => reportsApi.import(code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  }));
}
