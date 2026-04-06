import { Component, For, Show, createMemo, createSignal } from "solid-js";

export interface SimplifiedRow {
  playerName: string;
  totalPoints: number;
  fightPoints: Map<string, number>;
  penaltyTotal: number;
}

interface Props {
  fightNames: string[];
  rows: SimplifiedRow[];
}

type SortKey = "player" | "penalty" | "total" | string;
type SortDir = "asc" | "desc";

function SortIcon(p: { active: boolean; dir: SortDir }) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="currentColor"
      class={`inline-block ml-1 transition-colors ${p.active ? "opacity-100" : "opacity-30"}`}
      aria-hidden="true"
    >
      {p.dir === "asc" || !p.active ? (
        <path d="M4 1L7 6H1L4 1Z" class={p.active && p.dir === "asc" ? "" : "opacity-40"} />
      ) : null}
      {p.dir === "desc" || !p.active ? (
        <path d="M4 7L1 2H7L4 7Z" class={p.active && p.dir === "desc" ? "" : "opacity-40"} />
      ) : null}
    </svg>
  );
}

function fightPointColor(value: number, max: number): string {
  if (max === 0) return "text-stone-500";
  const ratio = value / max;
  if (ratio >= 0.9) return "text-amber-300";
  if (ratio >= 0.75) return "text-emerald-400";
  if (ratio >= 0.5) return "text-sky-400";
  if (ratio >= 0.25) return "text-stone-300";
  return "text-stone-500";
}

const PlayerScoringSimplifiedView: Component<Props> = (props) => {
  const [sortKey, setSortKey] = createSignal<SortKey>("total");
  const [sortDir, setSortDir] = createSignal<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey() === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sortedRows = createMemo(() => {
    const key = sortKey();
    const dir = sortDir();
    return [...props.rows].sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      if (key === "player") {
        av = a.playerName.toLowerCase();
        bv = b.playerName.toLowerCase();
      } else if (key === "penalty") {
        av = a.penaltyTotal;
        bv = b.penaltyTotal;
      } else if (key === "total") {
        av = a.totalPoints;
        bv = b.totalPoints;
      } else {
        av = a.fightPoints.get(key) ?? -Infinity;
        bv = b.fightPoints.get(key) ?? -Infinity;
      }
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
  });

  const fightMaxes = createMemo(() => {
    const map = new Map<string, number>();
    for (const name of props.fightNames) {
      let max = 0;
      for (const row of props.rows) {
        const v = row.fightPoints.get(name);
        if (v !== undefined && v > max) max = v;
      }
      map.set(name, max);
    }
    return map;
  });

  return (
    <div class="overflow-x-auto border border-void-700">
      <table class="w-full text-left border-collapse font-mono text-xs">
        <thead>
          <tr class="bg-void-800 border-b border-void-600">
            <th
              class="px-3 py-2 text-stone-400 font-semibold tracking-wider whitespace-nowrap sticky left-0 bg-void-800 z-10 border-r border-void-700 cursor-pointer select-none hover:text-stone-200 transition-colors"
              onClick={() => toggleSort("player")}
            >
              Player
              <SortIcon active={sortKey() === "player"} dir={sortDir()} />
            </th>
            <For each={props.fightNames}>
              {(name) => (
                <th
                  class="px-3 py-2 text-stone-500 font-normal tracking-wide whitespace-nowrap text-center max-w-[100px] cursor-pointer select-none hover:text-stone-300 transition-colors"
                  onClick={() => toggleSort(name)}
                >
                  <span class="block truncate max-w-[96px]" title={name}>
                    {name}
                  </span>
                  <SortIcon active={sortKey() === name} dir={sortDir()} />
                </th>
              )}
            </For>
            <th
              class="px-3 py-2 text-stone-400 font-semibold tracking-wider whitespace-nowrap text-right border-l border-void-700 cursor-pointer select-none hover:text-stone-200 transition-colors"
              onClick={() => toggleSort("penalty")}
            >
              Penalidades
              <SortIcon active={sortKey() === "penalty"} dir={sortDir()} />
            </th>
            <th
              class="px-3 py-2 text-stone-200 font-bold tracking-wider whitespace-nowrap text-right border-l border-void-600 cursor-pointer select-none hover:text-white transition-colors"
              onClick={() => toggleSort("total")}
            >
              Total
              <SortIcon active={sortKey() === "total"} dir={sortDir()} />
            </th>
          </tr>
        </thead>
        <tbody>
          <For each={sortedRows()}>
            {(row, i) => (
              <tr
                class={`border-b border-void-800 ${
                  i() % 2 === 0 ? "bg-void-900/40" : "bg-void-950/60"
                } hover:bg-void-700/30 transition-colors`}
              >
                <td
                  class={`px-3 py-2 text-stone-200 font-semibold whitespace-nowrap sticky left-0 z-10 border-r border-void-700 ${
                    i() % 2 === 0 ? "bg-void-900/40" : "bg-void-950/60"
                  }`}
                >
                  <span class="text-stone-500 mr-2 text-[10px]">{i() + 1}.</span>
                  {row.playerName}
                </td>
                <For each={props.fightNames}>
                  {(name) => {
                    const value = row.fightPoints.get(name);
                    const max = fightMaxes().get(name) ?? 0;
                    return (
                      <td class="px-3 py-2 text-center tabular-nums">
                        <Show
                          when={value !== undefined}
                          fallback={<span class="text-void-500">—</span>}
                        >
                          <span class={`font-medium ${fightPointColor(value!, max)}`}>
                            {value}
                          </span>
                        </Show>
                      </td>
                    );
                  }}
                </For>
                <td
                  class={`px-3 py-2 text-right border-l border-void-700 tabular-nums ${
                    row.penaltyTotal < 0 ? "text-red-400" : "text-stone-500"
                  }`}
                >
                  <Show
                    when={row.penaltyTotal !== 0}
                    fallback={<span class="text-void-500">—</span>}
                  >
                    {row.penaltyTotal}
                  </Show>
                </td>
                <td class="px-3 py-2 text-right font-bold text-stone-100 border-l border-void-600 tabular-nums">
                  {row.totalPoints}
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};

export default PlayerScoringSimplifiedView;
