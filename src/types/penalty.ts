export interface PenaltyEvent {
  id: number;
  description: string;
  points: number;
  createdAt: string;
}

export interface PlayerWeekPenalty {
  id: number;
  playerId: number;
  playerName: string;
  raidWeekId: number;
  penaltyEventId: number;
  penaltyDescription: string;
  points: number;
  note: string | null;
  createdAt: string;
}
