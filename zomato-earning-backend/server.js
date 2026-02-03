import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import { router as earningsRouter } from './routes/earnings.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/earnings', earningsRouter);

// ✅ DB connect ONLY (NO sync)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 DB connected');
  } catch (err) {
    console.error('🔴 DB error:', err);
  }
})();

export default app;
