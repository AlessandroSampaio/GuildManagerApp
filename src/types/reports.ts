import { Guild } from "./guild";

export interface Report {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  guildName: string | null;
  fightCount: number;
  importedAt: string;
  importStatus?: "Queued" | "Importing" | "Done" | "Failed";
}
export interface ReportDetail {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  guild: Guild | null;
  fights: Fight[];
  importedAt: string;
  importStatus: "Queued" | "Importing" | "Done" | "Failed";
  importError: string | null;
}
export interface Fight {
  id: number;
  fightIndex: number;
  name: string;
  kill: boolean | null;
  durationMs: number;
  difficulty: number;
}

export interface PerformanceEntry {
  characterName: string;
  spec: string;
  role: string;
  amount: number;
  rankPercent: number | null;
  bestPercent: number | null;
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

export type ImportPhase =
  | "Started"
  | "FetchingReport"
  | "SavingReport"
  | "FetchingRankings"
  | "SavingPerformance"
  | "Completed"
  | "Failed";

export interface ImportProgressEvent {
  reportCode: string;
  phase: ImportPhase;
  phaseCode: number;
  message: string;
  data: ImportResult | { killCount: number } | null;
  timestamp: string;
}

export interface ImportAccepted {
  reportCode: string;
  status: string;
  wsUrl: string;
  message: string;
}
