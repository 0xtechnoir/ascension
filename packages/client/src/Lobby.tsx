import React, { useState } from "react";
import { useGameContext } from "./GameContext";
import { useEntityQuery } from "@latticexyz/react";
import { getComponentValue, Has, HasValue } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";

interface LobbyProps {
  setShowGameBoard: React.Dispatch<React.SetStateAction<boolean>>;
  showGameBoard: boolean;
  currentGameID: number;
}

const Lobby: React.FC<LobbyProps> = ({ setShowGameBoard, currentGameID }) => {

    const { setGameId } = useGameContext();
    const { components: { GameSession } } = useMUD();

    const [inputGameID, setInputGameID] = useState<number>(0);
    
    const allGameSessions = useEntityQuery([Has(GameSession)]);
    const allGameIds = allGameSessions.map((entity) => {
      const rec = getComponentValue(GameSession, entity);
      return rec?.gameId;
    });
    console.log("allGameIds: ", allGameIds);

    const handleCreateGame = () => {
      // generate a unique 9-digit gameId
      let gameId
      while(true) {
        gameId = Math.floor(100000000 + Math.random() * 900000000);
        if (!allGameIds.includes(gameId)) {
          break;
        }
      }     
      setGameId(gameId);
      setShowGameBoard(true);
      console.log("handleCreateGame GameId created: ", gameId);
    }
    const handleJoinGame = (eventOrGameID?: React.MouseEvent<HTMLButtonElement, MouseEvent> | number) => {
        let gameIDToJoin: number;
        if (typeof eventOrGameID === 'number') {
          gameIDToJoin = eventOrGameID;
        } else {
          gameIDToJoin = inputGameID;
        }
        
        if (gameIDToJoin) {
          setGameId(gameIDToJoin);
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
                        onChange={(e) => setInputGameID(Number(e.target.value))}
                        />
                        <button onClick={() => handleJoinGame(inputGameID)}>Join Game</button>
                    </div>
                </>
            }
        </div>
    );
};

export default Lobby;
