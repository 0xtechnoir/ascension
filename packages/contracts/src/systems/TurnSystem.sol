// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { MapConfig, Movable, Player, PlayerTableId, Position, Health, Range, ActionPoint, Turn, GameStartTime, GameIsLive } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";
import { getKeysInTable } from "@latticexyz/world/src/modules/keysintable/getKeysInTable.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";

contract TurnSystem is System {

  bytes32[][] private players;
  
  // function startMatch(uint256 startTime) public {
  function startMatch(uint256 startTime) public {
    // revert("startMatch called");
    players = getKeysInTable(PlayerTableId);
    require(players.length >= 2, "two players to start match");
    GameIsLive.set(true);
    GameStartTime.set(startTime);
  }

  function incrementTurn() public {
    uint32 currentTurn = Turn.get();
    Turn.set(currentTurn + 1);
    // get all players and increment action point by 1
    for (uint256 i; i < players.length; i++) {
        bytes32 player = players[i][0];
        ActionPoint.set(player, ActionPoint.get(player) + 1);
    }
  }
}