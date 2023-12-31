// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

/**
 * @title IMapSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IMapSystem {
  function spawn(uint256 _timestamp, string memory _username, uint32 _gameId) external;

  function leaveGame(uint256 _timestamp, uint32 _gameId) external;

  function move(uint256 timestamp, int32 deltaX, int32 deltaY, uint32 _gameId) external;
}
