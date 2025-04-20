import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import validator from 'validator';
import jwt from 'jsonwebtoken';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 5; // Max 5 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  // Reset count if window has passed
  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  // Increment count and check limit
  if (record.count >= RATE_LIMIT) {
    return false;
  }

  rateLimitMap.set(ip, { count: record.count + 1, lastReset: record.lastReset });
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface GameOutcome {
  gameMode: string;
  winner: string | null; // 'white', 'black', or null for draw
}

export async function POST(req: NextRequest) {
  try {
    // Get client IP
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      console.log('Rate limit exceeded for IP:', clientIp);
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }

    // Verify JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid Authorization header');
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    let decoded: { username: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string };
      console.log('JWT verified for username:', decoded.username);
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const playerUsername = decoded.username;

    const { gameMode, winner } = await req.json();

    // Input validation
    if (!gameMode || !validator.isLength(gameMode, { min: 3, max: 50 })) {
      console.log('Invalid gameMode:', gameMode);
      return NextResponse.json(
        { error: 'Game mode must be between 3 and 50 characters' },
        { status: 400 }
      );
    }
    if (!playerUsername || !validator.isLength(playerUsername, { min: 3, max: 20 })) {
      console.log('Invalid username:', playerUsername);
      return NextResponse.json(
        { error: 'Username must be between 3 and 20 characters' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedUsername = validator.escape(playerUsername.trim());

    // Only update if there is a winner
    if (winner !== null) {
      // Check if user exists
      const userCheck = await pool.query(
        'SELECT * FROM "UserInfo" WHERE LOWER(username) = $1',
        [sanitizedUsername.toLowerCase()]
      );
      if (userCheck.rows.length === 0) {
        console.log('User not found:', sanitizedUsername);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Update chests_received for the winning player
      console.log('Awarding chest to:', sanitizedUsername);
      const query = `
        UPDATE "UserInfo"
        SET chests_received = chests_received + 1
        WHERE LOWER(username) = $1
        RETURNING chests_received
      `;
      const values = [sanitizedUsername.toLowerCase()];

      const result = await pool.query(query, values);
      console.log('Chest awarded, new count:', result.rows[0].chests_received);

      return NextResponse.json(
        {
          message: 'Chest awarded successfully',
          chests_received: result.rows[0].chests_received,
        },
        { status: 200 }
      );
    }

    console.log('No winner, no chest awarded');
    return NextResponse.json({ message: 'No winner, no chest awarded' }, { status: 200 });
  } catch (error) {
    console.error('Error updating game outcome:', error);
    return NextResponse.json({ error: 'Failed to process game outcome' }, { status: 500 });
  }
}