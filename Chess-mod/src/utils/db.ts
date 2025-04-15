import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export const db = {
  query: (text: string, params: any[]) => client.query(text, params),
  // You can add more database functions as needed
};
