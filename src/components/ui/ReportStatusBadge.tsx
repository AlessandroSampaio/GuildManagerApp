import { Component } from "solid-js";

export const ReportStatusBadge: Component<{
  code: string;
  title: string;
  status: string;
  included: boolean;
}> = (props) => (
  <div
    class={`flex items-center gap-3 px-3 py-2 border font-mono text-xs ${
      props.included
        ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400"
        : "bg-void-800/40 border-void-600 text-stone-500"
    }`}
  >
    <div
      class={`w-1.5 h-1.5 rounded-full shrink-0 ${props.included ? "bg-emerald-500" : "bg-stone-600"}`}
    />
    <span class="font-bold text-stone-300">{props.code}</span>
    <span class="flex-1 truncate text-stone-500">{props.title}</span>
    <span class={props.included ? "text-emerald-500" : "text-amber-600"}>
      {props.status}
    </span>
  </div>
);
