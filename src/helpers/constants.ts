export const DIFF: Record<number, string> = {
  3: "Normal",
  4: "Heroic",
  5: "Mythic",
};

export const diffLabel = (d: number) => DIFF[d] ?? `Diff ${d}`;
