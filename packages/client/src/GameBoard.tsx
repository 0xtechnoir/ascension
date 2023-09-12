import { useEffect, useState } from "react";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { GameMap } from "./GameMap";
import { useMUD } from "./MUDContext";
import { useKeyboardMovement } from "./useKeyboardMovement";
import {
  Entity,
  getComponentValueStrict,
  Has,
  HasValue,
} from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { useErrorContext } from "./ErrorContext";

interface GameBoardProps {
  players: Entity[];
  highlightedPlayer: Entity | null;
  setHighlightedPlayer: (player: Entity | null) => void;
  setGameStarted: (gameStarted: boolean) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  players,
  highlightedPlayer,
  setHighlightedPlayer,
}) => {
  const [showUsernameInput, setShowUsernameInput] = useState(false);

  const { handleError } = useErrorContext();
  const {
    components: {
      MapConfig,
      Player,
      Position,
      Alive,
    },
    network: { playerEntity },
  } = useMUD();

  const deadPlayers = useEntityQuery([
    Has(Player),
    HasValue(Alive, { value: false }),
  ]);
  const mappedPlayers = players.map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    let emoji = "";
    // if entity is not in the deadPlayers array give it the rocket emoji, otherwise give it the skull emoji
    if (!deadPlayers.includes(entity)) {
      emoji = entity === playerEntity ? "🚀" : "🛸";
    } else {
      emoji = "💀";
    }
    return {
      entity,
      x: position.x,
      y: position.y,
      emoji: emoji,
    };
  });

  const closeModal = () => {
    setShowUsernameInput(false);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showUsernameInput) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showUsernameInput]);

  const { moveMessage, clearMoveMessage } = useKeyboardMovement();
  useEffect(() => {
    if (moveMessage) {
      // When setting the error message, add the new message to the existing array instead of replacing it.
      handleError(moveMessage);
      clearMoveMessage();
    }
  }, [moveMessage]);

  // Function to handle the button click
  const selectPlayer = (inputX: number, inputY: number) => {
    const player = mappedPlayers.find((player) => {
      const position = getComponentValueStrict(Position, player.entity);
      return position.x === inputX && position.y === inputY;
    });

    if (player) {
      setHighlightedPlayer(player.entity);
    }
  };

  // Get map width and height from MapConfig component
  const mapConfig = useComponentValue(MapConfig, singletonEntity);
  if (mapConfig == null) {
    throw new Error(
      "map config not set or not ready, only use this hook after loading state === LIVE"
    );
  }
  const { width, height } = mapConfig;

  return (
    <div>
      <GameMap
        width={width}
        height={height}
        onTileClick={selectPlayer}
        players={mappedPlayers}
        highlightedPlayer={highlightedPlayer}
      />
    </div>
  );
};
