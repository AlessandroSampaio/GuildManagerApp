export const DIFF: Record<number, string> = {
  3: "Normal",
  4: "Heroic",
  5: "Mythic",
};
export const DELAY_SUCCESS = 3;
export const DELAY_FAILURE = 5;
export const WOW_CLASSES = [
  "DeathKnight",
  "DemonHunter",
  "Druid",
  "Evoker",
  "Hunter",
  "Mage",
  "Monk",
  "Paladin",
  "Priest",
  "Rogue",
  "Shaman",
  "Warlock",
  "Warrior",
];

export const diffLabel = (d: number) => DIFF[d] ?? `Diff ${d}`;
