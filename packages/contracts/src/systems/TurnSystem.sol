// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { MapConfig, Movable, Player, PlayerTableId, Position, Health, Range, ActionPoint, Turn, GameIsLive, Alive, Champion, Username, LastActionPointClaim, APClaimInterval, ActionPointClaimExecuted, ActionPointClaimExecutedData } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";
import { getKeysInTable } from "@latticexyz/world/src/modules/keysintable/getKeysInTable.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { PlayerTableId, Position, PositionTableId, AliveTableId } from "../codegen/Tables.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { GameStarted, GameStartedTableId } from "../codegen/Tables.sol";
import { AttackExecuted, AttackExecutedData } from "../codegen/Tables.sol";
import { SendActionPointExecuted, SendActionPointExecutedData } from "../codegen/Tables.sol";
import { RangeIncreaseExecuted, RangeIncreaseExecutedData } from "../codegen/Tables.sol";

contract TurnSystem is System {

  function startMatch(uint256 gameId, uint32 playersSpawned, uint256 startTime) public {
    require(playersSpawned > 1, "Not enough players to start match");
    require(!GameIsLive.get(), "Match has already started");
    GameIsLive.set(true);
    Turn.set(1);
    GameStarted.emitEphemeral(gameId, startTime);
  }

  function incrementTurn() public {
    require(GameIsLive.get(), "Match has not started yet.");
    // TODO - Should have some logic in here that stops people from arbitrarily incrementing the turn
    uint32 currentTurn = Turn.get();
    Turn.set(currentTurn + 1);
    assignActionPointsToAllLivePlayers();
  }

  function assignActionPointsToAllLivePlayers() private {
    // get all players and increment action point by 1
    bytes32[][] memory players = getKeysInTable(PlayerTableId);
    for (uint256 i; i < players.length; i++) {
        bytes32 player = players[i][0];
        if (Alive.get(player)) {
          ActionPoint.set(player, ActionPoint.get(player) + 1);
        }
    }
  }

  function increaseRange(uint256 timestamp) public {
    bytes32 player = addressToEntityKey(_msgSender());
    require(GameIsLive.get(), "Match is not live.");
    require(Alive.get(player), "Not possible when dead");
    uint32 currentRange = Range.get(player);
    uint32 currentActionPoints = ActionPoint.get(player);
    require(currentActionPoints > 0, "You need an action point in order to increase your range");
    Range.set(player, currentRange + 1);
    ActionPoint.set(player, currentActionPoints - 1);

    string memory sender = Username.get(player);
    RangeIncreaseExecuted.emitEphemeral(timestamp, RangeIncreaseExecutedData({
      timestamp: timestamp,
      player: sender
    })); 
  }

  function sendActionPoint(uint256 timestamp, bytes32 _recipient) public {
    bytes32 player = addressToEntityKey(_msgSender());
    require(GameIsLive.get(), "Match is not live.");
    require(Alive.get(player), "Not possible when dead");
    require(Alive.get(_recipient), "Cannot send AP to a dead player");
    uint32 currentActionPoints = ActionPoint.get(player);
    require(currentActionPoints > 0, "You need an action point in order to transfer an action point");
    
    // TODO - check if recipient is within range
    (uint32 target_x, uint32 target_y) = Position.get(_recipient);
    (uint32 player_x, uint32 player_y) = Position.get(player);
    uint32 playerRange = Range.get(player);
    require(distance(player_x, player_y, target_x, target_y) <= playerRange, "Target is out of range");

    ActionPoint.set(player, currentActionPoints - 1);
    ActionPoint.set(_recipient, ActionPoint.get(_recipient) + 1);

    string memory sender = Username.get(player);
    string memory reciever = Username.get(_recipient);
    SendActionPointExecuted.emitEphemeral(timestamp, SendActionPointExecutedData({
      timestamp: timestamp,
      sender: sender,
      reciever: reciever
    })); 
  }

  function attackPlayer(uint256 timestamp, bytes32 _target) public {
    bytes32 player = addressToEntityKey(_msgSender());
    require(GameIsLive.get(), "Match is not live.");
    require(Alive.get(player), "Not possible when dead");
    require(Alive.get(_target), "Cannot attack a dead player");
    uint32 currentActionPoints = ActionPoint.get(player);
    require(currentActionPoints > 0, "You need an action point in order to attack");
    
    // Check if target is within range
    (uint32 target_x, uint32 target_y) = Position.get(_target);
    (uint32 player_x, uint32 player_y) = Position.get(player);
    uint32 playerRange = Range.get(player);
    require(distance(player_x, player_y, target_x, target_y) <= playerRange, "Target is out of range");

    Health.set(_target, Health.get(_target) - 1);
    ActionPoint.set(player, currentActionPoints - 1);

    // Check if target is dead
    if (Health.get(_target) == 0) {
      Movable.set(_target, false);
      Range.set(_target, 0);
      Alive.set(_target, false);
    }

    string memory attacker = Username.get(player);
    string memory target = Username.get(_target);

    AttackExecuted.emitEphemeral(timestamp, AttackExecutedData({
      timestamp: timestamp,
      attacker: attacker,
      target: target
    }));  
    
    bytes32[] memory remainingPlayers = getKeysWithValue(AliveTableId, Alive.encode(true));// return all records for alive players
    if (remainingPlayers.length == 1) {
      // Only oneplayer left alive so end game
      GameIsLive.set(false);
      Champion.set(remainingPlayers[0], true);
    }
  }

  function claimActionPoint(uint256 timestamp) public {
    require(GameIsLive.get(), "Match is not live.");
    bytes32 player = addressToEntityKey(_msgSender());
    require(Alive.get(player), "Not possible when dead");

    uint32 claimInterval = APClaimInterval.get();
    uint256 lastClaimed = LastActionPointClaim.get(player);

    // if lastClaimed is equal to 0 this is the first time they are claiming so we can skip the check
    if (lastClaimed != 0) {
      require(timestamp - lastClaimed > claimInterval, "You can only claim an action point every 30 seconds");
    }
    LastActionPointClaim.set(player, timestamp);
    uint32 currentActionPoints = ActionPoint.get(player);
    ActionPoint.set(player, currentActionPoints + 1);

    string memory username = Username.get(player);
    ActionPointClaimExecuted.emitEphemeral(timestamp, ActionPointClaimExecutedData({
      timestamp: timestamp,
      player: username
    }));  
  }

  function distance(uint32 fromX, uint32 fromY, uint32 toX, uint32 toY) internal pure returns (uint32) {
    uint32 deltaX = fromX > toX ? fromX - toX : toX - fromX;
    uint32 deltaY = fromY > toY ? fromY - toY : toY - fromY;
    return deltaX + deltaY;
  }
}