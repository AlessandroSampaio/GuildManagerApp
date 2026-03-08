export interface ScoringTier {
  id: number;
  minPercent: number;
  maxPercent: number;
  points: number;
  label: string | null;
}

export interface ScoringSettings {
  updatedAt: string;
  tiers: ScoringTier[];
}

export interface ScoringTierRequest {
  minPercent: number;
  maxPercent: number;
  points: number;
  label?: string;
}

export interface ScoreCalculationResult {
  rankPercent: number;
  points: number | null;
  tier: ScoringTier | null;
}

export const DEFAULT_TIERS: ScoringTierRequest[] = [
  { minPercent: 0, maxPercent: 25, points: 0, label: "Comum" },
  { minPercent: 25, maxPercent: 50, points: 25, label: "Incomum" },
  { minPercent: 50, maxPercent: 75, points: 50, label: "Raro" },
  { minPercent: 75, maxPercent: 95, points: 75, label: "Épico" },
  { minPercent: 95, maxPercent: 100, points: 100, label: "Lendário" },
];
