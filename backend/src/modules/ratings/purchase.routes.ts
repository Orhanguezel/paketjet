import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { createPurchaseRating, getEligiblePurchaseRatings, getMemberPurchaseRatings } from './purchase.controller';

export function registerPurchaseRatings(app: FastifyInstance) {
  app.get('/ratings/eligible', { preHandler: [requireAuth] }, getEligiblePurchaseRatings);
  app.get('/ratings/member/:id', getMemberPurchaseRatings);
  app.post('/ratings/purchase/:id', { preHandler: [requireAuth], config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, createPurchaseRating);
}
