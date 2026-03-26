import { req } from "./client";
import { PagedResult } from "@/types/common";
import { AuditLogDto } from "@/types/audit-log";

export interface AuditLogFilters {
  from?: string; // ISO 8601, e.g. "2026-03-01T00:00"
  to?: string;
}

export const auditLogApi = {
  list: (page = 1, pageSize = 20, filters: AuditLogFilters = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    return req<PagedResult<AuditLogDto>>(`/api/admin/audit-log?${params}`);
  },
};
