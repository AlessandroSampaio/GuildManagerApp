import { Component } from "solid-js";

export const FailureIcon: Component = () => (
  <div class="relative flex items-center justify-center w-32 h-32">
    <div
      class="absolute inset-0 rounded-full border-2 border-red-500/25 animate-ping"
      style="animation-duration:1.2s;animation-iteration-count:1;animation-fill-mode:forwards"
    />
    <div class="absolute inset-2 rounded-full border border-red-900/40" />

    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      class="relative z-10"
    >
      <style>{`
        @keyframes strokeX {
          from { stroke-dashoffset: 40; opacity:0; }
          to   { stroke-dashoffset: 0;  opacity:1; }
        }
      `}</style>

      <circle cx="40" cy="40" r="36" fill="rgba(239,68,68,0.05)" />
      <circle
        cx="40"
        cy="40"
        r="36"
        stroke="#ef4444"
        stroke-width="2"
        fill="none"
        stroke-dasharray="226"
        stroke-dashoffset="226"
        transform="rotate(-90 40 40)"
        style="animation: strokeCircle 0.6s 0.05s cubic-bezier(0.65,0,0.35,1) forwards"
      />

      <line
        x1="27"
        y1="27"
        x2="53"
        y2="53"
        stroke="#f87171"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-dasharray="40"
        stroke-dashoffset="40"
        style="animation: strokeX 0.35s 0.55s cubic-bezier(0.65,0,0.35,1) forwards"
      />
      <line
        x1="53"
        y1="27"
        x2="27"
        y2="53"
        stroke="#f87171"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-dasharray="40"
        stroke-dashoffset="40"
        style="animation: strokeX 0.35s 0.72s cubic-bezier(0.65,0,0.35,1) forwards"
      />
    </svg>
  </div>
);
