import dotenv from 'dotenv';
import { AppDataSource } from './data-source.js';
import app from './app.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('DB init error:', err);
    process.exit(1);
  });
