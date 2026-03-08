export interface Player {
  id: number;
  name: string;
  characterCount: number;
  createdAt: string;
}

export interface PlayerCharacter {
  id: number;
  name: string;
  server: string;
  region: string;
  class: string;
  guildName: string | null;
}

export interface PlayerDetail {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  characters: PlayerCharacter[];
}
