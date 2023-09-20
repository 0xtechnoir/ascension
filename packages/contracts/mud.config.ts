import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export default mudConfig({
  enums: {},
  tables: {
    MapConfig: {
      keySchema: {},
      dataStruct: false,
      schema: {
        width: "uint32",
        height: "uint32",
      }
    },
    GameSession: {
      keySchema: {
        id: "uint32",
      },
      schema: {
        isLive: "bool",
        startTime: "uint256",
        gameId: "uint32",
      }
    },
    ClaimInterval: {
      keySchema: {},
      schema: "uint32",
    },
    Username: "string",
    Champion: "bool",
    Movable: "bool",
    Player: "bool",
    Alive: "bool",
    Health: "uint32",
    Range: "uint32",
    InGame: "uint32",
    LastActionPointClaim: "uint256",
    LastVotingPointClaim: "uint256",
    ActionPoint: "uint32",
    VotingPoint: "uint32",
    Position: {
      dataStruct: false,
      schema: {
        x: "uint32",
        y: "uint32",
      }
    },
    // Ephemeral tables ====================================
    PlayerSpawned : {
      keySchema: {
        id: "uint256",
      },
      schema: {
        timestamp: "uint256",
        x: "uint32",
        y: "uint32", 
        gameId: "uint32",
        player: "string",
      }, 
      ephemeral: true,
    },
    MoveExecuted : {
      keySchema: {
        id: "uint256",
      },
      schema: {
        timestamp: "uint256",
        fromX: "uint32",
        fromY: "uint32",
        toX: "uint32",
        toY: "uint32", 
        gameId: "uint32",
        player: "string",
      }, 
      ephemeral: true,
    },
    AttackExecuted : {
      keySchema: {
        id: "uint256",
      },
      schema: {
        timestamp: "uint256",
        attacker: "string",
        target: "string",
      }, 
      ephemeral: true,
    },
    SendActionPointExecuted : {
      keySchema: {
        id: "uint256",
      },
      schema: {
        timestamp: "uint256",
        sender: "string",
        reciever: "string",
      }, 
      ephemeral: true,
    },
    RangeIncreaseExecuted : {
      keySchema: {
        id: "uint256",
      },
      schema: {
        timestamp: "uint256",
        player: "string",
      }, 
      ephemeral: true,
    },
    ActionPointClaimExecuted : {
      keySchema: {
        id: "uint32",
      },
      schema: {
        timestamp: "uint256",
        gameId: "uint32",
        player: "string",
      }, 
      ephemeral: true,
    },
    ClaimExecuted : {
      keySchema: {
        id: "uint256",
      },
      schema: {
        timestamp: "uint256",
        player: "string",
        gameId: "string",
      }, 
      ephemeral: true,
    },
    VotingPointClaimExecuted : {
      keySchema: {
        id: "uint256",
      },
      schema: {
        timestamp: "uint256",
        player: "string",
      }, 
      ephemeral: true,
    },
    VoteExecuted : {
      keySchema: {
        id: "uint256",
      },
      schema: {
        timestamp: "uint256",
        voter: "string",
        recipient: "string",
      }, 
      ephemeral: true,
    },
    GameStarted: {
      keySchema: {
        id: "uint32",
      },
      schema: {
        timestamp: "uint256",
        gameId: "uint32",
      },
      ephemeral: true,
    },
    GameEnded: {
      schema: {
        timestamp: "uint256",
      },
      ephemeral: true,
    },
  },
  modules: [
    {
      name: "KeysInTableModule",
      root: true,
      args: [
        resolveTableId("Player"),
      ],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [
        resolveTableId("Position"), 
      ],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [
        resolveTableId("InGame"), 
      ],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [
        resolveTableId("Alive"),
      ],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [
        resolveTableId("Username"),
      ],
    },
  ],
});
