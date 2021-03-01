import { Token } from '@solana/spl-token';
import { Account, Connection, PublicKey, sendAndConfirmRawTransaction, Transaction } from "@solana/web3.js";
import { Express } from "express";
import http from "http";
import { url } from "../url";
import { loadPrograms } from './loadProgram';
import { SolGSN } from "./solgsn";
import { newAccountWithLamports } from "./util/new-account-with-lamports";


const SOLGSN_PROGRAM_KEY = process.env.SOLGSN_PROGRAM_KEY;
const TOKEN_PROGRAM_KEY = process.env.TOKEN_PROGRAM_KEY;

async function getOrCreateTokenAccount(connection: Connection, tokenPubKey: PublicKey, accountPubKey: PublicKey, testToken: Token): Promise<PublicKey> {
  const accounts = await connection.getParsedTokenAccountsByOwner(accountPubKey, { mint: tokenPubKey });
  if (accounts.value.length === 0) {
    return testToken.createAccount(accountPubKey);
  }
  return accounts.value[0].pubkey;
}

export default class ApiServer {
  static async start(app: Express, httpServer: http.Server): Promise<void> {
    const connection = new Connection(url, "recent");
    const [solgsnProgramId, tokenProgramId] = await loadPrograms(connection, SOLGSN_PROGRAM_KEY, TOKEN_PROGRAM_KEY);

    const payer = await newAccountWithLamports(connection, 3000000000);
    // Initialising the  program
    const solgsn = new SolGSN(connection, solgsnProgramId, payer);
    const gsnAccountKey = await solgsn.initialize();
    // creating the test token
    const testMintAuthority = new Account();
    const testToken = await Token.createMint(
      connection,
      payer,
      testMintAuthority.publicKey,
      null,
      2,
      tokenProgramId,
    );
    // set account to pay gas fees
    const feePayerAccount = await newAccountWithLamports(connection, 10000000);
    const userTransferAuthority = new Account();

    app.post("/tokenFaucet", async (req, res) => {
      const pubKey = new PublicKey(req.body["publicKey"]);
      const accountKey = new PublicKey(req.body["accountKey"]);
      const faucetAccount = req.body["accountKey"] ? accountKey : await getOrCreateTokenAccount(connection, testToken.publicKey, pubKey, testToken);
      await testToken.mintTo(faucetAccount, testMintAuthority, [], 1000);
      res
        .send(
          JSON.stringify({
            amount: 1000,
          })
        )
        .end();
    });

    app.post("/sendTokenTx", async (req, res) => {
      const data = [];
      req.on('data', (chunk) => {
        data.push(chunk);
      });
      req.on('end', async () => {
        const buffer = Buffer.concat(data);
        const transaction = Transaction.from(buffer);
        transaction.partialSign(userTransferAuthority, feePayerAccount);
        await sendAndConfirmRawTransaction(
          connection,
          transaction.serialize(),
          {
            skipPreflight: false,
            commitment: 'recent',
            preflightCommitment: 'recent',
          },
        );
        res.send(JSON.stringify({
          success: true,
        })).end();
      });
    });

    app.post("/txInfo", async (req, res) => {
      const pubKey = new PublicKey(req.body["publicKey"]);
      const recieverPubKey = new PublicKey(req.body["receiverPubKey"]);
      const accountKey = (await getOrCreateTokenAccount(connection, testToken.publicKey, pubKey, testToken)).toString();
      const recieverAccountKey = (await getOrCreateTokenAccount(connection, testToken.publicKey, recieverPubKey, testToken)).toString();
      const feePayerPubKey = feePayerAccount.publicKey.toString();
      const authorityPubKey = userTransferAuthority.publicKey.toString();
      res.send(
        JSON.stringify({
          accountKey,
          recieverAccountKey,
          feePayerPubKey,
          gsnAccountKey: gsnAccountKey.toString(),
          tokenProgramId: tokenProgramId.toString(),
          gsnProgramId: solgsnProgramId.toString(),
          authorityPubKey,
          tokenPubKey: testToken.publicKey.toString(),
        })
      )
    });
  }
}
