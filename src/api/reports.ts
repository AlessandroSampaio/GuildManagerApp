import type {
  ImportResult,
  ReportDetail,
  Report,
  PerformanceEntry,
  ImportAccepted,
} from "@/types/reports";
import { req } from "./client";

export const reportsApi = {
  list: (page = 1, pageSize = 20) =>
    req<Report[]>(`/api/reports?page=${page}&pageSize=${pageSize}`),
  get: (code: string) => req<ReportDetail>(`/api/reports/${code}`),
  import: (code: string) =>
    req<ImportAccepted>(`/api/reports/import/${code}`, { method: "POST" }),
  getPerformance: (code: string) =>
    req<Record<number, PerformanceEntry[]>>(`/api/reports/${code}/performance`),
  connectImportWs(code: string, token: string | null): WebSocket {
    const base = (
      import.meta.env.VITE_API_URL ?? "https://localhost:5001"
    ).replace(/^https?/, (m: string) => (m === "https" ? "wss" : "ws"));
    const url = token
      ? `${base}/api/reports/${code}/ws?access_token=${encodeURIComponent(token)}`
      : `${base}/api/reports/${code}/ws`;
    return new WebSocket(url);
  },
};
