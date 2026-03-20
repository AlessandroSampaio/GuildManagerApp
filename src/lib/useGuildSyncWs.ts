import { createSignal, onCleanup } from "solid-js";
import { guildsApi } from "@/api/guild";
import { authStore } from "@/stores/auth";
import type { SyncPhase, SyncProgressEvent } from "@/types/guild";

export interface GuildSyncWsState {
  /** Fase atual da sincronização. */
  phase: () => SyncPhase | null;
  /** Mensagem descritiva da fase atual. */
  message: () => string;
  /** WebSocket está aberto e recebendo eventos. */
  isActive: () => boolean;
  /** Sincronização concluída com sucesso. */
  isCompleted: () => boolean;
  /** Sincronização falhou. */
  isFailed: () => boolean;
  /** true enquanto não há estado terminal (não Completed, não Failed). */
  isPending: () => boolean;
  /** Número de personagens sincronizados — disponível quando isCompleted(). */
  charactersSynced: () => number | null;
  /** Inicia monitoramento WS para a wsUrl retornada pelo POST. */
  connect: (wsUrl: string) => void;
  /** Encerra manualmente o WebSocket. */
  disconnect: () => void;
  /** Reseta todos os sinais para o estado inicial. */
  reset: () => void;
}

export function useGuildSyncWs(): GuildSyncWsState {
  const [phase, setPhase] = createSignal<SyncPhase | null>(null);
  const [message, setMessage] = createSignal<string>("");
  const [isActive, setIsActive] = createSignal(false);
  const [charactersSynced, setCharactersSynced] = createSignal<number | null>(null);

  let ws: WebSocket | null = null;

  function disconnect() {
    if (ws && ws.readyState < WebSocket.CLOSING) {
      ws.close(1000, "client disconnect");
    }
    ws = null;
    setIsActive(false);
  }

  function reset() {
    disconnect();
    setPhase(null);
    setMessage("");
    setCharactersSynced(null);
  }

  function connect(wsUrl: string) {
    disconnect();
    setPhase(null);
    setMessage("Conectando...");
    setCharactersSynced(null);
    setIsActive(false);

    const socket = guildsApi.connectSyncWs(wsUrl, authStore.accessToken());
    ws = socket;

    socket.onopen = () => {
      setIsActive(true);
      setMessage("Conectado. Aguardando progresso...");
    };

    socket.onmessage = (evt: MessageEvent<string>) => {
      let parsed: SyncProgressEvent;
      try {
        parsed = JSON.parse(evt.data) as SyncProgressEvent;
      } catch {
        return;
      }

      setPhase(parsed.phase);
      setMessage(parsed.message);

      if (parsed.phase === "Completed") {
        if (parsed.charactersSynced !== undefined) {
          setCharactersSynced(parsed.charactersSynced);
        }
        setIsActive(false);
        socket.close(1000, "done");
        return;
      }

      if (parsed.phase === "Failed") {
        setIsActive(false);
        socket.close(1000, "failed");
        return;
      }
    };

    socket.onerror = () => {
      setPhase("Failed");
      setMessage("Erro de conexão WebSocket. Verifique se a API está acessível.");
      setIsActive(false);
    };

    socket.onclose = (evt: CloseEvent) => {
      if (evt.code !== 1000) {
        setPhase("Failed");
        setMessage(`Conexão encerrada inesperadamente (código ${evt.code}).`);
      }
      setIsActive(false);
      ws = null;
    };
  }

  onCleanup(disconnect);

  const isCompleted = () => phase() === "Completed";
  const isFailed = () => phase() === "Failed";
  const isPending = () => !isCompleted() && !isFailed();

  return {
    phase,
    message,
    isActive,
    isCompleted,
    isFailed,
    isPending,
    charactersSynced,
    connect,
    disconnect,
    reset,
  };
}
