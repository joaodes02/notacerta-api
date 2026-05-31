import 'fastify';
import type { users } from '../db/schema';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      req: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }

  interface FastifyRequest {
    currentUser?: typeof users.$inferSelect;
  }
}
