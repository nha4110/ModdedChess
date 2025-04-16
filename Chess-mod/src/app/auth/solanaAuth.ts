import { Connection, PublicKey } from '@solana/web3.js';

export const verifySolanaWallet = async (walletAddress: string) => {
  const rpcUrl = process.env.SOLANA_RPC_URL;
  if (!rpcUrl) throw new Error('SOLANA_RPC_URL is not set in .env.local');

  const connection = new Connection(rpcUrl);

  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    if (balance >= 0) {
      return true; // Wallet exists
    } else {
      throw new Error('Insufficient balance or invalid wallet');
    }
  } catch {
    return false; // Invalid wallet address
  }
};