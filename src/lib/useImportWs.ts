import { createSignal, onCleanup } from "solid-js";
import { reportsApi } from "@/api/reports";
import { authStore } from "@/stores/auth";
import type {
  ImportPhase,
  ImportProgressEvent,
  ImportResult,
} from "@/types/reports";

export const IMPORT_PHASES: ImportPhase[] = [
  "Started",
  "FetchingReport",
  "SavingReport",
  "FetchingRankings",
  "SavingPerformance",
  "Completed",
];

export function phaseIndex(phase: ImportPhase): number {
  const idx = IMPORT_PHASES.indexOf(phase);
  return idx === -1 ? 0 : idx;
}

export const PHASE_LABELS: Record<ImportPhase, string> = {
  Started: "Iniciando",
  FetchingReport: "Buscando report",
  SavingReport: "Salvando report",
  FetchingRankings: "Buscando rankings",
  SavingPerformance: "Salvando performance",
  Completed: "Concluído",
  Failed: "Falha",
};

export interface ImportWsState {
  /** Fase atual da importação. */
  phase: () => ImportPhase | null;
  /** Mensagem descritiva da fase atual. */
  message: () => string;
  /** WebSocket está aberto e recebendo eventos. */
  isActive: () => boolean;
  /** Importação concluída com sucesso. */
  isCompleted: () => boolean;
  /** Importação falhou. */
  isFailed: () => boolean;
  /** true enquanto não há estado terminal (não Completed, não Failed). */
  isPending: () => boolean;
  /** Resultado final disponível quando isCompleted() === true. */
  result: () => ImportResult | null;
  /** Inicia monitoramento WS para o reportCode dado (uso após POST 202). */
  connect: (reportCode: string) => void;
  /**
   * Abre um novo WS para um report já em andamento (Queued/Importing).
   * Diferente de `connect`, não limpa o estado atual — apenas substitui o socket.
   * Útil quando o usuário navega para ReportDetailPage enquanto importa.
   */
  reconnect: (reportCode: string) => void;
  /** Encerra manualmente o WebSocket (ex: ao fechar o modal). */
  disconnect: () => void;
  /** Reseta todos os sinais para o estado inicial. */
  reset: () => void;
}

export function useImportWs(): ImportWsState {
  const [phase, setPhase] = createSignal<ImportPhase | null>(null);
  const [message, setMessage] = createSignal<string>("");
  const [isActive, setIsActive] = createSignal(false);
  const [result, setResult] = createSignal<ImportResult | null>(null);

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
    setResult(null);
  }

  function attachHandlers(socket: WebSocket) {
    socket.onopen = () => {
      setIsActive(true);
      setMessage("Conectado. Aguardando progresso...");
    };

    socket.onmessage = (evt: MessageEvent<string>) => {
      let parsed: ImportProgressEvent;
      try {
        parsed = JSON.parse(evt.data) as ImportProgressEvent;
      } catch {
        return;
      }

      setPhase(parsed.phase);
      setMessage(parsed.message);

      if (parsed.phase === "Completed") {
        if (parsed.data && "reportCode" in parsed.data) {
          setResult(parsed.data as ImportResult);
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
      setMessage(
        "Erro de conexão WebSocket. Verifique se a API está acessível.",
      );
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

  function connect(reportCode: string) {
    disconnect();
    setPhase(null);
    setMessage("Conectando...");
    setResult(null);
    setIsActive(false);

    const socket = reportsApi.connectImportWs(
      reportCode,
      authStore.accessToken(),
    );
    ws = socket;
    attachHandlers(socket);
  }

  function reconnect(reportCode: string) {
    // Não reconectar se já há um socket ativo
    if (ws && ws.readyState === WebSocket.OPEN) return;

    // Fechar socket morto antes de criar um novo
    if (ws && ws.readyState < WebSocket.CLOSING) {
      ws.close(1000, "reconnect");
    }
    ws = null;

    setIsActive(false);
    setMessage("Reconectando...");

    const socket = reportsApi.connectImportWs(
      reportCode,
      authStore.accessToken(),
    );
    ws = socket;
    attachHandlers(socket);
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
    result,
    connect,
    reconnect,
    disconnect,
    reset,
  };
}
