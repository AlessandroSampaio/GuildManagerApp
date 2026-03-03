function fmtMs(ms: number) {
  const m = Math.floor(ms / 60000);
  const ss = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${m}:${ss}`;
}
const DIFF: Record<number, string> = { 3: "Normal", 4: "Heroic", 5: "Mythic" };
const diffLabel = (d: number) => DIFF[d] ?? `Diff ${d}`;

function roleClass(role: string) {
  switch (role.toLowerCase()) {
    case "dps":
      return "tag-dps";
    case "healer":
      return "tag-healer";
    case "tank":
      return "tag-tank";
    default:
      return "tag-neutral";
  }
}

export { fmtMs, diffLabel, roleClass };
