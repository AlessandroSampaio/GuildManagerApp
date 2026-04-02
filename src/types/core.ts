export interface CoreDto {
  id: number;
  name: string | null;
  guildId: number;
  guildName: string | null;
  playerCount: number;
  createdAt: string;
}

export interface CorePlayerDto {
  playerId: number;
  name: string | null;
}

export interface CoreDetailDto {
  id: number;
  name: string | null;
  guildId: number;
  guildName: string | null;
  createdAt: string;
  updatedAt: string;
  players: CorePlayerDto[] | null;
}

export interface CoreCreateRequest {
  name: string | null;
  guildId: number;
}

export interface CoreUpdateRequest {
  name: string | null;
}
