import pkg from 'pg';
import config from '../config/index.js';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: config.database.url,
  ...config.database.pool
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const query = (text, params) => {
  return pool.query(text, params);
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default pool;
