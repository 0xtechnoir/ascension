// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { MapConfig, Movable, Player, PlayerTableId, Position, PositionTableId, Health, Range, ActionPoint, GameStartTime, GameIsLive, Username, Alive } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { getKeysInTable } from "@latticexyz/world/src/modules/keysintable/getKeysInTable.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract MapSystem is System {
  
  function spawn(uint32 x, uint32 y, string memory username) public {
    require(!GameIsLive.get(), "Cannot spawn players after match has started");
    
    // create a player entity using the message senders address as the key
    bytes32 player = addressToEntityKey(address(_msgSender()));
    
    // we could limit the number of players here as well
    require(!Player.get(player), "already spawned");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height ) = MapConfig.get();
    x = (x + width) % width;
    y = (y + height) % height;

    // when we spawn a new player we store state in separate tables (components) and associate them with the player entity rather than storing everything in a single contract
    Alive.set(player, true);
    Player.set(player, true);
    Username.set(player, username);
    Position.set(player, x, y);
    Movable.set(player, true);
    Health.set(player, 3);
    Range.set(player, 2);
    ActionPoint.set(player, 1);   
  }

  function move(uint32 x, uint32 y) public {

    bytes32 player = addressToEntityKey(_msgSender());
    
    require(GameIsLive.get(), "Match hasn't started yet. Stay put!");
    require(Movable.get(player), "You need to be a player to move");
    require(Alive.get(player), "Cannot move, you are dead");
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

    Position.set(player, x, y);
    ActionPoint.set(player, currentActionPoints - 1);
  }

  function distance(uint32 fromX, uint32 fromY, uint32 toX, uint32 toY) internal pure returns (uint32) {
    uint32 deltaX = fromX > toX ? fromX - toX : toX - fromX;
    uint32 deltaY = fromY > toY ? fromY - toY : toY - fromY;
    return deltaX + deltaY;
  }
}
