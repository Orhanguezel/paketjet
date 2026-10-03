import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { deleteMyIdentitySide, getMyIdentity, getMyIdentitySide, uploadMyIdentitySide } from './controller';

export async function registerIdentity(app: FastifyInstance) {
  const B = '/identity/me';
  app.get(B, { preHandler: [requireAuth] }, getMyIdentity);
  app.get(`${B}/:side`, { preHandler: [requireAuth] }, getMyIdentitySide);
  app.post(`${B}/:side`, { preHandler: [requireAuth], config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, uploadMyIdentitySide);
  app.delete(`${B}/:side`, { preHandler: [requireAuth] }, deleteMyIdentitySide);
}
