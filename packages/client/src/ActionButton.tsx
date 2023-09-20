import { ErrorWithShortMessage } from "./CustomTypes";
import { useGameContext } from "./GameContext";

type ActionButtonProps = {
  label: string;
  action: (gameId: number) => Promise<void>;
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  action,
}) => {
  const { handleError, gameId } = useGameContext();
  return (
    <button
      className="h-10 px-6 font-semibold rounded-md border border-slate-200 text-slate-300"
      type="button"
      onClick={async () => {
        
        if(!gameId) {
          handleError("No game ID found. Have ou joined a game?");
          return;
        }

        try {
          await action(gameId);
        } catch (error) {
          if (typeof error === "object" && error !== null) {
            const message = (error as ErrorWithShortMessage).shortMessage;
            handleError(message);
          }
        }
      }}
    >
      {label}
    </button>
  );
};
