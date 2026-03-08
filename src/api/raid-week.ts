import { PagedResult } from "@/types/common";
import { req } from "./client";
import { RaidWeekSummary, RaidWeek } from "@/types/raid-week";

export const raidWeeksApi = {
  list: (page = 1, pageSize = 20) =>
    req<PagedResult<RaidWeekSummary>>(
      `/api/raid-weeks?page=${page}&pageSize=${pageSize}`,
    ),
  get: (id: number) => req<RaidWeek>(`/api/raid-weeks/${id}`),
  create: (label: string, startsAt: string, reportCodes?: string[]) =>
    req<RaidWeek>("/api/raid-weeks", {
      method: "POST",
      body: JSON.stringify({ label, startsAt, reportCodes }),
    }),
  update: (id: number, label: string, startsAt: string) =>
    req<RaidWeek>(`/api/raid-weeks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ label, startsAt }),
    }),
  delete: (id: number) =>
    req<void>(`/api/raid-weeks/${id}`, { method: "DELETE" }),
  addReport: (id: number, reportCode: string) =>
    req<RaidWeek>(`/api/raid-weeks/${id}/reports/${reportCode}`, {
      method: "POST",
    }),
  removeReport: (id: number, reportCode: string) =>
    req<RaidWeek>(`/api/raid-weeks/${id}/reports/${reportCode}`, {
      method: "DELETE",
    }),
};
