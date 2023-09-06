import React, { createContext, useContext, useState } from "react";
import { ErrorModal } from "./ErrorModal";

type ErrorContextProps = {
  errorMessage: string;
  handleError: (message: string) => void;
};
type ErrorProviderProps = { children?: React.ReactNode };

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within an ErrorProvider");
  }
  return context;
};

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleError = (message: string) => {
    setErrorMessage(message);
  };

  const closeErrorModal = () => {
    setErrorMessage("");
  };

  return (
    <ErrorContext.Provider value={{ errorMessage, handleError }}>
      {children}
      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={closeErrorModal} />
      )}
    </ErrorContext.Provider>
  );
};
