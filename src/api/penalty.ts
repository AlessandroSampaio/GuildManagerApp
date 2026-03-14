import { PenaltyEvent, PlayerWeekPenalty } from "@/types/penalty";
import { req } from "./client";

export const penaltyApi = {
  listEvents: () => req<PenaltyEvent[]>("/api/penalty-events"),

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
