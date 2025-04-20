import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    // Query the database to find the user by username
    const result = await pool.query(
      'SELECT * FROM "UserInfo" WHERE username = $1',
      [username]
    );

    // If no user is found
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];

    // Ensure you're using the correct column name (password_hash) from your schema
    const isMatch = await bcrypt.compare(password, user.password_hash);

    // If the password doesn't match
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    // Return success response with token and userId
    return NextResponse.json(
      { message: 'Login successful', userId: user.id, token },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}