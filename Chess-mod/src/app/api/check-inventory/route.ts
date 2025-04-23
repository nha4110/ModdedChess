import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in your environment variables
});

export async function POST(request: Request) {
  try {
    const { username, spin } = await request.json();

    if (!username) {
      return NextResponse.json({ hasCases: false }, { status: 400 });
    }

    const client = await pool.connect();

    try {
      // Get user_id from UserInfo based on username
      const userResult = await client.query('SELECT id FROM "UserInfo" WHERE username = $1', [username]);
      if (userResult.rows.length === 0) {
        return NextResponse.json({ hasCases: false }, { status: 200 });
      }
      const userId = userResult.rows[0].id;

      // Check if user has any cases in Inventory
      const inventoryResult = await client.query(
        'SELECT skin_id FROM "Inventory" WHERE user_id = $1',
        [userId]
      );
      const userSkinIds = inventoryResult.rows.map((row) => row.skin_id);

      if (!spin) {
        // Initial check: return whether user has cases
        return NextResponse.json({ hasCases: userSkinIds.length > 0 }, { status: 200 });
      }

      // Spin logic: select a random skin from Skins table not in user's inventory
      const skinsResult = await client.query(
        'SELECT id, name FROM "Skins" WHERE id NOT IN (SELECT UNNEST($1::uuid[])) ORDER BY RANDOM() LIMIT 1',
        [userSkinIds.length > 0 ? userSkinIds : []]
      );

      if (skinsResult.rows.length === 0) {
        return NextResponse.json({ hasCases: false }, { status: 200 });
      }

      const selectedSkin = skinsResult.rows[0];

      // Optionally, insert the new skin into the user's inventory
      await client.query(
        'INSERT INTO "Inventory" (user_id, skin_id, source) VALUES ($1, $2, $3)',
        [userId, selectedSkin.id, 'case_opening']
      );

      return NextResponse.json({ hasCases: true, selectedSkin }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in check-inventory API:', error);
    return NextResponse.json({ hasCases: false }, { status: 500 });
  }
}