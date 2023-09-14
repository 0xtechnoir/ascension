// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { MapConfig, Movable, Player, PlayerTableId, Position, PositionTableId, Health, Range, ActionPoint, GameIsLive, Username, Alive, LastActionPointClaim, InGame, InGameTableId } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { getKeysInTable } from "@latticexyz/world/src/modules/keysintable/getKeysInTable.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { console } from "forge-std/console.sol";
import { MoveExecuted, MoveExecutedData } from "../codegen/Tables.sol";
import { PlayerSpawned, PlayerSpawnedData } from "../codegen/Tables.sol";

contract MapSystem is System {

  struct Point {
      uint16 x;
      uint16 y;
  }
  
  function spawn(uint256 timestamp, string memory username, string memory gameID) public {

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
      
    require(!GameIsLive.get(), "Cannot spawn players after match has started");
    // create a player entity using the message senders address as the key
    bytes32 player = addressToEntityKey(address(_msgSender()));
    // we could limit the number of players here as well
    require(!Player.get(player), "already spawned");

    // loop through the points array and find a point that is not already occupied
    for (uint i = 0; i < points.length; i++) {
      QueryFragment[] memory fragments = new QueryFragment[](2);
      fragments[0] = QueryFragment(QueryType.HasValue, InGameTableId, InGame.encode(gameID));
      fragments[1] = QueryFragment(QueryType.HasValue, PositionTableId, Position.encode(points[i].x, points[i].y));
      bytes32[][] memory keyTuples = query(fragments);
      if (keyTuples.length == 0) {
          x = points[i].x;
          y = points[i].y;
          break;
      }
    }

    // set the players attributes
    Alive.set(player, true);
    Player.set(player, true);
    Username.set(player, username);
    Position.set(player, x, y);
    Movable.set(player, true);
    Health.set(player, 3);
    Range.set(player, 2);
    InGame.set(player, gameID);
    ActionPoint.set(player, 0);
    LastActionPointClaim.set(player, 0); 

    PlayerSpawned.emitEphemeral(timestamp, PlayerSpawnedData({
      timestamp: timestamp,
      x: x, 
      y: y, 
      player: username,
      gameID: gameID
    })); 
  }
  function move(uint256 timestamp, uint32 x, uint32 y) public {

    bytes32 player = addressToEntityKey(_msgSender());
    
    require(GameIsLive.get(), "Match is not live");
    require(Movable.get(player), "Moving disabled");
    require(Alive.get(player), "You are dead");
    uint32 currentActionPoints = ActionPoint.get(player);
    require(currentActionPoints > 0, "An Action point is required to move");

    // retrieve the players current position
    (uint32 fromX, uint32 fromY) = Position.get(player);
    require(distance(fromX, fromY, x, y) == 1, "You can only move to adjacent spaces");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height ) = MapConfig.get();
    x = (x + width) % width;
    y = (y + height) % height;
    
    // check if there is already a player at the given position
    bytes32[] memory keysWithValue = getKeysWithValue(PositionTableId, Position.encode(x, y));
    require(keysWithValue.length == 0, "There is already a player at the given position");
    string memory username = Username.get(player);

    Position.set(player, x, y);
    
    MoveExecuted.emitEphemeral(timestamp, MoveExecutedData({
      timestamp: timestamp,
      player: username,
      fromX: fromX, 
      fromY: fromY, 
      toX: x, 
      toY: y
    }));

    ActionPoint.set(player, currentActionPoints - 1);
  }

  function distance(uint32 fromX, uint32 fromY, uint32 toX, uint32 toY) internal pure returns (uint32) {
    uint32 deltaX = fromX > toX ? fromX - toX : toX - fromX;
    uint32 deltaY = fromY > toY ? fromY - toY : toY - fromY;
    return deltaX + deltaY;
  }
}
