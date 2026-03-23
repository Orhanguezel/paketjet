// src/modules/subscription/controller.ts
import type { RouteHandler } from "fastify";
import { getAuthUserId, handleRouteError, sendNotFound, parsePage } from "@/modules/_shared";
import { purchasePlanSchema } from "./validation";
import {
  repoListPlans,
  repoGetPlanById,
  repoGetActiveSubscription,
  repoCreateSubscription,
  repoCancelSubscription,
  repoListUserSubscriptions,
  repoCountMonthlyIlans,
  repoGetFreeQuota,
} from "./repository";
import { deductForPlan } from "./service";

// GET /subscription/plans — Herkese acik plan listesi
export const listPlans: RouteHandler = async (req, reply) => {
  try {
    const plans = await repoListPlans(true);
    return reply.send(plans);
  } catch (e) {
    return handleRouteError(reply, req, e, "plans_list_failed");
  }
};

// GET /subscription/plans/:id
export const getPlan: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const plan = await repoGetPlanById(id);
    if (!plan) return sendNotFound(reply);
    return reply.send(plan);
  } catch (e) {
    return handleRouteError(reply, req, e, "plan_get_failed");
  }
};

// GET /subscription/my — Aktif abonelik + kullanim bilgisi
export const getMySubscription: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const [sub, { quota: freeQuota, early_user }, monthlyCount] = await Promise.all([
      repoGetActiveSubscription(userId),
      repoGetFreeQuota(userId),
      repoCountMonthlyIlans(userId),
    ]);

    const effectiveLimit = Math.max(freeQuota, sub?.ilan_limit ?? 0);

    return reply.send({
      active: !!sub,
      subscription: sub,
      usage: {
        ilans_this_month: monthlyCount,
        ilan_limit: effectiveLimit,
        remaining: Math.max(0, effectiveLimit - monthlyCount),
      },
      early_user,
      free_quota: freeQuota,
    });
  } catch (e) {
    return handleRouteError(reply, req, e, "subscription_my_failed");
  }
};

// GET /subscription/history — Gecmis abonelikler
export const listMyHistory: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const history = await repoListUserSubscriptions(userId);
    return reply.send(history);
  } catch (e) {
    return handleRouteError(reply, req, e, "subscription_history_failed");
  }
};

// POST /subscription/purchase — Plan satin al
export const purchasePlan: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const { plan_id } = purchasePlanSchema.parse(req.body ?? {});

    const plan = await repoGetPlanById(plan_id);
    if (!plan || !plan.is_active) {
      return reply.code(400).send({ error: { message: "plan_not_found" } });
    }

    // Zaten aktif plan var mi?
    const existing = await repoGetActiveSubscription(userId);
    if (existing) {
      return reply.code(400).send({ error: { message: "already_subscribed" } });
    }

    // Ucretli plan ise cuzdandan dus
    const price = parseFloat(plan.price);
    let paymentRef: string | undefined;
    if (price > 0) {
      paymentRef = await deductForPlan(userId, price, plan.id);
    }

    const sub = await repoCreateSubscription(userId, plan.id, plan.duration_days, paymentRef);
    return reply.code(201).send(sub);
  } catch (e) {
    return handleRouteError(reply, req, e, "subscription_purchase_failed");
  }
};

// POST /subscription/cancel — Aktif aboneligi iptal et
export const cancelSubscription: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const sub = await repoGetActiveSubscription(userId);
    if (!sub) {
      return reply.code(400).send({ error: { message: "no_active_subscription" } });
    }

    await repoCancelSubscription(sub.id);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, "subscription_cancel_failed");
  }
};
