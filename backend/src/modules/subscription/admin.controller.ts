// src/modules/subscription/admin.controller.ts
import type { RouteHandler } from "fastify";
import { handleRouteError, sendNotFound, parsePage } from "@/modules/_shared";
import { buildAdminPlanPatch, createAdminPlanInsert } from "./helpers";
import { createPlanSchema, updatePlanSchema } from "./validation";
import {
  repoListPlans,
  repoGetPlanById,
  repoCreatePlan,
  repoUpdatePlan,
  repoDeletePlan,
  repoListAllSubscriptions,
} from "./repository";

// GET /admin/subscription/plans
export const adminListPlans: RouteHandler = async (req, reply) => {
  try {
    const plans = await repoListPlans(false);
    return reply.send(plans);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_plans_list_failed");
  }
};

// GET /admin/subscription/plans/:id
export const adminGetPlan: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const plan = await repoGetPlanById(id);
    if (!plan) return sendNotFound(reply);
    return reply.send(plan);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_plan_get_failed");
  }
};

// POST /admin/subscription/plans
export const adminCreatePlan: RouteHandler = async (req, reply) => {
  try {
    const body = createPlanSchema.parse(req.body ?? {});
    const plan = await repoCreatePlan(createAdminPlanInsert(body));
    return reply.code(201).send(plan);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_plan_create_failed");
  }
};

// PUT /admin/subscription/plans/:id
export const adminUpdatePlan: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const existing = await repoGetPlanById(id);
    if (!existing) return sendNotFound(reply);

    const body = updatePlanSchema.parse(req.body ?? {});
    const updated = await repoUpdatePlan(id, buildAdminPlanPatch(body));
    return reply.send(updated);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_plan_update_failed");
  }
};

// DELETE /admin/subscription/plans/:id
export const adminDeletePlan: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const existing = await repoGetPlanById(id);
    if (!existing) return sendNotFound(reply);
    await repoDeletePlan(id);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_plan_delete_failed");
  }
};

// GET /admin/subscription/subscriptions
export const adminListSubscriptions: RouteHandler = async (req, reply) => {
  try {
    const q = req.query as Record<string, string>;
    const { page, limit } = parsePage(q);
    const result = await repoListAllSubscriptions(page, limit);
    reply.header("x-total-count", String(result.total));
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_subscriptions_list_failed");
  }
};
