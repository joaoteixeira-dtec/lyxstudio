// Vercel Serverless Function — wraps the Express backend
// Environment variables (FIREBASE_SERVICE_ACCOUNT, JWT_SECRET)
// must be set in the Vercel dashboard.

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

import app from '../backend/src/index';

export default app;
