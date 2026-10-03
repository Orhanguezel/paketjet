import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { deleteMyIdentityFront, getMyIdentity, getMyIdentityFront, uploadMyIdentityFront } from './controller';

export async function registerIdentity(app: FastifyInstance) {
  const B = '/identity/me';
  app.get(B, { preHandler: [requireAuth] }, getMyIdentity);
  app.get(`${B}/front`, { preHandler: [requireAuth] }, getMyIdentityFront);
  app.post(`${B}/front`, { preHandler: [requireAuth], config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, uploadMyIdentityFront);
  app.delete(`${B}/front`, { preHandler: [requireAuth] }, deleteMyIdentityFront);
}
