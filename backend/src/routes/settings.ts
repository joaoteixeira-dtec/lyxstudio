import { Router, Request, Response } from 'express';
import db from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

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

// GET /api/settings/smtp — retorna config SMTP guardada (requer auth)
router.get('/smtp', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const doc = await db.collection('settings').doc('smtp').get();
    if (!doc.exists) {
      res.json({});
      return;
    }
    res.json(doc.data());
  } catch (err) {
    console.error('Erro ao ler config SMTP:', err);
    res.status(500).json({ error: 'Erro ao carregar configuração SMTP.' });
  }
});

// PUT /api/settings/smtp — guarda config SMTP (requer auth)
router.put('/smtp', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { host, port, user, password, fromName, fromEmail, secure } = req.body;
    if (!host || !port || !user || !fromEmail) {
      res.status(400).json({ error: 'Campos obrigatórios em falta: host, port, user, fromEmail.' });
      return;
    }
    const smtpData: Record<string, any> = { host, port, user, fromName: fromName || '', fromEmail, secure: !!secure, updatedAt: new Date().toISOString() };
    if (password) smtpData.password = password;
    await db.collection('settings').doc('smtp').set(smtpData, { merge: true });
    res.json({ message: 'Configuração SMTP guardada com sucesso.' });
  } catch (err) {
    console.error('Erro ao guardar config SMTP:', err);
    res.status(500).json({ error: 'Erro ao guardar configuração SMTP.' });
  }
});

export default router;
