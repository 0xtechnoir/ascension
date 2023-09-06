import React from "react";
import { ErrorWithShortMessage } from "./CustomTypes";
import { useMUD } from "./MUDContext";
import { Entity } from "@latticexyz/recs";
import { useComponentValue } from "@latticexyz/react";
import { useErrorContext } from "./ErrorContext";

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

  const { handleError } = useErrorContext();
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
          <button
            onClick={async () => {
              try {
                await increaseRange();
              } catch (error) {
                if (typeof error === "object" && error !== null) {
                  const message = (error as ErrorWithShortMessage).shortMessage;
                  handleError(message);
                }
              }
            }}
            className="h-10 px-6 font-semibold rounded-md border border-slate-200 text-slate-300"
            type="button"
          >
            Increase Range (Requires 1 AP)
          </button>
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
            <button
              className="h-10 px-2 font-semibold rounded-md border border-slate-200 text-slate-300 mr-2"
              type="button"
              onClick={async () => {
                if (highlightedPlayer) {
                  try {
                    await sendActionPoint(highlightedPlayer);
                  } catch (error) {
                    if (typeof error === "object" && error !== null) {
                      const message = (error as ErrorWithShortMessage)
                        .shortMessage;
                      handleError(message);
                    }
                  }
                }
              }}
            >
              Donate Action Point
            </button>
            <br />
            <button
              className="h-10 px-6 font-semibold rounded-md border border-slate-200 text-slate-300"
              type="button"
              onClick={async () => {
                if (highlightedPlayer) {
                  try {
                    console.log("trying to attack");
                    await attack(highlightedPlayer);
                    console.log("Attack successful!");
                  } catch (error) {
                    console.log("typeof error: ", typeof error);
                    console.log("error: ", error);
                    if (typeof error === "object" && error !== null) {
                      const message = (error as ErrorWithShortMessage)
                        .shortMessage;
                      handleError(message);
                    }
                  }
                }
              }}
            >
              Attack Player
            </button>
          </div>
          <br />
          <p>-----------------------------------</p>
          <br />
        </div>
      );

    }
};
