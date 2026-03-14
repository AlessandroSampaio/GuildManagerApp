import { PenaltyEvent, PlayerWeekPenalty } from "@/types/penalty";
import { req } from "./client";

export const penaltyApi = {
  listEvents: () => req<PenaltyEvent[]>("/api/penalty-events"),

  createEvent: (description: string, points: number) =>
    req<PenaltyEvent>("/api/penalty-events", {
      method: "POST",
      body: JSON.stringify({ description, points }),
    }),

  updateEvent: (id: number, description: string, points: number) =>
    req<PenaltyEvent>(`/api/penalty-events/${id}`, {
      method: "PUT",
      body: JSON.stringify({ description, points }),
    }),

  deleteEvent: (id: number) =>
    req<void>(`/api/penalty-events/${id}`, { method: "DELETE" }),

  listWeekPenalties: (weekId: number) =>
    req<PlayerWeekPenalty[]>(`/api/raid-weeks/${weekId}/penalties`),

  addPenalty: (
    weekId: number,
    playerId: number,
    penaltyEventId: number,
    note?: string,
  ) =>
    req<PlayerWeekPenalty>(`/api/raid-weeks/${weekId}/penalties`, {
      method: "POST",
      body: JSON.stringify({ playerId, penaltyEventId, note: note || null }),
    }),

  removePenalty: (weekId: number, penaltyId: number) =>
    req<void>(`/api/raid-weeks/${weekId}/penalties/${penaltyId}`, {
      method: "DELETE",
    }),
};
