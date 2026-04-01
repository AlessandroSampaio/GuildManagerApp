import { classColor } from "@/helpers/colors";
import { PlayerCharacter } from "@/types/player";
import { A } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { Spinner } from "./ui/Spinner";

export const CharacterRow: Component<{
  char: PlayerCharacter;
  playerId: number;
  onRemove: (charId: number) => void;
  removing: boolean;
}> = (p) => (
  <div
    class="flex items-center gap-3 px-3 py-2.5 bg-void-800 border border-void-700
               hover:border-void-600 transition-colors group animate-fade-in"
  >
    {/* Class color bar */}
    <div
      class={`w-0.5 h-8 shrink-0 rounded-full ${classColor(
        p.char.class,
      ).replace("text-", "bg-")} opacity-60`}
      aria-hidden="true"
    />

    <A
      href={`/app/characters/${p.char.id}`}
      class="flex-1 min-w-0 hover:opacity-80 transition-opacity"
    >
      <p class={`font-semibold text-sm truncate ${classColor(p.char.class)}`}>
        {p.char.name}
      </p>
      <p class="font-mono text-[10px] text-stone-600 truncate">
        {p.char.class} · {p.char.server}
        {p.char.guildName ? ` · ${p.char.guildName}` : ""}
      </p>
    </A>

    <span class="font-mono text-[9px] text-stone-700 shrink-0">
      #{p.char.id}
    </span>

    <button
      onClick={() => p.onRemove(p.char.id)}
      disabled={p.removing}
      class="opacity-0 group-hover:opacity-100 text-stone-700 hover:text-red-400
             transition-all shrink-0 disabled:opacity-30"
      aria-label={`Desvincular ${p.char.name}`}
      title="Desvincular character"
    >
      <Show
        when={p.removing}
        fallback={
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <line x1="2" y1="2" x2="10" y2="10" stroke-linecap="round" />
            <line x1="10" y1="2" x2="2" y2="10" stroke-linecap="round" />
          </svg>
        }
      >
        <Spinner size={12} />
      </Show>
    </button>
  </div>
);
