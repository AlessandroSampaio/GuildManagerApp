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

const BACKGROUND_CLASS_COLORS: Record<string, string> = {
  DeathKnight: "bg-red-400",
  DemonHunter: "bg-purple-400",
  Druid: "bg-orange-400",
  Evoker: "bg-teal-400",
  Hunter: "bg-lime-400",
  Mage: "bg-sky-300",
  Monk: "bg-emerald-400",
  Paladin: "bg-paladin",
  Priest: "bg-white",
  Rogue: "bg-yellow-400",
  Shaman: "bg-blue-400",
  Warlock: "bg-violet-400",
  Warrior: "bg-orange-300",
};

const TEXT_CLASS_COLORS: Record<string, string> = {
  DeathKnight: "text-red-400",
  DemonHunter: "text-purple-400",
  Druid: "text-orange-400",
  Evoker: "text-teal-400",
  Hunter: "text-lime-400",
  Mage: "text-sky-300",
  Monk: "text-emerald-400",
  Paladin: "text-paladin",
  Priest: "text-white",
  Rogue: "text-yellow-400",
  Shaman: "text-blue-400",
  Warlock: "text-violet-400",
  Warrior: "text-orange-300",
};

export function backgroundClassColor(cls: string) {
  return BACKGROUND_CLASS_COLORS[cls.replace(/\s/g, "")] ?? "bg-stone-500";
}

export function classColor(cls: string) {
  return TEXT_CLASS_COLORS[cls.replace(/\s/g, "")] ?? "text-stone-400";
}

export function tierBadgeClass(points: number | null) {
  if (points === null) return "text-stone-600 bg-void-800 border-void-600";
  if (points >= 100)
    return "text-amber-300 bg-amber-950/40 border-amber-800/60";
  if (points >= 75) return "text-amber-400 bg-amber-950/30 border-amber-900/50";
  if (points >= 50)
    return "text-emerald-400 bg-emerald-950/30 border-emerald-900/50";
  if (points >= 25) return "text-blue-400 bg-blue-950/30 border-blue-900/50";
  return "text-stone-500 bg-void-800/50 border-void-700";
}
