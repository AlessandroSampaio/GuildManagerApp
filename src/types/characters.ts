export interface RaiderIoSnapshot {
  score: number;
  thumbnailUrl?: string;
}

export interface Character {
  id: number;
  name: string;
  server: string;
  class: string;
  guildName: string | null;
  raiderIoSnapshot: RaiderIoSnapshot | null;
}

export interface CharacterSearchResult {
  id: number;
  name: string;
  server: string;
  class: string;
  guildName: string | null;
  playerId: number | null;
  playerName: string | null;
}

export interface MythicPlusAffix {
  affixId: number;
  name: string;
  iconUrl: string;
}

export interface MythicPlusRun {
  keystoneRunId: number;
  dungeon: string;
  shortName: string;
  mythicLevel: number;
  completedAt: string;
  score: number;
  iconUrl: string;
  backgroundImageUrl: string;
  affixes: MythicPlusAffix[];
}

export interface RaiderIoRaidTier {
  raidSlug: string;
  summary: string;
  expansionId: number;
  totalBosses: number;
  normalBossesKilled: number;
  heroicBossesKilled: number;
  mythicBossesKilled: number;
}

export interface RaiderIoProfile {
  isFresh: boolean;
  characterId: number;
  name: string;
  server: string;
  region: string;
  className: string | null;
  guildName: string;
  playerId: number;
  playerName: string;
  thumbnailUrl: string;
  lastCrawledAt: string;
  cachedAt: string;
  score: number;
  mythicRuns: MythicPlusRun[];
  raidProgressions: RaiderIoRaidTier[];
}
