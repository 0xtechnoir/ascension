import React, { createContext, useContext, useState } from "react";
import { ErrorModal } from "./ErrorModal";

type GameContextProps = {
  errorMessage: string;
  gameId: number | null;
  setGameId: React.Dispatch<React.SetStateAction<number | null>>;
  handleError: (message: string) => void;
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
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [gameId, setGameId] = useState<number | null>(null);

  const handleError = (message: string) => {
    setErrorMessage(message);
  };

  const closeErrorModal = () => {
    setErrorMessage("");
  };

  const values = {
    errorMessage,
    gameId: gameId,
    setGameId: setGameId,
    handleError,
  };

  return (
    <GameContext.Provider value={values}>
      {children}
      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={closeErrorModal} />
      )}
    </GameContext.Provider>
  );
};
