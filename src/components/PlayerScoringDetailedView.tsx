import { PlayerCard } from "@/components/PlayerCard";
import { PlayerScore } from "@/types/player-scoring";
import { Component, For } from "solid-js";

interface Props {
  players: PlayerScore[];
  raidWeekId: number;
}

const PlayerScoringDetailedView: Component<Props> = (props) => (
  <div class="space-y-3">
    <For each={props.players}>
      {(player, i) => (
        <PlayerCard
          player={player}
          rank={i() + 1}
          raidWeekId={props.raidWeekId}
        />
      )}
    </For>
  </div>
);

export default PlayerScoringDetailedView;
