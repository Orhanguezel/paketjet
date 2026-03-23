// src/modules/carrier-bank/router.ts
import type { FastifyInstance } from "fastify";
import { getMyBank, upsertMyBank, deleteMyBank } from "./controller";
import { requireAuth } from "@/common/middleware/auth";

export async function registerCarrierBank(app: FastifyInstance) {
  const B = "/carrier-bank";
  const auth = { preHandler: [requireAuth] };
  app.get(B, auth, getMyBank);
  app.put(B, auth, upsertMyBank);
  app.delete(B, auth, deleteMyBank);
}
