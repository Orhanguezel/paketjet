// src/modules/disputes/controller.ts
import type { RouteHandler } from "fastify";
import { z } from "zod";
import { getAuthUserId, handleRouteError, sendNotFound, sendForbidden, parsePage } from "@/modules/_shared";
import { repoGetBookingById } from "../bookings/repository";
import { repoCreateDispute, repoGetDisputeByBooking, repoAdminListDisputes, repoGetDisputeById, repoResolveDispute } from "./repository";

const openDisputeSchema = z.object({
  reason: z.string().min(10, "Sebep en az 10 karakter olmalıdır").max(2000),
});

const resolveDisputeSchema = z.object({
  resolution: z.string().min(5).max(2000),
  status: z.enum(["resolved", "closed"]).default("resolved"),
});

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
