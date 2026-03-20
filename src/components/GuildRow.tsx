import { Guild } from "@/types/guild";
import { Component } from "solid-js";

export const GuildRow: Component<{
  guild: Guild;
  selected: boolean;
  onClick: () => void;
}> = (p) => (
  <button
    onClick={p.onClick}
    class={`w-full text-left flex flex-col px-4 py-2.5 border-l-2 transition-all duration-150
      ${
        p.selected
          ? "bg-forge-900/40 border-ember-700 text-ember-600"
          : "border-transparent text-stone-400 hover:text-stone-200 hover:bg-void-800"
      }`}
  >
    <span class="font-semibold text-sm truncate">{p.guild.name}</span>
    <span class="font-mono text-[10px] text-stone-600 truncate">
      {p.guild.server} · {p.guild.region}
    </span>
  </button>
);
