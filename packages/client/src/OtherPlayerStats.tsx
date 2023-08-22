import React from 'react';
import { useMUD } from "./MUDContext";
import { useComponentValue } from '@latticexyz/react';
import { Entity, Has, HasValue, getComponentValueStrict } from "@latticexyz/recs";

type OtherPlayersStatsProps = {
  players: Entity[];
};

export const OtherPlayersStats: React.FC<OtherPlayersStatsProps> = ({ players }) => {

    const {
        components: { SyncProgress, Health, Range, ActionPoint, Player, Position },
        network: { playerEntity },
      } = useMUD();

    const mappedPlayers = players.map((playerEntity) => {
        const health = useComponentValue(Health, playerEntity)?.value;
        const range = useComponentValue(Range, playerEntity)?.value;
        const ap = useComponentValue(ActionPoint, playerEntity)?.value;
        return {
            playerEntity,
            health: health,
            range: range,
            actionPoints: ap,
        };
    })

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', width: '250px', margin: '16px 0' }}>
      <h3>Other Players</h3>
      {mappedPlayers.map(player => (
        
        <div key={player.playerEntity} style={{ marginBottom: '12px' }}>
          <div>Ship Health: {player.health}</div>
          <div>Ship Range: {player.range}</div>
          <div>Action Points: {player.actionPoints}</div>

        </div>
      ))}
    </div>
  );
};
