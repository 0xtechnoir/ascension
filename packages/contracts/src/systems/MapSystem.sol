// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { 
  MapConfig, 
  Movable, 
  Player, 
  PlayerTableId, 
  Position, 
  PositionTableId, 
  Health, 
  Range, 
  ActionPoint, 
  // GameIsLive, 
  Username, 
  Alive, 
  LastActionPointClaim, 
  InGame, 
  InGameTableId,
  GameSession,
  PlayerAtPosition,
  PlayerInGame } from "../codegen/index.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { getKeysInTable } from "@latticexyz/world-modules/src/modules/keysintable/getKeysInTable.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import { MoveExecuted, MoveExecutedData } from "../codegen/Tables.sol";
import { PlayerSpawned, PlayerSpawnedData } from "../codegen/Tables.sol";
import { PlayerLeftGame, PlayerLeftGameData } from "../codegen/Tables.sol";
import { PackedCounter } from "@latticexyz/store/src/PackedCounter.sol";
import { console } from "forge-std/console.sol";

contract MapSystem is System {

  struct Point {
      uint16 x;
      uint16 y;
  }
  
  function spawn(uint256 _timestamp, string memory _username, uint32 _gameId) public {
    uint16 x;
    uint16 y;

    // TODO - find a better way to do this
    Point[] memory points = new Point[](8);
    points[0] = Point(0, 0);
    points[1] = Point(0, 5);
    points[2] = Point(0, 10);
    points[3] = Point(5, 0);
    points[4] = Point(5, 10);
    points[5] = Point(10, 0);
    points[6] = Point(10, 5);
    points[7] = Point(10, 10);
    
    bytes32 player = addressToEntityKey(address(_msgSender()));
    require(!GameSession.getIsLive(_gameId), "Cannot spawn players after match has started");  
    require(!PlayerInGame.getValue(player), "Player is already in a game");
    require(GameSession.getPlayers(_gameId) < 8, "Max players reached");

    // loop through the points array and find a point that is not already occupied
    for (uint i = 0; i < points.length; i++) {
      bytes32 playerAtPosition = PlayerAtPosition.get(_gameId, points[i].x, points[i].y);
      // if player has a value then the position is already occupied
      if (playerAtPosition != bytes32(0)) {
        continue;
      }
      x = points[i].x;
      y = points[i].y;
      break;
    }

    // Game Session attributes
    GameSession.setGameId(_gameId, _gameId);
    GameSession.setPlayers(_gameId, GameSession.getPlayers(_gameId) + 1);
    GameSession.setIsLive(_gameId, false);
    GameSession.setIsWon(_gameId, false);
    
    // set the players attributes
    Alive.set(player, true);
    Player.set(player, true);
    Username.set(player, _username);
    Position.set(player, x, y);  // TODO - PlayerAtPosition might make this redundent
    PlayerAtPosition.set(_gameId, x, y, player);
    Movable.set(player, true);
    Health.set(player, 3);
    Range.set(player, 2);
    InGame.set(player, _gameId);
    ActionPoint.set(player, 3);
    LastActionPointClaim.set(player, 0); 

    PlayerSpawned.set(_timestamp, PlayerSpawnedData({
      timestamp: _timestamp,
      x: x, 
      y: y, 
      player: _username,
      gameId: _gameId
    })); 
  }
  
  function leaveGame(uint256 _timestamp, uint32 _gameId) public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    require(InGame.get(player) == _gameId, "Player is not in this game");
    string memory username = Username.get(player);
    InGame.deleteRecord(player);
    PlayerInGame.deleteRecord(player);

    if (GameSession.getPlayers(_gameId) > 0) {
      GameSession.setPlayers(_gameId, GameSession.getPlayers(_gameId) - 1);
    }

     PlayerLeftGame.set(_timestamp, PlayerLeftGameData({
      timestamp: _timestamp,
      player: username,
      gameId: _gameId
    }));
  }

  function move(uint256 timestamp, int32 deltaX, int32 deltaY, uint32 _gameId) public {

    bytes32 player = addressToEntityKey(_msgSender());
    require(GameSession.getIsLive(_gameId), "Match hasn't started yet");
    require(Movable.get(player), "Moving disabled");
    require(Alive.get(player), "You are dead");
    uint32 currentActionPoints = ActionPoint.get(player);
    require(currentActionPoints > 0, "An Action point is required to move");
    require(
        isValidDelta(deltaX, deltaY),
        "Invalid movement: Either deltaX or deltaY must be non-zero, and the other must be zero."
    );
  
    // retrieve the players current position
    (uint32 fromX, uint32 fromY) = Position.get(player);
    console.log("fromX: ", fromX, ", fromY: ", fromY);
    console.log("deltaX: ");
    console.logInt(deltaX);
    console.log("deltaY: ");
    console.logInt(deltaY);
    uint32 toX = uint32(int32(fromX) + deltaX);
    uint32 toY = uint32(int32(fromY) + deltaY);
    console.log("toX: ", toX, ", toY: ", toY);
    checkForValidMove(fromX, fromY, deltaX, deltaY);


    PlayerAtPosition.deleteRecord(_gameId, fromX, fromY);
    
    bytes32 playerAtPosition = PlayerAtPosition.get(_gameId, toX, toY);
    require(playerAtPosition == bytes32(0), "There is already a player at the given position in the same game");

    Position.set(player, toX, toY); // TODO - PlayerAtPosition might make this redundent
    PlayerAtPosition.set(_gameId, toX, toY, player);

    string memory username = Username.get(player);
     MoveExecuted.set(timestamp, MoveExecutedData({
      timestamp: timestamp,
      fromX: fromX, 
      fromY: fromY, 
      toX: toX, 
      toY: toY,
      gameId: _gameId,
      player: username
    }));

    ActionPoint.set(player, currentActionPoints - 1);
  }

  function isValidDelta(int32 deltaX, int32 deltaY) private pure returns (bool) {
    // Check if both deltaX and deltaY are within the valid range (-1, 0, 1)
    bool deltaXValid = (deltaX == 1 || deltaX == -1 || deltaX == 0);
    bool deltaYValid = (deltaY == 1 || deltaY == -1 || deltaY == 0);

    // Ensure that if one is non-zero, the other must be zero
    bool mutuallyExclusive = (deltaX != 0 && deltaY == 0) || (deltaY != 0 && deltaX == 0);

    return deltaXValid && deltaYValid && mutuallyExclusive;
}

  function checkForValidMove(uint32 fromX, uint32 fromY, int32 deltaX, int32 deltaY) internal view {
    (uint32 width, uint32 height) = MapConfig.get();

    if ((fromX == 0 && deltaX == -1) ||
        (fromX == width - 1 && deltaX == 1) ||
        (fromY == 0 && deltaY == -1) || 
        (fromY == height - 1 && deltaY == 1)) {
        revert("Cannot move off the map");
    }
}
}
