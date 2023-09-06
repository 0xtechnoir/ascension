import React, { useState, useEffect } from "react";
import { useMUD } from "./MUDContext";
import { Entity } from "@latticexyz/recs";
import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { ActionButton } from "./ActionButton";

type LivePlayerProps = {
  entity: Entity;
  setHighlightedPlayer: (player: Entity | null) => void;
  highlightedPlayer: Entity | null;
};

export const LivePlayer: React.FC<LivePlayerProps> = ({
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
      APClaimInterval,
    },
    systemCalls: { sendActionPoint, attack, increaseRange, claimActionPoint },
    network: { playerEntity },
  } = useMUD();

  const [timeUntilNextClaim, setTimeUntilNextClaim] =
    useState<string>("Calculating...");

  const username = useComponentValue(Username, entity)?.value;
  const health = useComponentValue(Health, entity)?.value;
  const range = useComponentValue(Range, entity)?.value;
  const ap = useComponentValue(ActionPoint, entity)?.value;
  const alive = useComponentValue(Alive, entity)?.value;
  const lastActionPointClaim = useComponentValue(
    LastActionPointClaim,
    entity
  )?.value;
  const actionPointClaimInterval = useComponentValue(
    APClaimInterval,
    singletonEntity
  )?.value;

  console.log("lastActionPointClaim", lastActionPointClaim);
  console.log("actionPointClaimInterval", actionPointClaimInterval);

  useEffect(() => {
    const lastClaim = new Date(Number(lastActionPointClaim));
    const claimInterval = Number(actionPointClaimInterval);
    const nextClaimDate = new Date(lastClaim.getTime() + claimInterval);

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
  }, [lastActionPointClaim, actionPointClaimInterval]);

  if (entity === playerEntity) {
    return (
      <>
        <div
          key={entity}
          className={`cursor-pointer ${
            entity === playerEntity
              ? "bg-green-600"
              : entity === highlightedPlayer
              ? "bg-gray-600"
              : ""
          }`}
          onClick={() => setHighlightedPlayer(entity)}
        >
          <p>Name: {username} (You 🚀)</p>
          <p>Status: {alive ? `Alive` : `Dead`}</p>
          <p>Health: {health}</p>
          <p>Range: {range}</p>
          <p>Action Points: {ap}</p>
          <p>Time until next claim: {timeUntilNextClaim}</p>
        </div>
        <ActionButton
          label="Increase Range (Requires 1 AP)"
          action={increaseRange}
        />
        <br />
        <ActionButton label="Claim Action Point" action={claimActionPoint} />
        <p>-----------------------------------</p>
        <br />
      </>
    );
  } else {
    return (
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
        <p>Name: {username} 🛸</p>
        <p>Status: {alive ? `Alive` : `Dead`}</p>
        <p>Health: {health}</p>
        <p>Range: {range}</p>
        <p>Action Points: {ap}</p>
        <div className="flex">
          <ActionButton
            label="Donate Action Point"
            action={() => sendActionPoint(highlightedPlayer!)}
          />
          <ActionButton
            label="Attack Player"
            action={() => attack(highlightedPlayer!)}
          />
        </div>
        <br />
        <p>-----------------------------------</p>
        <br />
      </div>
    );
  }
};
