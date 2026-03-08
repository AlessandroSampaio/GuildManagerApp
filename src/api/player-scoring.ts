import { PlayerScoringResult } from "@/types/player-scoring";
import { req } from "./client";

export const playerScoringApi = {
  calculateByWeek: (raidWeekId: number) =>
    req<PlayerScoringResult>(`/api/player-scoring/by-week/${raidWeekId}`, {
      method: "POST",
    }),
  calculateManual: (reportCodes: string[]) =>
    req<PlayerScoringResult>("/api/player-scoring", {
      method: "POST",
      body: JSON.stringify({ reportCodes }),
    }),
};
