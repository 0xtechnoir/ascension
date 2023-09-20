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

  const vote = async (recipient: Entity) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const tx = await worldContract.write.vote([
      bigIntTimestamp,
      recipient,
    ]);
    await waitForTransaction(tx);
  };

  const sendActionPoint = async (recipient: Entity) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const tx = await worldContract.write.sendActionPoint([
      bigIntTimestamp,
      recipient,
    ]);
    await waitForTransaction(tx);
  };

  const attack = async (target: Entity) => {
    console.log("attack called");
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const tx = await worldContract.write.attackPlayer([
      bigIntTimestamp,
      target,
    ]);
    await waitForTransaction(tx);
  };

  const increaseRange = async () => {
    console.log("increaseRange called");
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const tx = await worldContract.write.increaseRange([bigIntTimestamp]);
    await waitForTransaction(tx);
  };

  const startMatch = async (gameId: number, playersSpawned: number, startTime: number) => {
    const bigIntStartTime = BigInt(startTime);
    const tx = await worldContract.write.startMatch([
      gameId,
      playersSpawned,
      bigIntStartTime,
    ]);
    const res = await waitForTransaction(tx);
  };

  const moveTo = async (inputX: number, inputY: number, gameId: number) => {
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
      const bigIntTimestamp = BigInt(Date.now());
      const tx = await worldContract.write.move([bigIntTimestamp, x, y, gameId]);
      await waitForTransaction(tx);
    } catch (error) {
      console.log("error: ", error);
      throw error;
    } finally {
      Position.removeOverride(positionId);
    }
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
    await moveTo(playerPosition.x + deltaX, playerPosition.y + deltaY, gameId);
  };

  const spawn = async (username: string, gameId: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
    const canSpawn = getComponentValue(Player, playerEntity)?.value !== true;
    if (!canSpawn) {
      throw new Error("already spawned");
    }
    console.log("spawn called with gameID: ", gameId);

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

  const claimVotingPoint = async () => {
    console.log("claimVotingPoint called");
    if (!playerEntity) {
      throw new Error("no player");
    }
    const bigIntTimestamp = BigInt(Date.now());
    const tx = await worldContract.write.claimVotingPoint([bigIntTimestamp]);
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
  };
}
