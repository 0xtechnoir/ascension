import React, { createContext, useContext, useState } from "react";
import { Entity } from "@latticexyz/recs";
import { MessageModal } from "./MessageModal";

type GameContextProps = {
  message: string;
  gameId: number | null;
  gameIsWon: boolean;
  showGameBoard: boolean;
  highlightedPlayer: Entity | null;
  setGameId: React.Dispatch<React.SetStateAction<number | null>>;
  setGameIsWon: React.Dispatch<React.SetStateAction<boolean>>;
  setShowGameBoard: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightedPlayer: React.Dispatch<React.SetStateAction<Entity | null>>;
  displayMessage: (message: string) => void;
};
type GameProviderProps = { children?: React.ReactNode };

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within an GameProvider");
  }
  return context;
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<string>("");
  const [gameId, setGameId] = useState<number | null>(null);
  const [gameIsWon, setGameIsWon] = useState<boolean>(false);
  const [showGameBoard, setShowGameBoard] = useState(false);
  const [highlightedPlayer, setHighlightedPlayer] = useState<Entity | null>(
    null
  );

  const displayMessage = (message: string) => {
    setMessage(message);
  };

  const closeMessageModal = () => {
    setMessage("");
    console.log("closeMessageModal - gameIsWon: ", gameIsWon);
    if (gameIsWon) {
      setShowGameBoard(false);
    }
  };

  const values = {
    message,
    gameId: gameId,
    gameIsWon: gameIsWon,
    showGameBoard: showGameBoard,
    highlightedPlayer: highlightedPlayer,
    setGameId: setGameId,
    setGameIsWon: setGameIsWon,
    setShowGameBoard: setShowGameBoard,
    setHighlightedPlayer: setHighlightedPlayer,
    displayMessage,
  };

  return (
    <GameContext.Provider value={values}>
      {children}
      {message && (
        <MessageModal message={message} onClose={closeMessageModal} />
      )}
    </GameContext.Provider>
  );
};
