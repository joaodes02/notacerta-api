import { FastifyInstance } from 'fastify';

export async function authRoutes(app: FastifyInstance) {
  // Endpoint que o front chama para validar a sessão e obter o usuário atual.
  app.get(
    '/me',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Auth'],
        summary: 'Retorna o usuário autenticado',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              name: { type: ['string', 'null'] },
              image: { type: ['string', 'null'] },
              plan: { type: 'string' },
              planStatus: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    async (req) => {
      // currentUser é injetado pelo preHandler `authenticate`.
      const user = req.currentUser!;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        plan: user.plan,
        planStatus: user.planStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },
  );
}
