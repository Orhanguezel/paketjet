// src/modules/ratings/controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { getAuthUserId, handleRouteError, sendNotFound, sendForbidden } from "@/modules/_shared";
import { parseCarrierRatingsPaging } from "./helpers";
import { createRatingSchema } from "./validation";
import {
  repoCreateRating,
  repoGetRatingByBooking,
  repoGetCarrierRatings,
  repoGetCarrierAvgRating,
} from "./repository";
import { db } from "@/db/client";
import { bookings } from "../bookings/schema";
import { eq } from "drizzle-orm";

/** POST /api/ratings — müşteri, teslim edilmiş booking için değerlendirme oluşturur */
export async function createRating(req: FastifyRequest, reply: FastifyReply) {
  try {
    const customerId = getAuthUserId(req);
    const body = createRatingSchema.parse(req.body ?? {});

    // Booking'i bul ve yetki kontrolü yap
    const rows = await db.select().from(bookings).where(eq(bookings.id, body.booking_id)).limit(1);
    const booking = rows[0];

    if (!booking) return sendNotFound(reply);
    if (booking.customer_id !== customerId) return sendForbidden(reply);
    if (booking.status !== "delivered") {
      return reply.status(400).send({ error: { code: "not_delivered", message: "Sadece teslim edilmiş rezervasyonlar değerlendirilebilir." } });
    }

    // Daha önce değerlendirme yapılmış mı?
    const existing = await repoGetRatingByBooking(body.booking_id);
    if (existing) {
      return reply.status(409).send({ error: { code: "already_rated", message: "Bu rezervasyon zaten değerlendirildi." } });
    }

    const rating = await repoCreateRating({
      booking_id: body.booking_id,
      customer_id: customerId,
      carrier_id: booking.carrier_id,
      score: body.score,
      comment: body.comment ?? null,
    });

    return reply.status(201).send(rating);
  } catch (e) {
    return handleRouteError(reply, req, e, "create_rating_error");
  }
}

/** GET /api/ratings/booking/:bookingId — booking'in değerlendirmesi var mı? */
export async function getBookingRating(req: FastifyRequest, reply: FastifyReply) {
  try {
    const customerId = getAuthUserId(req);
    const { bookingId } = req.params as { bookingId: string };

    // Booking sahibi kontrolü
    const rows = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
    const booking = rows[0];
    if (!booking) return sendNotFound(reply);
    if (booking.customer_id !== customerId) return sendForbidden(reply);

    const rating = await repoGetRatingByBooking(bookingId);
    return reply.send(rating ?? null);
  } catch (e) {
    return handleRouteError(reply, req, e, "get_booking_rating_error");
  }
}

/** GET /api/ratings/carrier/:carrierId — taşıyıcı değerlendirme listesi (herkese açık) */
export async function getCarrierRatings(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { carrierId } = req.params as { carrierId: string };
    const { limit, offset } = parseCarrierRatingsPaging(req.query as Record<string, string>);

    const [list, stats] = await Promise.all([
      repoGetCarrierRatings(carrierId, limit, offset),
      repoGetCarrierAvgRating(carrierId),
    ]);

    return reply.send({
      data: list,
      avg_score: stats.avg,
      total: stats.count,
    });
  } catch (e) {
    return handleRouteError(reply, req, e, "get_carrier_ratings_error");
  }
}
