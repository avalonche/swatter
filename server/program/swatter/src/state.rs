use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::pubkey::{Pubkey, PubkeyError};
use solana_program::msg;

// Traits/typedefs
pub(crate) trait BorshDecode {
    fn get_last_non_zero_index(input: &[u8]) -> usize {
        let mut i = input.len() - 1;
        while i > 0 && input[i] == 0 {
            i -= 1;
        }
        i += 1;
        return i;
    }

    fn decode(input: &[u8]) -> Self;
}

// Borsh doesn't like Solana Pubkey, so we're rolling our own
pub type PublicKey = [u8; 32];

// Struct defs
#[derive(BorshSerialize, BorshDeserialize, Default, PartialEq, Debug)]
pub struct Post {
    pub next_post: PublicKey, // posts are effectively linked list nodes
    pub content: String,
}


#[derive(BorshSerialize, BorshDeserialize, Default, PartialEq, Debug)]
pub struct Profile {
    pub next_post: PublicKey, // pk of the profile's first post
    pub alias: String,
    pub bio: String,
}

// Implementations
impl Post {
    pub const SIZE: usize = 255;
    pub const SEED: &'static str = "post";
    pub fn create_with_seed(
        previous_node_pk: &Pubkey,
        program_id: &Pubkey) -> Result<Pubkey, PubkeyError> {
        Pubkey::create_with_seed(&previous_node_pk, Post::SEED, &program_id)
    }

    pub fn getLastPost(root: &Pubkey) {
        // TODO implement
    }
}

impl BorshDecode for Post {
    fn decode(input: &[u8]) -> Self {
        let i = Self::get_last_non_zero_index(&input);
        let result = match Self::try_from_slice(&input[..i]) {
            Ok(p) => p,
            _ => Self::default(),
        };
        return result;
    }
}

impl Profile {
    pub const SIZE: usize = 255;
    pub const SEED: &'static str = "profile";
    pub fn create_with_seed(profile_owner: &Pubkey, program_id: &Pubkey) -> Result<Pubkey, PubkeyError> {
        Pubkey::create_with_seed(&profile_owner, Profile::SEED, &program_id)
    }
}

impl BorshDecode for Profile {
    fn decode(input: &[u8]) -> Self {
        let i = Self::get_last_non_zero_index(&input);
        msg!("Size: {}", i);
        let result = match Self::try_from_slice(&input[..i]) {
            Ok(p) => p,
            _ => Self::default(),
        };
        return result;
    }
}
