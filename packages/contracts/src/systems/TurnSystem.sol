// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { MapConfig, Movable, Player, PlayerTableId, Position, Health, Range, ActionPoint, Turn, GameStartTime, GameIsLive } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";
import { getKeysInTable } from "@latticexyz/world/src/modules/keysintable/getKeysInTable.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";

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
    bytes32[][] memory players = getKeysInTable(PlayerTableId);
    for (uint256 i; i < players.length; i++) {
        bytes32 player = players[i][0];
        ActionPoint.set(player, ActionPoint.get(player) + 1);
    }
  }
}