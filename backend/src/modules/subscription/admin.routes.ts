// src/modules/subscription/admin.routes.ts
import type { FastifyInstance } from "fastify";
import {
  adminListPlans,
  adminGetPlan,
  adminCreatePlan,
  adminUpdatePlan,
  adminDeletePlan,
  adminListSubscriptions,
} from "./admin.controller";

const B = "/subscription";

export async function registerSubscriptionAdmin(app: FastifyInstance) {
  app.get(`${B}/plans`, adminListPlans);
  app.get(`${B}/plans/:id`, adminGetPlan);
  app.post(`${B}/plans`, adminCreatePlan);
  app.put(`${B}/plans/:id`, adminUpdatePlan);
  app.delete(`${B}/plans/:id`, adminDeletePlan);
  app.get(`${B}/subscriptions`, adminListSubscriptions);
}
