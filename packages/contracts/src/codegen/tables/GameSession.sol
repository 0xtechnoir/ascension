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
  bytes32(abi.encodePacked(RESOURCE_TABLE, bytes14(""), bytes16("GameSession")))
);
ResourceId constant GameSessionTableId = _tableId;

FieldLayout constant _fieldLayout = FieldLayout.wrap(
  0x0026040001200401000000000000000000000000000000000000000000000000
);

struct GameSessionData {
  bool isLive;
  uint256 startTime;
  uint32 gameId;
  uint8 players;
}

library GameSession {
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
    _keySchema[0] = SchemaType.UINT32;

    return SchemaLib.encode(_keySchema);
  }

  /**
   * @notice Get the table's value schema.
   * @return _valueSchema The value schema for the table.
   */
  function getValueSchema() internal pure returns (Schema) {
    SchemaType[] memory _valueSchema = new SchemaType[](4);
    _valueSchema[0] = SchemaType.BOOL;
    _valueSchema[1] = SchemaType.UINT256;
    _valueSchema[2] = SchemaType.UINT32;
    _valueSchema[3] = SchemaType.UINT8;

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
    fieldNames[0] = "isLive";
    fieldNames[1] = "startTime";
    fieldNames[2] = "gameId";
    fieldNames[3] = "players";
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
   * @notice Get isLive.
   */
  function getIsLive(uint32 id) internal view returns (bool isLive) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (_toBool(uint8(bytes1(_blob))));
  }

  /**
   * @notice Get isLive.
   */
  function _getIsLive(uint32 id) internal view returns (bool isLive) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (_toBool(uint8(bytes1(_blob))));
  }

  /**
   * @notice Set isLive.
   */
  function setIsLive(uint32 id, bool isLive) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((isLive)), _fieldLayout);
  }

  /**
   * @notice Set isLive.
   */
  function _setIsLive(uint32 id, bool isLive) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((isLive)), _fieldLayout);
  }

  /**
   * @notice Get startTime.
   */
  function getStartTime(uint32 id) internal view returns (uint256 startTime) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get startTime.
   */
  function _getStartTime(uint32 id) internal view returns (uint256 startTime) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set startTime.
   */
  function setStartTime(uint32 id, uint256 startTime) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((startTime)), _fieldLayout);
  }

  /**
   * @notice Set startTime.
   */
  function _setStartTime(uint32 id, uint256 startTime) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((startTime)), _fieldLayout);
  }

  /**
   * @notice Get gameId.
   */
  function getGameId(uint32 id) internal view returns (uint32 gameId) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Get gameId.
   */
  function _getGameId(uint32 id) internal view returns (uint32 gameId) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Set gameId.
   */
  function setGameId(uint32 id, uint32 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked((gameId)), _fieldLayout);
  }

  /**
   * @notice Set gameId.
   */
  function _setGameId(uint32 id, uint32 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked((gameId)), _fieldLayout);
  }

  /**
   * @notice Get players.
   */
  function getPlayers(uint32 id) internal view returns (uint8 players) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 3, _fieldLayout);
    return (uint8(bytes1(_blob)));
  }

  /**
   * @notice Get players.
   */
  function _getPlayers(uint32 id) internal view returns (uint8 players) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 3, _fieldLayout);
    return (uint8(bytes1(_blob)));
  }

  /**
   * @notice Set players.
   */
  function setPlayers(uint32 id, uint8 players) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 3, abi.encodePacked((players)), _fieldLayout);
  }

  /**
   * @notice Set players.
   */
  function _setPlayers(uint32 id, uint8 players) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.setStaticField(_tableId, _keyTuple, 3, abi.encodePacked((players)), _fieldLayout);
  }

  /**
   * @notice Get the full data.
   */
  function get(uint32 id) internal view returns (GameSessionData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    (bytes memory _staticData, PackedCounter _encodedLengths, bytes memory _dynamicData) = StoreSwitch.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Get the full data.
   */
  function _get(uint32 id) internal view returns (GameSessionData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    (bytes memory _staticData, PackedCounter _encodedLengths, bytes memory _dynamicData) = StoreCore.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function set(uint32 id, bool isLive, uint256 startTime, uint32 gameId, uint8 players) internal {
    bytes memory _staticData = encodeStatic(isLive, startTime, gameId, players);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function _set(uint32 id, bool isLive, uint256 startTime, uint32 gameId, uint8 players) internal {
    bytes memory _staticData = encodeStatic(isLive, startTime, gameId, players);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function set(uint32 id, GameSessionData memory _table) internal {
    bytes memory _staticData = encodeStatic(_table.isLive, _table.startTime, _table.gameId, _table.players);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function _set(uint32 id, GameSessionData memory _table) internal {
    bytes memory _staticData = encodeStatic(_table.isLive, _table.startTime, _table.gameId, _table.players);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Decode the tightly packed blob of static data using this table's field layout.
   */
  function decodeStatic(
    bytes memory _blob
  ) internal pure returns (bool isLive, uint256 startTime, uint32 gameId, uint8 players) {
    isLive = (_toBool(uint8(Bytes.slice1(_blob, 0))));

    startTime = (uint256(Bytes.slice32(_blob, 1)));

    gameId = (uint32(Bytes.slice4(_blob, 33)));

    players = (uint8(Bytes.slice1(_blob, 37)));
  }

  /**
   * @notice Decode the tightly packed blobs using this table's field layout.
   * @param _staticData Tightly packed static fields.
   *
   *
   */
  function decode(
    bytes memory _staticData,
    PackedCounter,
    bytes memory
  ) internal pure returns (GameSessionData memory _table) {
    (_table.isLive, _table.startTime, _table.gameId, _table.players) = decodeStatic(_staticData);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function deleteRecord(uint32 id) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function _deleteRecord(uint32 id) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreCore.deleteRecord(_tableId, _keyTuple, _fieldLayout);
  }

  /**
   * @notice Tightly pack static (fixed length) data using this table's schema.
   * @return The static data, encoded into a sequence of bytes.
   */
  function encodeStatic(
    bool isLive,
    uint256 startTime,
    uint32 gameId,
    uint8 players
  ) internal pure returns (bytes memory) {
    return abi.encodePacked(isLive, startTime, gameId, players);
  }

  /**
   * @notice Encode all of a record's fields.
   * @return The static (fixed length) data, encoded into a sequence of bytes.
   * @return The lengths of the dynamic fields (packed into a single bytes32 value).
   * @return The dyanmic (variable length) data, encoded into a sequence of bytes.
   */
  function encode(
    bool isLive,
    uint256 startTime,
    uint32 gameId,
    uint8 players
  ) internal pure returns (bytes memory, PackedCounter, bytes memory) {
    bytes memory _staticData = encodeStatic(isLive, startTime, gameId, players);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    return (_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Encode keys as a bytes32 array using this table's field layout.
   */
  function encodeKeyTuple(uint32 id) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    return _keyTuple;
  }
}

/**
 * @notice Cast a value to a bool.
 * @dev Boolean values are encoded as uint8 (1 = true, 0 = false), but Solidity doesn't allow casting between uint8 and bool.
 * @param value The uint8 value to convert.
 * @return result The boolean value.
 */
function _toBool(uint8 value) pure returns (bool result) {
  assembly {
    result := value
  }
}
