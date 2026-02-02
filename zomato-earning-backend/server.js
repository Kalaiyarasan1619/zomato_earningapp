import express from 'express';
import cors    from 'cors';
import dotenv  from 'dotenv';
import { sequelize } from './models/index.js';
import { router as earningsRouter } from './routes/earnings.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/earnings', earningsRouter);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢  DB connection OK');

    // auto-create table if it doesn't exist
    await sequelize.sync();   // pass { alter: true } during dev if you tweak columns

    app.listen(PORT, () =>
      console.log(`🚀  API running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('🔴  Unable to connect to DB:', err);
  }
})();
