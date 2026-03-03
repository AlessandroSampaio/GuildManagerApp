import { Component } from "solid-js";

export const RankBar: Component<{ value: number | null }> = (p) => {
  const pct = () => Math.min(100, Math.max(0, p.value ?? 0));
  const color = () => {
    const v = pct();
    if (v >= 95) return "bg-amber-300";
    if (v >= 75) return "bg-amber-500";
    if (v >= 50) return "bg-emerald-500";
    if (v >= 25) return "bg-blue-400";
    return "bg-stone-500";
  };
  return (
    <div class="flex items-center gap-2">
      <div class="rank-bar flex-1">
        <div class={`rank-bar-fill ${color()}`} style={`width:${pct()}%`} />
      </div>
      <span
        class={`font-mono text-[12px] w-8 text-center text-white ${color()}`}
      >
        {p.value !== null ? pct().toFixed(0) : "—"}
      </span>
    </div>
  );
};
