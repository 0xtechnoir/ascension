import { ErrorWithShortMessage } from "./CustomTypes";
import { useErrorContext } from "./ErrorContext";
const { handleError } = useErrorContext();

type ActionButtonProps = {
    label: string;
    action: () => Promise<void>;
  };
  
  export const ActionButton: React.FC<ActionButtonProps> = ({
    label,
    action,
  }) => {
    return (
      <button
        className="h-10 px-6 font-semibold rounded-md border border-slate-200 text-slate-300"
        type="button"
        onClick={async () => {
          try {
            await action();
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
  