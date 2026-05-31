import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  // Servidor
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  FRONTEND_URL: z.url().default('http://localhost:3000'),

  // Banco de dados (obrigatório)
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),

  // JWT — mesma secret do NextAuth no frontend (obrigatório)
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET é obrigatória'),

  // Integrações — opcionais na fase inicial, tornar obrigatórias ao implementar
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRO_PRICE_ID: z.string().optional(),
  STRIPE_BUSINESS_PRICE_ID: z.string().optional(),
  FOCUS_NFE_API_KEY: z.string().optional(),
  FOCUS_NFE_BASE_URL: z.url().optional(),
  RESEND_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
