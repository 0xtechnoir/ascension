# Ascension (MUD Version)

Ascension is is a simple PvP game inspired by [Tank Turn Tactics](https://www.youtube.com/watch?v=aOYbR-Q_4Hs) from Australian game developer Halfbrick Studios. 

Players spawn on a grid with an initial amount of health points, action points and range. Action points can be claimed every 30 seconds and are required to move, attack and boost range. Players can also choose to donate an action point to another player instead of using it themselves. 

The objective of the game is to eliminate all other competitors, however defeated players have the power to assign extra action points to live players.

Victory in Ascension is decided by how well one can manipulate other players. Pacts can be made between players to pool action points and launch deadly strikes against others, but as this game only has one winner, at some point all pacts must be broken. Players need to think carefully about how and when they choose to betray others, as creating too many enemies will result in a player’s living rivals receiving disproportionate action points from fallen players. 

## Game Client:

You can play the game here (requires two separate browser sessions): 
https://ascension-mud.vercel.app/

Note: It may take some time to hydrate from the RPC.

## Purpose

The purpose of this project was to build a simple game in both MUD and Dojo to see how the engines and development experience differed. The report accompanying these builds can be found here: <insert link>

The Dojo repo can be found here: https://github.com/0xtechnoir/dojo-ascension


## Running locally:
From the root directory, run:
```
pnpm run dev
```

## Deploying publicly:

### 1. Pick your network
In client/.env in the client, set VITE_CHAIN_ID to one of the following:
- 31337 (local anvil devnet) 
- 4242 (Lattice public testnet - Currently using this one for the public version of Ascension but it's depreciated)
- 17001 (redstone testnet)

### 2. Deploy contracts
In the contracts package:
create a .env file and add in your private key:
```PRIVATE_KEY=<your key>```
Make sure the account has testnet ETH, then run
```
pnpm deploy:testnet
```
Lattice testnet explorer: https://miner.testnet-chain.linfra.xyz/
Redstone testnet explorer: https://explorer.holesky.redstone.xyz

### 3. Deploy client
From the client root directory, run:
```
pnpm build
cd dist
vercel
```
This will deploy the app to production, run: ```vercel --prod``` to overwrite later

### Funding a testnet wallet (required to deploy to public testnet)

```pnpm mud faucet --address 0x7Ed65bf3e8fABCd88347abB4B6aE470ADB909123```
defaults to lattice testnet right now. See https://mud.dev/cli/faucet for more info. 

## Misc notes: 

### Regenerating tables
Required if table structure has been changed. From inside the contracts package
```
pnpm build:mud
```