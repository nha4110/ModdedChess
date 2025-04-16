import { Pool } from 'pg';

// Create a new instance of the PostgreSQL client (pooling for performance)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure you have this environment variable in your .env.local
});

// Export the pool for use in other parts of the app (e.g., your routes)
export { pool };

// Export helper functions as well
export const db = {
  // Run a query with text and params
  query: async (text: string, params: unknown[] = []) => {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err: unknown) {
      console.error('Error executing query', err);
      throw err;
    }
  },

  // Add any other database functions as needed (e.g., for more specific queries)
  getUserByEmail: async (email: string) => {
    const query = 'SELECT * FROM "UserInfo" WHERE email = $1';
    const res = await db.query(query, [email]);
    return res.rows[0]; // Return the first row, assuming email is unique
  },

  createUser: async (email: string, username: string, passwordHash: string) => {
    const query =
      'INSERT INTO "UserInfo" (email, username, password_hash) VALUES ($1, $2, $3) RETURNING *';
    const res = await db.query(query, [email, username, passwordHash]);
    return res.rows[0]; // Return the created user
  },

  // You can add more helper functions for other database operations here
};
