/**
 * @flow
 */

import assert from 'assert';
import BN from 'bn.js';
import {Buffer} from 'buffer';
import * as BufferLayout from 'buffer-layout';
import type {Connection, TransactionSignature} from '@solana/web3.js';
import {
  Account,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

import * as Layout from './layout';
import {sendAndConfirmTransaction} from './util/send-and-confirm-transaction';
import {loadAccount} from './util/account';

/**
 * 64-bit value
 */
export class u64 extends BN {
  /**
   * Convert to Buffer representation
   */
  toBuffer(): typeof Buffer {
      const a = super.toArray().reverse();
      const b = Buffer.from(a);
      if (b.length === 8) {
          return b;
      }
      assert(b.length < 8, 'u64 too large');

      const zeroPad = Buffer.alloc(8);
      b.copy(zeroPad);
      return zeroPad;
  }

  /**
   * Construct a u64 from Buffer representation
   */
  static fromBuffer(buffer: typeof Buffer): u64 {
      assert(buffer.length === 8, `Invalid buffer length: ${buffer.length}`);
      return new BN(
          [...buffer]
              .reverse()
              .map(i => `00${i.toString(16)}`.slice(-2))
              .join(''),
          16,
      );
  }
}

export function uint64(property: string = 'uint64') {
  return BufferLayout.blob(8, property);
}

export class SolGSN {
  connection: Connection;
  programId: PublicKey;
  payer: Account;
  constructor(
    connection: Connection,
    programId: PublicKey,
    payer: Account,
  ) {
    Object.assign(this, {connection, programId, payer});
  } 

  static initSolGsnInstruction(
    programId: PublicKey,
    newProgram: PublicKey,
    nonce: number,
  ) : TransactionInstruction {

    const keys = [
        { pubkey: newProgram, isSigner: false, isWritable: true },
    ];

    const initLayout = BufferLayout.struct([BufferLayout.u8('instruction'), BufferLayout.u8('nonce')]);

    let data = Buffer.alloc(1024);
    {
      const encodeLength = initLayout.encode(
        {
          instruction: 0, // InitializeSwap instruction
          nonce,
        },
        data,
      );
      data = data.slice(0, encodeLength);
    }

    return new TransactionInstruction({
        keys,
        programId,
        data,
    });
  }

  async initialize(): Promise<PublicKey> {
    const newProgram = new Account();
    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: this.payer.publicKey,
            newAccountPubkey: newProgram.publicKey,
            lamports: 1000000,
            space: 1024,
            programId: this.programId,
        }),
    );

    const [authority, nonce] = await PublicKey.findProgramAddress(
        [newProgram.publicKey.toBuffer()],
        this.programId,
    );

    await sendAndConfirmTransaction(
      'create account',
      this.connection,
      transaction,
      this.payer,
      newProgram,
    );

    await sendAndConfirmTransaction(
        'initialize account',
        this.connection,
        new Transaction().add(
          SolGSN.initSolGsnInstruction(
            this.programId,
            newProgram.publicKey,
            nonce,
          )
        ),
        this.payer,
    );
    return newProgram.publicKey;
  }

  /**
  * Topup Account
  */
  static topupInst(
    gsnAccount: PublicKey,
    senderAccount: PublicKey,
    gsnProgramId: PublicKey,
    amount: number,
  ): TransactionInstruction {
    const keys = [
      { pubkey: gsnAccount, isSigner: false, isWritable: true },
      { pubkey: senderAccount, isSigner: false, isWritable: true },
    ];


    const topupLayout = BufferLayout.struct([
        BufferLayout.u8('instruction'),
        uint64('amount'),
    ]);

    const data = Buffer.alloc(topupLayout.span);

    topupLayout.encode(
        {
            instruction: 1,
            amount: new u64(amount).toBuffer(),
        },
        data,
    );


    return new TransactionInstruction({
      keys,
      programId: gsnProgramId,
      data,
    });
  }

  /**
  * Submit Transaction
  */
  static submitTxInst(
    transferAccount: PublicKey,
    senderAccount: PublicKey,
    recieverAccount: PublicKey,
    feePayerAccount: PublicKey,
    gsnAccount: PublicKey,
    gsnProgramId: PublicKey,
    amount: number,
  ): TransactionInstruction {
    const keys = [
        { pubkey: transferAccount, isSigner: false, isWritable: true },
        { pubkey: senderAccount, isSigner: true, isWritable: true },
        { pubkey: recieverAccount, isSigner: false, isWritable: true },
        { pubkey: feePayerAccount, isSigner: false, isWritable: true },
        { pubkey: gsnAccount, isSigner: false, isWritable: true },
    ];

    const dataLayout = BufferLayout.struct([
        BufferLayout.u8('instruction'),
        Layout.uint64('amount'),
    ]);

    const data = Buffer.alloc(dataLayout.span);

    dataLayout.encode(
        {
            instruction: 2,
            amount: new u64(amount).toBuffer(),
        },
        data,
    );

    return new TransactionInstruction({
        keys,
        programId: gsnProgramId,
        data,
    });
  }

  static submitTokenTxInst(
    senderAccountKey: PublicKey,
    recieverAccountKey: PublicKey,
    feePayerPubKey: PublicKey,
    gsnAccountKey: PublicKey,
    tokenProgramId: PublicKey,
    authorityPubKey: PublicKey,
    gsnProgramId: PublicKey,
    ownerPubKey: PublicKey,
    amount: number,
  ): TransactionInstruction {

    const keys = [
        { pubkey: senderAccountKey, isSigner: false, isWritable: true },
        { pubkey: recieverAccountKey, isSigner: false, isWritable: true },
        { pubkey: ownerPubKey, isSigner: true, isWritable: true },
        { pubkey: feePayerPubKey, isSigner: true, isWritable: true },
        { pubkey: gsnAccountKey, isSigner: false, isWritable: true },
        { pubkey: tokenProgramId, isSigner: false, isWritable: true },
        { pubkey: authorityPubKey, isSigner: true, isWritable: true },
    ];

    const submitLayout = BufferLayout.struct([
      BufferLayout.u8('instruction'),
      uint64('amount'),
    ]);

    const data = Buffer.alloc(submitLayout.span);

    submitLayout.encode(
        {
            instruction: 3,
            amount: new u64(amount).toBuffer(),
        },
        data,
    );

    return new TransactionInstruction({
        keys,
        programId: gsnProgramId,
        data,
    });
  }
}
