import fp from 'fastify-plugin';
import fjwt from '@fastify/jwt';
import { env } from '../config/env';
import { db } from '../db';
import { users } from '../db/schema';

// Claims que esperamos do JWT emitido pelo NextAuth.
interface SessionClaims {
  email?: string;
  name?: string | null;
  picture?: string | null; // NextAuth usa "picture" para a foto
  image?: string | null; // fallback
}

export const authPlugin = fp(async (app) => {
  await app.register(fjwt, { secret: env.NEXTAUTH_SECRET });

  // Decorator para proteger rotas: use em `preHandler: [app.authenticate]`.
  app.decorate('authenticate', async (req, reply) => {
    try {
      // Valida assinatura (HS256) e expiração do token.
      await req.jwtVerify();
    } catch {
      return reply.status(401).send({ error: 'Token inválido ou expirado' });
    }

    const claims = req.user as SessionClaims;
    const email = claims.email?.trim().toLowerCase();

    if (!email) {
      return reply.status(401).send({ error: 'Token sem e-mail' });
    }

    // Auto-provisionamento: cria o usuário no primeiro acesso e mantém
    // nome/imagem em dia nos acessos seguintes. Mantém o backend stateless
    // e funciona mesmo sem o front escrever direto neste banco.
    const name = claims.name ?? null;
    const image = claims.picture ?? claims.image ?? null;

    const [user] = await db
      .insert(users)
      .values({ email, name, image })
      .onConflictDoUpdate({
        target: users.email,
        set: { name, image, updatedAt: new Date() },
      })
      .returning();

    req.currentUser = user;
  });
});
