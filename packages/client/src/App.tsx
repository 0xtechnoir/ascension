import { useState, useEffect } from "react";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { Entity, Has, HasValue, getComponentValue } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { GameBoard } from "./GameBoard";
import { LivePlayersListComponent } from "./LivePlayersListComponent";
import { ErrorWithShortMessage } from "./CustomTypes";
import ActivityLogComponent from "./ActivityLogComponent";
import { DeadPlayersListComponent } from "./DeadPlayersListComponent";
import { useErrorContext } from "./ErrorContext";
import SpawnModal from './SpawnModal';

export const App = () => {
  
  // Custom Types
  enum SyncStep {
    INITIALIZE = "initialize",
    SNAPSHOT = "snapshot",
    RPC = "rpc",
    LIVE = "live",
  }

  // Contexts
  const { handleError } = useErrorContext();
  const {
    network: { playerEntity },
    components: { SyncProgress, Player, Position, GameIsLive, Alive },
    systemCalls: { spawn, startMatch },
  } = useMUD();
  
  // Constants 
  const gameIsLive = (useComponentValue(GameIsLive, singletonEntity)?.value) || false;
  const allPlayers = useEntityQuery([Has(Player), Has(Position)]);
  const livePlayers = useEntityQuery([Has(Player), HasValue(Alive, { value: true })]);
  const deadPlayers = useEntityQuery([Has(Player), HasValue(Alive, { value: false })]);
  const syncProgress = useComponentValue(SyncProgress, singletonEntity, {
    step: SyncStep.INITIALIZE,
    message: "Connecting",
    percentage: 0,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n,
  });

  // Hooks
  const [highlightedPlayer, setHighlightedPlayer] = useState<Entity | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSpawnButton, setShowSpawnButton] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (gameIsLive) {
      setGameStarted(true);
    }
  }, [gameIsLive]);

  useEffect(() => {
    // Hide spawn button if player is already spawned
    const canSpawn = getComponentValue(Player, playerEntity)?.value !== true;
    if (!canSpawn) {
      setShowSpawnButton(false);
    }
  });

  const handleSpawnClick = () => {
    setShowModal(true);
  };

  const start = async () => {
    const playersSpawned = allPlayers.length;
    const startTime = Date.now();
    try {
      await startMatch(playersSpawned, startTime);
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        const message = (error as ErrorWithShortMessage).shortMessage;
        handleError(message);
      }
    }
  };

  console.log("showSpawnButton: ", showSpawnButton);

  return (
    <div className="items-center justify-center">
      {syncProgress.step !== SyncStep.LIVE ? (
        <div>
          {syncProgress.message} ({Math.floor(syncProgress.percentage)}%)
        </div>
      ) : (
        <div className={`flex ${showModal ? 'blur-md' : ''}`}>
            <>
              <div className="h-15 flex-grow felx-col overflow-scroll">
                <LivePlayersListComponent
                  players={livePlayers}
                  highlightedPlayer={highlightedPlayer}
                  setHighlightedPlayer={setHighlightedPlayer}
                />
              </div>
              <div className="w-2/4">
                {showSpawnButton &&(
                  <button onClick={handleSpawnClick}>Spawn</button>
                  )}
                <button
                  onClick={start}
                  className={`text-white ${gameIsLive ? 'bg-green-500' : 'bg-blue-500'}`}
                  disabled={gameStarted}
                  >
                {gameIsLive ? "Match Started" : "Start Match"}
                </button>
                <GameBoard
                  players={allPlayers}
                  highlightedPlayer={highlightedPlayer}
                  setHighlightedPlayer={setHighlightedPlayer}
                  setGameStarted={setGameStarted}
                />
                <ActivityLogComponent />
              </div>
              <div className="w-1/4">
                <div className="h-15 overflow-scroll">
                <DeadPlayersListComponent
                  players={deadPlayers}
                  highlightedPlayer={highlightedPlayer}
                  setHighlightedPlayer={setHighlightedPlayer}
                  />
                </div> 
              </div>
            </>      
            <SpawnModal
              showModal={showModal}
              setShowModal={setShowModal}
              setShowSpawnButton={setShowSpawnButton}
            />
        </div>
      )}
    </div>
  );
};
