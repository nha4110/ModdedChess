import { db } from '@/utils/db';
import bcrypt from 'bcryptjs';
import validator from 'validator';

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
  // Input validation
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }
  if (!username || username.length < 3 || username.length > 20) {
    throw new Error('Username must be between 3 and 20 characters');
  }
  if (
    !password ||
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    throw new Error(
      'Password must be at least 8 characters, include an uppercase letter and a number'
    );
  }

  // Sanitize inputs
  const sanitizedEmail = validator.normalizeEmail(email) || email;
  const sanitizedUsername = validator.escape(username.trim());

  // Determine if this is the admin account
  const isAdmin = sanitizedUsername.toLowerCase() === 'admin';

  // Check if username exists or is reserved
  const existingUser = await db.query(
    `SELECT * FROM "UserInfo" WHERE LOWER(username) = $1`,
    [sanitizedUsername.toLowerCase()]
  );
  if (existingUser.rows.length > 0) {
    throw new Error('Username already taken or reserved');
  }

  // Check if admin account exists
  if (isAdmin) {
    const adminCheck = await db.query(`SELECT * FROM "UserInfo" WHERE is_admin = $1`, [true]);
    if (adminCheck.rows.length > 0) {
      throw new Error('Admin account already exists');
    }
  }

  // Hash password
  const hash = bcrypt.hashSync(password, 12);

  // Insert user
  await db.query(
    `INSERT INTO "UserInfo" (username, email, password_hash, wallet_address, is_admin)
     VALUES ($1, $2, $3, $4, $5)`,
    [sanitizedUsername, sanitizedEmail, hash, walletAddress, isAdmin]
  );
}