// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/store/src/MudTest.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { GameIsLive, Turn, GameStartTime, Username, UsernameTableId } from "../src/codegen/Tables.sol";
import { addressToEntityKey } from "../src/addressToEntityKey.sol";

contract MapSystemTest is MudTest {
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

  function testSpawn() public {
    string memory username = "test_player";
    world.spawn(username);
    bytes32[] memory keysWithValue = getKeysWithValue(UsernameTableId, Username.encode(username));
    assertEq(keysWithValue.length, 1);
  }
}
