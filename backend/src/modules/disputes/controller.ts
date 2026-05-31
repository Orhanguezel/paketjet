// src/modules/disputes/controller.ts
import type { RouteHandler } from "fastify";
import { getAuthUserId, handleRouteError, sendNotFound, sendForbidden, parsePage } from "@/modules/_shared";
import { repoGetBookingById } from "../bookings/repository";
import {
  repoAdminListDisputes,
  repoCreateDispute,
  repoCreateIlanDispute,
  repoGetDisputeByBooking,
  repoGetDisputeById,
  repoGetDisputeByIlan,
  repoGetIlanDisputeContext,
  repoResolveDispute,
} from "./repository";
import { openDisputeSchema, resolveDisputeSchema } from "./validation";

/** POST /bookings/:id/dispute */
export const openDispute: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    const { reason } = openDisputeSchema.parse(req.body);

    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    if (booking.customer_id !== userId && booking.carrier_id !== userId) return sendForbidden(reply);

    const existing = await repoGetDisputeByBooking(id);
    if (existing) return reply.code(400).send({ error: { message: "dispute_already_exists" } });

    const dispute = await repoCreateDispute(id, userId, reason);
    return reply.code(201).send(dispute);
  } catch (e) {
    return handleRouteError(reply, req, e, "dispute_open");
  }
};

/** GET /bookings/:id/dispute */
export const getDispute: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };

    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    if (booking.customer_id !== userId && booking.carrier_id !== userId) return sendForbidden(reply);

    const dispute = await repoGetDisputeByBooking(id);
    return reply.send(dispute ?? null);
  } catch (e) {
    return handleRouteError(reply, req, e, "dispute_get");
  }
};

/** POST /ilanlar/:id/dispute */
export const openIlanDispute: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    const { reason, issue_type } = openDisputeSchema.parse(req.body);

    const context = await repoGetIlanDisputeContext(id);
    if (!context) return sendNotFound(reply);
    const participantIds = [context.seller_id, context.buyer_id];
    if (!participantIds.includes(userId)) return sendForbidden(reply);

    const existing = await repoGetDisputeByIlan(id);
    if (existing) return reply.code(400).send({ error: { message: "dispute_already_exists" } });

    const openedAgainst = userId === context.buyer_id ? context.seller_id : context.buyer_id;
    const dispute = await repoCreateIlanDispute({
      ilanId: id,
      purchaseId: context.purchase_id,
      openedBy: userId,
      openedAgainst,
      reason,
      issueType: issue_type,
      declaredValue: context.estimated_value_snapshot ?? context.estimated_value,
      declaredValueCurrency: context.estimated_value_currency,
    });
    return reply.code(201).send(dispute);
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_dispute_open");
  }
};

/** GET /ilanlar/:id/dispute */
export const getIlanDispute: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    const context = await repoGetIlanDisputeContext(id);
    if (!context) return sendNotFound(reply);
    if (![context.seller_id, context.buyer_id].includes(userId)) return sendForbidden(reply);
    return reply.send((await repoGetDisputeByIlan(id)) ?? null);
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_dispute_get");
  }
};

/** GET /admin/disputes */
export const adminListDisputes: RouteHandler = async (req, reply) => {
  try {
    const q = req.query as Record<string, string>;
    const { limit, offset, page } = parsePage(q);
    const result = await repoAdminListDisputes({ status: q.status, limit, offset });
    reply.header("x-total-count", String(result.total));
    return reply.send({ data: result.data, total: result.total, page, limit });
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_disputes_list");
  }
};

/** PUT /admin/disputes/:id/resolve */
export const adminResolveDispute: RouteHandler = async (req, reply) => {
  try {
    const adminId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    const { resolution, status } = resolveDisputeSchema.parse(req.body);

    const dispute = await repoGetDisputeById(id);
    if (!dispute) return sendNotFound(reply);

    const updated = await repoResolveDispute(id, adminId, resolution, status);
    return reply.send(updated);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_dispute_resolve");
  }
};
