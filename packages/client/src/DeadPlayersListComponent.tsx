import React from "react";
import { Entity } from "@latticexyz/recs";
import { DeadPlayer } from "./DeadPlayer";

type DeadPlayersListComponentProps = {
  players: Entity[];
  highlightedPlayer: Entity | null;
  setHighlightedPlayer: (player: Entity | null) => void;
};

export const DeadPlayersListComponent: React.FC<DeadPlayersListComponentProps> = ({
  players,
  highlightedPlayer,
  setHighlightedPlayer,
}) => {

  return (
    <div className="flex flex-col items-start border border-gray-300 p-3 rounded-md my-1">
      <h1>Dead Players</h1>
      <p>Click to highlight on map</p>
      <p>-----------------------------------</p>
      <br />
      {players.map((player) => {
        const entity = player;
        return <DeadPlayer
          key={entity}
          entity={entity}
          setHighlightedPlayer={setHighlightedPlayer}
          highlightedPlayer={highlightedPlayer}
        />
      })}
    </div>
  )
};
