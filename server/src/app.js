import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, '../../client/dist');
const allowedOrigins = env.clientUrl
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== 'production') {
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'House Property Tax Management System API',
      version: '1.0.0',
    });
  });
}

if (env.nodeEnv === 'production') {
  app.use(express.static(clientDistPath));
}

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'House Property Tax Management System API',
    version: '1.0.0',
  });
});

app.use('/api', apiRoutes);

if (env.nodeEnv === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
