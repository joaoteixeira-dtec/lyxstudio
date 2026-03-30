import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../db';
import { loginSchema } from '../validators/schemas';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vanguard-secret';

// POST /api/admin/login → JWT
router.post('/login', async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    const { email, password } = parsed.data;

    const snapshot = await db.collection('admins').where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const adminDoc = snapshot.docs[0];
    const admin = { id: adminDoc.id, ...adminDoc.data() } as any;

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro ao autenticar.' });
  }
});

export default router;
