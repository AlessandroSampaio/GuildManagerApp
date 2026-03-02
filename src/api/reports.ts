import type { ImportResult, ReportDetail, Report } from "@/types/reports";
import { req } from "./client";

export const reportsApi = {
  list: (page = 1, pageSize = 20) =>
    req<Report[]>(`/api/reports?page=${page}&pageSize=${pageSize}`),
  get: (code: string) => req<ReportDetail>(`/api/reports/${code}`),
  import: (code: string) =>
    req<ImportResult>(`/api/reports/import/${code}`, { method: "POST" }),
  getPerformance: (code: string) =>
    req<Record<number, PerformanceEntry[]>>(`/api/reports/${code}/performance`),
};
