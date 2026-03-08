export function tierColor(points: number): string {
  if (points >= 100)
    return "text-amber-300 bg-amber-950/40 border-amber-800/60";
  if (points >= 75) return "text-amber-400 bg-amber-950/30 border-amber-900/50";
  if (points >= 50)
    return "text-emerald-400 bg-emerald-950/30 border-emerald-900/50";
  if (points >= 25) return "text-blue-400 bg-blue-950/30 border-blue-900/50";
  return "text-stone-400 bg-void-800/50 border-void-600";
}

export function tierBarColor(points: number): string {
  if (points >= 100) return "bg-amber-300";
  if (points >= 75) return "bg-amber-500";
  if (points >= 50) return "bg-emerald-500";
  if (points >= 25) return "bg-blue-400";
  return "bg-stone-500";
}
