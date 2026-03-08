import { formatWeekRange } from "@/helpers";
import { RaidWeekSummary } from "@/types/raid-week";
import { Component } from "solid-js";

export const WeekItem: Component<{
  week: RaidWeekSummary;
  active: boolean;
  onClick: () => void;
}> = (props) => {
  return (
    <button
      onClick={props.onClick}
      class={`w-full text-left px-4 py-3 border-l-2 transition-all duration-150
               ${
                 props.active
                   ? "bg-forge-900/40 border-ember-700 text-stone-100"
                   : "border-transparent text-stone-500 hover:text-stone-200 hover:bg-void-800"
               }`}
    >
      <p
        class={`font-semibold text-sm truncate ${props.active ? "text-ember-500" : ""}`}
      >
        {props.week.label}
      </p>
      <p class="font-mono text-[10px] text-stone-600 mt-0.5">
        {formatWeekRange(props.week.startsAt, props.week.endsAt)}
      </p>
      <p class="font-mono text-[10px] text-stone-600 mt-0.5">
        {props.week.reportCount} report{props.week.reportCount !== 1 ? "s" : ""}
      </p>
    </button>
  );
};
