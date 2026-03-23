import { Router, Request, Response } from 'express';
import db from '../db';
import { dateRangeSchema, createBlackoutSchema } from '../validators/schemas';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/availability?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req: Request, res: Response) => {
  try {
    const parsed = dateRangeSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    const from = parsed.data.from || new Date().toISOString().slice(0, 10);
    const to = parsed.data.to || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    // Get confirmed/pending bookings in range
    const bookings = await db('bookings')
      .where('status', '!=', 'cancelled')
      .where('check_in', '<', to)
      .andWhere('check_out', '>', from)
      .select('check_in', 'check_out', 'status');

    // Get blackouts in range
    const blackouts = await db('blackouts')
      .where('date_from', '<=', to)
      .andWhere('date_to', '>=', from)
      .select('date_from', 'date_to', 'reason');

    // Build unavailable dates array
    const unavailableDates: string[] = [];
    const addDateRange = (start: string, end: string) => {
      const current = new Date(start);
      const endDate = new Date(end);
      while (current < endDate) {
        unavailableDates.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
      }
    };

    for (const b of bookings) {
      addDateRange(b.check_in, b.check_out);
    }
    for (const bl of blackouts) {
      const endPlusOne = new Date(bl.date_to);
      endPlusOne.setDate(endPlusOne.getDate() + 1);
      addDateRange(bl.date_from, endPlusOne.toISOString().slice(0, 10));
    }

    const unique = [...new Set(unavailableDates)].sort();

    res.json({
      from,
      to,
      unavailable_dates: unique,
      bookings: bookings.map(b => ({ check_in: b.check_in, check_out: b.check_out })),
      blackouts: blackouts.map(bl => ({ date_from: bl.date_from, date_to: bl.date_to, reason: bl.reason })),
    });
  } catch (err) {
    console.error('Erro ao verificar disponibilidade:', err);
    res.status(500).json({ error: 'Erro ao verificar disponibilidade.' });
  }
});

// POST /api/blackouts — admin: bloquear datas
router.post('/blackouts', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createBlackoutSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    const [id] = await db('blackouts').insert({
      date_from: parsed.data.date_from,
      date_to: parsed.data.date_to,
      reason: parsed.data.reason,
      created_at: new Date(),
    });

    const blackout = await db('blackouts').where('id', id).first();
    res.status(201).json(blackout);
  } catch (err) {
    console.error('Erro ao criar blackout:', err);
    res.status(500).json({ error: 'Erro ao bloquear datas.' });
  }
});

// GET /api/availability/blackouts — admin: listar blackouts
router.get('/blackouts', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const blackouts = await db('blackouts').orderBy('date_from', 'asc');
    res.json(blackouts);
  } catch (err) {
    console.error('Erro ao listar blackouts:', err);
    res.status(500).json({ error: 'Erro ao listar blackouts.' });
  }
});

// DELETE /api/availability/blackouts/:id — admin: remover blackout
router.delete('/blackouts/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await db('blackouts').where('id', id).first();
    if (!existing) {
      res.status(404).json({ error: 'Blackout não encontrado.' });
      return;
    }
    await db('blackouts').where('id', id).delete();
    res.json({ message: 'Blackout removido.' });
  } catch (err) {
    console.error('Erro ao remover blackout:', err);
    res.status(500).json({ error: 'Erro ao remover blackout.' });
  }
});

export default router;
