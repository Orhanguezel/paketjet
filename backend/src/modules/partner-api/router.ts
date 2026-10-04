import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { createMyApiKey, listMyApiKeys, revokeMyApiKey } from './key.controller';
import { partnerCreate, partnerDelete, partnerGet, partnerList, partnerStatus, partnerUpdate } from './controller';
import { apiKeyRateKey, requireApiKey } from './auth';

export async function registerPartnerApi(app: FastifyInstance) {
  const K = '/me/api-keys';
  app.get(K, { preHandler: [requireAuth] }, listMyApiKeys);
  app.post(K, { preHandler: [requireAuth], config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, createMyApiKey);
  app.delete(`${K}/:id`, { preHandler: [requireAuth] }, revokeMyApiKey);

  const B = '/v1/partner/listings';
  const read = { preHandler: [requireApiKey], config: { rateLimit: { max: 120, timeWindow: '1 minute', keyGenerator: apiKeyRateKey } } };
  const write = { preHandler: [requireApiKey], config: { rateLimit: { max: 30, timeWindow: '1 minute', keyGenerator: apiKeyRateKey } } };
  app.get(B, read, partnerList);
  app.get(`${B}/:id`, read, partnerGet);
  app.post(B, write, partnerCreate);
  app.patch(`${B}/:id`, write, partnerUpdate);
  app.post(`${B}/:id/status`, write, partnerStatus);
  app.delete(`${B}/:id`, write, partnerDelete);
}
