// src/lib/neon.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export class NeonClient {
  async insertSkin(skin: {
    name: string;
    type: string;
    image_url: string;
    metadata_url: string;
  }) {
    const query = `
      INSERT INTO "Skins" (name, type, image_url, metadata_url)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [
      skin.name,
      skin.type,
      skin.image_url,
      skin.metadata_url,
    ];
    await pool.query(query, values);
  }
}
