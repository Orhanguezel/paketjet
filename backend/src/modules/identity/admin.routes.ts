import type { FastifyInstance } from 'fastify';
import { adminGetIdentitySide, adminListIdentity, adminReviewIdentity } from './admin.controller';

export async function registerIdentityAdmin(app: FastifyInstance) {
  const B = '/identity';
  app.get(B, adminListIdentity);
  app.get(`${B}/:userId/:side`, adminGetIdentitySide);
  app.patch(`${B}/:userId`, adminReviewIdentity);
}
