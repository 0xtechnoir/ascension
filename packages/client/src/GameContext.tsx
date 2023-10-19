import React, { createContext, useContext, useState } from "react";
import { MessageModal } from "./MessageModal";

type GameContextProps = {
  message: string;
  gameId: number | null;
  gameIsWon: boolean;
  showGameBoard: boolean;
  setGameId: React.Dispatch<React.SetStateAction<number | null>>;
  setGameIsWon: React.Dispatch<React.SetStateAction<boolean>>;
  setShowGameBoard: React.Dispatch<React.SetStateAction<boolean>>;
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

  const displayMessage = (message: string) => {
    setMessage(message);
  };

  const closeMessageModal = () => {
    setMessage("");
    if (gameIsWon) {
      setShowGameBoard(false);
    }
  };

  const values = {
    message,
    gameId: gameId,
    gameIsWon: gameIsWon,
    showGameBoard: showGameBoard,
    setGameId: setGameId,
    setGameIsWon: setGameIsWon,
    setShowGameBoard: setShowGameBoard,
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
