import express from 'express';
import cors from 'cors';
import { router as earningsRouter } from './routes/earnings.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/earnings', earningsRouter);

export default app;
