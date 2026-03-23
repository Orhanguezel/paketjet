// src/modules/subscription/router.ts
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { listPlans, getPlan, getMySubscription, listMyHistory, purchasePlan, cancelSubscription } from "./controller";

const B = "/subscription";

export async function registerSubscription(app: FastifyInstance) {
  // Public
  app.get(`${B}/plans`, listPlans);
  app.get(`${B}/plans/:id`, getPlan);

  // Auth required
  app.get(`${B}/my`, { preHandler: [requireAuth] }, getMySubscription);
  app.get(`${B}/history`, { preHandler: [requireAuth] }, listMyHistory);
  app.post(`${B}/purchase`, { preHandler: [requireAuth] }, purchasePlan);
  app.post(`${B}/cancel`, { preHandler: [requireAuth] }, cancelSubscription);
}
