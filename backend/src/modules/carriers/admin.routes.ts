// src/modules/carriers/admin.routes.ts
import type { FastifyInstance } from "fastify";
import { adminGetCarrier, adminListCarriers } from "./controller";

export async function registerCarriersAdmin(app: FastifyInstance) {
  app.get("/carriers", adminListCarriers);
  app.get("/carriers/:id", adminGetCarrier);
}
