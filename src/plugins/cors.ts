import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { env } from '../config/env';

export const corsPlugin = fp(async (app) => {
  await app.register(cors, {
    origin: env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
});
