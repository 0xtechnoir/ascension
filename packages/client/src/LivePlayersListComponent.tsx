import React from "react";
import { Entity } from "@latticexyz/recs";
import { LivePlayer } from "./LivePlayer";

type LivePlayersListComponentProps = {
  handleError: (
    message: string,
    actionButtonText?: string,
    onActionButtonClick?: () => void
  ) => void;
  players: Entity[];
  highlightedPlayer: Entity | null;
  setHighlightedPlayer: (player: Entity | null) => void;
};

export const LivePlayersListComponent: React.FC<LivePlayersListComponentProps> = ({
  handleError,
  players,
  highlightedPlayer,
  setHighlightedPlayer,
}) => {

  return (
    <div className="flex flex-col items-start border border-gray-300 p-3 rounded-md my-1">
      <h1>Live Players: 🛸</h1>
      <p>Click to highlight on map</p>
      <p>-----------------------------------</p>
      <br />
      
      {players.map((player) => {
        const entity = player;
        return <LivePlayer
          key={entity}
          entity={entity}
          setHighlightedPlayer={setHighlightedPlayer}
          highlightedPlayer={highlightedPlayer}
          handleError={handleError}
        />;
      })}
    </div>
  )
};
