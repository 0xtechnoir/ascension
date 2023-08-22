import { useEffect } from "react";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { GameMap } from "./GameMap";
import { useMUD } from "./MUDContext";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { Entity, Has, HasValue, getComponentValueStrict } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { ErrorWithShortMessage } from "./CustomTypes";

interface GameBoardProps {
  handleError: (message: string, actionButtonText?: string, onActionButtonClick?: () => void) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ handleError }) =>  {
  
  const {
    components: { MapConfig, Player, Position, Health, Range, ActionPoint, Turn, GameStartTime },
    network: { playerEntity },
    systemCalls: { 
       spawn,
       startMatch,
       increaseRange,
      },
  } = useMUD();

  const { moveMessage, clearMoveMessage } = useKeyboardMovement();
  useEffect(() => {
    console.log("moveMessage: ", moveMessage);
    if (moveMessage) {
      console.log("moveMessage: ", moveMessage);
      // When setting the error message, add the new message to the existing array instead of replacing it.
      handleError(moveMessage);
      clearMoveMessage();
    }
  }, [moveMessage]);

  // Add event listener for the Escape key
  // useEffect(() => {
  //   const handleEscape = (event: KeyboardEvent) => {
  //     if (event.code === 'Escape') {
  //       setShowModal(false);
  //     }
  //   };
  //   window.addEventListener("keydown", handleEscape);

  //   return () => {
  //     window.removeEventListener("keydown", handleEscape);
  //   };
  // }, []);

  // const playerHealth = useComponentValue(Health, playerEntity)?.value;
  // const shipRange = useComponentValue(Range, playerEntity)?.value;
  // const actionPoint = useComponentValue(ActionPoint, playerEntity)?.value;
  const turn = useComponentValue(Turn, singletonEntity)?.value;
  const gameStartTime = useComponentValue(GameStartTime, singletonEntity)?.value;

  let startDate, startTime;

  if (gameStartTime) { // Checking if the gameStartTime exists
    const num = Number(gameStartTime)
    let dateObj = new Date(num);
    startDate = dateObj.toLocaleDateString(); // This gives you a string in the form MM/DD/YYYY
    startTime = dateObj.toLocaleTimeString(); // This gives you a string in the form HH:MM:SS
  } 

  const players = useEntityQuery([
      Has(Player), 
      Has(Position)
    ])
    .map((entity) => {
      const position = getComponentValueStrict(Position, entity);
      return {
        entity,
        x: position.x,
        y: position.y,
        emoji: entity === playerEntity ? "🚀" : "🛸",
      };
    }
  );

  const donateActionPoint = async (player: Entity) => {
    console.log("donateActionPoint called with player: ", player);
  }

   // Function to handle the button click
  const selectPlayer = (inputX: number, inputY: number) => {
    
    const player = players.find(player => {
      const position = getComponentValueStrict(Position, player.entity);
      return position.x === inputX && position.y === inputY;
    });

    if(player) {
      handleError('Donate an action point to this player.', 'Donate Action Point', () => donateActionPoint(player.entity));
    }
  };

  
  const start = async () => {
    console.log("players: ", players);
    const playersSpawned = players.length;
    const startTime = Date.now();     
    try {
      await startMatch(playersSpawned, startTime)
    } catch (error){
      if (typeof error === 'object' && error !== null) {
        const message = (error as ErrorWithShortMessage).shortMessage;
        handleError(message);
      }
    }  
  }

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
 
  // Only allow the player to spawn if they haven't already spawned.
  const canSpawn = useComponentValue(Player, playerEntity)?.value != true;
  // Get the map config from the singleton entity.
  const mapConfig = useComponentValue(MapConfig, singletonEntity);
  if (mapConfig == null) {
    throw new Error("map config not set or not ready, only use this hook after loading state === LIVE");
  }
  const { width , height } = mapConfig;

  return (
    <div>
      <GameMap 
        width={width}
        height={height}
        onTileClick={canSpawn ? spawn : selectPlayer} 
        players={players}
      />
      <button onClick={start} style={{backgroundColor: 'blue', color: 'white'}}>Start Match</button>
      <br/>
      <button onClick={boostRange} style={{backgroundColor: 'blue', color: 'white'}}>Increase Range (Requires 1 AP)</button>
      {/* <div>Ship Health: {playerHealth}</div>
      <div>Ship Range: {shipRange}</div>
      <div>Action Points: {actionPoint}</div> */}
      <div>Turn: {turn}</div>
      <div>
        {
          gameStartTime && startDate && startTime
          ? `Game Start Date: ${startDate}, Time: ${startTime}`
          : ''
        }
      </div>
    </div>
  )
};
