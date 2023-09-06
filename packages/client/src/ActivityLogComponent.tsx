import React from "react";
import { getComponentValue, Has } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { LogMessage } from "./CustomTypes";
import { formatDate } from "./utils";

const ActivityLogComponent: React.FC = () => {
  const {
    components: {
      MoveExecuted,
      AttackExecuted,
      SendActionPointExecuted,
      RangeIncreaseExecuted,
      GameStarted,
      PlayerSpawned,
    },
  } = useMUD();

  const allMoveLogs = useEntityQuery([Has(MoveExecuted)]);
  const allAttackLogs = useEntityQuery([Has(AttackExecuted)]);
  const allSendActionPointLogs = useEntityQuery([Has(SendActionPointExecuted)]);
  const allRangeIncreaseLogs = useEntityQuery([Has(RangeIncreaseExecuted)]);
  const allPlayerSpawnedLogs = useEntityQuery([Has(PlayerSpawned)]);
  const gameStarted = useEntityQuery([Has(GameStarted)]);
  let mappedLogs: LogMessage[] = [];

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


  const mappedMoveLogs = mapMoveLogs();
  const mappedAttackLogs = mapAttackLogs();
  const mappedSendActionPointLogs = mapSendActionPointLogs();
  const mappedRangeIncreaseLogs = mapRangeIncreaseLogs();
  const mappedStartedLog = mapGameStartedLog();
  const mappedPlayerSpawnedLogs = mapPlayerSpawnedLogs();
  
  mappedLogs = mappedLogs.concat(
    mappedPlayerSpawnedLogs,
    mappedStartedLog,
    mappedMoveLogs,
    mappedAttackLogs,
    mappedSendActionPointLogs,
    mappedRangeIncreaseLogs
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
