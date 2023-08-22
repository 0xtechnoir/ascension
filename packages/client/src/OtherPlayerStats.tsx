import React from "react";
import { useMUD } from "./MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";

type OtherPlayersStatsProps = {
  players: Entity[];
};

export const OtherPlayersStats: React.FC<OtherPlayersStatsProps> = ({
  players,
}) => {
  const {
    components: { Health, Range, ActionPoint, Username },
  } = useMUD();

  const mappedPlayers = players.map((playerEntity) => {
    const username = useComponentValue(Username, playerEntity)?.value;
    const health = useComponentValue(Health, playerEntity)?.value;
    const range = useComponentValue(Range, playerEntity)?.value;
    const ap = useComponentValue(ActionPoint, playerEntity)?.value;
    return {
      playerEntity,
      username: username,
      health: health,
      range: range,
      actionPoints: ap,
    };
  });

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        width: "250px",
        margin: "16px 0",
      }}
    >
      <strong>Other Players</strong>
      <br />
      <br />
      {mappedPlayers.map((player) => (
        <div key={player.playerEntity} style={{ marginBottom: "12px" }}>
          <p>Player: {player.username}</p>
          <p>Ship Health: {player.health}</p>
          <p>Ship Range: {player.range}</p>
          <p>Action Points: {player.actionPoints}</p>
          <br />
        </div>
      ))}
    </div>
  );
};
