import { fileOpsIpc } from "@/ipc";
import { PlayerScoringResult } from "@/types/player-scoring";
import { PlayerWeekPenalty } from "@/types/penalty";
import * as XLSX from "xlsx-js-style";

export async function exportRaidWeekXlsx(
  result: PlayerScoringResult,
  weekLabel: string,
  penalties: PlayerWeekPenalty[] = [],
): Promise<void> {
  const players = result.players;

  const fightNameSet = new LinkedSet<string>();
  for (const player of players) {
    for (const char of player.characters) {
      for (const fight of char.fights) {
        fightNameSet.add(fight.fightName);
      }
    }
  }
  const fightNames = fightNameSet.values();

  // Build penalty totals per player
  const penaltyByPlayer = new Map<number, number>();
  for (const p of penalties) {
    const prev = penaltyByPlayer.get(p.playerId) ?? 0;
    penaltyByPlayer.set(p.playerId, prev + p.points);
  }

  const header = ["Player", ...fightNames, "Penalidades", "Total"];

  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "1C1917" } },
    alignment: { horizontal: "center" as const },
    border: {
      bottom: { style: "thin", color: { rgb: "78716C" } },
    },
  };

  const headerRow = header.map(
    (h) => ({ v: h, t: "s", s: headerStyle }) as XLSX.CellObject,
  );

  const rows: XLSX.CellObject[][] = [headerRow];

  for (const player of players) {
    const fightPoints = new Map<string, number>();
    for (const char of player.characters) {
      for (const fight of char.fights) {
        const prev = fightPoints.get(fight.fightName) ?? 0;
        fightPoints.set(fight.fightName, prev + (fight.points ?? 0));
      }
    }

    const penaltyTotal = penaltyByPlayer.get(player.playerId) ?? 0;

    const row: XLSX.CellObject[] = [
      { v: player.playerName, t: "s" },
      ...fightNames.map(
        (name): XLSX.CellObject => ({
          v: fightPoints.get(name) ?? "",
          t: fightPoints.has(name) ? "n" : "s",
        }),
      ),
      {
        v: penaltyTotal !== 0 ? penaltyTotal : "",
        t: penaltyTotal !== 0 ? "n" : "s",
        s: penaltyTotal < 0 ? { font: { color: { rgb: "EF4444" } } } : undefined,
      },
      { v: player.totalPoints, t: "n", s: { font: { bold: true } } },
    ];
    rows.push(row);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  const colWidths = header.map((h, i) =>
    i === 0 ? { wch: 24 } : { wch: Math.max(h.length + 2, 12) },
  );
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pontuação");

  const data = XLSX.write(wb, {
    type: "buffer",
    bookType: "xlsx",
  }) as Uint8Array;

  const filename = `${weekLabel.replace(/[^a-zA-Z0-9_\-]/g, "_")}_pontos.xlsx`;

  const downloadDir = await fileOpsIpc.get_download_dir();
  const fullPath = `${downloadDir}\\${filename}`;
  await fileOpsIpc.save_bytes(fullPath, Array.from(data));
}

class LinkedSet<T> {
  private map = new Map<T, true>();
  add(v: T) {
    this.map.set(v, true);
  }
  values(): T[] {
    return [...this.map.keys()];
  }
}
