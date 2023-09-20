import { useState, useEffect } from "react";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { Entity, Has, HasValue, getComponentValue, g } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { GameBoard } from "./GameBoard";
import { LivePlayersListComponent } from "./LivePlayersListComponent";
import { ErrorWithShortMessage } from "./CustomTypes";
import ActivityLogComponent from "./ActivityLogComponent";
import { DeadPlayersListComponent } from "./DeadPlayersListComponent";
import { useGameContext } from "./GameContext";
import SpawnModal from './SpawnModal';
import Lobby from './Lobby';

export const App = () => {

  const [showGameBoard, setShowGameBoard] = useState(false);
  
  // Custom Types
  enum SyncStep {
    INITIALIZE = "initialize",
    SNAPSHOT = "snapshot",
    RPC = "rpc",
    LIVE = "live",
  }

  // Contexts
  const { handleError, gameId } = useGameContext();
  const {
    network: { playerEntity },
    components: { SyncProgress, Player, Position, 
      Alive, GameSession, InGame },
    systemCalls: { startMatch },
  } = useMUD();
  
  // Constants 
  // const gameSession = useEntityQuery([HasValue(GameSession, { gameId: gameId })]);
  const gameSession = useEntityQuery([Has(GameSession)]);
  const currentGameID = useComponentValue(InGame, playerEntity)?.value || "";
  const allPlayers = useEntityQuery([HasValue(InGame, { value: gameId }), Has(Player), Has(Position)]);
  const livePlayers = useEntityQuery([HasValue(InGame, { value: gameId }), Has(Player), HasValue(Alive, { value: true })]);
  const deadPlayers = useEntityQuery([HasValue(InGame, { value: gameId }), Has(Player), HasValue(Alive, { value: false })]);
  const syncProgress = useComponentValue(SyncProgress, singletonEntity, {
    step: SyncStep.INITIALIZE,
    message: "Connecting",
    percentage: 0,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n,
  });

  let gameIsLive = false;
  if (gameSession) {
    console.log("gameSession: ", gameSession);
    console.log("gameId: ", gameId);
    gameIsLive = getComponentValue(GameSession, gameSession[0])?.isLive || false;
    console.log("gameIsLive: ", gameIsLive);
  }

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
      await startMatch(gameId, playersSpawned, startTime);
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        const message = (error as ErrorWithShortMessage).shortMessage;
        handleError(message);
      }
    }
  };

  return (
    <div className="items-center justify-center">
      
      {!showGameBoard ? (
        <Lobby setShowGameBoard={setShowGameBoard} showGameBoard={showGameBoard} currentGameID={currentGameID} />
      ) : syncProgress.step !== SyncStep.LIVE ? (
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
                  {currentGameID ? 
                    <>
                      <p>Game ID: {currentGameID}</p>
                      <p>Share this with other players so they can join your game</p>
                      <p>When you have enough players (min 2), hit "Start Match"</p>
                    </>
                    :
                    <p>Spawn to get a sharable game ID</p>
                  }
                <br />
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
              gameID={gameId}
              />
        </div>
      )}
      {showGameBoard && <button onClick={() => setShowGameBoard(false)}>Back to Lobby</button>}
    </div>
  );
};
