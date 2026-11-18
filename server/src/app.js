import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import { notFound, errorHandler } from './middleware/error.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: config.clientUrl, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.use('/api', publicRoutes);
  app.use('/api/admin', adminRoutes);

  // In development the React app is served by Vite on its own port, so the
  // API server has no pages to show — point visitors to the right URL.
  if (config.nodeEnv !== 'production') {
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.status(200).json({
        message: 'API is running. In development, open the website at http://localhost:5173',
        health: '/api/health',
      });
    });
  }

  // In production the same Node process serves the built React app (cPanel)
  if (config.nodeEnv === 'production') {
    const dist = path.resolve(here, '../../client/dist');
    if (fs.existsSync(dist)) {
      app.use(express.static(dist));
      app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
    }
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
