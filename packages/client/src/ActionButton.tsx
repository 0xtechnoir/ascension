import { ErrorWithShortMessage } from "./CustomTypes";
import { useGameContext } from "./GameContext";

type ActionButtonProps = {
  label: string;
  action: () => () => Promise<void>;
  buttonStyle?: string,
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  action,
  buttonStyle = '',
}) => {
  const { handleError, gameId } = useGameContext();
  return (
    <button
      className={buttonStyle}
      type="button"
      onClick={async () => {
        
        if(!gameId) {
          handleError("No game ID found. Have you joined a game?");
          return;
        }

        try {
          const actionToExecute = action();
          await actionToExecute();
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
