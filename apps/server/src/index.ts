import dotenv from 'dotenv';

import { createApp } from './app';

dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 3031;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server };
