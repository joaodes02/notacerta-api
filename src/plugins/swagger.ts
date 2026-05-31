import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export const swaggerPlugin = fp(async (app) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'NotaCerta API',
        description: 'API do NotaCerta — emissão automática de NFS-e',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  // Swagger UI disponível em /docs. Em produção, considere proteger ou remover.
  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });
});
