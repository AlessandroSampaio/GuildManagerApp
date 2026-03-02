import { Component } from "solid-js";

export const SkeletonList: Component<{ rows?: number }> = (props) => (
  <div class="space-y-2">
    {Array.from({ length: props.rows ?? 4 }).map((_, i) => (
      <div
        class="h-[60px] bg-void-800 border border-void-700 animate-pulse"
        style={`animation-delay:${i * 60}ms`}
      />
    ))}
  </div>
);
