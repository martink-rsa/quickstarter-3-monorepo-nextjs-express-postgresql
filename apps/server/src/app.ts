import cors from 'cors';
import express, { Application } from 'express';

import { specialRoutes } from './routes/special.routes';
import { userRoutes } from './routes/user.routes';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/specials', specialRoutes);

  return app;
}
