use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("4ysKbtmk6SX1rgLKX9TFEwuSNvF6fQMjUdYDtu4V1CSy"); // Replace with the actual program ID from target/deploy/solana_nft_mint-keypair.json

#[program]
pub mod solana_nft_mint {
    use super::*;

    pub fn mint_nft(
        ctx: Context<MintNFT>,
        name: String,
        uri: String,
    ) -> Result<()> {
        let nft = &mut ctx.accounts.nft;
        nft.owner = *ctx.accounts.owner.key;
        nft.name = name;
        nft.uri = uri;
        nft.minted = true;

        // Mint the token (1 token representing the NFT)
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
            ),
            1, // Mint exactly 1 token (NFT)
        )?;

        Ok(())
    }

    pub fn transfer_nft(
        ctx: Context<TransferNFT>,
    ) -> Result<()> {
        let nft = &mut ctx.accounts.nft;
        require!(nft.owner == *ctx.accounts.current_owner.key, ErrorCode::NotOwner);

        // Transfer the token to the new owner
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.from_token_account.to_account_info(),
                    to: ctx.accounts.to_token_account.to_account_info(),
                    authority: ctx.accounts.current_owner.to_account_info(),
                },
            ),
            1, // Transfer the 1 token (NFT)
        )?;

        // Update the owner in the NFT account
        nft.owner = *ctx.accounts.new_owner.key;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 100 + 200 + 1, // discriminator + owner (32) + name (100) + uri (200) + minted (1)
        seeds = [b"nft", owner.key().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub nft: Account<'info, NFT>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(mut)]
    pub mint_authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct TransferNFT<'info> {
    #[account(mut, has_one = owner)]
    pub nft: Account<'info, NFT>,

    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,

    pub current_owner: Signer<'info>,

    #[account(constraint = new_owner.key() != current_owner.key())]
    pub new_owner: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
pub struct NFT {
    pub owner: Pubkey,
    pub name: String,
    pub uri: String,
    pub minted: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not the owner of this NFT")]
    NotOwner,
}