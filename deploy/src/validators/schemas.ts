import { z } from 'zod';

export const createBookingSchema = z.object({
  check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)'),
  check_out: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)'),
  guests: z.number().int().min(1, 'Mínimo 1 hóspede').max(20, 'Máximo 20 hóspedes'),
  name: z.string().min(2, 'Nome é obrigatório').max(200),
  email: z.string().email('Email inválido'),
  phone: z.string().min(6, 'Telefone é obrigatório').max(30),
  notes: z.string().max(1000).optional().default(''),
}).refine(data => new Date(data.check_out) >= new Date(data.check_in), {
  message: 'A data de check-out deve ser igual ou posterior ao check-in',
  path: ['check_out'],
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled'], {
    errorMap: () => ({ message: 'Estado inválido. Use: pending, confirmed, cancelled' }),
  }),
});

export const createBlackoutSchema = z.object({
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)'),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)'),
  reason: z.string().max(500).optional().default(''),
}).refine(data => new Date(data.date_to) >= new Date(data.date_from), {
  message: 'date_to deve ser >= date_from',
  path: ['date_to'],
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Password é obrigatória'),
});

export const dateRangeSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido').optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido').optional(),
});
