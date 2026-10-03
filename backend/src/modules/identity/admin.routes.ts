import type { FastifyInstance } from 'fastify';
import { adminGetIdentityFront, adminListIdentity, adminReviewIdentity } from './admin.controller';

export async function registerIdentityAdmin(app: FastifyInstance) {
  const B = '/identity';
  app.get(B, adminListIdentity);
  app.get(`${B}/:userId/front`, adminGetIdentityFront);
  app.patch(`${B}/:userId`, adminReviewIdentity);
}
