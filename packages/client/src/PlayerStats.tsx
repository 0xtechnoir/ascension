import React from 'react';
import { useComponentValue } from "@latticexyz/react";
import { ErrorWithShortMessage } from "./CustomTypes";
import { useMUD } from "./MUDContext";

type PlayerStatsProps = {
    handleError: (message: string, actionButtonText?: string, onActionButtonClick?: () => void) => void;
};

export const PlayerStats: React.FC<PlayerStatsProps> = ({ handleError }) => {
    
    const {
        components: { Health, Range, ActionPoint, Username },
        network: { playerEntity },
        systemCalls: { 
           increaseRange,
          },
      } = useMUD();


    const playerName = useComponentValue(Username, playerEntity)?.value;
    const playerHealth = useComponentValue(Health, playerEntity)?.value;
    const shipRange = useComponentValue(Range, playerEntity)?.value;
    const actionPoint = useComponentValue(ActionPoint, playerEntity)?.value;

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
                <p></p>
                <p>Player: {playerName}</p>
                <p>Health: {playerHealth}</p>
                <p>Range: {shipRange}</p>
                <p>Action Points: {actionPoint}</p> 
                <button onClick={boostRange} style={{backgroundColor: 'grey', color: 'white'}}>Increase Range (Requires 1 AP)</button>
            </div>
        </div>
    );
};
