import React, { useState, useEffect } from "react";
import { useMUD } from "./MUDContext";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { ActionButton } from "./ActionButton";
import { useGameContext } from "./GameContext";
import { Entity, Has, getComponentValue } from "@latticexyz/recs";

type PlayerProps = {
  entity: Entity;
  setHighlightedPlayer: (player: Entity | null) => void;
  highlightedPlayer: Entity | null;
};

export const Player: React.FC<PlayerProps> = ({
  entity,
  setHighlightedPlayer,
  highlightedPlayer,
}) => {
  const {
    components: {
      Health,
      Range,
      ActionPoint,
      VotingPoint,
      Username,
      Alive,
      LastActionPointClaim,
      LastVotingPointClaim,
      ClaimInterval,
      GameSession,
    },
    systemCalls: { sendActionPoint, attack, increaseRange, claimActionPoint, vote, claimVotingPoint },
    network: { playerEntity },
  } = useMUD();

  const { gameId } = useGameContext();
  const username = useComponentValue(Username, entity)?.value;
  const health = useComponentValue(Health, entity)?.value;
  const range = useComponentValue(Range, entity)?.value;
  const ap = useComponentValue(ActionPoint, entity)?.value;
  const vp = useComponentValue(VotingPoint, entity)?.value;
  const alive = useComponentValue(Alive, entity)?.value;
  const playerIsAlive = useComponentValue(Alive, playerEntity)?.value;

  // is the game live yet? 
  const gameSessions = useEntityQuery([Has(GameSession)]);
  let gameIsLive = false;
  if (gameSessions) {
    // loop through gameSessions and find the one with the matching gameId
    for (let i = 0; i < gameSessions.length; i++) {
      const gameSession = gameSessions[i];
      const rec = getComponentValue(GameSession, gameSession);
      if (rec?.gameId === gameId) {
        gameIsLive = rec?.isLive || false;
      }
    }
  }

  const lastActionPointClaim = useComponentValue(
    LastActionPointClaim,
    entity
  )?.value;

  const lastVotingPointClaim = useComponentValue(
    LastVotingPointClaim,
    entity
  )?.value;

  const claimInterval = useComponentValue(
    ClaimInterval,
    singletonEntity
  )?.value;

  const [timeUntilNextAPClaim, setTimeUntilNextAPClaim] = useState<string>("Calculating...");
  const [timeUntilNextVPClaim, setTimeUntilNextVPClaim] = useState<string>("Calculating...");

  useEffect(() => {
    const updateTimer = (lastClaimTimestamp: bigint, setTimeFunc: React.Dispatch<React.SetStateAction<string>>) => {
      const lastClaim = new Date(Number(lastClaimTimestamp));
      const interval = Number(claimInterval);
      const nextClaimDate = new Date(lastClaim.getTime() + interval);
      
      const now = new Date();
      const timeLeft = nextClaimDate.getTime() - now.getTime();
      
      if (timeLeft > 0) {
        const seconds = Math.floor((timeLeft / 1000) % 60);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        setTimeFunc(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeFunc("Now!");
      }
    };
  
    const intervalId = setInterval(() => {
      updateTimer(lastActionPointClaim!, setTimeUntilNextAPClaim);
      updateTimer(lastVotingPointClaim!, setTimeUntilNextVPClaim);
    }, 1000);
  
    // Update the timer immediately
    updateTimer(lastActionPointClaim!, setTimeUntilNextAPClaim);
    updateTimer(lastVotingPointClaim!, setTimeUntilNextVPClaim);
  
    return () => clearInterval(intervalId);
  }, [lastActionPointClaim, lastVotingPointClaim, claimInterval]);

  if (entity === playerEntity) {
    return (
      <>
        <div
          key={entity}
          className={`p-2 cursor-pointer border border-gray-400 rounded-md m-1 ${
            entity === playerEntity
              ? "bg-green-900"
              : entity === highlightedPlayer
              ? "bg-gray-900"
              : ""
          }`}
          onClick={() => setHighlightedPlayer(entity)}
        >
          <p>Name: {username} (You {alive ? "🚀": "💀"})</p>
          <p>Status: {alive ? `Alive` : `Dead`}</p>
          {alive ? (
            <>
              <p>Health: {health}</p>
              <p>Range: {range}</p>
              <p>Action Points: {ap}</p>
            </>
          ) : (
            <p>Voting Points: {vp}</p>
          )}
        {gameIsLive && (
          playerIsAlive ? (
            <>
              <ActionButton
                label="Boost Range"
                action={() => () => increaseRange(gameId!)}
                buttonStyle="btn-sci-fi"
              />
              <ActionButton 
                label={`Claim AP: ${timeUntilNextAPClaim}`}
                action={() => () => claimActionPoint(gameId!)} 
                buttonStyle={timeUntilNextAPClaim === "Now!" ? "btn-cta" : "btn-sci-fi"}
              />
            </>
          ) : (
            <>
              <ActionButton 
                label={`Claim VP: ${timeUntilNextVPClaim}`} 
                action={() => () => claimVotingPoint(gameId!)} 
                buttonStyle={timeUntilNextVPClaim === "Now!" ? "btn-cta" : "btn-sci-fi"}
              />
            </>
          )
        )}
        </div>
      </>
    );
  } else {
    return (
      <div
        key={entity}
        className={`p-2 cursor-pointer border border-gray-400 rounded-md m-1 ${
          !alive
            ? "bg-red-900"
            : entity === highlightedPlayer
            ? "bg-gray-600"
            : ""
        }`}
        onClick={() => setHighlightedPlayer(entity)}
      >
        <p>Name: {username} 🛸</p>
        <p>Status: {alive ? `Alive` : `Dead`}</p>
        <p>Health: {health}</p>
        <p>Range: {range}</p>
        <p>Action Points: {ap}</p>
        <div className="flex">
        {gameIsLive && (
          <>
            {playerIsAlive && alive && (
              <>
                <ActionButton
                  label="Send AP"
                  action={() => () => sendActionPoint(entity, gameId!)}
                  buttonStyle="btn-sci-fi"
                />
                <ActionButton
                  label="Attack"
                  action={() => () => attack(entity, gameId!)}
                  buttonStyle="btn-sci-fi"
                />
              </>
            )}
            {!playerIsAlive && alive && (
              <ActionButton
                label="Vote"
                action={() => () => vote(entity, gameId!)}
                buttonStyle="btn-sci-fi"
              />
            )}
          </>
        )}
        </div>
      </div>
    );
  }
};
