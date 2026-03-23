import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// GET /api/settings — retorna todas as settings como key/value
router.get('/', async (_req: Request, res: Response) => {
  try {
    const rows = await db('settings').select('*');
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (err) {
    console.error('Erro ao ler settings:', err);
    res.status(500).json({ error: 'Erro ao carregar configurações.' });
  }
});

export default router;
