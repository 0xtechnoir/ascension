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
        components: { Health, Range, ActionPoint, Username, Alive },
        systemCalls: { sendActionPoint, attack },
    } = useMUD();

    const mappedPlayers = players.map((player) => {
        const entity = player;
        const username = useComponentValue(Username, player)?.value;
        const health = useComponentValue(Health, player)?.value;
        const range = useComponentValue(Range, player)?.value;
        const ap = useComponentValue(ActionPoint, player)?.value;
        const alive = useComponentValue(Alive, player)?.value;

        return {
          entity,
          username: username,
          health: health,
          range: range,
          actionPoints: ap,
          alive: alive,
        };
    });

    return (
      <div className="flex flex-col items-start" style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', margin: '16px 0' }}>
        <h2>Other Players:</h2>
        <br />
        {mappedPlayers.map((mappedPlayer) => {
          return (
            <div
              key={mappedPlayer.entity}
              style={{
                backgroundColor: mappedPlayer.entity === highlightedPlayer ? "darkgray" : "transparent",
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
              <p>Status: {mappedPlayer.alive ? `Alive` : `Dead`}</p>
              <p>Health: {mappedPlayer.health}</p>
              <p>Range: {mappedPlayer.range}</p>
              <p>Action Points: {mappedPlayer.actionPoints}</p>
              <div>
                <button 
                  className="h-10 px-6 font-semibold rounded-md border border-slate-200 text-slate-300"
                  type="button"
                  onClick={() => {
                    if (highlightedPlayer) {
                      sendActionPoint(highlightedPlayer)
                    }
                  }} 
                >
                  Donate Action Point
                </button>
                <br />
                <button 
                  className="h-10 px-6 font-semibold rounded-md border border-slate-200 text-slate-300"
                  type="button"
                  onClick={() => {
                    if (highlightedPlayer) {
                      attack(highlightedPlayer)
                    }
                  }} 
                >
                  Attack Player
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };