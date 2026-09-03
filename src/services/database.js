import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_xtGvc5gP2oqY@ep-misty-poetry-ax5n6c7g-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

export const queryDatabase = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('[DB QUERY]', { text: text.substring(0, 80), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('[DB ERROR]', error.message);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, current_database() as db_name, version();');
    client.release();
    return {
      success: true,
      data: result.rows[0]
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
};
