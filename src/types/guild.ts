export interface Guild {
  id: number;
  name: string;
  server: string;
  region: string;
}

export interface RosterCharacter {
  id: number;
  name: string;
  server: string;
  class: string;
  playerId: number | null;
  playerName: string | null;
  characterId: number;
  characterName: string;
}

/** Resposta do POST /api/guilds/{id}/sync-characters — enfileira a sincronização. */
export interface SyncAccepted {
  message: string;
  wsUrl: string;
}

export type SyncPhase = "Started" | "Syncing" | "Completed" | "Failed";

/** Evento recebido via WebSocket durante a sincronização. */
export interface SyncProgressEvent {
  phase: SyncPhase;
  message: string;
  charactersSynced?: number;
}
