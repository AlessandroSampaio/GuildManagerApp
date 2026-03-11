import { Component } from "solid-js";

export const SuccessIcon: Component = () => (
  <div class="relative flex items-center justify-center w-32 h-32">
    {/* Single pulse ring — fires once on mount */}
    <div
      class="absolute inset-0 rounded-full border-2 border-emerald-500/40 animate-ping"
      style="animation-duration:1.2s;animation-iteration-count:1;animation-fill-mode:forwards"
    />
    <div class="absolute inset-2 rounded-full border border-emerald-900/50" />

    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      class="relative z-10"
    >
      <style>{`
        @keyframes scaleIn {
          from { opacity:0; transform:scale(0.5) rotate(-15deg); }
          to   { opacity:1; transform:scale(1)   rotate(0deg);   }
        }
        @keyframes strokeCircle {
          from { stroke-dashoffset: 226; }
          to   { stroke-dashoffset: 0;   }
        }
        @keyframes strokeCheck {
          from { stroke-dashoffset: 60; opacity:0; }
          to   { stroke-dashoffset: 0;  opacity:1; }
        }
      `}</style>

      {/* Background tint */}
      <circle cx="40" cy="40" r="36" fill="rgba(16,185,129,0.06)" />

      {/* Animated border */}
      <circle
        cx="40"
        cy="40"
        r="36"
        stroke="#10b981"
        stroke-width="2"
        fill="none"
        stroke-dasharray="226"
        stroke-dashoffset="226"
        transform="rotate(-90 40 40)"
        style="animation: strokeCircle 0.6s 0.05s cubic-bezier(0.65,0,0.35,1) forwards"
      />

      {/* Check mark */}
      <path
        d="M24 41 L35 52 L56 28"
        stroke="#34d399"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
        stroke-dasharray="60"
        stroke-dashoffset="60"
        style="animation: strokeCheck 0.45s 0.55s cubic-bezier(0.65,0,0.35,1) forwards"
      />
    </svg>
  </div>
);
