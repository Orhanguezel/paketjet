import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { retiredOperation } from '../purchases/legacy.controller';
export async function registerBookingPayments(app: FastifyInstance) {
  app.post('/bookings/:id/pay', {preHandler: [requireAuth]}, retiredOperation);
  app.post('/bookings/pay/callback', retiredOperation);
  app.post('/bookings/pay/paytr-callback', retiredOperation);
}
