import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    await db.collection('settings').limit(1).get();
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected', timestamp: new Date().toISOString() });
  }
});

export default router;
