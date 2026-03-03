import { diffLabel, fmtMs } from "@/helpers";
import { Fight } from "@/types/reports";
import { Component } from "solid-js";

const FightRow: Component<{
  fight: Fight;
  selected: boolean;
  onClick: () => void;
}> = (props) => {
  return (
    <button
      onClick={props.onClick}
      class={`w-full text-left flex items-center gap-4 px-4 py-3 border-l-2
                  transition-all duration-150
                  ${
                    props.selected
                      ? "bg-forge-900/40 border-ember-700"
                      : "bg-void-800 border-transparent hover:bg-void-700 hover:border-void-500"
                  }`}
    >
      <span class="font-mono text-[10px] text-stone-600 w-5 shrink-0">
        {props.fight.fightIndex}
      </span>
      <div class="flex-1 min-w-0">
        <p
          class={`font-semibold text-sm truncate ${props.selected ? "text-stone-100" : "text-stone-400"}`}
        >
          {props.fight.name}
        </p>
        <p class="font-mono text-[10px] text-stone-600">
          {diffLabel(props.fight.difficulty)} · {fmtMs(props.fight.durationMs)}
        </p>
      </div>
      {props.fight.kill ? (
        <span class="tag-kill shrink-0">Kill</span>
      ) : (
        <span class="tag-wipe shrink-0">Wipe</span>
      )}
    </button>
  );
};

export default FightRow;
