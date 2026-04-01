import { createEffect, createSignal, onCleanup } from "solid-js";
import { useQueryClient } from "@tanstack/solid-query";
import { authStore } from "@/stores/auth";
import { penaltyKeys, raidWeekKeys } from "@/lib/query-keys";

const BASE = import.meta.env.VITE_API_URL ?? "https://localhost:5000";

type RaidWeekEvent =
  | "updated"
  | "deleted"
  | "reportAdded"
  | "reportRemoved"
  | "penaltyAdded"
  | "penaltyRemoved";

interface WsMessage {
  event: RaidWeekEvent;
}

/**
 * Abre uma conexão WebSocket para `/api/raid-weeks/:id/ws` e invalida as
 * queries relevantes silenciosamente ao receber eventos do servidor.
 *
 * O hook é reativo: quando `weekId()` muda, a conexão anterior é encerrada e
 * uma nova é aberta automaticamente. `onCleanup` do Solid garante o
 * fechamento quando o componente desmonta.
 */
export function useRaidWeekWs(
  weekId: () => number,
  onDeleted: () => void,
): { isConnected: () => boolean } {
  const qc = useQueryClient();
  const [isConnected, setIsConnected] = createSignal(false);

  let ws: WebSocket | null = null;
  // Impede tentativas de reconexão após o componente ter sido desmontado.
  let destroyed = false;

  function disconnect() {
    if (ws && ws.readyState < WebSocket.CLOSING) {
      ws.close(1000, "client disconnect");
    }
    ws = null;
    setIsConnected(false);
  }

  function connect(id: number) {
    disconnect();

    const wsBase = BASE.replace(/^http/, "ws");
    const token = authStore.accessToken();
    const qs = token ? `?token=${encodeURIComponent(token)}` : "";
    const socket = new WebSocket(`${wsBase}/api/raid-weeks/${id}/ws${qs}`);
    ws = socket;

    socket.onopen = () => setIsConnected(true);

    socket.onmessage = (evt: MessageEvent<string>) => {
      let msg: WsMessage;
      try {
        msg = JSON.parse(evt.data) as WsMessage;
      } catch {
        return;
      }

      switch (msg.event) {
        case "deleted":
          qc.removeQueries({ queryKey: raidWeekKeys.detail(id) });
          qc.invalidateQueries({ queryKey: raidWeekKeys.lists() });
          onDeleted();
          break;

        case "updated":
          qc.invalidateQueries({ queryKey: raidWeekKeys.detail(id) });
          qc.invalidateQueries({ queryKey: raidWeekKeys.lists() });
          break;

        case "reportAdded":
        case "reportRemoved":
          qc.invalidateQueries({ queryKey: raidWeekKeys.detail(id) });
          qc.invalidateQueries({ queryKey: raidWeekKeys.lists() });
          break;

        case "penaltyAdded":
        case "penaltyRemoved":
          qc.invalidateQueries({ queryKey: raidWeekKeys.detail(id) });
          qc.invalidateQueries({ queryKey: penaltyKeys.weekPenalties(id) });
          break;
      }
    };

    socket.onerror = () => setIsConnected(false);

    socket.onclose = (evt: CloseEvent) => {
      // Ignora o evento de close de uma conexão anterior (stale).
      if (ws !== socket) return;
      setIsConnected(false);
      ws = null;
      // Reconecta automaticamente em caso de queda inesperada.
      if (evt.code !== 1000 && evt.code !== 1001 && !destroyed) {
        setTimeout(() => connect(id), 3_000);
      }
    };
  }

  // Reconecta sempre que weekId muda (troca de semana selecionada).
  createEffect(() => connect(weekId()));

  onCleanup(() => {
    destroyed = true;
    disconnect();
  });

  return { isConnected };
}
