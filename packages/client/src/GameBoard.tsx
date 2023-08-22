import { useEffect } from "react";
import { useComponentValue } from "@latticexyz/react";
import { GameMap } from "./GameMap";
import { useMUD } from "./MUDContext";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { Entity,getComponentValueStrict } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { ErrorWithShortMessage } from "./CustomTypes";

interface GameBoardProps {
  handleError: (message: string, actionButtonText?: string, onActionButtonClick?: () => void) => void;
  players: Entity[];
}

export const GameBoard: React.FC<GameBoardProps> = ({ handleError , players }) =>  {
  
  const {
    components: { MapConfig, Player, Position, Health, Range, ActionPoint, Turn, GameStartTime },
    network: { playerEntity },
    systemCalls: { 
       spawn,
       startMatch,
       increaseRange,
      },
  } = useMUD();

  const mappedPlayers = players.map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    return {
      entity,
      x: position.x,
      y: position.y,
      emoji: entity === playerEntity ? "🚀" : "🛸",
    };
  }
  );

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

  const turn = useComponentValue(Turn, singletonEntity)?.value;
  const gameStartTime = useComponentValue(GameStartTime, singletonEntity)?.value;

  let startDate, startTime;

  if (gameStartTime) {
    const num = Number(gameStartTime)
    let dateObj = new Date(num);
    startDate = dateObj.toLocaleDateString();
    startTime = dateObj.toLocaleTimeString(); 
  } 

  const donateActionPoint = async (player: Entity) => {
    console.log("donateActionPoint called with player: ", player);
  }

   // Function to handle the button click
  const selectPlayer = (inputX: number, inputY: number) => {
    
    const player = mappedPlayers.find(player => {
      const position = getComponentValueStrict(Position, player.entity);
      return position.x === inputX && position.y === inputY;
    });

    if(player) {
      handleError('Donate an action point to this player.', 'Donate Action Point', () => donateActionPoint(player.entity));
    }
  };

  const start = async () => {
    console.log("players: ", mappedPlayers);
    const playersSpawned = mappedPlayers.length;
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

  // const boostRange = async () => {
  //   try {
  //     await increaseRange()
  //   } catch (error){
  //     console.log("error: ", error)
  //     if (typeof error === 'object' && error !== null) {
  //       const message = (error as ErrorWithShortMessage).shortMessage;
  //       handleError(message);
  //     }
  //   }
  // }
 
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
      <div>Turn: {turn}</div>
      <GameMap 
        width={width}
        height={height}
        onTileClick={canSpawn ? spawn : selectPlayer} 
        players={mappedPlayers}
      />
      <button onClick={start} style={{backgroundColor: 'blue', color: 'white'}}>Start Match</button>
      <br/>
      {/* <button onClick={boostRange} style={{backgroundColor: 'blue', color: 'white'}}>Increase Range (Requires 1 AP)</button> */}
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
