import React from "react";
import { ErrorWithShortMessage } from "./CustomTypes";
import { useMUD } from "./MUDContext";
import { Entity } from "@latticexyz/recs";
import { useComponentValue } from "@latticexyz/react";

type DeadPlayerProps = {
  entity: Entity;
  setHighlightedPlayer: (player: Entity | null) => void;
  highlightedPlayer: Entity | null;
  handleError: (
    message: string,
    actionButtonText?: string,
    onActionButtonClick?: () => void
  ) => void;
};

export const DeadPlayer: React.FC<DeadPlayerProps> = ({
  entity,
  setHighlightedPlayer,
  highlightedPlayer,
  handleError,
}) => {

  const {
    components: { Username, Alive },
    systemCalls: { vote },
    network: { playerEntity },
  } = useMUD();

  const username = useComponentValue(Username, entity)?.value;
  const alive = useComponentValue(Alive, entity)?.value;

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
              <p>Votes: - </p>
              <button
                onClick={async () => {
                  if (highlightedPlayer) {
                    try {
                      await vote(highlightedPlayer);
                    } catch (error) {
                      if (typeof error === "object" && error !== null) {
                        const message = (error as ErrorWithShortMessage)
                          .shortMessage;
                        handleError(message);
                      }
                    }
                  }
                }}
                className="h-10 px-6 font-semibold rounded-md border border-slate-200 text-slate-300"
                type="button"
              >
                Vote
              </button>
            </div>
            :
            <div>
              <p>Name: {username}</p>
              <p>Status: {alive ? `Alive` : `Dead`}</p>
              <p>Votes: - </p>
            </div>
          }
        </>
      )
};
