import './env.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { connectDB } from './config/db.js';
import jobsRouter from './routes/jobs.js';
import careerRouter from './routes/career.js';
import userPreferencesRouter from './routes/userPreferences.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

const corsAllowedList = () => {
  const defaults = ['http://localhost:5173', 'http://127.0.0.1:5173'];
  const extra = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  return [...new Set([...defaults, ...extra])];
};

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const list = corsAllowedList();
      if (list.includes(origin)) return cb(null, true);
      if (
        process.env.CORS_ALLOW_VERCEL === '1' &&
        /^https:\/\/.+\.vercel\.app$/i.test(origin)
      ) {
        return cb(null, true);
      }
      cb(null, false);
    },
    credentials: true
  })
);
app.use(express.json());

app.use('/api/jobs', jobsRouter);
app.use('/api/career', careerRouter);
app.use('/api/user/preferences', userPreferencesRouter);

app.get('/', (req, res) => {
  res.send('Job Recommendation Backend is running');
});

connectDB().then(() => {
  app.listen(PORT, () => {
    const ml =
      (process.env.ML_SERVICE_URL || '').trim() || 'http://127.0.0.1:8765 (default)';
    console.log(`Server listening on port ${PORT}`);
    console.log(`Career ML service URL: ${ml}`);
  });
});

