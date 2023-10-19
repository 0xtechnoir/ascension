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
        Position, PositionTableId, PlayerTableId } from "../src/codegen/Tables.sol";
import { PlayerAtPosition } from "../src/codegen/index.sol";
import { addressToEntityKey } from "../src/addressToEntityKey.sol";
import { PackedCounter } from "@latticexyz/store/src/PackedCounter.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";

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

  // function testSpawn() public {
  //   string memory username = "test_player";
  //   uint32 gameId = 12345678;
  //   uint32 timestamp = 1629474300;
  //   world.spawn(timestamp, username, gameId);

  //   (bytes memory usernameStaticData, PackedCounter usernameEncodedLengths, bytes memory usernameDynamicData) = Username.encode(username);
  //   bytes32[] memory keysWithValue = getKeysWithValue(UsernameTableId, usernameStaticData, usernameEncodedLengths, usernameDynamicData);
  //   assertEq(keysWithValue.length, 1);

  //   (bytes memory gameSessionStaticData, PackedCounter gameSessionEncodedLengths, bytes memory gameSessionDynamicData) = GameSession.encode(true, timestamp, gameId);
  //   bytes32[] memory gameSessionValue = getKeysWithValue(GameSessionTableId, gameSessionStaticData, gameSessionEncodedLengths, gameSessionDynamicData);
  //   assertEq(gameSessionValue.length, 1);
  // }

  // function testValidMove() public {
  //   string memory playerOne = "playerOne";
  //   string memory playerTwo = "playerTwo";
  //   uint32 gameId = 123456789;
  //   uint32 timestamp = 1629474300;
  //   world.spawn(1629474300, playerOne, gameId);
  //   world.spawn(1629474400, playerTwo, gameId);

  //   // get player entity keys

  //   // QueryFragment[] memory fragments = new QueryFragment[](1);
  //   // fragments[0] = QueryFragment(QueryType.Has, PositionTableId, new bytes(0) );
  //   // fragments[1] = QueryFragment(QueryType.Has, PlayerTableId, new bytes(0));
  //   // bytes32[][] memory keyTuples = query(fragments);

  //   // console.logBytes32(keyTuples[0][0]);
 
  //   //get sender username
  //   // (bytes memory usernameStaticData, PackedCounter usernameEncodedLengths, bytes memory usernameDynamicData) = Username.encode(playerOne);
    
  //   string memory username = Username.get(world, addressToEntityKey(msg.sender));
  //   console.log("username: ", username);

  //   (uint32 startX, uint32 startY) = Position.get(world, addressToEntityKey(msg.sender));
  //   console.log("start coordinates: ", startX, ", ", startY);
    
  //   bytes32 playerAtPosition1 = PlayerAtPosition.get(world, startX, startY, gameId);
  //   console.log("playerAtPosition: ");
  //   console.logBytes32(playerAtPosition1);

  //   PlayerAtPosition.deleteRecord(world, gameId, startX, startY);

  //   bytes32 playerAtPosition2 = PlayerAtPosition.get(world, startX, startY, gameId);
  //   console.log("post delete playerAtPosition: ");
  //   console.logBytes32(playerAtPosition2);
    
  //   world.startMatch(gameId, 2, timestamp);
  //   world.claimActionPoint(timestamp, gameId);
  //   // world.move(timestamp, startX + 1, startY, gameId);   
  //   world.move(timestamp, 1, 0, gameId);    
  //   (uint32 endX, uint32 endY) = Position.get(addressToEntityKey(msg.sender));
  //   console.log("end coordinates: ", endX, ", ", endY);
  //   assertEq(endX, startX + 1);
  //   assertEq(endY, startY);
  //   }

    function entityKeyToAddress(bytes32 entityKey) internal pure returns (address) {
        return address(uint160(uint256(entityKey)));
    }

    function testDeletePlayerAtPosition() public {
      address creator = world.creator();
      vm.startPrank(creator);

      string memory username = "player";
      uint32 gameId = 123456789;
      uint32 spawnTimestamp = 1629474300;
      world.spawn(spawnTimestamp, username, gameId);

      (uint32 x, uint32 y) = Position.get(world, addressToEntityKey(msg.sender));
      console.log("start coordinates: ", x, ", ", y); // should be (0, 0)

      console.logBytes32(PlayerAtPosition.get(gameId, x, y));
      PlayerAtPosition.deleteRecord(gameId, x, y);
      console.logBytes32(PlayerAtPosition.get(gameId, x, y));
      vm.stopPrank();
    }


    // function testBackwardsMove() public {
    //     string memory username = "test_player";
    //     uint32 gameId = 123456789;
    //     uint32 timestamp = 1629474300;
    //     world.spawn(timestamp, username, gameId);
    //     (uint32 startX, uint32 startY) = Position.get(addressToEntityKey(msg.sender));
    //     bytes32 playerAtPosition = PlayerAtPosition.get(startX, startY, gameId);
    //     // console.log("playerAtPosition: %s", playerAtPosition);
    //     console.log("******************");
    //     console.logBytes32(playerAtPosition);
    //     console.log("******************");

    //     // world.move(timestamp, startX + 1, startY, gameId);    
    //     // (uint32 endX, uint32 endY) = Position.get(addressToEntityKey(msg.sender));
    //     // assertEq(endX, startX + 1);
    //     // assertEq(endY, startY);
    // }

}
