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

    let query: FirebaseFirestore.Query = db.collection('bookings').orderBy('check_in', 'asc');

    if (parsed.data.from) {
      query = query.where('check_in', '>=', parsed.data.from);
    }
    if (parsed.data.to) {
      query = query.where('check_out', '<=', parsed.data.to);
    }

    const snapshot = await query.get();
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    const blackoutSnap = await db.collection('blackouts')
      .where('date_from', '<=', data.check_out)
      .where('date_to', '>=', data.check_in)
      .get();

    if (!blackoutSnap.empty) {
      res.status(409).json({ error: 'As datas selecionadas não estão disponíveis.' });
      return;
    }

    // Check for overlapping bookings (filter cancelled in-memory)
    const overlapSnap = await db.collection('bookings')
      .where('check_in', '<', data.check_out)
      .where('check_out', '>', data.check_in)
      .get();

    const overlapping = overlapSnap.docs.filter(doc => doc.data().status !== 'cancelled');

    if (overlapping.length > 0) {
      res.status(409).json({ error: 'Já existe uma reserva para as datas selecionadas.' });
      return;
    }

    const docRef = await db.collection('bookings').add({
      check_in: data.check_in,
      check_out: data.check_out,
      guests: data.guests,
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    const newDoc = await docRef.get();
    res.status(201).json({ id: newDoc.id, ...newDoc.data() });
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

    const docRef = db.collection('bookings').doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      res.status(404).json({ error: 'Reserva não encontrada.' });
      return;
    }

    await docRef.update({ status: parsed.data.status });
    const updated = await docRef.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err) {
    console.error('Erro ao atualizar reserva:', err);
    res.status(500).json({ error: 'Erro ao atualizar reserva.' });
  }
});

export default router;
