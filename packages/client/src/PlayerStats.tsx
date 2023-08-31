import React from "react";
import { useComponentValue } from "@latticexyz/react";
import { ErrorWithShortMessage } from "./CustomTypes";
import { useMUD } from "./MUDContext";

type PlayerStatsProps = {
  handleError: (
    message: string,
    actionButtonText?: string,
    onActionButtonClick?: () => void
  ) => void;
};

export const PlayerStats: React.FC<PlayerStatsProps> = ({ handleError }) => {
  const {
    components: { Health, Range, ActionPoint, Username, Alive },
    network: { playerEntity },
    systemCalls: { increaseRange },
  } = useMUD();

  const playerName = useComponentValue(Username, playerEntity)?.value;
  const playerHealth = useComponentValue(Health, playerEntity)?.value;
  const shipRange = useComponentValue(Range, playerEntity)?.value;
  const actionPoint = useComponentValue(ActionPoint, playerEntity)?.value;
  const alive = useComponentValue(Alive, playerEntity)?.value;

  return (
    <div className="flex flex-col items-start border border-gray-300 p-4 rounded-md my-1">
      <div className="flex-col mr-4">
        <strong>You: 🚀</strong>
        <br />
        <br />
        <p></p>
        <p>Player: {playerName}</p>
        <p>Status: {alive ? `Alive` : `Dead`}</p>
        <p>Health: {playerHealth}</p>
        <p>Range: {shipRange}</p>
        <p>Action Points: {actionPoint}</p>
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
      </div>
    </div>
  );
};
