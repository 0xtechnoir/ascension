import React from "react";
import { Entity } from "@latticexyz/recs";
import { Player } from "./Player";
import { useMUD } from "./MUDContext";

type PlayersListProps = {
  players: Entity[];
};

export const PlayersList: React.FC<PlayersListProps> = ({ players }) => {
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
    <div className="h-full items-start p-3 rounded-md">
      <h1 className="text-2xl font-bold text-white mb-4">Players: 🛸</h1>
      <i>Click a player to highlight them on the map</i>
      {sortedPlayers.map((player) => {
        const entity = player;
        return <Player key={entity} entity={entity} />;
      })}
    </div>
  );
};
