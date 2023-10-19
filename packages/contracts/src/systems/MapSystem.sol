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
  PlayerAtPosition } from "../codegen/index.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { getKeysInTable } from "@latticexyz/world-modules/src/modules/keysintable/getKeysInTable.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import { console } from "forge-std/console.sol";
import { MoveExecuted, MoveExecutedData } from "../codegen/Tables.sol";
import { PlayerSpawned, PlayerSpawnedData } from "../codegen/Tables.sol";
import { PlayerLeftGame, PlayerLeftGameData } from "../codegen/Tables.sol";
import { PackedCounter } from "@latticexyz/store/src/PackedCounter.sol";

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
    
    require(!GameSession.getIsLive(_gameId), "Cannot spawn players after match has started");
    // create a player entity using the message senders address as the key
    bytes32 player = addressToEntityKey(address(_msgSender()));
    // we could limit the number of players here as well

    QueryFragment[] memory inGameFragments = new QueryFragment[](1);
    inGameFragments[0] = QueryFragment(QueryType.Has, InGameTableId, new bytes(0));
    bytes32[][] memory InGameResult = query(inGameFragments);
    require(InGameResult.length == 0, "Player is already in a game");

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

    // set the players attributes
    Alive.set(player, true);
    Player.set(player, true);
    Username.set(player, _username);
    Position.set(player, x, y);  // TODO - PlayerAtPosition might make this redundent
    PlayerAtPosition.set(_gameId, x, y, player);
    Movable.set(player, true);
    Health.set(player, 3);
    Range.set(player, 2);
    GameSession.setGameId(_gameId, _gameId);
    InGame.set(player, _gameId);
    ActionPoint.set(player, 0);
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

     PlayerLeftGame.set(_timestamp, PlayerLeftGameData({
      timestamp: _timestamp,
      player: username,
      gameId: _gameId
    }));
  }

  function move(uint256 timestamp, uint32 _x, uint32 _y, uint32 _gameId) public {

    bytes32 player = addressToEntityKey(_msgSender());
    
    require(GameSession.getIsLive(_gameId), "Match hasn't started yet");
    require(Movable.get(player), "Moving disabled");
    require(Alive.get(player), "You are dead");
    uint32 currentActionPoints = ActionPoint.get(player);
    require(currentActionPoints > 0, "An Action point is required to move");

    // retrieve the players current position
    (uint32 fromX, uint32 fromY) = Position.get(player);

    require(distance(fromX, fromY, _x, _y) == 1, "You can only move to adjacent spaces");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height ) = MapConfig.get();
    _x = (_x + width) % width;
    _y = (_y + height) % height;

    PlayerAtPosition.deleteRecord(_gameId, fromX, fromY);
    
    bytes32 playerAtPosition = PlayerAtPosition.get(_gameId, _x, _y);
    require(playerAtPosition == bytes32(0), "There is already a player at the given position in the same game");

    string memory username = Username.get(player);
    Position.set(player, _x, _y); // TODO - PlayerAtPosition might make this redundent
    PlayerAtPosition.set(_gameId, _x, _y, player);

     MoveExecuted.set(timestamp, MoveExecutedData({
      timestamp: timestamp,
      fromX: fromX, 
      fromY: fromY, 
      toX: _x, 
      toY: _y,
      gameId: _gameId,
      player: username
    }));

    ActionPoint.set(player, currentActionPoints - 1);
  }

  function queryPosition(uint32 _x, uint32 _y, uint32 _gameId) public view returns (bytes32[][] memory) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, InGameTableId, abi.encode(_gameId));
    fragments[1] = QueryFragment(QueryType.HasValue, PositionTableId, abi.encode(_x, _y));
    return query(fragments);
  }
  function queryisLive(uint32 _x, uint32 _y, uint32 _gameId) public view returns (bytes32[][] memory) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, InGameTableId, abi.encode(_gameId));
    fragments[1] = QueryFragment(QueryType.HasValue, PositionTableId, abi.encode(_x, _y));
    return query(fragments);
  }

  function distance(uint32 fromX, uint32 fromY, uint32 toX, uint32 toY) internal pure returns (uint32) {
    uint32 deltaX = fromX > toX ? fromX - toX : toX - fromX;
    uint32 deltaY = fromY > toY ? fromY - toY : toY - fromY;
    return deltaX + deltaY;
  }
}
