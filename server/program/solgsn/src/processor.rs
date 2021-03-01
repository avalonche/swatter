use crate::{error::GsnError, instruction::GsnInstruction, state::GsnInfo};

use num_traits::FromPrimitive;
use solana_program::{account_info::AccountInfo, account_info::{Account, next_account_info}, decode_error::DecodeError, entrypoint_deprecated::ProgramResult, info, program::{invoke, invoke_signed}, program_error::{PrintProgramError, ProgramError}, pubkey::Pubkey, system_instruction};
use std::convert::TryInto;
use spl_token::{
    instruction::transfer,
};
pub struct Processor {}

impl Processor {
    pub fn process(accounts: &[AccountInfo], input: &[u8]) -> ProgramResult {
        let instruction = GsnInstruction::deserialize(input)?;
        match instruction {
            GsnInstruction::Initialize(args) => {
                Self::process_initialize(args.nonce, accounts)
            }
            GsnInstruction::Topup(args) => {
                info!("Instruction: TopUp");
                Self::process_topup(args.amount, accounts)
            }
            GsnInstruction::SubmitTransaction(args) => {
                info!("Instruction: Submit Transaction");
                Self::process_submit_tx(args.amount, accounts)
            }
            GsnInstruction::SubmitTokenTransaction(args) => {
                info!("Instruction: Submit Token Transaction");
                Self::process_token_tx(args.amount, accounts)
            }
        }
    }

    pub fn process_initialize(nonce: u8, accounts: &[AccountInfo]) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let gsn_program_info = next_account_info(account_info_iter)?;

