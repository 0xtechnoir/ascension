import { getComponentValue, Has, HasValue } from "@latticexyz/recs";
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
      VotingPointClaimExecuted
    },
  } = useMUD();

  const allMoveLogs = useEntityQuery([HasValue(MoveExecuted, { gameId : gameId })]);
  const allAttackLogs = useEntityQuery([Has(AttackExecuted)]);
  const allSendActionPointLogs = useEntityQuery([Has(SendActionPointExecuted)]);
  const allRangeIncreaseLogs = useEntityQuery([HasValue(RangeIncreaseExecuted, { gameId : gameId })]);
  const allPlayerSpawnedLogs = useEntityQuery([HasValue(PlayerSpawned, { gameId : gameId })]);
  const allActionPointClaimExecutedLogs = useEntityQuery([HasValue(ActionPointClaimExecuted, { gameId : gameId })]);
  const allVotingPointClaimExecutedLogs = useEntityQuery([Has(VotingPointClaimExecuted)]);
  const allVoteExecutedLogs = useEntityQuery([Has(VoteExecuted)]);
  const gameStarted = useEntityQuery([HasValue(GameStarted, { gameId : gameId })]);
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
  const mappedActionPointClaimExecutedLogs = mapActionPointClaimExecutedLogs();
  const mappedVoteExecutedLogs = mapVoteExecutedLogs();
  const mappedVotingPointClaimExecutedLogs = mapVotingPointClaimExecutedLogs();
  
  mappedLogs = mappedLogs.concat(
    mappedPlayerSpawnedLogs,
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
    <div
      className="activity-log"
      style={{ maxHeight: "200px", overflowY: "auto" }}
    >
      <h3>Ships Log:</h3>
      <ul>
        {mappedLogs
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((logObj, index) => (
            <li key={index}>
              {`${formatDate(logObj.timestamp)} : ${logObj.message}`}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ActivityLogComponent;
