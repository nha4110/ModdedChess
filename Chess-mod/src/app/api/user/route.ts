import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { validate } from 'uuid';

export async function GET(req: Request) {
  const userId = req.headers.get('user-id');

  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    if (!validate(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT username, email, wallet_address, is_admin FROM "UserInfo" WHERE id = $1',
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

export async function PUT(req: Request) {
  const userId = req.headers.get('user-id');
  if (!userId) return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });

  try {
    if (!validate(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const body = await req.json();
    const { wallet_address } = body;

    await pool.query('UPDATE "UserInfo" SET wallet_address = $1 WHERE id = $2', [
      wallet_address,
      userId,
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 });
  }
}