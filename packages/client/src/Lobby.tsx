import React, { useState } from "react";
import { uuid } from "@latticexyz/utils";
import { useMUD } from "./MUDContext";

interface LobbyProps {
  setGameID: React.Dispatch<React.SetStateAction<string>>;
  setShowGameBoard: React.Dispatch<React.SetStateAction<boolean>>;
  showGameBoard: boolean;
  currentGameID: string;
}

const Lobby: React.FC<LobbyProps> = ({ setGameID, setShowGameBoard, showGameBoard, currentGameID }) => {

    const {
        network: { playerEntity },
        components: { SyncProgress, Player, Position, GameIsLive, Alive, GameId, InGame },
        systemCalls: { spawn, startMatch },
        } = useMUD();

    const [inputGameID, setInputGameID] = useState('');

    const handleCreateGame = () => {
        const gameID = uuid();
        setGameID(gameID);
        setShowGameBoard(true);
        console.log("GameID: ", gameID);
    }

    const handleJoinGame = (eventOrGameID?: React.MouseEvent<HTMLButtonElement, MouseEvent> | string) => {
        let gameIDToJoin: string;
        if (typeof eventOrGameID === 'string') {
          gameIDToJoin = eventOrGameID;
        } else {
          gameIDToJoin = inputGameID;
        }
        
        if (gameIDToJoin) {
          setGameID(gameIDToJoin);
          setShowGameBoard(true);
        }
    };

    return (
        <div>
            {currentGameID ? 
                <>
                <p>{`You are already in game: ${currentGameID}`}</p>
                <button onClick={() => handleJoinGame(currentGameID)}>Join This Game</button>
                </>
                :
                <>
                <p>You are not in a game. Create a new one or join an existing one.</p>
                <div>
                <button onClick={handleCreateGame}>Create New Game</button>
                <br />
                <input
                        type="text"
                        className="text-black"
                        placeholder="Enter Game ID"
                        value={inputGameID}
                        onChange={(e) => setInputGameID(e.target.value)}
                        />
                        <button onClick={() => handleJoinGame(inputGameID)}>Join Game</button>
                    </div>
                </>
            }
        </div>
    );
};

export default Lobby;
