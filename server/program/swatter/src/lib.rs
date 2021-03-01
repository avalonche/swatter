mod state;

use borsh::{BorshSerialize, BorshDeserialize};
use byteorder::{ByteOrder, LittleEndian};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use std::{
    str,
};
use serde::{Deserialize, Serialize};
use serde_json::Result;

use crate::state::{Profile, BorshDecode};

#[derive(Serialize, Deserialize, Debug)]
pub enum Instruction {
    SetProfile {
        alias: String,
        bio: String,
    },
    MakePost {
        content: String,
    }
}

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
fn process_instruction(
    program_id: &Pubkey, // Public key of the account the hello world program was loaded into
    accounts: &[AccountInfo], // The account to say hello to
    instruction_data: &[u8], // Ignored, all helloworld instructions are hellos
) -> ProgramResult {
    msg!("Helloworld Rust program entrypoint");

    // Iterating accounts is safer then indexing
    let accounts_iter = &mut accounts.iter();

    // Get the account to say hello to
    let account = next_account_info(accounts_iter)?;
    let s = match str::from_utf8(instruction_data)
    {
        Ok(v) => {
            let instr = match serde_json::from_str(&v).unwrap() {
                Instruction::SetProfile { alias, bio } => {
                    msg!("Set profile: {} {}", alias, bio);

                    let previous = Profile::decode(&account.try_borrow_data().unwrap());

                    msg!("Profile previously set to: {} {}", previous.alias, previous.bio);

                    let mut out = Profile::from(previous);
                    out.alias = alias;
                    out.bio = bio;

                    let encoded_profile = out.try_to_vec().unwrap();
                    account.try_borrow_mut_data()?.copy_from_slice(&[0; Profile::SIZE]);
                    account.try_borrow_mut_data()?[..encoded_profile.len()].copy_from_slice(&encoded_profile);

                },
                Instruction::MakePost { content } => {
                    msg!("Make post: {}", content);


                }
            };

        },
        Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
    };

    Ok(())
}

// Sanity tests
#[cfg(test)]
mod test {
    use super::*;
    use solana_program::clock::Epoch;

    #[test]
    fn test_sanity() {

        let mut profile: Profile = Profile::default();
        profile.alias = String::from("potato");
        profile.bio = String::from("tomato");
        let encoded_profile = profile.try_to_vec().unwrap();
        let decoded_profile: Profile = Profile::decode(&encoded_profile);
        assert_eq!(profile.alias, decoded_profile.alias);
        assert_eq!(profile.bio, decoded_profile.bio);
    }
}
