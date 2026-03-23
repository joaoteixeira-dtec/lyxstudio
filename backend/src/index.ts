import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

import healthRouter from './routes/health';
import settingsRouter from './routes/settings';
import bookingsRouter from './routes/bookings';
import availabilityRouter from './routes/availability';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// --- Middleware ---
app.use(cors({
  origin: isProduction
    ? (process.env.CORS_ORIGIN || '*')
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(express.json());

// Force HTTPS in production (behind reverse proxy / Passenger)
if (isProduction) {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Rate limiter: 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos. Tente novamente mais tarde.' },
});
app.use('/api/', limiter);

// Serve static assets (images + video)
const assetsPath = isProduction
  ? path.join(__dirname, '../assets')
  : path.join(__dirname, '../../assets');
app.use('/assets', express.static(assetsPath, { maxAge: isProduction ? '7d' : 0 }));

// --- Routes ---
app.use('/api/health', healthRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/admin', adminRouter);

// --- Production: serve frontend ---
if (isProduction) {
  const publicPath = path.join(__dirname, '../public');
  app.use(express.static(publicPath, { maxAge: '1d' }));

  // SPA fallback: any non-API route returns index.html
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// --- Global error handler ---
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`✅ Vanguard API running at http://localhost:${PORT} [${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}]`);
});

export default app;
