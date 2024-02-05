import { useState, useEffect } from "react";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { Entity, Has, HasValue, getComponentValue } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { GameBoard } from "./components/GameBoard";
import { PlayersList } from "./components/PlayersList";
import { ErrorWithShortMessage } from "./CustomTypes";
import ActivityLogComponent from "./components/ActivityLogComponent";
import { useGameContext } from "./hooks/GameContext";
import SpawnModal from "./modals/SpawnModal";
import LeaveGameModal from "./modals/LeaveGameModal";
import RulesModal from "./modals/RulesModal";
import Lobby from "./components/Lobby";
import logo from "../assets/mud-logo.png";

export const App = () => {
  // Custom Types
  enum SyncStep {
    INITIALIZE = "initialize",
    SNAPSHOT = "snapshot",
    RPC = "rpc",
    LIVE = "live",
  }

  // Contexts
  const {
    displayMessage,
    gameId,
    showGameBoard,
    setShowGameBoard,
    setGameIsWon,
    gameIsWon,
  } = useGameContext();
  const {
    network: { playerEntity },
    components: { SyncProgress, Player, Position, GameSession, InGame },
    systemCalls: { startMatch },
  } = useMUD();

  // Hooks
  const [gameStarted, setGameStarted] = useState(false);
  const [showSpawnButton, setShowSpawnButton] = useState(true);
  const [showLeaveGameButton, setShowLeaveGameButton] = useState(true);
  const [showSpawnModal, setShowSpawnModal] = useState(false);
  const [showLeaveGameModal, setShowLeaveGameModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const gameSessions = useEntityQuery([Has(GameSession)]);
  const currentGameID = useComponentValue(InGame, playerEntity)?.value;

  const allPlayers = useEntityQuery([
    HasValue(InGame, { value: gameId! }),
    Has(Player),
    Has(Position),
  ]);
  const syncProgress = useComponentValue(SyncProgress, singletonEntity, {
    step: SyncStep.INITIALIZE,
    message: "Connecting",
    percentage: 0,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n,
  });

  let gameIsLive = false;
  if (gameSessions) {
    // loop through gameSessions and find the one with the matching gameId
    for (let i = 0; i < gameSessions.length; i++) {
      const gameSession = gameSessions[i];
      const rec = getComponentValue(GameSession, gameSession);
      console.dir(rec);
      if (rec?.gameId === gameId) {
        gameIsLive = rec.isLive;
        setGameIsWon(rec.isWon);
      }
    }
  }

  useEffect(() => {
    if (gameIsLive) {
      setGameStarted(true);
    }
  }, [gameIsLive]);

  useEffect(() => {
    // Hide spawn button if player is already spawned
    const playerEntityExists =
      getComponentValue(Player, playerEntity)?.value == true;
    if (playerEntityExists && currentGameID) {
      setShowSpawnButton(false);
      setShowLeaveGameButton(true);
    } else {
      setShowSpawnButton(true);
      setShowLeaveGameButton(false);
    }
  });

  const handleSpawnClick = () => {
    setShowSpawnModal(true);
  };

  const handleLeaveGameClick = () => {
    setShowLeaveGameModal(true);
  };

  const start = async () => {
    const playersSpawned = allPlayers.length;
    const startTime = Date.now();
    if (!gameId) {
      throw new Error("No game ID found");
    }
    try {
      await startMatch(gameId, playersSpawned, startTime);
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        const message = (error as ErrorWithShortMessage).cause.data.args[0];
        displayMessage(message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-space-bg">
    <img src={logo} alt="Logo" className="absolute top-0 right-0 m-4 w-40 h-30 z-0" />
      <div className="flex justify-center z-10">
        {!showGameBoard ? (
          <Lobby
            setShowGameBoard={setShowGameBoard}
            showGameBoard={showGameBoard}
            currentGameID={currentGameID}
          />
        ) : syncProgress.step !== SyncStep.LIVE ? (
          <div>
            {syncProgress.message} ({Math.floor(syncProgress.percentage)}%)
          </div>
        ) : (
          <div
            className={`flex flex-col ${
              showSpawnModal ? "blur-md" : ""
            } w-full h-full`}
          >
            <div className="m-2 flex items-start border border-gray-700 p-3 rounded-md bg-slate-900">
              {showSpawnButton ? (
                <button className="btn-sci-fi" onClick={handleSpawnClick}>
                  Spawn
                </button>
              ) : (
                <button
                  onClick={start}
                  className={`text-white  ${
                    gameIsLive ? "btn-active" : "btn-sci-fi"
                  }`}
                  disabled={gameIsLive}
                >
                  {gameIsLive ? "Match Started" : "Start Match"}
                </button>
              )}
              {showLeaveGameButton && (
                <button className="btn-sci-fi" onClick={handleLeaveGameClick}>
                  Leave Game
                </button>
              )}
              <button
                className="btn-sci-fi"
                onClick={() => setShowGameBoard(false)}
              >
                Back to Lobby
              </button>
              <button
                className="btn-sci-fi"
                onClick={() => setShowRulesModal(true)}
              >
                Rules
              </button>
              <br />
              {currentGameID ? (
                <>
                  <p>
                    Game ID:{" "}
                    <strong className="text-orange-500 bg-gray-800 p-1 rounded-md">
                      {currentGameID}
                    </strong>
                    (Share this with other players so they can join your game)
                  </p>
                </>
              ) : (
                <p>Spawn to get a sharable game ID</p>
              )}
            </div>
            <div className="flex justify-center">
              <div className="m-2 flex-col w-1/3 bg-slate-900 border border-gray-700 p-2 min-w-[30rem] max-h-[40rem] rounded-md overflow-auto">
                <PlayersList players={allPlayers} />
              </div>
              <div className="m-2 bg-slate-900 border border-gray-700 p-2 rounded-md">
                <GameBoard players={allPlayers} />
                <br />
              </div>
              <div className="m-2 w-1/3 bg-slate-900 border border-gray-700 p-2 min-w-[30rem] max-h-[40rem] rounded-md overflow-auto">
                <ActivityLogComponent />
              </div>
            </div>
            <SpawnModal
              showSpawnModal={showSpawnModal}
              setShowSpawnModal={setShowSpawnModal}
              setShowSpawnButton={setShowSpawnButton}
            />
            <LeaveGameModal
              showLeaveGameModal={showLeaveGameModal}
              setShowLeaveGameModal={setShowLeaveGameModal}
              setShowLeaveGameButton={setShowLeaveGameButton}
              setShowGameBoard={setShowGameBoard}
            />
            <RulesModal
              showRulesModal={showRulesModal}
              setShowRulesModal={setShowRulesModal}
            />
          </div>
        )}
      </div>
    </div>
  );
};
