import React, { useState, useEffect } from "react";
import { useMUD } from "./MUDContext";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { ActionButton } from "./ActionButton";
import { useGameContext } from "./GameContext";
import { Entity, Has, HasValue, getComponentValue } from "@latticexyz/recs";

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
      Username,
      Alive,
      LastActionPointClaim,
      ClaimInterval,
      GameSession,
    },
    systemCalls: { sendActionPoint, attack, increaseRange, claimActionPoint, vote, claimVotingPoint },
    network: { playerEntity },
  } = useMUD();

  const [timeUntilNextClaim, setTimeUntilNextClaim] =
    useState<string>("Calculating...");

  const { gameId } = useGameContext();

  const username = useComponentValue(Username, entity)?.value;
  const health = useComponentValue(Health, entity)?.value;
  const range = useComponentValue(Range, entity)?.value;
  const ap = useComponentValue(ActionPoint, entity)?.value;
  const alive = useComponentValue(Alive, entity)?.value;

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

  const claimInterval = useComponentValue(
    ClaimInterval,
    singletonEntity
  )?.value;

  useEffect(() => {
    const lastClaim = new Date(Number(lastActionPointClaim));
    const interval = Number(claimInterval);
    const nextClaimDate = new Date(lastClaim.getTime() + interval);

    // Function to update the time left for the next claim
    const updateTimer = () => {
      const now = new Date();
      const timeLeft = nextClaimDate.getTime() - now.getTime();

      if (timeLeft > 0) {
        const seconds = Math.floor((timeLeft / 1000) % 60);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        setTimeUntilNextClaim(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeUntilNextClaim("Now!");
      }
    };

    // Update the timer immediately
    updateTimer();
    // Update the timer every second
    const intervalId = setInterval(updateTimer, 1000);
    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [lastActionPointClaim, claimInterval]);

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
            <p>Voting Points: {ap}</p>
          )}
        {gameIsLive && (
          alive ? (
            <>
              <ActionButton
                label="Boost Range"
                action={() => () => increaseRange(gameId!)}
                buttonStyle="btn-sci-fi"
              />
              <ActionButton 
                label={`Claim 1 AP: ${timeUntilNextClaim}` }
                action={() => () => claimActionPoint(gameId!)} 
                buttonStyle={timeUntilNextClaim === "Now!" ? "btn-cta" : "btn-sci-fi"}
              />
            </>
          ) : (
            <>
            <ActionButton
                label="Vote"
                action={() => () => vote(highlightedPlayer!, gameId!)}
                buttonStyle="btn-sci-fi"
              />
              <ActionButton 
                label={`Claim VP: ${timeUntilNextClaim}`} 
                action={() => () => claimVotingPoint(gameId!)} 
                buttonStyle={timeUntilNextClaim === "Now!" ? "btn-cta" : "btn-sci-fi"}
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
            <ActionButton
              label="Send AP"
              action={() => () => sendActionPoint(highlightedPlayer!, gameId!)}
              buttonStyle="btn-sci-fi"
            />
            <ActionButton
              label="Attack"
              action={() => () => attack(highlightedPlayer!, gameId!)}
              buttonStyle="btn-sci-fi"
            />
          </> 
        )}
        </div>
      </div>
    );
  }
};
