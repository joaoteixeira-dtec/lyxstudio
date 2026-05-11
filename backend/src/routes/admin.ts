import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import db from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
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

// POST /api/admin/smtp-test — testa ligação SMTP com as config fornecidas (requer auth)
router.post('/smtp-test', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { host, port, user, password, secure } = req.body;
    if (!host || !port || !user || !password) {
      res.status(400).json({ error: 'Campos obrigatórios: host, port, user, password.' });
      return;
    }
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: !!secure,
      auth: { user, pass: password },
    });
    await transporter.verify();
    res.json({ ok: true, message: 'Ligação SMTP estabelecida com sucesso.' });
  } catch (err: any) {
    console.error('Erro no teste SMTP:', err);
    res.status(400).json({ ok: false, error: err.message || 'Falha na ligação SMTP.' });
  }
});

// POST /api/admin/email-send — envia email real usando SMTP guardado (requer auth)
router.post('/email-send', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
      res.status(400).json({ error: 'Campos obrigatórios: to, subject, body.' });
      return;
    }

    const smtpDoc = await db.collection('settings').doc('smtp').get();
    if (!smtpDoc.exists) {
      res.status(400).json({ error: 'Configuração SMTP em falta. Guarde primeiro nas Definições de Email.' });
      return;
    }
    const smtp = smtpDoc.data() as any;
    if (!smtp.host || !smtp.port || !smtp.user || !smtp.password) {
      res.status(400).json({ error: 'Configuração SMTP incompleta. Verifique host, port, utilizador e password.' });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: parseInt(smtp.port, 10),
      secure: !!smtp.secure,
      auth: { user: smtp.user, pass: smtp.password },
    });

    const fromName = smtp.fromName || 'LYX Studios';
    const fromEmail = smtp.fromEmail || smtp.user;
    const from = `"${fromName}" <${fromEmail}>`;

    const isHtml = /<[a-z][\s\S]*>/i.test(body);
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      ...(isHtml ? { html: body } : { text: body }),
    });

    res.json({ ok: true, messageId: info.messageId });
  } catch (err: any) {
    console.error('Erro ao enviar email:', err);
    res.status(500).json({ ok: false, error: err.message || 'Erro ao enviar email.' });
  }
});

export default router;
