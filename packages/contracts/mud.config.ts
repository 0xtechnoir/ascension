import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export default mudConfig({
  enums: {},
  tables: {
    MapConfig: {
      keySchema: {},
      dataStruct: false,
      valueSchema: {
        width: "uint32",
        height: "uint32",
      }
    },
    GameSession: {
      keySchema: {
        id: "uint32",
      },
      valueSchema: {
        isLive: "bool",
        startTime: "uint256",
        gameId: "uint32",
      }
    },
    ClaimInterval: {
      keySchema: {},
      valueSchema: "uint32",
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
      valueSchema: {
        x: "uint32",
        y: "uint32",
      }
    },
    PlayerAtPosition: {
      keySchema: {
        gameId: 'uint32', 
        x: 'uint32',
        y: 'uint32',
      },
      valueSchema: {
        playerEntity: 'bytes32',
      }
    },
    // Offchain tables (events) ====================================
    PlayerSpawned : {
      keySchema: {
        id: "uint256",
      },
      valueSchema: {
        timestamp: "uint256",
        x: "uint32",
        y: "uint32", 
        gameId: "uint32",
        player: "string",
      }, 
      offchainOnly: true,
    },
    PlayerLeftGame : {
      keySchema: {
        id: "uint256",
      },
      valueSchema: {
        timestamp: "uint256",
        gameId: "uint32",
        player: "string",
      }, 
      offchainOnly: true,
    },
    PlayerDied : {
      keySchema: {
        id: "uint256",
      },
      valueSchema: {
        timestamp: "uint256",
        gameId: "uint32",
        player: "string",
      }, 
      offchainOnly: true,
    },
    MoveExecuted : {
      keySchema: {
        id: "uint256",
      },
      valueSchema: {
        timestamp: "uint256",
        fromX: "uint32",
        fromY: "uint32",
        toX: "uint32",
        toY: "uint32", 
        gameId: "uint32",
        player: "string",
      }, 
      offchainOnly: true,
    },
    AttackExecuted : {
      keySchema: {
        id: "uint256",
      },
      valueSchema: {
        timestamp: "uint256",
        gameId: "uint32",
        attacker: "string",
        target: "string",
      }, 
      offchainOnly: true,
    },
    SendActionPointExecuted : {
      keySchema: {
        id: "uint256",
      },
      valueSchema: {
        timestamp: "uint256",
        gameId: "uint32",
        sender: "string",
        reciever: "string",
      }, 
      offchainOnly: true,
    },
    RangeIncreaseExecuted : {
      keySchema: {
        id: "uint256",
      },
      valueSchema: {
        timestamp: "uint256",
        gameId: "uint32",
        player: "string",
      }, 
      offchainOnly: true,
    },
    ActionPointClaimExecuted : {
      keySchema: {
        id: "uint32",
      },
      valueSchema: {
        timestamp: "uint256",
        gameId: "uint32",
        player: "string",
      }, 
      offchainOnly: true,
    },
    ClaimExecuted : {
      keySchema: {
        id: "uint256",
      },
      valueSchema: {
        timestamp: "uint256",
        player: "string",
        gameId: "string",
      }, 
      offchainOnly: true,
    },
    VotingPointClaimExecuted : {
      keySchema: {
        id: "uint256",
      },
      valueSchema: {
        timestamp: "uint256",
        gameId: "uint32",
        player: "string",
      }, 
      offchainOnly: true,
    },
    VoteExecuted : {
      keySchema: {
        id: "uint256",
      },
      valueSchema: {
        timestamp: "uint256",
        gameId: "uint32",
        voter: "string",
        recipient: "string",
      }, 
      offchainOnly: true,
    },
    GameStarted: {
      keySchema: {
        id: "uint32",
      },
      valueSchema: {
        timestamp: "uint256",
        gameId: "uint32",
      },
      offchainOnly: true,
    },
    GameEnded: {
      keySchema: {
        id: "uint32",
      },
      valueSchema: {
        timestamp: "uint256",
        gameId: "uint32",
      },
      offchainOnly: true,
    },
    PlayerWon: {
      keySchema: {
        id: "uint32",
      },
      valueSchema: {
        timestamp: "uint256",
        gameId: "uint32",
        player: "string",
      },
      offchainOnly: true,
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
