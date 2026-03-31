// src/modules/carriers/admin.routes.ts
import type { FastifyInstance } from "fastify";
import { adminGetCarrier, adminListCarriers } from "./controller";

export async function registerCarriersAdmin(app: FastifyInstance) {
  const B= "/carriers";
  app.get(B, adminListCarriers);
  app.get(`${B}/:id`, adminGetCarrier);
}
