// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { Username, 
        UsernameTableId, 
        GameSession, 
        GameSessionTableId,
        Position, PositionTableId, Player, PlayerTableId } from "../src/codegen/Tables.sol";
import { PlayerAtPosition } from "../src/codegen/index.sol";
import { addressToEntityKey } from "../src/addressToEntityKey.sol";
import { PackedCounter } from "@latticexyz/store/src/PackedCounter.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";

contract MapSystemTest is MudTest {
  
  IWorld public world;
  uint32 gameId = 123456789;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);

    
    vm.startPrank(address(0x1));
    string memory playerOne = "playerOne";
    world.spawn(1629474300, playerOne, gameId);
    vm.stopPrank();

    vm.startPrank(address(0x2));
    string memory playerTwo = "playerTwo";
    world.spawn(1629474400, playerTwo, gameId);
    vm.stopPrank();
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

    QueryFragment[] memory fragments = new QueryFragment[](1);
    fragments[0] = QueryFragment(QueryType.Has, PlayerTableId, new bytes(0));
    bytes32[][] memory keyTuples = query(fragments);

    assertEq(keyTuples.length, 2);
  }
    
    // address creator = world.creator();
    // vm.startPrank(creator);

function testInvalidMove() public {

    uint32 timestamp = 1629474300;    
    world.startMatch(gameId, 2, timestamp);
    vm.startPrank(address(0x1));
    (uint32 startX, uint32 startY) = Position.get(addressToEntityKey(msg.sender));
    world.claimActionPoint(timestamp, gameId);
    vm.expectRevert("Cannot move off the map");
    world.move(timestamp, -1, 0, gameId);   
    // (uint32 endX, uint32 endY) = Position.get(addressToEntityKey(msg.sender));
    // console.log("end coordinates: ", endX, ", ", endY);
    vm.stopPrank();
}

//     function entityKeyToAddress(bytes32 entityKey) internal pure returns (address) {
//         return address(uint160(uint256(entityKey)));
//     }

//     function testPrintplayerDetails() public {
//       console.log("Player address: ");
//       console.log(msg.sender);
//       console.log("++++++++++++++++++++++++++++++++++++++++++++++");

//       console.log("Player entity: ");
//       console.logBytes32(addressToEntityKey(msg.sender));
//       console.log("++++++++++++++++++++++++++++++++++++++++++++++");

//       console.log("Player address: ");
//       console.log(entityKeyToAddress(addressToEntityKey(msg.sender)));
//       console.log("++++++++++++++++++++++++++++++++++++++++++++++");
//     }

//     function testDeletePlayerAtPosition() public {
//       address creator = world.creator();
//       vm.startPrank(creator);

//       string memory username = "player";
//       uint32 gameId = 123456789;
//       uint32 spawnTimestamp = 1629474300;
//       world.spawn(spawnTimestamp, username, gameId);

//       (uint32 x, uint32 y) = Position.get(world, addressToEntityKey(msg.sender));
//       console.log("start coordinates: ", x, ", ", y); // should be (0, 0)

//       console.logBytes32(PlayerAtPosition.get(gameId, x, y));
//       PlayerAtPosition.deleteRecord(gameId, x, y);
//       console.logBytes32(PlayerAtPosition.get(gameId, x, y));
//       vm.stopPrank();
//     }


//     // function testBackwardsMove() public {
//     //     string memory username = "test_player";
//     //     uint32 gameId = 123456789;
//     //     uint32 timestamp = 1629474300;
//     //     world.spawn(timestamp, username, gameId);
//     //     (uint32 startX, uint32 startY) = Position.get(addressToEntityKey(msg.sender));
//     //     bytes32 playerAtPosition = PlayerAtPosition.get(startX, startY, gameId);
//     //     // console.log("playerAtPosition: %s", playerAtPosition);
//     //     console.log("******************");
//     //     console.logBytes32(playerAtPosition);
//     //     console.log("******************");

//     //     // world.move(timestamp, startX + 1, startY, gameId);    
//     //     // (uint32 endX, uint32 endY) = Position.get(addressToEntityKey(msg.sender));
//     //     // assertEq(endX, startX + 1);
//     //     // assertEq(endY, startY);
//     // }

}
