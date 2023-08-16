import { mudConfig } from "@latticexyz/world/register";
// import { resolveTableId } from "@latticexyz/config";

export default mudConfig({
  enums: {},
  tables: {
    MapConfig: {
      keySchema: {},
      dataStruct: false,
      schema: {
        width: "uint32",
        height: "uint32",
      },
    },
    Turn: {
      keySchema: {},
      schema: "uint32",
    },
    GameStartTime: {
      keySchema: {},
      schema: "uint256",
    },
    GameIsLive: {
      keySchema: {},
      schema: "bool",
    },
    Movable: "bool",
    Player: "bool",
    Health: "uint32",
    Range: "uint32",
    ActionPoint: "uint32",
    Position: {
      dataStruct: false,
      schema: {
        x: "uint32",
        y: "uint32",
      }
    }
  },
//   modules: [
//     {
//       name: "KeysInTableModule",
//       root: true,
//       args: [resolveTableId("Player")],
//     }
//   ]
});
