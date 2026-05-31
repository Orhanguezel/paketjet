import type { FastifyInstance } from "fastify";
import { adminListIlanPurchases } from "./admin.controller";

export async function registerPurchasesAdmin(app: FastifyInstance) {
  app.get("/ilan-purchases", adminListIlanPurchases);
}
