import { Component } from "solid-js";

export const CountdownArc: Component<{
  remaining: number;
  total: number;
  success: boolean;
}> = (p) => {
  const R = 11;
  const circ = 2 * Math.PI * R;
  const frac = () => Math.max(0, p.remaining / p.total);
  const col = () => (p.success ? "#10b981" : "#ef4444");

  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      class="shrink-0"
    >
      {/* Track */}
      <circle cx="15" cy="15" r={R} stroke="#27272a" stroke-width="2.5" />
      {/* Arc */}
      <circle
        cx="15"
        cy="15"
        r={R}
        stroke={col()}
        stroke-width="2.5"
        stroke-dasharray={circ}
        stroke-dashoffset={circ * (1 - frac())}
        stroke-linecap="round"
        transform="rotate(-90 15 15)"
        style="transition: stroke-dashoffset 0.95s linear"
      />
      {/* Number */}
      <text
        x="15"
        y="15"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="9"
        font-family="ui-monospace,monospace"
        fill={col()}
      >
        {p.remaining}
      </text>
    </svg>
  );
};
