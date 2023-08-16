import { useState, useEffect } from "react";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { GameMap } from "./GameMap";
import { useMUD } from "./MUDContext";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";

export const GameBoard = () => {
  
  const {
    components: { MapConfig, Player, Position, Health, Range, ActionPoint, Turn, GameStartTime },
    network: { playerEntity },
    systemCalls: { 
       spawn,
       startMatch 
      },
  } = useMUD();

  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const moveMessage = useKeyboardMovement();

  useEffect(() => {
    if (moveMessage) {
      // When setting the error message, add the new message to the existing array instead of replacing it.
      setErrorMessage((prevMessages) => [...prevMessages, moveMessage]);
    }
  }, [moveMessage]);


  const playerHealth = useComponentValue(Health, playerEntity)?.value;
  const shipRange = useComponentValue(Range, playerEntity)?.value;
  const actionPoint = useComponentValue(ActionPoint, playerEntity)?.value;
  const turn = useComponentValue(Turn, singletonEntity)?.value;
  const gameStartTime = useComponentValue(GameStartTime, singletonEntity)?.value;

  let startDate, startTime;

  if (gameStartTime) { // Checking if the gameStartTime exists
    const num = Number(gameStartTime)
    let dateObj = new Date(num);
    startDate = dateObj.toLocaleDateString(); // This gives you a string in the form MM/DD/YYYY
    startTime = dateObj.toLocaleTimeString(); // This gives you a string in the form HH:MM:SS
  } 

  const players = useEntityQuery([Has(Player), Has(Position)]).map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    return {
      entity,
      x: position.x,
      y: position.y,
      emoji: entity === playerEntity ? "🚀" : "🛸",
    };
  });
  
  const start = async () => {
    console.log('starting match');
    console.log("players length: ", players.length);
    const playersSpawned = players.length;
    // const startTime = BigInt(Date.now()); 
    const startTime = Date.now(); 
    // deserialize startTime
    const serializedStartTime = startTime.toString();
    console.log("startTime: ", startTime)
    console.log("serializedStartTime: ", serializedStartTime)
    
    try {
      await startMatch(playersSpawned, startTime)
    } catch ( error: any ){
      setErrorMessage((prevMessages) => [...prevMessages, error]);
      console.log("Error calling startMatch. Reason: ", error);
    }  
  }

  const canSpawn = useComponentValue(Player, playerEntity)?.value != true;


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
        onTileClick={canSpawn ? spawn : undefined} 
        players={players}
      />
      <button onClick={start} style={{backgroundColor: 'blue', color: 'white'}}>Start Match</button>
          <div>Ship Health: {playerHealth}</div>
          <div>Ship Range: {shipRange}</div>
          <div>Action Points: {actionPoint}</div>
          <div>Turn: {turn}</div>
          <div>
            {
              gameStartTime && startDate && startTime
              ? `Game Start Date: ${startDate}, Time: ${startTime}`
              : ''
            }
          </div>
      <div>
        <h2>Ships Log:</h2>
        {
          // Map over the error messages and create a paragraph for each one.
          errorMessage.map((message, index) => (
            <p key={index}>{message}</p>
          ))
        }
      </div>
    </div>
  )
};
