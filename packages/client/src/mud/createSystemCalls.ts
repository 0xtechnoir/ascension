import { getComponentValue, Entity, Has, HasValue } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { useEntityQuery } from "@latticexyz/react";
 
export type SystemCalls = ReturnType<typeof createSystemCalls>;
 
export function createSystemCalls(
  { playerEntity, worldContract, waitForTransaction }: SetupNetworkResult,
  { MapConfig, Player, Position, GameIsLive, Health }: ClientComponents) {

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

  const sendActionPoint = async (recipient: Entity) => {
      if (!playerEntity) {
        throw new Error("no player");
      }
      const tx = await worldContract.write.sendActionPoint([recipient]);
      await waitForTransaction(tx);
  }

  const attack = async (target: Entity) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
    const tx = await worldContract.write.attackPlayer([target]);
    await waitForTransaction(tx);

    // we should now check if the player is dead and remove them from the game if so
    const targetHealth = getComponentValue(Health, target)?.value;
    if (targetHealth && targetHealth === 0) {
      console.log("target is dead");




    // we should also check to see if the game is over
    // if the game is over, we should call endGame


    }
  }

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
    }, 30000); // 30 seconds turn length
  }

  const incrementTurn = async () => {
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

  const spawn = async (inputX: number, inputY: number, username: string) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
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
      const tx = await worldContract.write.spawn([x, y, username]);
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
    sendActionPoint,
    attack,
   };
}