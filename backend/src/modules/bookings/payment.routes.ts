import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { retiredOperation, legacyBookingIyzico, legacyBookingPaytr } from '../purchases/legacy.controller';
export async function registerBookingPayments(app: FastifyInstance) {
  app.post('/bookings/:id/pay', {preHandler: [requireAuth]}, retiredOperation);
  app.post('/bookings/pay/callback', legacyBookingIyzico);
  app.post('/bookings/pay/paytr-callback', legacyBookingPaytr);
}
