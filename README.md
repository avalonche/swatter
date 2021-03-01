# Swatter

This is a social media mobile payments platform build on Solana allowing gasless transfers to others. 

The user first partially signs the token transfer transaction and then sends it over to a relayer, who will execute it on the user's behalf to the network so that applications on Solana can pay the network fees for their users. The client will need to know the relayer's public key and the GSN account addresses to construct and sign the transaction on the client side. 

## Deployment

There are two folders, one is the client that hosts the mobile application written in React Native and the server hosts the relayer application to conduct gasless transfers.

### Client

Create an `.env` file in the client directory to specify where the relay server is to send signed transaction requests.

```
SERVER_URL=http://localhost:8080 # your server url here
```

Then to start the client application, first install dependencies
```
cd client
npm install
```

then to start the app

```
cd ios
pod install
cd ..
npm ios
```

or

```
npm android
```

For further installation instructions see the [React Native documentation](https://reactnative.dev/docs/environment-setup).

### Server

This runs a simple express server that responds to client transaction requests. The programs are currently deployed on `devnet` so running `npm cluster:devnet` will read off the gsn and token program addresses currently deployed there. Starting the server will create a new token and the api will provide airdrops to client requesting tokens.

This is where the rust smart contracts are, so nodejs and rust will need to be installed. Make sure the Solana CLI is installed to run your own local node.

```
cd server
npm install
npm run start # start the server
```

To run and deploy the programs locally
```
sudo npm run localnet:up
npm run build
npm run start
```

All the smart contracts are in `/server/program` which contains the profile, an extended solgsn implementation and token programs. The http server is in `/server/setup`, which initialises a new token, gsn account and fee payer who will pay the network fee on behalf of the user on the network.

## Integrations

### Torus

User key management is powered by [Torus](https://tor.us). The account keys are generated from the Torus Key when authenticating with a OAuth provider such as Google or Facebook. On log in, the app will connect to an existing account or create a new one.

### SolGSN

This builds upon the [SolGSN](https://github.com/princesinha19/solgsn) implementation by adding token transfers onto SolGSN. This allows any `spl_token` to be transfered and be used to pay fees such as USDC or USDT stable coins. Users do not require any SOL balance in order to start participating in the network.

As per the original SolGSN implementation, the program will contain credit associated with the user denominated in the token the user transacted in. The client will complete the topup and transaction in one atomic transaction so users do not need to topup their account first. In the future we would like to integrate with the token swap program so the token can be swapped to SOL directly to pay the fee in an atomic transaction. 



