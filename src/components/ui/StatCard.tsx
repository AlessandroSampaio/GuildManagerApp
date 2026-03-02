import { Component } from "solid-js";

const StatCard: Component<{
  label: string;
  value: string | number;
  sub?: string;
  delay?: string;
}> = (p) => (
  <div
    class="card animate-fade-in"
    style={`animation-delay:${p.delay ?? "0s"}`}
  >
    <p class="label-xs mb-2">{p.label}</p>
    <p class="font-display text-2xl text-stone-100">{p.value}</p>
    {p.sub && <p class="font-mono text-[10px] text-stone-600 mt-1">{p.sub}</p>}
  </div>
);

export default StatCard;
