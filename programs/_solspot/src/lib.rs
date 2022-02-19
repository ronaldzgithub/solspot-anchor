use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("9LzdaMByVqhVJqbP74KF1mwxfSiQSVQWMZnwRgbPMW88");

#[program]
pub mod solspot {
    use super::*;

    pub fn initialize(ctx: Context<CreateProfile>) -> ProgramResult {
        let profile: &mut Account<Profile> = &mut ctx.accounts.profile;
        let user: &Signer = &ctx.accounts.user;
        profile.user = *user.key;
        profile.light_theme = true;
        profile.individual = true;
        Ok(())
    }

    pub fn update_profile(ctx: Context<UpdateProfile>, bio: String, color: String, light: bool, individ_prof: bool, content: Vec<ContentStruct>) -> ProgramResult {
        let profile: &mut Account<Profile> = &mut ctx.accounts.profile;

        if bio.chars().count() > 150 {
            return Err(ErrorCode::BioTooLong.into())
        }

        if color.chars().count() > 6 {
            return Err(ErrorCode::ColorTooLong.into())
        }

        profile.bio = bio;
        profile.color = color;
        profile.light_theme = light;
        profile.individual = individ_prof;
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
    pub color: String,
    pub light_theme: bool,
    pub individual: bool,
    pub link_list: Vec<ContentStruct>,
}




// Vectors
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const MAX_BIO_LENGTH: usize = 150 * 4; // 140 chars max.
const COLOR_LENGTH: usize = 6 * 4; // 6 chars max -- hex code
const THEME_LENGTH: usize = 1 * 4; // boolean, based on ligth vs dark mode
const INDIVIDUAL_TYPE_LENGTH: usize = 1 * 4; // boolean, based on ligth vs dark mode
const ITEM_NAME_LENGTH: usize = 50 * 4; // 50 chars max per title length of a link
const ITEM_URL_LENGTH: usize = 200 * 4; // 200 chars max for the url
const ITEM_ID_LENGTH: usize = 1 * 4; // 1 byte (1 byte == 4 bits)
const MAX_VEC_LENGTH: usize = (ITEM_NAME_LENGTH + ITEM_URL_LENGTH + ITEM_ID_LENGTH) * 8; // length of the vector of strings not including prefix
const STRING_PREFIX_TOTAL: usize = 22 * 4; // 21 total prefixes for the strings of 4 each

impl Profile {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + MAX_BIO_LENGTH // Bio.
        + COLOR_LENGTH
        + THEME_LENGTH
        + INDIVIDUAL_TYPE_LENGTH 
        + STRING_PREFIX_TOTAL // prefix 
        + MAX_VEC_LENGTH; // URL ARR
}

#[error]
pub enum ErrorCode {
    #[msg("The provided bio should be 150 characters long maximum.")]
    BioTooLong,
    
    #[msg("The provided color should be 6 characters long.")]
    ColorTooLong,
}