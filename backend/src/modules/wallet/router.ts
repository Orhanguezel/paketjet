import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { getMyWallet, listMyTransactions } from './controller';
import { retiredOperation, legacyWalletIyzico, legacyWalletPaytr } from '../purchases/legacy.controller';
export async function registerWallet(app: FastifyInstance) {
  app.get('/wallet', {preHandler: [requireAuth]}, getMyWallet);
  app.get('/wallet/transactions', {preHandler: [requireAuth]}, listMyTransactions);
  app.post('/wallet/deposit/initiate', {preHandler: [requireAuth]}, retiredOperation);
  app.post('/wallet/deposit/dev', {preHandler: [requireAuth]}, retiredOperation);
  app.post('/wallet/deposit', {preHandler: [requireAuth]}, retiredOperation);
  app.post('/wallet/deposit/callback', legacyWalletIyzico);
  app.post('/wallet/deposit/paytr-callback', legacyWalletPaytr);
}
