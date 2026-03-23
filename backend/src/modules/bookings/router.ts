// src/modules/bookings/router.ts
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { authSecurity, fromZodSchema, idParamsSchema, okResponseSchema } from "@/modules/_shared";
import { z } from "zod";
import {
  createBooking, listMyBookings, getBooking, confirmBooking, updateBookingStatus, cancelBooking, getBankDetails,
} from "./controller";
import { cancelBookingSchema, createBookingSchema, updateBookingStatusSchema } from "./validation";

const B = '/bookings';

export async function registerBookings(app: FastifyInstance) {
  const auth = { preHandler: [requireAuth] };
  const bookingListQuerySchema = fromZodSchema(z.object({
    role: z.enum(['customer', 'carrier']).optional(),
    status: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  }), 'BookingListQuery');

  app.post(B, {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: { tags: ['bookings'], summary: 'Yeni rezervasyon olustur', security: authSecurity, body: fromZodSchema(createBookingSchema, 'CreateBookingBody'), response: { 201: okResponseSchema } },
  }, createBooking);
  app.get(B, {
    ...auth,
    schema: { tags: ['bookings'], summary: 'Kullanicinin rezervasyonlarini listele', security: authSecurity, querystring: bookingListQuerySchema, response: { 200: okResponseSchema } },
  }, listMyBookings);
  app.get(`${B}/:id`, {
    ...auth,
    schema: { tags: ['bookings'], summary: 'Tek rezervasyon detayi', security: authSecurity, params: idParamsSchema, response: { 200: okResponseSchema } },
  }, getBooking);
  app.patch(`${B}/:id/confirm`, {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['bookings'], summary: 'Rezervasyonu onayla', security: authSecurity, params: idParamsSchema, response: { 200: okResponseSchema } },
  }, confirmBooking);
  app.patch(`${B}/:id/status`, {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['bookings'], summary: 'Rezervasyon durumunu guncelle', security: authSecurity, params: idParamsSchema, body: fromZodSchema(updateBookingStatusSchema, 'UpdateBookingStatusBody'), response: { 200: okResponseSchema } },
  }, updateBookingStatus);
  app.get(`${B}/bank-details`, { ...auth, schema: { tags: ['bookings'], summary: 'Banka bilgileri' } }, getBankDetails);
  app.patch(`${B}/:id/cancel`, {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['bookings'], summary: 'Rezervasyonu iptal et', security: authSecurity, params: idParamsSchema, body: fromZodSchema(cancelBookingSchema, 'CancelBookingBody'), response: { 200: okResponseSchema } },
  }, cancelBooking);
}
