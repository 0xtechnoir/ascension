import React, { useState, useEffect } from "react";
import { useMUD } from "./MUDContext";
import { Entity } from "@latticexyz/recs";
import { useComponentValue } from "@latticexyz/react";
import { ActionButton } from "./ActionButton";
import { singletonEntity } from "@latticexyz/store-sync/recs";

type DeadPlayerProps = {
  entity: Entity;
  setHighlightedPlayer: (player: Entity | null) => void;
  highlightedPlayer: Entity | null;
};

export const DeadPlayer: React.FC<DeadPlayerProps> = ({
  entity,
  setHighlightedPlayer,
  highlightedPlayer,
}) => {

  const {
    components: { Username, Alive, LastVotingPointClaim, ClaimInterval, VotingPoint },
    systemCalls: { vote, claimVotingPoint },
    network: { playerEntity },
  } = useMUD();

  const [timeUntilNextClaim, setTimeUntilNextClaim] =
  useState<string>("Calculating...");

  const username = useComponentValue(Username, entity)?.value;
  const alive = useComponentValue(Alive, entity)?.value;
  const votes = useComponentValue(VotingPoint, entity)?.value;

  const lastVotingPointClaim = useComponentValue(
    LastVotingPointClaim,
    entity
  )?.value;

  const claimInterval = useComponentValue(
    ClaimInterval,
    singletonEntity
  )?.value;

  useEffect(() => {
    const lastClaim = new Date(Number(lastVotingPointClaim));
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
  }, [lastVotingPointClaim, claimInterval]);


      return (
        <>
          <div
            key={entity}
            className={`cursor-pointer ${
              !alive
                ? "bg-red-900"
                : entity === highlightedPlayer
                ? "bg-gray-600"
                : ""
            }`}
            onClick={() => setHighlightedPlayer(entity)}
          >
          </div>
          {entity === playerEntity ? 
            <div>
              <p>Name: {username} (You 🚀)</p>
              <p>Status: {alive ? `Alive` : `Dead`}</p>
              <p>Votes: {votes} </p>
              <p>Time until next claim: {timeUntilNextClaim}</p>
              <ActionButton
                label="Vote"
                action={() => vote(highlightedPlayer!)}
              />
              <br />
              <ActionButton label="Claim Voting Point" action={claimVotingPoint} />
              <p>-----------------------------------</p>
              <br />
            </div>
            :
            <div>
              <p>Name: {username}</p>
              <p>Status: {alive ? `Alive` : `Dead`}</p>
              <p>Votes: {votes} </p>
            </div>
          }
        </>
      )
};
