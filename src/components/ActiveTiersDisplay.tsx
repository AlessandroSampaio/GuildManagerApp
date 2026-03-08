import { tierColor, tierBarColor } from "@/helpers/colors";
import { ScoringTier } from "@/types/scoring";
import { Component, createMemo, For } from "solid-js";

export const ActiveTiersDisplay: Component<{ tiers: ScoringTier[] }> = (p) => {
  const sorted = createMemo(() =>
    [...p.tiers].sort((a, b) => b.minPercent - a.minPercent),
  );

  return (
    <div class="space-y-1.5">
      <For each={sorted()}>
        {(tier) => (
          <div
            class={`flex items-center gap-3 px-3 py-2 border font-mono text-xs ${tierColor(tier.points)}`}
          >
            <div
              class={`w-2 h-2 rounded-full shrink-0 ${tierBarColor(tier.points)}`}
            />
            <span class="w-24 shrink-0">
              {tier.minPercent}% – {tier.maxPercent}%
            </span>
            <span class="w-16 shrink-0 font-bold">{tier.points} pts</span>
            <span class="flex-1 opacity-70">{tier.label ?? "—"}</span>
          </div>
        )}
      </For>
    </div>
  );
};
