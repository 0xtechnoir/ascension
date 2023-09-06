import React from "react";
import { Entity } from "@latticexyz/recs";
import { LivePlayer } from "./LivePlayer";
import { useMUD } from "./MUDContext";

type LivePlayersListComponentProps = {
  players: Entity[];
  highlightedPlayer: Entity | null;
  setHighlightedPlayer: (player: Entity | null) => void;
};

export const LivePlayersListComponent: React.FC<
  LivePlayersListComponentProps
> = ({ players, highlightedPlayer, setHighlightedPlayer }) => {
  const {
    network: { playerEntity },
  } = useMUD();

  // Sort players so that your player comes first
  const sortedPlayers = [...players].sort((a, b) => {
    if (a === playerEntity) return -1;
    if (b === playerEntity) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col items-start border border-gray-300 p-3 rounded-md my-1">
      <h1>Live Players: 🛸</h1>
      <p>Click to highlight on map</p>
      <p>-----------------------------------</p>
      <br />

      {sortedPlayers.map((player) => {
        const entity = player;
        return (
          <LivePlayer
            key={entity}
            entity={entity}
            setHighlightedPlayer={setHighlightedPlayer}
            highlightedPlayer={highlightedPlayer}
          />
        );
      })}
    </div>
  );
};
