
import {
  Account,
  BpfLoader,
  BPF_LOADER_PROGRAM_ID, Connection,
  PublicKey
} from '@solana/web3.js';
import fs from 'mz/fs';
import { newAccountWithLamports } from './util/new-account-with-lamports';

export async function loadPrograms(connection: Connection, solgsnProgramId: string, tokenProgramId: string): Promise<[PublicKey, PublicKey]> {
  if (!solgsnProgramId) {
      await loadProgram(
          connection,
          'target/bpfel-unknown-unknown/release/solgsn.so',
        )
  }
  if (!tokenProgramId) {
      await loadProgram(
          connection,
          'target/bpfel-unknown-unknown/release/spl_token.so',
      )
  }
  return [new PublicKey(solgsnProgramId), new PublicKey(tokenProgramId)];
}

async function loadProgram(
  connection: Connection,
  path: string,
): Promise<PublicKey> {
  const NUM_RETRIES = 500; /* allow some number of retries */
  const data = await fs.readFile(path);
  const {feeCalculator} = await connection.getRecentBlockhash();
  const balanceNeeded =
    feeCalculator.lamportsPerSignature *
      (BpfLoader.getMinNumSignatures(data.length) + NUM_RETRIES) +
    (await connection.getMinimumBalanceForRentExemption(data.length));

  const from = await newAccountWithLamports(connection, balanceNeeded);
  const program_account = new Account();
  console.log('Loading program:', path);
  await BpfLoader.load(
    connection,
    from,
    program_account,
    data,
    BPF_LOADER_PROGRAM_ID,
  );
  return program_account.publicKey;
}