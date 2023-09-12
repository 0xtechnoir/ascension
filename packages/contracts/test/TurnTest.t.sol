// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/store/src/MudTest.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { GameIsLive } from "../src/codegen/Tables.sol";

contract TurnTest is MudTest {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function testStartMatchWithValidInputs() public {
    world.startMatch(1629474300, 2, 1629474300);
    assertTrue(GameIsLive.get(), "Game should be live");
  }

  function testStartMatchWithInsufficientPlayers() public {
    try world.startMatch(1629474300, 2, 1629474300) {
      fail("Should have reverted");
      } catch Error(string memory reason) {
      assertEq(reason, "Not enough players to start match");
    }
  }

  function testStartMatchWhenGameIsAlreadyLive() public {
    world.startMatch(1629474300, 2, 1629474300);
    try world.startMatch(1629474300, 2, 1629474300) {
      fail("Should have reverted");
    } catch Error(string memory reason) {
      assertEq(reason, "Match has already started");
    }
  }
}
