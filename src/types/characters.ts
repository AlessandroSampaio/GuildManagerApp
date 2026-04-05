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
  id: number;
  name: string;
  description: string;
  icon: string;
  icon_url: string;
  wowhead_url: string;
}

export interface MythicPlusSpec {
  id: number;
  name: string;
  slug: string;
  class_id: number;
  role: string;
  is_melee: boolean;
  patch: string;
  ordinal: number;
}

export interface MythicPlusRun {
  dungeon: string;
  short_name: string;
  mythic_level: number;
  completed_at: string;
  clear_time_ms: number;
  keystone_run_id: number;
  par_time_ms: number;
  num_keystone_upgrades: number;
  map_challenge_mode_id: number;
  zone_id: number;
  zone_expansion_id: number;
  icon_url: string;
  background_image_url: string;
  score: number;
  affixes: MythicPlusAffix[];
  url: string;
  spec: MythicPlusSpec;
  role: string;
}

export interface RaiderIoRaidTier {
  summary: string;
  expansion_id: number;
  total_bosses: number;
  normal_bosses_killed: number;
  heroic_bosses_killed: number;
  mythic_bosses_killed: number;
}

export interface RaiderIoProfile {
  name: string;
  race: string;
  class: string;
  active_spec_name: string;
  active_spec_role: string;
  gender: string;
  faction: string;
  achievement_points: number;
  thumbnail_url: string;
  region: string;
  realm: string;
  last_crawled_at: string;
  profile_url: string;
  profile_banner: string;
  raid_progression: Record<string, RaiderIoRaidTier>;
  mythic_plus_best_runs: MythicPlusRun[];
}
