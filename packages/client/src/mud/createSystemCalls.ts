import { getComponentValue, Entity } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity } from "@latticexyz/store-sync/recs";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { playerEntity, worldContract, waitForTransaction }: SetupNetworkResult,
  { MapConfig, Player, Position }: ClientComponents
) {
  const wrapPosition = (x: number, y: number) => {
    const mapConfig = getComponentValue(MapConfig, singletonEntity);
    if (!mapConfig) {
      throw new Error("mapConfig no yet loaded or initialized");
    }
    return [
      (x + mapConfig.width) % mapConfig.width,
      (y + mapConfig.height) % mapConfig.height,
    ];
  };

  const vote = async (recipient: Entity, gameId: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const tx = await worldContract.write.vote([
      bigIntTimestamp,
      recipient,
      gameId,
    ]);
    await waitForTransaction(tx);
  };

  const sendActionPoint = async (recipient: Entity, gameId: number) => {
    console.log("sendActionPoint called with recipient: ", recipient);
    console.log("sendActionPoint called with gameId: ", gameId);
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const tx = await worldContract.write.sendActionPoint([
      bigIntTimestamp,
      recipient,
      gameId,
    ]);
    await waitForTransaction(tx);
  };

  const attack = async (target: Entity, gameId: number) => {
    console.log("attack called");
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const tx = await worldContract.write.attackPlayer([
      bigIntTimestamp,
      target,
      gameId,
    ]);
    await waitForTransaction(tx);
  };

  const increaseRange = async (gameId: number) => {
    console.log("increaseRange called");
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const tx = await worldContract.write.increaseRange([bigIntTimestamp, gameId]);
    await waitForTransaction(tx);
  };

  const startMatch = async (gameId: number, playersSpawned: number, startTime: number) => {
    console.log("startMatch called");
    const bigIntStartTime = BigInt(startTime);
    const tx = await worldContract.write.startMatch([
      gameId,
      playersSpawned,
      bigIntStartTime,
    ]);
    const res = await waitForTransaction(tx);
  };

  const moveBy = async (deltaX: number, deltaY: number, gameId: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const playerPosition = getComponentValue(Position, playerEntity);
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }

    // optimitsic render
    const [x, y] = wrapPosition(playerPosition.x + deltaX, playerPosition.y + deltaY);
    const positionId = uuid();
    try {
      Position.addOverride(positionId, {
        entity: playerEntity,
        value: { x, y },
      });
    } catch (error) {
      console.log("Optimistic render error: ", error);
      throw error;
    }

    try {
      const bigIntTimestamp = BigInt(Date.now());
      const tx = await worldContract.write.move([bigIntTimestamp, deltaX, deltaY, gameId]);
      await waitForTransaction(tx);
    } catch (error) {
      console.log("error: ", error);
      throw error;
    } finally {
      Position.removeOverride(positionId);
    }
  };

  const spawn = async (username: string, gameId: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const playerId = uuid();
    Player.addOverride(playerId, {
      entity: playerEntity,
      value: { value: true },
    });

    try {
      const tx = await worldContract.write.spawn([bigIntTimestamp, username, gameId]);
      await waitForTransaction(tx);
    } catch (error) {
      throw error;
    } finally {
      Player.removeOverride(playerId);
    }
  };
  
  const leaveGame = async (gameId: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    try {
      const tx = await worldContract.write.leaveGame([bigIntTimestamp, gameId]);
      await waitForTransaction(tx);
    } catch (error) {
      throw error;
    }
  };

  const claimActionPoint = async (gameId: number) => {
    if (!gameId) {
      throw new Error("no gameId found");
    }
    if (!playerEntity) {
      throw new Error("no player found");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const tx = await worldContract.write.claimActionPoint([bigIntTimestamp, gameId]);
    await waitForTransaction(tx);
  };

  const claimVotingPoint = async (gameId: number) => {
    console.log("claimVotingPoint called");
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const tx = await worldContract.write.claimVotingPoint([bigIntTimestamp, gameId]);
    await waitForTransaction(tx);
  };

  return {
    moveTo,
    moveBy,
    spawn,
    startMatch,
    increaseRange,
    sendActionPoint,
    attack,
    vote,
    claimActionPoint,
    claimVotingPoint,
    leaveGame,
  };
}
