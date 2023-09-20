import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { useGameContext } from "./GameContext";
import { useMUD } from "./MUDContext";
import { ErrorWithShortMessage } from "./CustomTypes";
import { getComponentValue } from "@latticexyz/recs";

type SpawnModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSpawnButton: React.Dispatch<React.SetStateAction<boolean>>;
  gameID: string;
};

const SpawnModal: React.FC<SpawnModalProps> = ({
  showModal,
  setShowModal,
  setShowSpawnButton,
}) => {

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [enteredUsername, setEnteredUsername] = useState("");
    const { gameId } = useGameContext();

      // Contexts
    const { handleError } = useGameContext();
    const {
        network: { playerEntity },
        components: { InGame },
        systemCalls: { spawn },
    } = useMUD();

    const sanitizeInput = (input: string) => {
        let sanitized = input.trim();
        if (sanitized.length < 3 || sanitized.length > 20) {
            setError('Username must be between 3 and 20 characters.');
            return null;
        }
        if (/[^a-zA-Z0-9_]/.test(sanitized)) { // Only allow alphanumeric and underscore
            setError('Username can only contain letters, numbers, and underscores.');
            return null;
        }
        return sanitized;
    };

    const onSubmit = async () => {
        setError("");
        setIsLoading(true);
        const sanitizedUsername = sanitizeInput(enteredUsername);

        if (!sanitizedUsername) {
            setIsLoading(false);
            return; // Stop if invalid
          }
        try {
            console.log("About to call spawn with gameId: ", gameId);
            if (!gameId) {
              throw new Error("No game ID found");
            }
            await spawn(sanitizedUsername, gameId);
            setShowSpawnButton(false);
            const result = getComponentValue(InGame, playerEntity);
            console.log("Player successfully spawned into game: ", result);
          } catch (error) {
            console.log("handleModalSubmit error: ", error);
            if (typeof error === "object" && error !== null) {
              const message = (error as ErrorWithShortMessage).shortMessage;
              handleError(message);
            }
          } finally {
            setIsLoading(false);
            setShowModal(false);
          }
      };

      const dismissError = () => {
        setError("");
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
        dismissError();
      };

  return (
    <Modal
      onClose={handleCloseModal}
      open={showModal}
      className="flex items-center justify-center"
    >
      <div className="bg-white rounded-lg p-8 shadow-lg w-96 text-black relative">
        <button 
          onClick={handleCloseModal} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1"
        >
          X
        </button>
        <h2 className="text-2xl mb-4">Enter a Username</h2>
        {error ? (
          <div className="text-red-500">
            {error}
            <button 
              onClick={dismissError} 
              className="text-blue-500 hover:text-blue-700 underline ml-2"
            >
              Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className="text-gray-500">Spawning, please wait...</div>
        ) : (
          <div>
            <input
              type='text'
              autoFocus  // Set autofocus here
              onChange={(e) => setEnteredUsername(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter' && enteredUsername.trim() !== '') {
                  onSubmit();
                }
              }}
              className="border rounded p-2 w-full"
            />
            <button
              onClick={onSubmit}
              className="mt-4 bg-blue-500 text-white h-10 px-6 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SpawnModal;
