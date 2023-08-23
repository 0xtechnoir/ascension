import { useEffect, useState } from "react";
import { useComponentValue } from "@latticexyz/react";
import { GameMap } from "./GameMap";
import { useMUD } from "./MUDContext";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { Entity, getComponentValueStrict } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { ErrorWithShortMessage } from "./CustomTypes";

interface GameBoardProps {
  handleError: (message: string, actionButtonText?: string, onActionButtonClick?: () => void) => void;
  players: Entity[];
  highlightedPlayer: Entity | undefined;
  setHighlightedPlayer: (player: Entity | undefined) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  handleError,
  players,
  highlightedPlayer,
  setHighlightedPlayer,
}) => {

  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [enteredUsername, setEnteredUsername] = useState("");
  const [spawnX, setSpawnX] = useState<number | null>(null);
  const [spawnY, setSpawnY] = useState<number | null>(null);

  const {
    components: { MapConfig, Player, Position, Turn, GameStartTime },
    network: { playerEntity },
    systemCalls: { spawn, startMatch },
  } = useMUD();

  const mappedPlayers = players.map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    return {
      entity,
      x: position.x,
      y: position.y,
      emoji: entity === playerEntity ? "🚀" : "🛸",
    };
  });

  const { moveMessage, clearMoveMessage } = useKeyboardMovement();
  useEffect(() => {
    console.log("moveMessage: ", moveMessage);
    if (moveMessage) {
      console.log("moveMessage: ", moveMessage);
      // When setting the error message, add the new message to the existing array instead of replacing it.
      handleError(moveMessage);
      clearMoveMessage();
    }
  }, [moveMessage]);

  const turn = useComponentValue(Turn, singletonEntity)?.value;
  const gameStartTime = useComponentValue(
    GameStartTime,
    singletonEntity
  )?.value;

  let startDate, startTime;

  if (gameStartTime) {
    const num = Number(gameStartTime);
    let dateObj = new Date(num);
    startDate = dateObj.toLocaleDateString();
    startTime = dateObj.toLocaleTimeString();
  }

  const donateActionPoint = async (player: Entity) => {
    console.log("donateActionPoint called with player: ", player);
  };

  // Function to handle the button click
  const selectPlayer = (inputX: number, inputY: number) => {
    const player = mappedPlayers.find((player) => {
      const position = getComponentValueStrict(Position, player.entity);
      return position.x === inputX && position.y === inputY;
    });

    // if (player) {
    //   handleError(
    //     "Donate an action point to this player.",
    //     "Donate Action Point",
    //     () => donateActionPoint(player.entity)
    //   );
    // }

    if (player) {
      setHighlightedPlayer(player.entity);
    }
  };

  const start = async () => {
    console.log("players: ", mappedPlayers);
    const playersSpawned = mappedPlayers.length;
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

  const spawnPlayerWithName = async (inputX: number, inputY: number) => {
    // Set the spawn coordinates in the state
    setSpawnX(inputX);
    setSpawnY(inputY);
    // Display the modal for user input
    setShowUsernameInput(true);
  };

  const handleSpawnSubmit = () => {
    if (spawnX !== null && spawnY !== null && enteredUsername) {
      // Call the spawn function with the entered username and stored coordinates
      spawn(spawnX, spawnY, enteredUsername);
      // Hide the modal afterward
      setShowUsernameInput(false);
      // Reset the spawn coordinates state
      setSpawnX(null);
      setSpawnY(null);
    }
  };

  // Only allow the player to spawn if they haven't already spawned.
  const canSpawn = useComponentValue(Player, playerEntity)?.value != true;
  // Get the map config from the singleton entity.
  const mapConfig = useComponentValue(MapConfig, singletonEntity);

  if (mapConfig == null) {
    throw new Error(
      "map config not set or not ready, only use this hook after loading state === LIVE"
    );
  }

  const { width, height } = mapConfig;

  return (
    
    <div>
      <div>Turn: {turn}</div>
      {showUsernameInput && (
        // Modal background
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 100,
        }}>
          {/* Modal content */}
          <div style={{
            backgroundColor: 'white', 
            color: 'black',
            padding: '20px', 
            borderRadius: '10px', 
            width: '300px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px'
          }}>
            <h3>Enter Username</h3>
            <input
              type="text"
              placeholder="..."
              onChange={(e) => setEnteredUsername(e.target.value)}
              style={{
                paddingLeft: '10px',
              }}
            />
            <button 
              onClick={handleSpawnSubmit}
              style={{
                padding: '10px 15px',
                borderRadius: '5px',
                backgroundImage: 'linear-gradient(to right, #6A82FB, #FC5C7D)', 
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                transition: '0.3s',
                fontSize: '16px',
                zIndex: 200,
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      <GameMap
        width={width}
        height={height}
        onTileClick={canSpawn ? spawnPlayerWithName : selectPlayer}
        players={mappedPlayers}
        highlightedPlayer={highlightedPlayer}
      />
      <button
        onClick={start}
        style={{ backgroundColor: "blue", color: "white" }}
      >
        Start Match
      </button>
      <br />
      <div>
        {gameStartTime && startDate && startTime
          ? `Game Start Date: ${startDate}, Time: ${startTime}`
          : ""}
      </div>
    </div>
  );
};
