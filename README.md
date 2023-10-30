# Ascension

## Regenerate tables
From inside the contracts package
```
pnpm build:mud
```

## Deploying 
### 1. Pick your network
In client/.env in the client, set VITE_CHAIN_ID to one of the following:
- 31337 (local anvil devnet) 
- 4242 (Lattice public testnet)

### 2. Deploy contracts
From project root, run:
```
cd packages/contracts 
pnpm deploy:testnet
```
Lattice testnet explorer: https://explorer.testnet-chain.linfra.xyz/

### 3. Deploy client
From root, run:
```
cd packages/client
pnpm build
cd dist
vercel
```
This will deploy the app to production, run: ```vercel --prod``` to overwrite later

Vercel CLI docs: https://vercel.com/docs/cli#commands/overview/unique-options/prod

Production deployment can be found here: https://ascension-snowy.vercel.app/