import { Component, JSX } from "solid-js";

export const EmptyState: Component<{
  icon?: JSX.Element;
  title: string;
  subtitle?: string;
  action?: JSX.Element;
}> = (p) => (
  <div class="flex flex-col items-center justify-center py-14 text-center">
    <div class="text-white mb-4 opacity-60">
      {p.icon ?? (
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
        >
          <rect x="4" y="4" width="28" height="28" rx="2" />
          <line x1="12" y1="18" x2="24" y2="18" />
          <line x1="18" y1="12" x2="18" y2="24" />
        </svg>
      )}
    </div>
    <p class="text-stone-400 font-semibold text-sm">{p.title}</p>
    {p.subtitle && (
      <p class="text-stone-600 text-xs mt-1 font-mono">{p.subtitle}</p>
    )}
    {p.action && <div class="mt-5">{p.action}</div>}
  </div>
);
