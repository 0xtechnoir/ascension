import React from 'react';
import { ErrorWithShortMessage } from "./CustomTypes";
import { useMUD } from "./MUDContext";

type PlayerStatsProps = {
    health: number | undefined;
    range: number | undefined;
    actionPoints: number | undefined;
    handleError: (message: string, actionButtonText?: string, onActionButtonClick?: () => void) => void;
};


export const PlayerStats: React.FC<PlayerStatsProps> = ({ health, range, actionPoints, handleError }) => {
    
    const {
        components: { MapConfig, Player, Position, Health, Range, ActionPoint, Turn, GameStartTime },
        network: { playerEntity },
        systemCalls: { 
           increaseRange,
          },
      } = useMUD();

    const boostRange = async () => {
        try {
          await increaseRange()
        } catch (error){
          console.log("error: ", error)
          if (typeof error === 'object' && error !== null) {
            const message = (error as ErrorWithShortMessage).shortMessage;
            handleError(message);
          }
        }
    }
    
    return (
        <div className="flex" style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', margin: '16px 0' }}>
            <div className="flex-col mr-4">
            <strong>Ship Control:</strong>
                <br /><br />
                <p>Health: {health}</p>
                <p>Range: {range}</p>
                <p>Action Points: {actionPoints}</p> 
                <button onClick={boostRange} style={{backgroundColor: 'grey', color: 'white'}}>Increase Range (Requires 1 AP)</button>
            </div>
        </div>
    );
};
