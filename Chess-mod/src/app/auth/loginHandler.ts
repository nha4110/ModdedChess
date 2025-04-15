// src/app/auth/loginHandler.ts
import { db } from '@/utils/db';
import bcrypt from 'bcryptjs';

export async function handleLogin({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const result = await db.query(
    `SELECT * FROM "UserInfo" WHERE username = $1`,
    [username]
  );

  if (result.rows.length === 0) return null;
  const user = result.rows[0];

  const match = bcrypt.compareSync(password, user.password_hash);
  return match ? user : null;
}
