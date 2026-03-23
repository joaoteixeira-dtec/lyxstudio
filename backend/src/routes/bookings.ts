import { Router, Request, Response } from 'express';
import db from '../db';
import { createBookingSchema, updateBookingStatusSchema, dateRangeSchema } from '../validators/schemas';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/bookings?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req: Request, res: Response) => {
  try {
    const parsed = dateRangeSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    let query = db('bookings').orderBy('check_in', 'asc');

    if (parsed.data.from) {
      query = query.where('check_in', '>=', parsed.data.from);
    }
    if (parsed.data.to) {
      query = query.where('check_out', '<=', parsed.data.to);
    }

    const bookings = await query;
    res.json(bookings);
  } catch (err) {
    console.error('Erro ao listar reservas:', err);
    res.status(500).json({ error: 'Erro ao carregar reservas.' });
  }
});

// POST /api/bookings — nova reserva (estado pendente)
router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    const data = parsed.data;

    // Check for blackout overlap
    const blackouts = await db('blackouts')
      .where('date_from', '<=', data.check_out)
      .andWhere('date_to', '>=', data.check_in);

    if (blackouts.length > 0) {
      res.status(409).json({ error: 'As datas selecionadas não estão disponíveis.' });
      return;
    }

    // Check for overlapping confirmed bookings
    const overlapping = await db('bookings')
      .where('status', '!=', 'cancelled')
      .where('check_in', '<', data.check_out)
      .andWhere('check_out', '>', data.check_in);

    if (overlapping.length > 0) {
      res.status(409).json({ error: 'Já existe uma reserva para as datas selecionadas.' });
      return;
    }

    const [id] = await db('bookings').insert({
      check_in: data.check_in,
      check_out: data.check_out,
      guests: data.guests,
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
      status: 'pending',
      created_at: new Date(),
    });

    const booking = await db('bookings').where('id', id).first();
    res.status(201).json(booking);
  } catch (err) {
    console.error('Erro ao criar reserva:', err);
    res.status(500).json({ error: 'Erro ao criar reserva.' });
  }
});

// PATCH /api/bookings/:id — admin: alterar estado
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = updateBookingStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    const existing = await db('bookings').where('id', id).first();
    if (!existing) {
      res.status(404).json({ error: 'Reserva não encontrada.' });
      return;
    }

    await db('bookings').where('id', id).update({ status: parsed.data.status });
    const updated = await db('bookings').where('id', id).first();
    res.json(updated);
  } catch (err) {
    console.error('Erro ao atualizar reserva:', err);
    res.status(500).json({ error: 'Erro ao atualizar reserva.' });
  }
});

export default router;
