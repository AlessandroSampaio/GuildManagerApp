import { Component } from "solid-js";

export const Spinner: Component<{ size?: number; class?: string }> = (p) => (
  <svg
    width={p.size ?? 16}
    height={p.size ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    class={`animate-spin ${p.class ?? ""}`}
  >
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.2" />
    <path d="M21 12a9 9 0 00-9-9" />
  </svg>
);
