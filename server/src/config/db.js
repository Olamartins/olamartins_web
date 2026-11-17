import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { config } from './env.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export const pool = new pg.Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: 10,
});

export function query(text, params) {
  return pool.query(text, params);
}

// Creates tables/indexes if they do not exist yet (schema uses IF NOT EXISTS)
export async function initDb() {
  const schemaPath = path.resolve(here, '../../../database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(schema);
}
