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
    console.error('Failed to initialize the database. Check your DB_* environment variables.', err);
    process.exit(1);
  });

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
