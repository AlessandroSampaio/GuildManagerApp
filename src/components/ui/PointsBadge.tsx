import { tierBadgeClass } from "@/helpers/colors";
import { Component } from "solid-js";

export const PointsBadge: Component<{
  points: number | null;
  label: string | null;
}> = (props) => {
  const cls = tierBadgeClass(props.points);
  return (
    <span class={`font-mono text-[10px] px-1.5 py-0.5 border ${cls}`}>
      {props.points !== null ? `${props.points} pts` : "—"}
      {props.label && <span class="opacity-70 ml-1">· {props.label}</span>}
    </span>
  );
};
