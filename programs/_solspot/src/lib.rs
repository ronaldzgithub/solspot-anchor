use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("6qgQxwtSDhC8sEJ1AERrchDcyWVKsyj6cN5uk5papLsd");

#[program]
pub mod solspot {
    use super::*;

    pub fn initialize(ctx: Context<CreateProfile>) -> ProgramResult {
        let profile: &mut Account<Profile> = &mut ctx.accounts.profile;
        let user: &Signer = &ctx.accounts.user;
        profile.user = *user.key;
        Ok(())
    }

    pub fn update_profile(ctx: Context<UpdateProfile>, bio: String, content: Vec<ContentStruct>) -> ProgramResult {
        let profile: &mut Account<Profile> = &mut ctx.accounts.profile;
        profile.bio = bio;
        profile.link_list = content;
        Ok(())
    }

    pub fn delete_profile(_ctx: Context<DeleteProfile>) -> ProgramResult {
        Ok(())
    }

}


//Profile::LEN
#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(init, payer = user, space = Profile::LEN)]
    pub profile: Account<'info, Profile>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}


// Add the signer who calls the AddGif method to the struct so that we can save it
#[derive(Accounts)]
pub struct UpdateProfile<'info> {
  #[account(mut, has_one = user)]
  pub profile: Account<'info, Profile>,
  pub user: Signer<'info>,
}


#[derive(Accounts)]
pub struct DeleteProfile<'info> {
    #[account(mut, has_one = user, close = user)]
    pub profile: Account<'info, Profile>,
    pub user: Signer<'info>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ContentStruct {
    pub name: String,
    pub url: String,
    pub id: u8,
}


#[account]
pub struct Profile {
    pub user: Pubkey,
    pub bio: String,
    pub link_list: Vec<ContentStruct>,
}





const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const MAX_BIO_LENGTH: usize = 140 * 4; // 140 chars max.
const URL_LENGTH: usize = 200 * 4; // 200 chars max for the url
const URL_TITLE_LENGTH: usize = 50 * 4; // 50 chars max per title length of a link
const VEC_LENGTH: usize = (URL_LENGTH + URL_TITLE_LENGTH) * 8; // length of the vector of strings not including prefix
const STRING_LENGTH_PREFIX_TOTAL: usize = 21 * 4; // 21 total prefixes for the strings of 4 each

impl Profile {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + STRING_LENGTH_PREFIX_TOTAL // prefix 
        + MAX_BIO_LENGTH // Bio.
        + VEC_LENGTH; // URL ARR
}

#[error]
pub enum ErrorCode {
    #[msg("The provided bio should be 140 characters long maximum.")]
    BioTooLong,
}