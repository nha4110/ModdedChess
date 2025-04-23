import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, createInitializeMintInstruction, createInitializeAccountInstruction, MINT_SIZE } from '@solana/spl-token';
import idl from '../../../idl/solana_nft_mint.json'; // Import the IDL from your project

// Load the program keypair (used for mint authority and PDA seeds)
const programKeypairPath = '/root/ModdedChess/ModdedChess/Chess-mod/solana-nft-mint/target/deploy/new_solana_nft_mint-keypair.json';
const programKeypair = Keypair.fromSecretKey(
  Buffer.from(JSON.parse(require('fs').readFileSync(programKeypairPath, 'utf8')))
);

// Create a dummy wallet for the provider (we won't use it for signing)
const dummyKeypair = Keypair.generate();
const dummyWallet: Wallet = {
  publicKey: dummyKeypair.publicKey,
  payer: dummyKeypair,
  signTransaction: async (tx: Transaction) => {
    throw new Error('Dummy wallet cannot sign transactions');
  },
  signAllTransactions: async (txs: Transaction[]) => {
    throw new Error('Dummy wallet cannot sign transactions');
  },
};

// Solana connection and program setup
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const provider = new AnchorProvider(connection, dummyWallet, { commitment: 'confirmed' });
const programId = new PublicKey(idl.metadata.address);
const program = new Program(idl as any, programId, provider);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletPublicKey, name, metadataCid, imageCid, collectionName } = body;

    if (!walletPublicKey || !name || !metadataCid || !imageCid || !collectionName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const receiverPublicKey = new PublicKey(walletPublicKey);

    // Derive the NFT account PDA
    const [nftPda, _bump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("nft"),
        receiverPublicKey.toBuffer(),
        programKeypair.publicKey.toBuffer(),
      ],
      programId
    );
    console.log('NFT PDA:', nftPda.toBase58());

    // Create a new mint (SPL token for the NFT)
    const mint = Keypair.generate();
    const mintLamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
    const createMintAccountInstruction = SystemProgram.createAccount({
      fromPubkey: receiverPublicKey,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports: mintLamports,
      programId: TOKEN_PROGRAM_ID,
    });
    const initializeMintInstruction = createInitializeMintInstruction(
      mint.publicKey,
      0, // Decimals (0 for NFT)
      programKeypair.publicKey, // Mint authority
      null, // Freeze authority
      TOKEN_PROGRAM_ID
    );

    // Create a token account for the receiver
    const tokenAccount = Keypair.generate();
    const tokenAccountSpace = 165; // Token account space
    const tokenAccountLamports = await connection.getMinimumBalanceForRentExemption(tokenAccountSpace);
    const createTokenAccountInstruction = SystemProgram.createAccount({
      fromPubkey: receiverPublicKey,
      newAccountPubkey: tokenAccount.publicKey,
      space: tokenAccountSpace,
      lamports: tokenAccountLamports,
      programId: TOKEN_PROGRAM_ID,
    });
    const initializeTokenAccountInstruction = createInitializeAccountInstruction(
      tokenAccount.publicKey,
      mint.publicKey,
      receiverPublicKey,
      TOKEN_PROGRAM_ID
    );

    // Build the mint NFT instruction
    const mintNftInstruction = await program.methods
      .mintNft(name, `https://ipfs.io/ipfs/${metadataCid}`)
      .accounts({
        nft: nftPda,
        mint: mint.publicKey,
        tokenAccount: tokenAccount.publicKey,
        owner: receiverPublicKey,
        mintAuthority: programKeypair.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction();

    // Combine all instructions into a single transaction
    const transaction = new Transaction();
    transaction.add(createMintAccountInstruction);
    transaction.add(initializeMintInstruction);
    transaction.add(createTokenAccountInstruction);
    transaction.add(initializeTokenAccountInstruction);
    transaction.add(mintNftInstruction);

    // Set the recent blockhash and fee payer
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = receiverPublicKey; // The user's wallet will pay the fees

    // Partial sign with the program keypair (mint authority) and the generated keypairs
    transaction.partialSign(programKeypair, mint, tokenAccount);

    // Serialize the transaction to send to the client
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false });
    const transactionBase64 = serializedTransaction.toString('base64');

    return NextResponse.json({
      success: true,
      transaction: transactionBase64,
      nftAccount: nftPda.toBase58(),
      metadata: { name, metadataCid, imageCid, collectionName }, // Return metadata for confirmation
    }, { status: 200 });
  } catch (error) {
    console.error('Error preparing NFT mint transaction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}