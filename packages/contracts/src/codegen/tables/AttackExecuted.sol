// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

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
import { FieldLayout, FieldLayoutLib } from "@latticexyz/store/src/FieldLayout.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { RESOURCE_TABLE, RESOURCE_OFFCHAIN_TABLE } from "@latticexyz/store/src/storeResourceTypes.sol";

ResourceId constant _tableId = ResourceId.wrap(
  bytes32(abi.encodePacked(RESOURCE_OFFCHAIN_TABLE, bytes14(""), bytes16("AttackExecuted")))
);
ResourceId constant AttackExecutedTableId = _tableId;

FieldLayout constant _fieldLayout = FieldLayout.wrap(
  0x0024020220040000000000000000000000000000000000000000000000000000
);

struct AttackExecutedData {
  uint256 timestamp;
  uint32 gameId;
  string attacker;
  string target;
}

library AttackExecuted {
  /**
   * @notice Get the table values' field layout.
   * @return _fieldLayout The field layout for the table.
   */
  function getFieldLayout() internal pure returns (FieldLayout) {
    return _fieldLayout;
  }

  /**
   * @notice Get the table's key schema.
   * @return _keySchema The key schema for the table.
   */
  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _keySchema = new SchemaType[](1);
    _keySchema[0] = SchemaType.UINT256;

    return SchemaLib.encode(_keySchema);
  }

  /**
   * @notice Get the table's value schema.
   * @return _valueSchema The value schema for the table.
   */
  function getValueSchema() internal pure returns (Schema) {
    SchemaType[] memory _valueSchema = new SchemaType[](4);
    _valueSchema[0] = SchemaType.UINT256;
    _valueSchema[1] = SchemaType.UINT32;
    _valueSchema[2] = SchemaType.STRING;
    _valueSchema[3] = SchemaType.STRING;

    return SchemaLib.encode(_valueSchema);
  }

  /**
   * @notice Get the table's key field names.
   * @return keyNames An array of strings with the names of key fields.
   */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](1);
    keyNames[0] = "id";
  }

  /**
   * @notice Get the table's value field names.
   * @return fieldNames An array of strings with the names of value fields.
   */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](4);
    fieldNames[0] = "timestamp";
    fieldNames[1] = "gameId";
    fieldNames[2] = "attacker";
    fieldNames[3] = "target";
  }

  /**
   * @notice Register the table with its config.
   */
  function register() internal {
    StoreSwitch.registerTable(_tableId, _fieldLayout, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /**
   * @notice Register the table with its config.
   */
  function _register() internal {
    StoreCore.registerTable(_tableId, _fieldLayout, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /**
   * @notice Register the table with its config (using the specified store).
   */
  function register(IStore _store) internal {
    _store.registerTable(_tableId, _fieldLayout, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /**
   * @notice Set timestamp.
   */
  function setTimestamp(uint256 id, uint256 timestamp) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((timestamp)), _fieldLayout);
  }

  /**
   * @notice Set timestamp.
   */
  function _setTimestamp(uint256 id, uint256 timestamp) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((timestamp)), _fieldLayout);
  }

  /**
   * @notice Set timestamp (using the specified store).
   */
  function setTimestamp(IStore _store, uint256 id, uint256 timestamp) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((timestamp)), _fieldLayout);
  }

  /**
   * @notice Set gameId.
   */
  function setGameId(uint256 id, uint32 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((gameId)), _fieldLayout);
  }

  /**
   * @notice Set gameId.
   */
  function _setGameId(uint256 id, uint32 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((gameId)), _fieldLayout);
  }

  /**
   * @notice Set gameId (using the specified store).
   */
  function setGameId(IStore _store, uint256 id, uint32 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((gameId)), _fieldLayout);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function set(uint256 id, uint256 timestamp, uint32 gameId, string memory attacker, string memory target) internal {
    bytes memory _staticData = encodeStatic(timestamp, gameId);

    PackedCounter _encodedLengths = encodeLengths(attacker, target);
    bytes memory _dynamicData = encodeDynamic(attacker, target);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function _set(uint256 id, uint256 timestamp, uint32 gameId, string memory attacker, string memory target) internal {
    bytes memory _staticData = encodeStatic(timestamp, gameId);

    PackedCounter _encodedLengths = encodeLengths(attacker, target);
    bytes memory _dynamicData = encodeDynamic(attacker, target);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Set the full data using individual values (using the specified store).
   */
  function set(
    IStore _store,
    uint256 id,
    uint256 timestamp,
    uint32 gameId,
    string memory attacker,
    string memory target
  ) internal {
    bytes memory _staticData = encodeStatic(timestamp, gameId);

    PackedCounter _encodedLengths = encodeLengths(attacker, target);
    bytes memory _dynamicData = encodeDynamic(attacker, target);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function set(uint256 id, AttackExecutedData memory _table) internal {
    bytes memory _staticData = encodeStatic(_table.timestamp, _table.gameId);

    PackedCounter _encodedLengths = encodeLengths(_table.attacker, _table.target);
    bytes memory _dynamicData = encodeDynamic(_table.attacker, _table.target);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function _set(uint256 id, AttackExecutedData memory _table) internal {
    bytes memory _staticData = encodeStatic(_table.timestamp, _table.gameId);

    PackedCounter _encodedLengths = encodeLengths(_table.attacker, _table.target);
    bytes memory _dynamicData = encodeDynamic(_table.attacker, _table.target);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Set the full data using the data struct (using the specified store).
   */
  function set(IStore _store, uint256 id, AttackExecutedData memory _table) internal {
    bytes memory _staticData = encodeStatic(_table.timestamp, _table.gameId);

    PackedCounter _encodedLengths = encodeLengths(_table.attacker, _table.target);
    bytes memory _dynamicData = encodeDynamic(_table.attacker, _table.target);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Decode the tightly packed blob of static data using this table's field layout.
   */
  function decodeStatic(bytes memory _blob) internal pure returns (uint256 timestamp, uint32 gameId) {
    timestamp = (uint256(Bytes.slice32(_blob, 0)));

    gameId = (uint32(Bytes.slice4(_blob, 32)));
  }

  /**
   * @notice Decode the tightly packed blob of dynamic data using the encoded lengths.
   */
  function decodeDynamic(
    PackedCounter _encodedLengths,
    bytes memory _blob
  ) internal pure returns (string memory attacker, string memory target) {
    uint256 _start;
    uint256 _end;
    unchecked {
      _end = _encodedLengths.atIndex(0);
    }
    attacker = (string(SliceLib.getSubslice(_blob, _start, _end).toBytes()));

    _start = _end;
    unchecked {
      _end += _encodedLengths.atIndex(1);
    }
    target = (string(SliceLib.getSubslice(_blob, _start, _end).toBytes()));
  }

  /**
   * @notice Decode the tightly packed blobs using this table's field layout.
   * @param _staticData Tightly packed static fields.
   * @param _encodedLengths Encoded lengths of dynamic fields.
   * @param _dynamicData Tightly packed dynamic fields.
   */
  function decode(
    bytes memory _staticData,
    PackedCounter _encodedLengths,
    bytes memory _dynamicData
  ) internal pure returns (AttackExecutedData memory _table) {
    (_table.timestamp, _table.gameId) = decodeStatic(_staticData);

    (_table.attacker, _table.target) = decodeDynamic(_encodedLengths, _dynamicData);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function deleteRecord(uint256 id) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function _deleteRecord(uint256 id) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.deleteRecord(_tableId, _keyTuple, _fieldLayout);
  }

  /**
   * @notice Delete all data for given keys (using the specified store).
   */
  function deleteRecord(IStore _store, uint256 id) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Tightly pack static (fixed length) data using this table's schema.
   * @return The static data, encoded into a sequence of bytes.
   */
  function encodeStatic(uint256 timestamp, uint32 gameId) internal pure returns (bytes memory) {
    return abi.encodePacked(timestamp, gameId);
  }

  /**
   * @notice Tightly pack dynamic data lengths using this table's schema.
   * @return _encodedLengths The lengths of the dynamic fields (packed into a single bytes32 value).
   */
  function encodeLengths(
    string memory attacker,
    string memory target
  ) internal pure returns (PackedCounter _encodedLengths) {
    // Lengths are effectively checked during copy by 2**40 bytes exceeding gas limits
    unchecked {
      _encodedLengths = PackedCounterLib.pack(bytes(attacker).length, bytes(target).length);
    }
  }

  /**
   * @notice Tightly pack dynamic (variable length) data using this table's schema.
   * @return The dynamic data, encoded into a sequence of bytes.
   */
  function encodeDynamic(string memory attacker, string memory target) internal pure returns (bytes memory) {
    return abi.encodePacked(bytes((attacker)), bytes((target)));
  }

  /**
   * @notice Encode all of a record's fields.
   * @return The static (fixed length) data, encoded into a sequence of bytes.
   * @return The lengths of the dynamic fields (packed into a single bytes32 value).
   * @return The dyanmic (variable length) data, encoded into a sequence of bytes.
   */
  function encode(
    uint256 timestamp,
    uint32 gameId,
    string memory attacker,
    string memory target
  ) internal pure returns (bytes memory, PackedCounter, bytes memory) {
    bytes memory _staticData = encodeStatic(timestamp, gameId);

    PackedCounter _encodedLengths = encodeLengths(attacker, target);
    bytes memory _dynamicData = encodeDynamic(attacker, target);

    return (_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Encode keys as a bytes32 array using this table's field layout.
   */
  function encodeKeyTuple(uint256 id) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    return _keyTuple;
  }
}
