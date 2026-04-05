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

const RAIDERIO_SCORE_COLORS: [number, string][] = [
  [3750, "#ff8000"], [3690, "#fe7e16"], [3665, "#fd7c23"], [3640, "#fc7a2c"],
  [3615, "#fa7735"], [3595, "#f9753d"], [3570, "#f87344"], [3545, "#f6714a"],
  [3520, "#f56f51"], [3495, "#f36d57"], [3475, "#f26a5d"], [3450, "#f06863"],
  [3425, "#ee6669"], [3400, "#ed646f"], [3375, "#eb6274"], [3355, "#e95f7a"],
  [3330, "#e75d7f"], [3305, "#e55b85"], [3280, "#e3598b"], [3255, "#e05790"],
  [3235, "#de5596"], [3210, "#dc539b"], [3185, "#d950a1"], [3160, "#d64ea6"],
  [3135, "#d34cac"], [3115, "#d04ab1"], [3090, "#cd48b7"], [3065, "#ca46bc"],
  [3040, "#c744c2"], [3015, "#c342c7"], [2995, "#bf40cd"], [2970, "#bb3ed2"],
  [2945, "#b73cd8"], [2920, "#b23add"], [2895, "#ae38e3"], [2875, "#a837e8"],
  [2850, "#a335ee"], [2815, "#9940ec"], [2790, "#8e49ea"], [2770, "#8351e8"],
  [2745, "#7858e6"], [2720, "#6a5ee5"], [2695, "#5c63e3"], [2670, "#4b68e1"],
  [2650, "#346cdf"], [2625, "#0070dd"], [2560, "#1a73da"], [2535, "#2777d6"],
  [2510, "#307ad2"], [2485, "#377dcf"], [2465, "#3d81cb"], [2440, "#4284c8"],
  [2415, "#4787c4"], [2390, "#4b8bc1"], [2365, "#4e8ebd"], [2345, "#5192ba"],
  [2320, "#5495b6"], [2295, "#5698b2"], [2270, "#589caf"], [2245, "#5a9fab"],
  [2225, "#5ba3a7"], [2200, "#5ca6a3"], [2175, "#5daaa0"], [2150, "#5ead9c"],
  [2125, "#5fb198"], [2105, "#5fb494"], [2080, "#5fb890"], [2055, "#5fbb8c"],
  [2030, "#5fbf88"], [2005, "#5fc284"], [1985, "#5ec67f"], [1960, "#5dc97b"],
  [1935, "#5ccd76"], [1910, "#5bd072"], [1885, "#59d46d"], [1865, "#57d768"],
  [1840, "#55db63"], [1815, "#53df5e"], [1790, "#50e258"], [1765, "#4de652"],
  [1745, "#49e94c"], [1720, "#45ed45"], [1695, "#40f03d"], [1670, "#3af434"],
  [1645, "#33f82a"], [1625, "#2afb1c"], [1600, "#1eff00"], [1575, "#2dff14"],
  [1550, "#38ff20"], [1525, "#42ff29"], [1500, "#4aff30"], [1475, "#51ff37"],
  [1450, "#58ff3d"], [1425, "#5eff43"], [1400, "#63ff48"], [1375, "#69ff4d"],
  [1350, "#6eff52"], [1325, "#73ff56"], [1300, "#77ff5b"], [1275, "#7cff5f"],
  [1250, "#80ff64"], [1225, "#84ff68"], [1200, "#89ff6c"], [1175, "#8cff70"],
  [1150, "#90ff74"], [1125, "#94ff78"], [1100, "#98ff7c"], [1075, "#9bff80"],
  [1050, "#9fff84"], [1025, "#a2ff88"], [1000, "#a6ff8c"], [975, "#a9ff8f"],
  [950, "#acff93"], [925, "#b0ff97"], [900, "#b3ff9b"], [875, "#b6ff9e"],
  [850, "#b9ffa2"], [825, "#bcffa6"], [800, "#bfffa9"], [775, "#c2ffad"],
  [750, "#c5ffb0"], [725, "#c8ffb4"], [700, "#cbffb8"], [675, "#ceffbb"],
  [650, "#d0ffbf"], [625, "#d3ffc2"], [600, "#d6ffc6"], [575, "#d9ffca"],
  [550, "#dbffcd"], [525, "#deffd1"], [500, "#e1ffd4"], [475, "#e3ffd8"],
  [450, "#e6ffdb"], [425, "#e9ffdf"], [400, "#ebffe3"], [375, "#eeffe6"],
  [350, "#f0ffea"], [325, "#f3ffed"], [300, "#f5fff1"], [275, "#f8fff4"],
  [250, "#fafff8"], [225, "#fdfffb"], [200, "#ffffff"],
];

export function raiderIoScoreColor(score: number): string {
  for (const [threshold, color] of RAIDERIO_SCORE_COLORS) {
    if (score >= threshold) return color;
  }
  return "#9d9d9d";
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
