import React from 'react';

type PlayerStatsProps = {
  health: number | undefined;
  range: number | undefined;
  actionPoints: number | undefined;
};

export const PlayerStats: React.FC<PlayerStatsProps> = ({ health, range, actionPoints }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', width: '200px', margin: '16px 0' }}>
      <strong>My Stats:</strong>
      <div>
        <p>Ship Health: {health}</p>
        <p>Ship Range: {range}</p>
        <p>Action Points: {actionPoints}</p> 
      </div>
    </div>
  );
};
