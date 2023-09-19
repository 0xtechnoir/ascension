// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("MoveExecuted")));
bytes32 constant MoveExecutedTableId = _tableId;

struct MoveExecutedData {
  uint256 timestamp;
  uint32 fromX;
  uint32 fromY;
  uint32 toX;
  uint32 toY;
  string player;
  string gameId;
}

library MoveExecuted {
  /** Get the table's key schema */
  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](1);
    _schema[0] = SchemaType.UINT256;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's value schema */
  function getValueSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](7);
    _schema[0] = SchemaType.UINT256;
    _schema[1] = SchemaType.UINT32;
    _schema[2] = SchemaType.UINT32;
    _schema[3] = SchemaType.UINT32;
    _schema[4] = SchemaType.UINT32;
    _schema[5] = SchemaType.STRING;
    _schema[6] = SchemaType.STRING;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's key names */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](1);
    keyNames[0] = "id";
  }

  /** Get the table's field names */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](7);
    fieldNames[0] = "timestamp";
    fieldNames[1] = "fromX";
    fieldNames[2] = "fromY";
    fieldNames[3] = "toX";
    fieldNames[4] = "toY";
    fieldNames[5] = "player";
    fieldNames[6] = "gameId";
  }

  /** Register the table's key schema, value schema, key names and value names */
  function register() internal {
    StoreSwitch.registerTable(_tableId, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /** Register the table's key schema, value schema, key names and value names (using the specified store) */
  function register(IStore _store) internal {
    _store.registerTable(_tableId, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /** Emit the ephemeral event using individual values */
  function emitEphemeral(
    uint256 id,
    uint256 timestamp,
    uint32 fromX,
    uint32 fromY,
    uint32 toX,
    uint32 toY,
    string memory player,
    string memory gameId
  ) internal {
    bytes memory _data = encode(timestamp, fromX, fromY, toX, toY, player, gameId);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.emitEphemeralRecord(_tableId, _keyTuple, _data, getValueSchema());
  }

  /** Emit the ephemeral event using individual values (using the specified store) */
  function emitEphemeral(
    IStore _store,
    uint256 id,
    uint256 timestamp,
    uint32 fromX,
    uint32 fromY,
    uint32 toX,
    uint32 toY,
    string memory player,
    string memory gameId
  ) internal {
    bytes memory _data = encode(timestamp, fromX, fromY, toX, toY, player, gameId);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.emitEphemeralRecord(_tableId, _keyTuple, _data, getValueSchema());
  }

  /** Emit the ephemeral event using the data struct */
  function emitEphemeral(uint256 id, MoveExecutedData memory _table) internal {
    emitEphemeral(
      id,
      _table.timestamp,
      _table.fromX,
      _table.fromY,
      _table.toX,
      _table.toY,
      _table.player,
      _table.gameId
    );
  }

  /** Emit the ephemeral event using the data struct (using the specified store) */
  function emitEphemeral(IStore _store, uint256 id, MoveExecutedData memory _table) internal {
    emitEphemeral(
      _store,
      id,
      _table.timestamp,
      _table.fromX,
      _table.fromY,
      _table.toX,
      _table.toY,
      _table.player,
      _table.gameId
    );
  }

  /** Tightly pack full data using this table's schema */
  function encode(
    uint256 timestamp,
    uint32 fromX,
    uint32 fromY,
    uint32 toX,
    uint32 toY,
    string memory player,
    string memory gameId
  ) internal pure returns (bytes memory) {
    PackedCounter _encodedLengths;
    // Lengths are effectively checked during copy by 2**40 bytes exceeding gas limits
    unchecked {
      _encodedLengths = PackedCounterLib.pack(bytes(player).length, bytes(gameId).length);
    }

    return
      abi.encodePacked(timestamp, fromX, fromY, toX, toY, _encodedLengths.unwrap(), bytes((player)), bytes((gameId)));
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(uint256 id) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    return _keyTuple;
  }
}
