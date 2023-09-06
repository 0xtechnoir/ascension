import React from "react";
import { useMUD } from "./MUDContext";
import { Entity } from "@latticexyz/recs";
import { useComponentValue } from "@latticexyz/react";
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
    components: { Health, Range, ActionPoint, Username, Alive },
    systemCalls: { sendActionPoint, attack, increaseRange},
    network: { playerEntity },
  } = useMUD();

  const username = useComponentValue(Username, entity)?.value;
  const health = useComponentValue(Health, entity)?.value;
  const range = useComponentValue(Range, entity)?.value;
  const ap = useComponentValue(ActionPoint, entity)?.value;
  const alive = useComponentValue(Alive, entity)?.value;

  if (entity === playerEntity) {
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
            <p>Name: {username} (You 🚀)</p>
            <p>Status: {alive ? `Alive` : `Dead`}</p>
            <p>Health: {health}</p>
            <p>Range: {range}</p>
            <p>Action Points: {ap}</p>
          </div>
          <ActionButton
              label="Increase Range (Requires 1 AP)"
              action={increaseRange}
            />
          <br />
          <p>-----------------------------------</p>
          <br />
        </>
      )
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
