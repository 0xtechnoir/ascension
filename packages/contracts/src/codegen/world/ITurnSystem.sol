// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

/**
 * @title ITurnSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface ITurnSystem {
  function startMatch(uint32 gameId, uint32 playersSpawned, uint256 startTime) external;

  function increaseRange(uint256 timestamp, uint32 gameId) external;

  function sendActionPoint(uint256 timestamp, bytes32 _recipient, uint32 gameId) external;

  function attackPlayer(uint256 timestamp, bytes32 _target, uint32 gameId) external;

  function endGame(uint256 timestamp, bytes32 winningPlayer, uint32 gameId) external;

  function claimActionPoint(uint256 _timestamp, uint32 _gameId) external;

  function claimVotingPoint(uint256 timestamp, uint32 _gameId) external;

  function vote(uint256 timestamp, bytes32 _recipient, uint32 gameId) external;
}
