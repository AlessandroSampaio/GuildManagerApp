import { useQuery } from "@tanstack/solid-query";
import { auditLogApi, AuditLogFilters } from "@/api/audit-log";
import { auditLogKeys } from "../query-keys";

export function useAuditLogList(
  page: () => number,
  filters: () => AuditLogFilters = () => ({}),
) {
  return useQuery(() => ({
    queryKey: auditLogKeys.list(page(), filters().from, filters().to),
    queryFn: () => auditLogApi.list(page(), 20, filters()),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev: any) => prev,
  }));
}
