import Fastify from 'fastify';
import { corsPlugin } from './plugins/cors';
import { swaggerPlugin } from './plugins/swagger';
import { authPlugin } from './plugins/auth';
import { registerRoutes } from './routes';

export const app = Fastify({ logger: true });

// Plugins
app.register(corsPlugin);
app.register(swaggerPlugin);
app.register(authPlugin);

// Rotas
app.register(registerRoutes, { prefix: '/api' });
