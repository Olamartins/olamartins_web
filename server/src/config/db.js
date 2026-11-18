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

function quoteIdent(name) {
  return `"${String(name).replace(/"/g, '""')}"`;
}

// If the configured database does not exist yet (error 3D000), try to create
// it via the maintenance "postgres" database. On shared hosting (cPanel) the
// user usually lacks CREATEDB, so we surface a clear how-to in that case.
async function ensureDatabaseExists() {
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    if (err.code !== '3D000') throw err;
    const admin = new pg.Client({
      host: config.db.host,
      port: config.db.port,
      database: 'postgres',
      user: config.db.user,
      password: config.db.password,
    });
    await admin.connect();
    try {
      await admin.query(`CREATE DATABASE ${quoteIdent(config.db.database)}`);
      console.log(`Created database "${config.db.database}" automatically.`);
    } catch (createErr) {
      if (createErr.code === '42P04') return; // already exists (race) — fine
      if (createErr.code === '42501') {
        throw new Error(
          `Database "${config.db.database}" does not exist and user "${config.db.user}" is not allowed to create databases. ` +
          'Create it manually (locally: `createdb ' + config.db.database + '`; on cPanel: PostgreSQL® Databases or phpPgAdmin), then restart.'
        );
      }
      throw createErr;
    } finally {
      await admin.end();
    }
  }
}

// Creates the database if needed, then tables/indexes (schema uses IF NOT EXISTS)
export async function initDb() {
  await ensureDatabaseExists();
  const schemaPath = path.resolve(here, '../../../database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(schema);
}
