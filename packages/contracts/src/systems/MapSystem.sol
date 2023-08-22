// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { MapConfig, Movable, Player, Position, Health, Range, ActionPoint, GameStartTime, GameIsLive, Username } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";

contract MapSystem is System {

  function spawn(uint32 x, uint32 y, string memory username) public {

    //TODO Stop new players from spawning if match has already started
    //TODO: Allow the player to enter a name to associate with their piece - hovering over the piece in the UI will show the name

    // create a player entity using the message senders address as the key
    bytes32 player = addressToEntityKey(address(_msgSender()));
    
    // we could limit the number of players here as well
    require(!Player.get(player), "already spawned");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height ) = MapConfig.get();
    x = (x + width) % width;
    y = (y + height) % height;

    // when we spawn a new player we store state in separate tables (components) and associate them with the player entity rather than storing everything in a single contract
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
    // ensure the player entity has the movable component
    require(Movable.get(player), "cannot move");

    // match moust hve started
    require(GameIsLive.get(), "Match hasn't started yet. Stay put!");

    // retrieve the players current position
    (uint32 fromX, uint32 fromY) = Position.get(player);
    // if a players range is dynamic, could retrieve a value from a range component here instead of the hardcoded '1'
    require(distance(fromX, fromY, x, y) == 1, "can only move to adjacent spaces");

    // player must have an action point to move
    // require(ActionPoint.get(player) >= 1, "You need an action point in order to move");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height ) = MapConfig.get();
    x = (x + width) % width;
    y = (y + height) % height;

    Position.set(player, x, y);
  }

  function distance(uint32 fromX, uint32 fromY, uint32 toX, uint32 toY) internal pure returns (uint32) {
    uint32 deltaX = fromX > toX ? fromX - toX : toX - fromX;
    uint32 deltaY = fromY > toY ? fromY - toY : toY - fromY;
    return deltaX + deltaY;
  }
}
