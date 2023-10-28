import { getComponentValue, HasValue } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { LogMessage } from "./CustomTypes";
import { formatDate } from "./utils";
import { useGameContext } from "./GameContext";
import { useEffect, useState } from "react";

const ActivityLogComponent = () => {
  
  const { gameId, displayMessage, setGameIsWon } = useGameContext();
  const [mappedLogs, setMappedLogs] = useState<LogMessage[]>([]);
  
  const {
    components: {
      MoveExecuted,
      AttackExecuted,
      SendActionPointExecuted,
      RangeIncreaseExecuted,
      GameStarted,
      GameEnded,
      PlayerSpawned,
      ActionPointClaimExecuted,
      VoteExecuted,
      VotingPointClaimExecuted,
      PlayerDied,
      PlayerLeftGame,
      PlayerWon
    },
  } = useMUD();

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
  
  const mapGameEndedLog = () => {
    return gameEnded.map((entity) => {
      const rec = getComponentValue(GameEnded, entity);
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `Game Ended`,
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

  const mapPlayerWonLogs = () => {
    const winner = playerWon[0]
    if(playerWon.length > 0) {
      const rec = getComponentValue(PlayerWon, winner);
      const player = rec?.player;
      const ts = rec?.timestamp;
      const numTs = Number(ts);
      const mappedLog: LogMessage = {
        timestamp: numTs,
        message: `${player} won the game`,
      };
      setGameIsWon(true);
      displayMessage(`Game over, ${player} won the game`);
      return [mappedLog];
    } else {
      return [];
    }
  };

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
  const gameEnded = useEntityQuery([HasValue(GameEnded, { gameId: gameId ?? undefined })]);
  const playerWon = useEntityQuery([HasValue(PlayerWon, { gameId: gameId ?? undefined })]);
  
  useEffect(() => {
    const newMappedLogs = [
      ...mapMoveLogs(),
      ...mapAttackLogs(),
      ...mapSendActionPointLogs(),
      ...mapRangeIncreaseLogs(),
      ...mapGameStartedLog(),
      ...mapGameEndedLog(),
      ...mapPlayerSpawnedLogs(),
      ...mapPlayerLeftGameLogs(),
      ...mapPlayerDiedLogs(),
      ...mapActionPointClaimExecutedLogs(),
      ...mapVoteExecutedLogs(),
      ...mapVotingPointClaimExecutedLogs(),
      ...mapPlayerWonLogs()
    ]
    setMappedLogs(newMappedLogs);    
  }, [allMoveLogs, allAttackLogs, allSendActionPointLogs, allRangeIncreaseLogs, gameStarted, gameEnded, allPlayerSpawnedLogs, allPlayerLeftGameLogs, allPlayerDiedLogs, allActionPointClaimExecutedLogs, allVoteExecutedLogs, allVotingPointClaimExecutedLogs, playerWon]);

  return (
    <div className="h-full items-start p-3 rounded-md">
      <h1 className="text-2xl font-bold text-white mb-4">Ships Log:</h1>
      <ul className="list-decimal text-white">
        {mappedLogs
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((logObj) => (
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
