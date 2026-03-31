// src/modules/disputes/admin.routes.ts
import type { FastifyInstance } from "fastify";
import { adminListDisputes, adminResolveDispute } from "./controller";

export async function registerDisputesAdmin(app: FastifyInstance) {
  const B = "/disputes";
  app.get(B, adminListDisputes);
  app.put(`${B}/:id/resolve`, adminResolveDispute);
}
