import { Guild } from "./wcl-common";

export interface Report {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  guildName: string | null;
  fightCount: number;
  killCount: number;
  importedAt: string;
}
export interface ReportDetail {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  guild: Guild | null;
  fights: Fight[];
  importedAt: string;
}
export interface Fight {
  id: number;
  fightIndex: number;
  name: string;
  kill: boolean | null;
  startTimeMs: number;
  endTimeMs: number;
  difficulty: number;
}
export interface ImportResult {
  reportCode: string;
  title: string;
  fightsImported: number;
  killsImported: number;
  playersImported: number;
  performanceEntriesSaved: number;
  guildName: string | null;
}
export interface PerformanceEntry {
  characterName: string;
  spec: string;
  role: string;
  amount: number;
  rankPercent: number | null;
  bestPercent: number | null;
}
