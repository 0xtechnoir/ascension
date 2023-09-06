// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { MapConfig, APClaimInterval } from "../src/codegen/Tables.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {

    IWorld world = IWorld(worldAddress);

    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);
    uint32 height = 11;
    uint32 width = 11;
    MapConfig.set(world, width, height);
    APClaimInterval.set(world, 30000);

    vm.stopBroadcast();
  }
}
