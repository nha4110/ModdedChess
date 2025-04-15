import { pool } from '@/lib/db'; // Correct import path
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Retrieve userId from request headers or session (ensure it's a valid UUID string)
  const userId = req.headers.get('user-id');  // Or get it from a JWT or session

  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    // Ensure userId is a valid UUID
    const uuid = require('uuid'); // Import uuid package
    if (!uuid.validate(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    // Query the database to get user info based on userId
    const result = await pool.query(
      'SELECT username, email, wallet_address FROM "UserInfo" WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user information' }, { status: 500 });
  }
}
