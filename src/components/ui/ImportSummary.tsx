import { A } from "@solidjs/router";
import { Component } from "solid-js";

const ImportSummary: Component<{
  reportCode: string;
  title: string;
  fightsImported: number;
  killsImported: number;
  playersImported: number;
  performanceEntriesSaved: number;
  guildName: string | null;
  onClose: () => void;
}> = (p) => (
  <div class="space-y-4 animate-fade-in">
    <div class="flex items-center gap-3 bg-emerald-950/40 border border-emerald-900 px-4 py-3">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        class="text-emerald-400 shrink-0"
      >
        <circle cx="8" cy="8" r="7" />
        <path d="M5 8l2 2 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <p class="font-mono text-xs text-emerald-400">
        Report importado com sucesso
      </p>
    </div>

    <dl class="space-y-0">
      {(
        [
          ["Título", p.title],
          ["Fights importados", p.fightsImported],
          ["Kills", p.killsImported],
          ["Jogadores", p.playersImported],
          ["Entradas perf.", p.performanceEntriesSaved],
          ["Guilda", p.guildName ?? "—"],
        ] as [string, string | number][]
      ).map(([k, v]) => (
        <div class="flex items-center justify-between py-2.5 border-b border-void-700 last:border-0">
          <dt class="label-xs">{k}</dt>
          <dd class="font-mono text-xs text-stone-200">{v}</dd>
        </div>
      ))}
    </dl>

    <div class="flex gap-2 pt-1">
      <A
        href={`/app/reports/${p.reportCode}`}
        class="btn-primary flex-1 text-center text-xs"
        onClick={p.onClose}
      >
        Ver Report
      </A>
      <button onClick={p.onClose} class="btn-ghost flex-1 text-xs">
        Fechar
      </button>
    </div>
  </div>
);

export default ImportSummary;