        let gsn = GsnInfo::new(nonce);
        gsn.serialize(&mut gsn_program_info.data.borrow_mut())
    }

    pub fn process_topup(amount: u64, accounts: &[AccountInfo]) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let gsn_program_info = next_account_info(account_info_iter)?;
        let consumer_info = next_account_info(account_info_iter)?;

        let mut gsn = GsnInfo::deserialize(gsn_program_info.data.borrow().as_ref())?;

        // TODO: deduct amount

        if gsn.consumer.contains_key(&consumer_info.key.to_string()) {
            match gsn.consumer.get(&consumer_info.key.to_string()) {
                Some(current_topup) => {
                    let val = current_topup + amount;
                    gsn.consumer
                        .entry(consumer_info.key.to_string())
                        .or_insert(val);
                }
                None => println!("has no value"),
            }
        } else {
            gsn.add_consumer(consumer_info.key.to_string(), amount);
        }

        gsn.serialize(&mut gsn_program_info.data.borrow_mut())
    }

    pub fn process_submit_tx(amount: u64, accounts: &[AccountInfo]) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let target_program_info = next_account_info(account_info_iter)?;
        let sender_info = next_account_info(account_info_iter)?;
        let reciever_info = next_account_info(account_info_iter)?;
        let fee_payer_info = next_account_info(account_info_iter)?;
        let gsn_program_info = next_account_info(account_info_iter)?;

        let mut gsn = GsnInfo::deserialize(&gsn_program_info.data.borrow())?;

        if gsn.consumer.contains_key(&sender_info.key.to_string()) {
            let inst = system_instruction::transfer(&sender_info.key, &reciever_info.key, amount);

            // let message = Message::new(&[inst.clone()], Some(&sender_info.key));
            // let fee_calculator = FeeCalculator::new(1);
            // let fee = fee_calculator.calculate_fee(&message);
            let fee = 50000;

            match invoke(
                &inst,
                &[
                    sender_info.clone(),
                    reciever_info.clone(),
                    target_program_info.clone(),
                ],
            ) {
                Ok(_) => {
                    if gsn.executor.contains_key(&fee_payer_info.key.to_string()) {
                        match gsn.executor.get(&fee_payer_info.key.to_string()) {
                            Some(earned_amount) => {
                                let val = earned_amount + fee;
                                gsn.executor
                                    .entry(fee_payer_info.key.to_string())
                                    .or_insert(val);
                            }
                            None => println!("has no value"),
                        }
                    } else {
                        gsn.add_executor(fee_payer_info.key.to_string(), fee);
                    }
                }
                Err(error) => return Err(error),
            }

            match gsn.consumer.get(&sender_info.key.to_string()) {
                Some(current_topup) => {
                    let val = current_topup - fee;
                    gsn.consumer
                        .entry(sender_info.key.to_string())
                        .or_insert(val);
                }
                None => println!("has no value"),
            }

            gsn.serialize(&mut gsn_program_info.data.borrow_mut())
        } else {
            return Err(ProgramError::InvalidInstructionData);
        }
    }

    pub fn process_token_tx(amount: u64, accounts: &[AccountInfo]) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let sender_info = next_account_info(account_info_iter)?;
        let reciever_info = next_account_info(account_info_iter)?;
        let owner_info = next_account_info(account_info_iter)?;
        let fee_payer_info = next_account_info(account_info_iter)?;
        let gsn_program_info = next_account_info(account_info_iter)?;
        let token_program_info = next_account_info(account_info_iter)?;
        let user_transfer_authority_info = next_account_info(account_info_iter)?;

        let mut gsn = GsnInfo::deserialize(&gsn_program_info.data.borrow())?;


        if !gsn.consumer.contains_key(&owner_info.key.to_string()) {
            // let message = Message::new(&[inst.clone()], Some(&sender_info.key));
            // let fee_calculator = FeeCalculator::new(1);
            // let fee = fee_calculator.calculate_fee(&message);
            let fee = 50000;

            Self::token_approve(
                token_program_info.clone(),
                sender_info.clone(),
                user_transfer_authority_info.clone(),
                owner_info.clone(),
                amount,
            )?;

            match Self::token_transfer(
                gsn_program_info.key,
                token_program_info.clone(),
                sender_info.clone(),
                reciever_info.clone(),
                user_transfer_authority_info.clone(),
                gsn.nonce,
                amount,
            ) {
                Ok(_) => {
                    if gsn.executor.contains_key(&fee_payer_info.key.to_string()) {
                        match gsn.executor.get(&fee_payer_info.key.to_string()) {
                            Some(earned_amount) => {
                                let val = earned_amount + fee;
                                gsn.executor
                                    .entry(fee_payer_info.key.to_string())
                                    .or_insert(val);
                            }
                            None => println!("has no value"),
                        }
                    } else {
                        gsn.add_executor(fee_payer_info.key.to_string(), fee);
                    }
                }
                Err(error) => return Err(error),
            }

            match gsn.consumer.get(&sender_info.key.to_string()) {
                Some(current_topup) => {
                    let val = current_topup - fee;
                    gsn.consumer
                        .entry(sender_info.key.to_string())
                        .or_insert(val);
                }
                None => println!("has no value"),
            }

            gsn.serialize(&mut gsn_program_info.data.borrow_mut())
        } else {
            return Err(ProgramError::InvalidInstructionData);
        }
    }

    /// Issue a spl_token `Transfer` instruction.
    pub fn token_transfer<'a>(
        gsn: &Pubkey,
        token_program: AccountInfo<'a>,
        source: AccountInfo<'a>,
        destination: AccountInfo<'a>,
        authority: AccountInfo<'a>,
        nonce: u8,
        amount: u64,
    ) -> Result<(), ProgramError> {
        let gsn_bytes = gsn.to_bytes();
        let authority_signature_seeds = [&gsn_bytes[..32], &[nonce]];
        let signers = &[&authority_signature_seeds[..]];
        let ix = spl_token::instruction::transfer(
            token_program.key,
            source.key,
            destination.key,
            authority.key,
            &[],
            amount,
        )?;
        invoke_signed(
            &ix,
            &[source, destination, authority, token_program],
            signers,
        )
    }

    pub fn token_approve<'a>(
        token_program: AccountInfo<'a>,
        source: AccountInfo<'a>,
        authority: AccountInfo<'a>,
        owner: AccountInfo<'a>,
        amount: u64,
    ) -> Result<(), ProgramError> {
        let ix = spl_token::instruction::approve(
            token_program.key,
            source.key,
            authority.key,
            owner.key,
            &[],
            amount,
        )?;
        invoke(
            &ix,
            &[source, authority, owner],
        )
    }
}

impl PrintProgramError for GsnError {
    fn print<E>(&self)
    where
        E: 'static + std::error::Error + DecodeError<E> + PrintProgramError + FromPrimitive,
    {
        match self {
            GsnError::AlreadyInUse => info!("Error: GSN account already in use"),
            GsnError::InvalidState => info!("Error: GSN state is not valid"),
        }
    }
}
