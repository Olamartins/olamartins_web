import { createApp } from './app.js';
import { config } from './config/env.js';
import { initDb, pool } from './config/db.js';

const app = createApp();

initDb()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`API listening on http://localhost:${config.port} (${config.nodeEnv})`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize the database:', err.message);
    console.error(
      'Check the DB_* values in your .env file. If the database itself is missing, the server tries to ' +
      'create it automatically; if that is not permitted, create it first (locally: `createdb <name>`; ' +
      'on cPanel: PostgreSQL® Databases / phpPgAdmin) and restart.'
    );
    process.exit(1);
  });

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
