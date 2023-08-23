// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { MapConfig, Movable, Player, PlayerTableId, Position, Health, Range, ActionPoint, Turn, GameStartTime, GameIsLive } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";
import { getKeysInTable } from "@latticexyz/world/src/modules/keysintable/getKeysInTable.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { PlayerTableId, Position, PositionTableId } from "../codegen/Tables.sol";

contract TurnSystem is System {

  function startMatch(uint32 playersSpawned, uint256 startTime) public {
    require(playersSpawned > 1, "Not enough players to start match");
    require(!GameIsLive.get(), "Match has already started");
    GameIsLive.set(true);
    Turn.set(1);
    GameStartTime.set(startTime);
  }

  function incrementTurn() public {
    require(GameIsLive.get(), "Match has not started yet.");
    uint32 currentTurn = Turn.get();
    Turn.set(currentTurn + 1);
    // get all players and increment action point by 1
    assignActionPointsToAllPlayers();
  }

  function assignActionPointsToAllPlayers() private {
    // get all players and increment action point by 1
    bytes32[][] memory players = getKeysInTable(PlayerTableId);
    for (uint256 i; i < players.length; i++) {
        bytes32 player = players[i][0];
        ActionPoint.set(player, ActionPoint.get(player) + 1);
    }
  }

  function increaseRange() public {
    bytes32 player = addressToEntityKey(_msgSender());
    require(GameIsLive.get(), "Match has not started yet.");
    uint32 currentRange = Range.get(player);
    uint32 currentActionPoints = ActionPoint.get(player);
    require(currentActionPoints > 0, "You need an action point in order to increase your range");
    Range.set(player, currentRange + 1);
    ActionPoint.set(player, currentActionPoints - 1);
  }

  function sendActionPoint(bytes32 _recipient) public {
    require(GameIsLive.get(), "Match has not started yet.");
    bytes32 player = addressToEntityKey(_msgSender());
    uint32 currentActionPoints = ActionPoint.get(player);
    require(currentActionPoints > 0, "You need an action point in order to transfer an action point");
    
    // TODO - check if recipient is within range
    (uint32 target_x, uint32 target_y) = Position.get(_recipient);
    (uint32 player_x, uint32 player_y) = Position.get(player);
    uint32 playerRange = Range.get(player);
    require(distance(player_x, player_y, target_x, target_y) <= playerRange, "Target is out of range");

    ActionPoint.set(player, currentActionPoints - 1);
    ActionPoint.set(_recipient, ActionPoint.get(_recipient) + 1);
  }

  function attackPlayer(bytes32 _target) public {
    require(GameIsLive.get(), "Match has not started yet.");
    bytes32 player = addressToEntityKey(_msgSender());
    uint32 currentActionPoints = ActionPoint.get(player);
    require(currentActionPoints > 0, "You need an action point in order to attack");
    
    // Check if target is within range
    (uint32 target_x, uint32 target_y) = Position.get(_target);
    (uint32 player_x, uint32 player_y) = Position.get(player);
    uint32 playerRange = Range.get(player);
    require(distance(player_x, player_y, target_x, target_y) <= playerRange, "Target is out of range");

    ActionPoint.set(player, currentActionPoints - 1);
    Health.set(_target, Health.get(_target) - 1);
  }

   function distance(uint32 fromX, uint32 fromY, uint32 toX, uint32 toY) internal pure returns (uint32) {
    uint32 deltaX = fromX > toX ? fromX - toX : toX - fromX;
    uint32 deltaY = fromY > toY ? fromY - toY : toY - fromY;
    return deltaX + deltaY;
  }
}