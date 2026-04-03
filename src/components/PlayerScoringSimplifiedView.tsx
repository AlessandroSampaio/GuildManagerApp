import { Component, For, Show } from "solid-js";

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

const PlayerScoringSimplifiedView: Component<Props> = (props) => (
  <div class="overflow-x-auto border border-void-700">
    <table class="w-full text-left border-collapse font-mono text-xs">
      <thead>
        <tr class="bg-void-800 border-b border-void-600">
          <th class="px-3 py-2 text-stone-400 font-semibold tracking-wider whitespace-nowrap sticky left-0 bg-void-800 z-10 border-r border-void-700">
            Player
          </th>
          <For each={props.fightNames}>
            {(name) => (
              <th class="px-3 py-2 text-stone-500 font-normal tracking-wide whitespace-nowrap text-center max-w-[100px]">
                <span class="block truncate max-w-[96px]" title={name}>
                  {name}
                </span>
              </th>
            )}
          </For>
          <th class="px-3 py-2 text-stone-400 font-semibold tracking-wider whitespace-nowrap text-right border-l border-void-700">
            Penalidades
          </th>
          <th class="px-3 py-2 text-stone-200 font-bold tracking-wider whitespace-nowrap text-right border-l border-void-600">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        <For each={props.rows}>
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
                {(name) => (
                  <td class="px-3 py-2 text-center text-stone-400">
                    <Show
                      when={row.fightPoints.has(name)}
                      fallback={<span class="text-void-500">—</span>}
                    >
                      {row.fightPoints.get(name)}
                    </Show>
                  </td>
                )}
              </For>
              <td
                class={`px-3 py-2 text-right border-l border-void-700 ${
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
              <td class="px-3 py-2 text-right font-bold text-stone-100 border-l border-void-600">
                {row.totalPoints}
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  </div>
);

export default PlayerScoringSimplifiedView;
