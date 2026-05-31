// =============================================================
// FILE: src/modules/bookings/admin.controller.ts
// Admin booking handlers
// =============================================================
import type { FastifyRequest, FastifyReply } from 'fastify';
import { handleRouteError, sendNotFound, parsePage } from "@/modules/_shared";
import { updateBookingStatusSchema } from './validation';
import { repoGetBookingById, repoUpdateBookingStatus, repoUpdatePaymentStatus } from './repository';
import { repoAdminListBookings } from './admin.repository';
import { repoDeductCapacity } from '../ilanlar/repository';
import { notifyBookingCreated } from './notify';

/** GET /admin/bookings */
export async function adminListBookings(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string>;
    const { page, limit, offset } = parsePage(q);
    const result = await repoAdminListBookings({
      status: q.status,
      customer_id: q.customer_id,
      carrier_id: q.carrier_id,
      limit,
      offset,
    });

    reply.header('x-total-count', String(result.total));
    return reply.send({ data: result.data, total: result.total, page, limit });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_bookings_list');
  }
}

/** GET /admin/bookings/:id */
export async function adminGetBooking(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    return reply.send(booking);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_booking_get');
  }
}

/** PATCH /admin/bookings/:id/status */
export async function adminUpdateBookingStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const { status, carrier_notes } = updateBookingStatusSchema.parse(req.body ?? {});
    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    const updated = await repoUpdateBookingStatus(id, status, { carrier_notes });
    return reply.send(updated);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_booking_status');
  }
}

/** PATCH /admin/bookings/:id/confirm-payment — Havale onayı */
export async function adminConfirmTransferPayment(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    if (booking.payment_status !== "awaiting_transfer")
      return reply.code(400).send({ error: { message: "not_awaiting_transfer" } });

    await repoUpdatePaymentStatus(id, "paid");
    await repoDeductCapacity(booking.ilan_id, parseFloat(booking.kg_amount));

    void notifyBookingCreated(booking, booking.customer_id, booking.carrier_id);

    const updated = await repoGetBookingById(id);
    return reply.send(updated);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_confirm_transfer');
  }
}
