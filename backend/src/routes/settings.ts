import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// GET /api/settings — retorna todas as settings como key/value
router.get('/', async (_req: Request, res: Response) => {
  try {
    const doc = await db.collection('settings').doc('main').get();
    if (!doc.exists) {
      res.json({});
      return;
    }
    res.json(doc.data());
  } catch (err) {
    console.error('Erro ao ler settings:', err);
    res.status(500).json({ error: 'Erro ao carregar configurações.' });
  }
});

export default router;
