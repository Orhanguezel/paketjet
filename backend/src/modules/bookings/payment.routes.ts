// src/modules/bookings/payment.routes.ts
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { initiateBookingPayment, bookingPaymentCallback, bookingPayTRCallback } from "./payment.controller";

export async function registerBookingPayments(app: FastifyInstance) {
  const B = "/bookings";
  app.post(`${B}/:id/pay`, { preHandler: [requireAuth] }, initiateBookingPayment);
  app.post(`${B}/pay/callback`, bookingPaymentCallback);
  app.post(`${B}/pay/paytr-callback`, bookingPayTRCallback);
}
