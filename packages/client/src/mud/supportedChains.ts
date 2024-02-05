import { MUDChain, latticeTestnet, mudFoundry } from "@latticexyz/common/chains";

var holeskyRedstone={
    name:"Holesky Redstone",
    id:17001,
    network:"holesky-redstone",
    nativeCurrency:{decimals:18,name:"Ether",symbol:"ETH"},
    rpcUrls:{
        default:{
            http:["https://rpc.holesky.redstone.xyz"],
            webSocket:["wss://rpc.holesky.redstone.xyz/ws"]
        },
        public:{
            http:["https://rpc.holesky.redstone.xyz"],
            webSocket:["wss://rpc.holesky.redstone.xyz/ws"]
        }
    },
    blockExplorers:{
        Blockscout:{
            name:"Blockscout",
            url:"https://explorer.testnet-chain.linfra.xyz"
        },
        default:{
            name:"Blockscout",
            url:"https://explorer.testnet-chain.linfra.xyz"
        },
    },
    faucetUrl:"https://holesky-faucet.pk910.de/" 
}

// If you are deploying to chains other than anvil or Lattice testnet, add them here
export const supportedChains: MUDChain[] = [mudFoundry, latticeTestnet, holeskyRedstone];
