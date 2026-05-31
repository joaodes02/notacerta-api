import { FastifyInstance } from "fastify";
import { healthRoutes } from "./health";
import { authRoutes } from "./auth";

export async function registerRoutes(app: FastifyInstance) {
  app.register(healthRoutes);
  app.register(authRoutes, { prefix: "/auth" });
}
