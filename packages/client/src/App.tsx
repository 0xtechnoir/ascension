import { useState, useEffect } from "react";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, Has } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { GameBoard } from "./GameBoard";
import { PlayerStats } from "./PlayerStats";
import { OtherPlayersStats } from "./OtherPlayersStats";
import { ErrorModal } from "./ErrorModal";

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
  } = useMUD();

  // State Hooks
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [highlightedPlayer, setHighlightedPlayer] = useState<Entity | null >(null);
  const [gameStarted, setGameStarted] = useState(false);

  // useEffect hook to check if the game has started
  const gameIsLive = useComponentValue(GameIsLive, singletonEntity)?.value;
  useEffect(() => {
    if (gameIsLive) {
      setGameStarted(true);
    }
  }, [gameIsLive]);

  // Query for all player entities
  const allPlayers = useEntityQuery([Has(Player), Has(Position)])
  // Get a list of all player entities except mine
  const otherPlayers = allPlayers.filter((entity) => entity !== playerEntity);

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
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

  return (
    <div className="items-center justify-center">
      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={closeErrorModal}
        />
      )}

      {syncProgress.step !== SyncStep.LIVE ? (
        <div>
          {syncProgress.message} ({Math.floor(syncProgress.percentage)}%)
        </div>
      ) : (
        <div className="flex">
          
          {gameStarted &&
            <div className="flex flex-col w-1/4">
              <PlayerStats handleError={handleError} />
              <div className="h-10 flex-grow felx-col overflow-scroll">
                <OtherPlayersStats handleError={handleError} players={otherPlayers} highlightedPlayer={highlightedPlayer} setHighlightedPlayer={setHighlightedPlayer} />
              </div>
            </div>
          }
        
          <div className="w-3/4">
            <GameBoard handleError={handleError} players={allPlayers} highlightedPlayer={highlightedPlayer} setHighlightedPlayer={setHighlightedPlayer} setGameStarted={setGameStarted}/>
          </div> 
        </div>    
      )}
    </div>
  );
};
