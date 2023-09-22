import { getComponentValue, HasValue } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { LogMessage } from "./CustomTypes";
import { formatDate } from "./utils";
import { useGameContext } from "./GameContext";

const ActivityLogComponent = () => {
  
  const { gameId } = useGameContext();
  
  const {
    components: {
      MoveExecuted,
      AttackExecuted,
      SendActionPointExecuted,
      RangeIncreaseExecuted,
      GameStarted,
      PlayerSpawned,
      ActionPointClaimExecuted,
      VoteExecuted,
      VotingPointClaimExecuted,
      PlayerDied,
      PlayerLeftGame
    },
  } = useMUD();

  const allMoveLogs = useEntityQuery([HasValue(MoveExecuted, { gameId: gameId ?? undefined })]);
  const allAttackLogs = useEntityQuery([HasValue(AttackExecuted, { gameId: gameId ?? undefined })]);
  const allSendActionPointLogs = useEntityQuery([HasValue(SendActionPointExecuted, { gameId: gameId ?? undefined })]);
  const allRangeIncreaseLogs = useEntityQuery([HasValue(RangeIncreaseExecuted, { gameId: gameId ?? undefined })]);
  const allPlayerSpawnedLogs = useEntityQuery([HasValue(PlayerSpawned, { gameId: gameId ?? undefined })]);
  const allPlayerLeftGameLogs = useEntityQuery([HasValue(PlayerLeftGame, { gameId: gameId ?? undefined })]);
  const allPlayerDiedLogs = useEntityQuery([HasValue(PlayerDied, { gameId: gameId ?? undefined })]);
  const allActionPointClaimExecutedLogs = useEntityQuery([HasValue(ActionPointClaimExecuted, { gameId: gameId ?? undefined })]);
  const allVotingPointClaimExecutedLogs = useEntityQuery([HasValue(VotingPointClaimExecuted, { gameId: gameId ?? undefined })]);
  const allVoteExecutedLogs = useEntityQuery([HasValue(VoteExecuted, { gameId: gameId ?? undefined })]);
  const gameStarted = useEntityQuery([HasValue(GameStarted, { gameId: gameId ?? undefined })]);
  let mappedLogs: LogMessage[] = [];

  console.log("ActivityLogComponent: gameStarted: ", gameStarted);

  const mapMoveLogs = () => {
    return allMoveLogs.map((entity) => {
      const rec = getComponentValue(MoveExecuted, entity);
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const player = rec?.player;
      const fromX = rec?.fromX;
      const fromY = rec?.fromY;
      const toX = rec?.toX;
      const toY = rec?.toY;
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `${player} moved from (${fromX}, ${fromY}) to (${toX}, ${toY})`,
      };
      return mappedLog;
    });
  };

  const mapAttackLogs = () => {
    return allAttackLogs.map((entity) => {
      const rec = getComponentValue(AttackExecuted, entity);
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const attacker = rec?.attacker;
      const target = rec?.target;
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `${attacker} attacked ${target}`,
      };
      return mappedLog;
    });
  };

  const mapSendActionPointLogs = () => {
    return allSendActionPointLogs.map((entity) => {
      const rec = getComponentValue(SendActionPointExecuted, entity);
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const sender = rec?.sender;
      const reciever = rec?.reciever;
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `${sender} sent 1 Action Point to ${reciever}`,
      };
      return mappedLog;
    });
  };

  const mapRangeIncreaseLogs = () => {
    return allRangeIncreaseLogs.map((entity) => {
      const rec = getComponentValue(RangeIncreaseExecuted, entity);
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const player = rec?.player;
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `${player} increased their range by 1`,
      };
      return mappedLog;
    });
  };

  const mapGameStartedLog = () => {
    return gameStarted.map((entity) => {
      const rec = getComponentValue(GameStarted, entity);
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `Game Started`,
      };
      return mappedLog;
    });
  };

  const mapPlayerSpawnedLogs = () => {
    return allPlayerSpawnedLogs.map((entity) => {
      const rec = getComponentValue(PlayerSpawned, entity);
      const player = rec?.player;
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const x = rec?.x;
      const y = rec?.y;
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `${player} spawned at (${x}, ${y})`,
      };
      return mappedLog;
    });
  };
  
  const mapPlayerLeftGameLogs = () => {
    return allPlayerLeftGameLogs.map((entity) => {
      const rec = getComponentValue(PlayerLeftGame, entity);
      const player = rec?.player;
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `${player} left the game`,
      };
      return mappedLog;
    });
  };
  
  const mapPlayerDiedLogs = () => {
    return allPlayerDiedLogs.map((entity) => {
      const rec = getComponentValue(PlayerDied, entity);
      const player = rec?.player;
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `${player} was destroyed`,
      };
      return mappedLog;
    });
  };

  const mapActionPointClaimExecutedLogs = () => {
    return allActionPointClaimExecutedLogs.map((entity) => {
      const rec = getComponentValue(ActionPointClaimExecuted, entity);
      const player = rec?.player;
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `${player} claimed an action point`,
      };
      return mappedLog;
    });
  };

  const mapVoteExecutedLogs = () => {
    return allVoteExecutedLogs.map((entity) => {
      const rec = getComponentValue(VoteExecuted, entity);
      const voter = rec?.voter;
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const recipient = rec?.recipient;
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `${voter} voted to send ${recipient} an additional action point`,
      };
      return mappedLog;
    });
  };

  const mapVotingPointClaimExecutedLogs = () => {
    return allVotingPointClaimExecutedLogs.map((entity) => {
      const rec = getComponentValue(VotingPointClaimExecuted, entity);
      const player = rec?.player;
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `${player} claimed a dead player voting point`,
      };
      return mappedLog;
    });
  };

  const mappedMoveLogs = mapMoveLogs();
  const mappedAttackLogs = mapAttackLogs();
  const mappedSendActionPointLogs = mapSendActionPointLogs();
  const mappedRangeIncreaseLogs = mapRangeIncreaseLogs();
  const mappedStartedLog = mapGameStartedLog();
  const mappedPlayerSpawnedLogs = mapPlayerSpawnedLogs();
  const mappedPlayerLeftGameLogs = mapPlayerLeftGameLogs();
  const mappedPlayerDiedLogs = mapPlayerDiedLogs();
  const mappedActionPointClaimExecutedLogs = mapActionPointClaimExecutedLogs();
  const mappedVoteExecutedLogs = mapVoteExecutedLogs();
  const mappedVotingPointClaimExecutedLogs = mapVotingPointClaimExecutedLogs();
  
  mappedLogs = mappedLogs.concat(
    mappedPlayerSpawnedLogs,
    mappedPlayerLeftGameLogs,
    mappedPlayerDiedLogs,
    mappedStartedLog,
    mappedMoveLogs,
    mappedAttackLogs,
    mappedSendActionPointLogs,
    mappedRangeIncreaseLogs,
    mappedActionPointClaimExecutedLogs,
    mappedVoteExecutedLogs,
    mappedVotingPointClaimExecutedLogs
  );

  return (
    <div className="h-full items-start p-3 rounded-md custom-scrollbar bg-slate-900">
      <h1 className="text-2xl font-bold text-white mb-4">Ships Log:</h1>
      <ul className="list-decimal text-white">
        {mappedLogs
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((logObj, index) => (
            <ul className="mb-1">
              <span className="text-gray-400">{`${formatDate(logObj.timestamp)}`}</span>
              <span className="text-orange-400"> : </span>
              <span className="text-white">{logObj.message}</span>
            </ul>
          ))}
      </ul>
    </div>
  );
};

export default ActivityLogComponent;
