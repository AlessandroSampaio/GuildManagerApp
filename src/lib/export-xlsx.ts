import { fileOpsIpc } from "@/ipc";
import { PlayerScoringResult } from "@/types/player-scoring";
import { openPath } from "@tauri-apps/plugin-opener";
import * as XLSX from "xlsx";

export async function exportRaidWeekXlsx(
  result: PlayerScoringResult,
  weekLabel: string,
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

  const header = ["Player", ...fightNames, "Total"];
  const rows: (string | number | null)[][] = [header];

  for (const player of players) {
    const fightPoints = new Map<string, number>();
    for (const char of player.characters) {
      for (const fight of char.fights) {
        const prev = fightPoints.get(fight.fightName) ?? 0;
        fightPoints.set(fight.fightName, prev + (fight.points ?? 0));
      }
    }

    const row: (string | number | null)[] = [player.playerName];
    for (const name of fightNames) {
      row.push(fightPoints.get(name) ?? null);
    }
    row.push(player.totalPoints);
    rows.push(row);
  }

  console.log(rows);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  const colWidths = header.map((h, i) =>
    i === 0 ? { wch: 24 } : { wch: Math.max(h.length + 2, 10) },
  );
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pontuação");

  const data = XLSX.write(wb, {
    type: "buffer",
    bookType: "xlsx",
  }) as Uint8Array;

  const filename = `${weekLabel.replace(/[^a-zA-Z0-9_\-]/g, "_")}_pontos.xlsx`;

  // Write to Downloads folder via Rust (std::fs::write)
  const downloadDir = await fileOpsIpc.get_download_dir();
  const fullPath = `${downloadDir}\\${filename}`;
  console.log(Array.from(data));
  await fileOpsIpc.save_bytes(fullPath, Array.from(data));

  // Open with default application (e.g. Excel, LibreOffice Calc)
  // await openPath(fullPath);
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
