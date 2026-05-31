import fp from 'fastify-plugin';
import fjwt from '@fastify/jwt';
import { eq } from 'drizzle-orm';
import { env } from '../config/env';
import { db } from '../db';
import { users } from '../db/schema';

export const authPlugin = fp(async (app) => {
  await app.register(fjwt, { secret: env.NEXTAUTH_SECRET });

  // Decorator para proteger rotas: use em `preHandler: [app.authenticate]`.
  app.decorate('authenticate', async (req, reply) => {
    try {
      await req.jwtVerify();

      const email = (req.user as { email?: string }).email;
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email ?? ''));

      if (!user) {
        return reply.status(401).send({ error: 'Usuário não encontrado' });
      }

      req.currentUser = user;
    } catch {
      return reply.status(401).send({ error: 'Token inválido ou expirado' });
    }
  });
});
