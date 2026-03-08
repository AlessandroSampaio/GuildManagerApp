import { RaidWeekSummary } from "./raid-week";
import { ScoringSettings } from "./scoring";

export interface FightScoreEntry {
  reportCode: string;
  reportTitle: string;
  fightId: number;
  fightName: string;
  kill: boolean | null;
  spec: string;
  role: string;
  amount: number;
  rankPercent: number | null;
  points: number | null;
  tierLabel: string | null;
}

export interface PlayerCharacterScore {
  characterId: number;
  characterName: string;
  class: string;
  server: string;
  totalPoints: number;
  averageRankPercent: number | null;
  fights: FightScoreEntry[];
}

export interface PlayerScore {
  playerId: number;
  playerName: string;
  totalPoints: number;
  averageRankPercent: number | null;
  scoredEntries: number;
  unscoredEntries: number;
  characters: PlayerCharacterScore[];
}

export interface ReportScoreStatus {
  reportCode: string;
  title: string;
  importStatus: string;
  includedInScoring: boolean;
}

export interface PlayerScoringResult {
  players: PlayerScore[];
  reports: ReportScoreStatus[];
  scoringSettings: ScoringSettings;
  raidWeek: RaidWeekSummary | null;
  totalEntriesEvaluated: number;
  entriesWithoutRankPercent: number;
}
