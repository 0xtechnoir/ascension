import React from "react";
import { useMUD } from "./MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";

type OtherPlayersStatsProps = {
  players: Entity[];
  highlightedPlayer: Entity | null;
  setHighlightedPlayer: (player: Entity | null) => void;
};

export const OtherPlayersStats: React.FC<OtherPlayersStatsProps> = ({ players, highlightedPlayer, setHighlightedPlayer }) => {

    const {
        components: { Health, Range, ActionPoint, Username },
    } = useMUD();

    const mappedPlayers = players.map((player) => {
        const entity = player;
        const username = useComponentValue(Username, player)?.value;
        const health = useComponentValue(Health, player)?.value;
        const range = useComponentValue(Range, player)?.value;
        const ap = useComponentValue(ActionPoint, player)?.value;

        return {
          entity,
          username: username,
          health: health,
          range: range,
          actionPoints: ap,
        };
    });

    console.log("mappedPlayers: ", mappedPlayers);

    return (
      <div className="flex flex-col items-start">
        <h2>Other Players:</h2>
        {mappedPlayers.map((mappedPlayer) => {
            console.log("mappedPlayer: ", mappedPlayer);
          return (
            <div
              key={mappedPlayer.entity}
              style={{
                backgroundColor: mappedPlayer.entity === highlightedPlayer ? "lightgray" : "transparent",
                cursor: 'pointer'
              }}
              onClick={() => {
                if (highlightedPlayer === mappedPlayer.entity) {
                  setHighlightedPlayer(null);
                } else {
                  setHighlightedPlayer(mappedPlayer.entity);
                }
              }}
            >
              <p>Name: {mappedPlayer.username}</p>
              <p>Health: {mappedPlayer.health}</p>
              <p>Range: {mappedPlayer.range}</p>
              <p>Action Points: {mappedPlayer.actionPoints}</p>
            </div>
          );
        })}
      </div>
    );
  };