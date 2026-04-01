import { backgroundClassColor, classColor } from "@/helpers/colors";
import { RosterCharacter } from "@/types/guild";
import { A } from "@solidjs/router";
import { Component, Show } from "solid-js";

export const RosterRow: Component<{ char: RosterCharacter }> = (p) => (
  <div
    class="flex items-center gap-3 px-3 py-2.5 bg-void-800 border border-void-700
           hover:border-void-600 transition-colors animate-fade-in"
  >
    {/* Class color bar */}
    <div
      class={`w-0.5 h-8 shrink-0 rounded-full ${backgroundClassColor(p.char.class)}`}
      aria-hidden="true"
    />

    <A
      href={`/app/characters/${p.char.characterId}`}
      class="flex-1 min-w-0 hover:opacity-80 transition-opacity"
    >
      <p class={`font-semibold text-sm truncate ${classColor(p.char.class)}`}>
        {p.char.characterName}
      </p>
      <p class="font-mono text-[10px] text-stone-600 truncate">
        {p.char.class} · {p.char.server}
      </p>
    </A>

    <Show when={p.char.playerId}>
      <span class="font-mono text-[9px] bg-void-700 border border-void-600 text-stone-400 px-1.5 py-0.5 shrink-0 truncate max-w-[7rem]">
        {p.char.playerName}
      </span>
    </Show>

    <span class="font-mono text-[9px] text-stone-700 shrink-0">
      #{p.char.id}
    </span>
  </div>
);
