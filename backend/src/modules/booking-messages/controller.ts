// src/modules/booking-messages/controller.ts
import type { RouteHandler } from "fastify";
import { z } from "zod";
import { getAuthUserId, handleRouteError, sendNotFound, sendForbidden } from "@/modules/_shared";
import { repoGetBookingById } from "../bookings/repository";
import { repoGetMessagesByBooking, repoCreateMessage, repoMarkMessagesRead } from "./repository";

const sendMessageSchema = z.object({
  message: z.string().min(1).max(2000),
});

/** GET /bookings/:id/messages */
export const getMessages: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };

    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    if (booking.customer_id !== userId && booking.carrier_id !== userId) return sendForbidden(reply);

    // Mesajları okundu olarak işaretle
    await repoMarkMessagesRead(id, userId);

    const messages = await repoGetMessagesByBooking(id);
    return reply.send(messages);
  } catch (e) {
    return handleRouteError(reply, req, e, "messages_get");
  }
};

/** POST /bookings/:id/messages */
export const sendMessage: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    const { message } = sendMessageSchema.parse(req.body);

    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    if (booking.customer_id !== userId && booking.carrier_id !== userId) return sendForbidden(reply);

    // Sadece aktif booking'lerde mesaj atılabilir
    if (["cancelled", "delivered"].includes(booking.status)) {
      return reply.code(400).send({ error: { message: "booking_not_active" } });
    }

    const msg = await repoCreateMessage(id, userId, message);
    return reply.code(201).send(msg);
  } catch (e) {
    return handleRouteError(reply, req, e, "messages_send");
  }
};
