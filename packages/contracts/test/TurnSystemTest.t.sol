// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { PlayerAtPosition } from "../src/codegen/index.sol";
import { PlayerTableId } from "../src/codegen/Tables.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { PackedCounter } from "@latticexyz/store/src/PackedCounter.sol";
import { InGame, InGameTableId } from "../src/codegen/Tables.sol";

contract TurnSystemTest is MudTest {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testThisWorks() public {
    console.log("turn test running");
  }

  function testEndGame() public {

    uint32 gameId = 123456789;

    vm.startPrank(address(0x1));
    string memory playerOne = "playerOne";
    world.spawn(1629474300, playerOne, gameId);
    vm.stopPrank();

    vm.startPrank(address(0x2));
    string memory playerTwo = "playerTwo";
    world.spawn(1629474400, playerTwo, gameId);
    vm.stopPrank();

    QueryFragment[] memory fragments = new QueryFragment[](1);
    fragments[0] = QueryFragment(QueryType.Has, PlayerTableId, new bytes(0));
    bytes32[][] memory keyTuples = query(fragments);
    bytes32 playerOneKey = keyTuples[0][0];
    console.log("Player Entity: ");
    console.logBytes32(keyTuples[0][0]);
    uint256 timestamp = 1629474300;    
    world.startMatch(gameId, 2, timestamp);

    world.endGame(timestamp, playerOneKey, gameId);

    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicData) = InGame.encode(gameId);
    bytes32[] memory playerInSession = getKeysWithValue(InGameTableId, staticData, encodedLengths, dynamicData);
    assertEq(playerInSession.length, 0);
}

//   function testWorldExists() public {
//     uint256 codeSize;
//     address addr = worldAddress;
//     assembly {
//       codeSize := extcodesize(addr)
//     }
//     assertTrue(codeSize > 0);
//   }

//   function testStartMatchWithValidInputs() public {
//     world.startMatch(gameId, 2, timestamp);
//     // assertTrue(GameIsLive.get(), "Game should be live");
//   }

//   function testStartMatchWithInsufficientPlayers() public {
//     try world.startMatch(gameId, 2, timestamp) {
//       fail("Should have reverted");
//       } catch Error(string memory reason) {
//       assertEq(reason, "Not enough players to start match");
//     }
//   }

//   function testStartMatchWhenGameIsAlreadyLive() public {
//     world.startMatch(gameId, 2, timestamp);
//     try world.startMatch(gameId, 2, timestamp) {
//       fail("Should have reverted");
//     } catch Error(string memory reason) {
//       assertEq(reason, "Match has already started");
//     }
//   }
}

