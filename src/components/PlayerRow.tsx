import { Player } from "@/types/player";
import { Component } from "solid-js";

export const PlayerRow: Component<{
  player: Player;
  selected: boolean;
  onClick: () => void;
}> = (p) => (
  <button
    onClick={p.onClick}
    class={`w-full text-left flex items-center gap-3 px-4 py-3 border-l-2
            transition-all duration-150
            ${
              p.selected
                ? "bg-forge-900/40 border-ember-700"
                : "bg-void-800 border-transparent hover:bg-void-700 hover:border-void-500"
            }`}
  >
    {/* Avatar circle */}
    <div
      class={`w-8 h-8 flex items-center justify-center font-display
                  text-sm shrink-0 border transition-colors
                  ${
                    p.selected
                      ? "bg-forge-900 border-ember-800 text-ember-500"
                      : "bg-void-700 border-void-600 text-stone-500"
                  }`}
    >
      {p.player.name[0]?.toUpperCase() ?? "?"}
    </div>

    <div class="flex-1 min-w-0">
      <p
        class={`font-semibold text-sm truncate leading-tight ${
          p.selected ? "text-stone-100" : "text-stone-300"
        }`}
      >
        {p.player.name}
      </p>
      <p class="font-mono text-[10px] text-stone-600 mt-0.5">
        {p.player.characterCount === 0
          ? "sem characters"
          : `${p.player.characterCount} character${p.player.characterCount !== 1 ? "s" : ""}`}
      </p>
    </div>

    <span class="font-mono text-[9px] text-stone-700 shrink-0">
      #{p.player.id}
    </span>
  </button>
);
