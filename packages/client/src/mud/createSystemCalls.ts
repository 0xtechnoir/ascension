import { getComponentValue, Has, HasValue } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { useEntityQuery } from "@latticexyz/react";
 
export type SystemCalls = ReturnType<typeof createSystemCalls>;
 
export function createSystemCalls(
  { playerEntity, worldContract, waitForTransaction }: SetupNetworkResult,
  { MapConfig, Player, Position, GameIsLive }: ClientComponents) {

  const wrapPosition = (x: number, y: number) => {
    const mapConfig = getComponentValue(MapConfig, singletonEntity);
    if (!mapConfig) {
      throw new Error("mapConfig no yet loaded or initialized");
    }
    return [(x + mapConfig.width) % mapConfig.width, (y + mapConfig.height) % mapConfig.height];
  };
 
  const moveTo = async (inputX: number, inputY: number) => {
    console.log("moveTo called")
    if (!playerEntity) {
      throw new Error("no player");
    }

    const [x, y] = wrapPosition(inputX, inputY);

    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: playerEntity,
      value: { x, y },
    });
 
    try {
      const tx = await worldContract.write.move([x, y]);
      await waitForTransaction(tx);
    } catch (error) {
      console.log("error: ", error);
      throw error;
    } finally {
      Position.removeOverride(positionId);
    }
  };

  const increaseRange = async () => {
    console.log("increaseRange called")
    if (!playerEntity) {
      throw new Error("no player");
    }
    const tx = await worldContract.write.increaseRange();
    await waitForTransaction(tx);
  }

  const startMatch = async (playersSpawned: number, startTime: number) => {
    console.log("startTime type: ", typeof startTime);
    const bigIntStartTime = BigInt(startTime);
    const tx = await worldContract.write.startMatch([playersSpawned, bigIntStartTime]);
    await waitForTransaction(tx);

    setInterval(() => {
      incrementTurn();
    }, 10000);
  }

  const incrementTurn = async () => {
    console.log("incrementTurn called")
    // const tx = await worldSend("incrementTurn", []);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    const tx = await worldContract.write.incrementTurn();
    await waitForTransaction(tx);
  }
 
  const moveBy = async (deltaX: number, deltaY: number) => {
    console.log("moveBy called")
    if (!playerEntity) {
      throw new Error("no player");
    }
    
    const playerPosition = getComponentValue(Position, playerEntity);
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }
 
    await moveTo(playerPosition.x + deltaX, playerPosition.y + deltaY);
  };

  
  // simple function to display another platers playerId when their current tile is clicked on
  // const displayPlayerId = async (inputX: number, inputY: number) => {
  //   console.log("displayPlayerId called with coordinates: ", inputX, " ,", inputY);
  //   // check if there is a player at the clicked on tile
  //   try {
  //     const tx = await worldContract.write.getPlayerAtPosition([inputX, inputY]);
  //     await waitForTransaction(tx);
  //     console.log("tx: ", tx);
  //   } catch (error) {
  //     console.log("caught error in createSystemCalls.ts: ", error);
  //   }
  // }


  const spawn = async (inputX: number, inputY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    console.log("playerEntity: ", playerEntity);
 
    const canSpawn = getComponentValue(Player, playerEntity)?.value !== true;
    if (!canSpawn) {
      throw new Error("already spawned");
    }
 
    const [x, y] = wrapPosition(inputX, inputY);
 
    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: playerEntity,
      value: { x, y },
    });
    const playerId = uuid();
    Player.addOverride(playerId, {
      entity: playerEntity,
      value: { value: true },
    });
 
    try {
      const tx = await worldContract.write.spawn([x, y]);
      await waitForTransaction(tx);
      console.log("Spawn tx: ", tx);
    } finally {
      Position.removeOverride(positionId);
      Player.removeOverride(playerId);
    }
  };
 
  return {
    moveTo,
    moveBy,
    spawn,
    startMatch,
    increaseRange,
   };
}