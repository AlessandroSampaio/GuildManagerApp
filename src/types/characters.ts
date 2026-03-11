export interface Character {
  id: number;
  name: string;
  server: string;
  class: string;
  guildName: string | null;
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
