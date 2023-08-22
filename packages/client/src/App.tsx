import { useState, useEffect } from "react";
import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { GameBoard } from "./GameBoard";
import { PlayerStats } from "./PlayerStats";

export const App = () => {
  const {
    components: { SyncProgress, Health, Range, ActionPoint },
    network: { playerEntity },
  } = useMUD();

  // State for error modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionButtonText, setActionButtonText] = useState<string | undefined>(undefined);
  const [actionButtonCallback, setActionButtonCallback] = useState<(() => void) | undefined>(undefined);

  const playerHealth = useComponentValue(Health, playerEntity)?.value;
  const shipRange = useComponentValue(Range, playerEntity)?.value;
  const actionPoint = useComponentValue(ActionPoint, playerEntity)?.value;

  // SyncStep enum
  enum SyncStep {  
    INITIALIZE = "initialize",
    SNAPSHOT = "snapshot",
    RPC = "rpc",
    LIVE = "live",
  }

  type ErrorModalProps = {
    message: string;
    onClose: () => void;
    actionButtonText?: string; // Optional action button text
    actionButtonCallback?: () => void; // Optional action button callback
  };

  // const handleError = (message: string) => {
  //   console.log("handleError called with message: ", message);
  //   setErrorMessage(message);
  //   setShowErrorModal(true);
  //   console.log("errorMessage: ", errorMessage);
  // };

  const handleError = (message: string, actionButtonText?: string, onActionButtonClick?: () => void) => {
    console.log("handleError setting onActionButtonClick to:", onActionButtonClick);

    // ... (existing code)
    setErrorMessage(message);
    setShowErrorModal(true);
    setActionButtonText(actionButtonText);
    setActionButtonCallback(onActionButtonClick);
    // console.log("onActionButtonClick type:", typeof onActionButtonClick);  // In App.tsx
    // console.log("actionButtonCallback type:", typeof actionButtonCallback);  // In App.tsx
  };

  const closeErrorModal = () => {
    setErrorMessage("");
    setShowErrorModal(false);
  };

  const syncProgress = useComponentValue(SyncProgress, singletonEntity, {
    step: SyncStep.INITIALIZE,
    message: "Connecting",
    percentage: 0,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n,
  });

  const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose, actionButtonText, actionButtonCallback }) => {

    console.log("ErrorModal props:", { message, onClose, actionButtonCallback, actionButtonText });

    const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClose();
    };
  
    const handleModalContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
    };
  
    useEffect(() => {
      const handleEscapePress = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
  
      document.addEventListener("keydown", handleEscapePress);
      return () => {
        // Cleanup the event listener
        document.removeEventListener("keydown", handleEscapePress);
      };
    }, [onClose]);
  
    return (
      <div onClick={handleBackgroundClick} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
        <div onClick={handleModalContentClick} style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '300px', textAlign: 'center', color: 'black', position: 'relative'}}>
        <div onClick={onClose} style={{position: 'absolute', right: '10px', top: '10px', cursor: 'pointer', fontWeight: 'bold'}}>X</div>
          <p>{message}</p>
          {actionButtonCallback && actionButtonText && (
          <button onClick={actionButtonCallback}>{actionButtonText}</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {showErrorModal && (
        // <ErrorModal
        //   message={errorMessage}
        //   onClose={closeErrorModal}
        //   actionButtonText={actionButtonText}
        //   onActionButtonClick={actionButtonCallback}
        // />

        <ErrorModal
          message={errorMessage}
          onClose={closeErrorModal}
          actionButtonText={actionButtonText}
          actionButtonCallback={() => console.log("Testing")}
        />

      )}

      {syncProgress.step !== SyncStep.LIVE ? (
        <div>
          {syncProgress.message} ({Math.floor(syncProgress.percentage)}%)
        </div>
      ) : (
        <div>
          <GameBoard handleError={handleError}/>
          <PlayerStats health={playerHealth} range={shipRange} actionPoints={actionPoint} />
        </div>  
      )}
    </div>
  );
};
