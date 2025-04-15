// src/app/auth/signupHandler.ts
import { db } from '@/utils/db';
import bcrypt from 'bcryptjs';

export async function handleSignup({
  username,
  email,
  password,
  walletAddress,
}: {
  username: string;
  email: string;
  password: string;
  walletAddress: string;
}) {
  const hash = bcrypt.hashSync(password, 10);

  await db.query(
    `INSERT INTO "UserInfo" (username, email, password_hash, wallet_address)
     VALUES ($1, $2, $3, $4)`,
    [username, email, hash, walletAddress]
  );
}
