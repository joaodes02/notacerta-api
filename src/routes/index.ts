import { FastifyInstance } from "fastify";
import { healthRoutes } from "./health";

export async function registerRoutes(app: FastifyInstance) {
  app.register(healthRoutes);
}
