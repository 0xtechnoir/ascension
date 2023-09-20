// // SPDX-License-Identifier: MIT
// pragma solidity >=0.8.0;
// import "forge-std/Test.sol";
// import { MudTest } from "@latticexyz/store/src/MudTest.sol";
// import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
// import { console } from "forge-std/console.sol";
// import { IWorld } from "../src/codegen/world/IWorld.sol";
// // import { GameIsLive } from "../src/codegen/Tables.sol";

// contract TurnTest is MudTest {
//   IWorld public world;
//   string gameId = "5027d732-5461-46c4-906a-2a4c1d84702d";
//   uint256 timestamp = 1629474300;

//   function setUp() public override {
//     super.setUp();
//     world = IWorld(worldAddress);
//   }

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
// }
