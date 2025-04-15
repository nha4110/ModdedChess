import { pool } from '@/lib/db';  // Ensure correct import path
import bcrypt from 'bcrypt';  // Correctly import bcrypt

export async function POST(req: Request) {
  const { email, username, password } = await req.json();

  try {
    // Check if the username already exists in the database
    const existingUser = await pool.query(
      'SELECT * FROM "UserInfo" WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      // If username exists, return a 409 Conflict error
      return new Response('Username already taken', { status: 409 });
    }

    // Hash the password before storing it
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.query(
      'INSERT INTO "UserInfo" (email, username, password_hash) VALUES ($1, $2, $3)',
      [email, username, password_hash]
    );

    return new Response('User created successfully', { status: 200 });
  } catch (error) {
    console.error('Error inserting user:', error);
    return new Response('Failed to create user', { status: 500 });
  }
}
