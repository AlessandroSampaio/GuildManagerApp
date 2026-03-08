import { fmtAmount, roleIcon } from "@/helpers";
import { FightScoreEntry } from "@/types/player-scoring";
import { Component, Show } from "solid-js";
import { PointsBadge } from "./ui/PointsBadge";
import { RankBar } from "./ui/RankBar";

export const FightRow: Component<{ entry: FightScoreEntry }> = (p) => {
  const e = p.entry;
  return (
    <div class="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-center px-4 py-2 text-xs border-b border-void-700 last:border-0 hover:bg-void-800/30 transition-colors">
      <div class="min-w-0">
        <span class="text-stone-300 font-semibold truncate">{e.fightName}</span>
        <Show when={e.kill}>
          <span class="ml-1.5 font-mono text-[9px] text-emerald-500 bg-emerald-950/40 border border-emerald-900/50 px-1 py-0.5">
            KILL
          </span>
        </Show>
        <span class="ml-1.5 font-mono text-[9px] text-stone-600">
          {e.reportCode}
        </span>
      </div>
      <span class="font-mono text-[10px] text-stone-500 whitespace-nowrap">
        {roleIcon(e.role)} {e.spec}
      </span>
      <span class="font-mono text-[10px] text-stone-500 whitespace-nowrap">
        {fmtAmount(e.amount, e.role)}
      </span>
      <div class="w-24">
        <RankBar value={e.rankPercent} />
      </div>
      <div class="flex justify-end">
        <PointsBadge points={e.points} label={e.tierLabel} />
      </div>
    </div>
  );
};
