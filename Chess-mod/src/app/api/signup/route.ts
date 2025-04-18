import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import validator from 'validator';

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

export async function POST(req: Request) {
  try {
    // Get client IP
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many signup attempts, please try again later.' },
        { status: 429 }
      );
    }

    const { email, username, password } = await req.json();

    // Input validation
    if (!validator.isEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    if (!username || username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: 'Username must be between 3 and 20 characters' },
        { status: 400 }
      );
    }
    if (
      !password ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters, include an uppercase letter and a number' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = validator.normalizeEmail(email) || email;
    const sanitizedUsername = validator.escape(username.trim());

    // Determine if this is the admin account
    const isAdmin = sanitizedUsername.toLowerCase() === 'admin';

    // Check if username already exists or is reserved
    const existingUser = await pool.query(
      'SELECT * FROM "UserInfo" WHERE LOWER(username) = $1',
      [sanitizedUsername.toLowerCase()]
    );
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username already taken or reserved' },
        { status: 409 }
      );
    }

    // Check if an admin account already exists
    if (isAdmin) {
      const adminCheck = await pool.query('SELECT * FROM "UserInfo" WHERE is_admin = $1', [true]);
      if (adminCheck.rows.length > 0) {
        return NextResponse.json({ error: 'Admin account already exists' }, { status: 403 });
      }
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 12);

    // Insert new user into the database
    await pool.query(
      'INSERT INTO "UserInfo" (email, username, password_hash, is_admin) VALUES ($1, $2, $3, $4)',
      [sanitizedEmail, sanitizedUsername, password_hash, isAdmin]
    );

    return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error inserting user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}