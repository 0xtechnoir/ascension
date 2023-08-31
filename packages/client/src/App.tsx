import { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, Has } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { GameBoard } from "./GameBoard";
import { PlayerStats } from "./PlayerStats";
import { OtherPlayersStats } from "./OtherPlayersStats";
import { ErrorModal } from "./ErrorModal";
import { ErrorWithShortMessage } from "./CustomTypes";
import ActivityLogComponent from "./ActivityLogComponent";

export const App = () => {
  
  // Custom Types
  enum SyncStep {
    INITIALIZE = "initialize",
    SNAPSHOT = "snapshot",
    RPC = "rpc",
    LIVE = "live",
  }

  // MUD Context
  const {
    components: { SyncProgress, Player, Position, GameIsLive },
    network: { playerEntity },
    systemCalls: { spawn },
  } = useMUD();
  
  // Constants 
  const gameIsLive = useComponentValue(GameIsLive, singletonEntity)?.value;
  const allPlayers = useEntityQuery([Has(Player), Has(Position)]);
  const otherPlayers = allPlayers.filter((entity) => entity !== playerEntity);
  const syncProgress = useComponentValue(SyncProgress, singletonEntity, {
    step: SyncStep.INITIALIZE,
    message: "Connecting",
    percentage: 0,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n,
  });

  // Hooks
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [highlightedPlayer, setHighlightedPlayer] = useState<Entity | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSpawnButton, setShowSpawnButton] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [enteredUsername, setEnteredUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (gameIsLive) {
      setGameStarted(true);
    }
  }, [gameIsLive]);

  const handleSpawnClick = () => {
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    setIsLoading(true);
    console.log("username entered: ", enteredUsername);

    try {
      await spawn(enteredUsername);
    } catch (error) {
      console.log("handleModalSubmit error: ", error);
      if (typeof error === "object" && error !== null) {
        const message = (error as ErrorWithShortMessage).shortMessage;
        handleError(message);
      }
    } finally {
      setIsLoading(false);
      setShowModal(false);
      setShowSpawnButton(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const closeErrorModal = () => {
    setErrorMessage("");
    setShowErrorModal(false);
  };

  return (
    <div className="items-center justify-center">
      {showErrorModal && (
        <ErrorModal message={errorMessage} onClose={closeErrorModal} />
      )}

      {syncProgress.step !== SyncStep.LIVE ? (
        <div>
          {syncProgress.message} ({Math.floor(syncProgress.percentage)}%)
        </div>
      ) : (
        <div className="flex">
          {gameStarted && (
            <div className="flex flex-col w-1/4">
              <PlayerStats handleError={handleError} />
              <div className="h-10 flex-grow felx-col overflow-scroll">
                <OtherPlayersStats
                  handleError={handleError}
                  players={otherPlayers}
                  highlightedPlayer={highlightedPlayer}
                  setHighlightedPlayer={setHighlightedPlayer}
                />
              </div>
            </div>
          )}

          <div className="w-3/4">
            {showSpawnButton && (
              <button onClick={handleSpawnClick}>Spawn</button>
            )}
             <GameBoard
              handleError={handleError}
              players={allPlayers}
              highlightedPlayer={highlightedPlayer}
              setHighlightedPlayer={setHighlightedPlayer}
              setGameStarted={setGameStarted}
            />
            <ActivityLogComponent />
            <Modal
              onClose={handleCloseModal}
              open={showModal}
              style={{
                position: "absolute",
                border: "2px solid #000",
                backgroundColor: "gray",
                boxShadow: "2px solid black",
                height: 80,
                width: 240,
                margin: "auto",
              }}
            >
              <div>
                <h2>Enter a Username</h2>
                {isLoading ? (
                  <>
                    <div>Spawning, please wait...</div>
                  </>
                ) : (
                  <div>
                    <input
                      type="text"
                      autoFocus
                      onChange={(e) => setEnteredUsername(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.keyCode === 13 && enteredUsername.trim() !== "") {
                          handleModalSubmit();
                        }
                      }}
                      style={{
                        paddingLeft: "10px",
                        color: "black",
                      }}
                    />
                    <button
                      onClick={handleModalSubmit}
                      className="h-10 px-6 font-semibold rounded-md border border-slate-400 text-slate-900"
                      type="button"
                      onMouseOver={(e) =>
                        (e.currentTarget.style.opacity = "0.8")
                      }
                      onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </Modal>
           
          </div>
        </div>
      )}
    </div>
  );
};
