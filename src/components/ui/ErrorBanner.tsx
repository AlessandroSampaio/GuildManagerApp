import { Component } from "solid-js";

export const ErrorBanner: Component<{ message: string }> = (p) => (
  <div class="bg-red-950/70 border border-red-900 px-4 py-3 animate-fade-in">
    <p class="font-mono text-xs text-red-400">{p.message}</p>
  </div>
);
