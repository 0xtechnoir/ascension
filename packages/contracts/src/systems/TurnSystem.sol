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
    //TODO: check if match has already started and if so, return
    GameIsLive.set(true);
    Turn.set(1);
    GameStartTime.set(startTime);
  }

  function incrementTurn() public {
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
    // allow players to spend action points to increase their range
    bytes32 player = addressToEntityKey(_msgSender());
    uint32 currentRange = Range.get(player);
    uint32 currentActionPoints = ActionPoint.get(player);
    require(GameIsLive.get(), "Match has not started yet.");
    require(currentActionPoints > 0, "You need an action point in order to increase your range");
    Range.set(player, currentRange + 1);
    ActionPoint.set(player, currentActionPoints - 1);
  }

  // function transferActionPoint(uint32 recipient) public {
  //   // allow players to transfer action points to other players
  //   bytes32 player = addressToEntityKey(_msgSender());
  //   uint32 currentActionPoints = ActionPoint.get(player);
  //   require(currentActionPoints > 0, "You need an action point in order to transfer an action point");
  //   ActionPoint.set(player, currentActionPoints - 1);
  //   ActionPoint.set(recipient, ActionPoint.get(recipient) + 1);
  // }
  


}