import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '@/core/env';
import { handleRouteError } from '../_shared';
import { retrieveCheckoutForm } from '../wallet/iyzico';
import { verifyPayTRCallback } from '../wallet/paytr';
import { repoTokenHash } from './session.repository';
import { repoRecordLegacyReceipt } from './legacy.repository';
export async function retiredOperation(req: FastifyRequest, reply: FastifyReply) {
  return reply.code(410).send({error: {message: 'legacy_flow_retired'}, next: '/api/ilan-alma-hakki'});
}
async function legacyCallback(req: FastifyRequest, reply: FastifyReply, kind: 'legacy_wallet' | 'legacy_booking', provider: 'iyzico' | 'paytr') {
  try {
    const body = req.body as Record<string, string>;
    if (provider === 'paytr') {
      if (!verifyPayTRCallback(body)) return reply.code(400).send('INVALID');
      if (body.status === 'success') await repoRecordLegacyReceipt(body.merchant_oid, kind, {provider, amount: Number(body.total_amount) / 100, currency: 'TRY', paymentId: body.merchant_oid});
      return reply.type('text/plain').send('OK');
    }
    if (typeof body?.token !== 'string') return reply.code(400).send('INVALID');
    const ref = `legacy-${repoTokenHash(body.token)}`;
    const detail = await retrieveCheckoutForm(body.token, ref);
    if (detail.status !== 'success' || !detail.paymentId || !Number.isFinite(Number(detail.paidPrice))) return reply.code(400).send('UNVERIFIED');
    await repoRecordLegacyReceipt(ref, kind, {provider, amount: Number(detail.paidPrice), currency: detail.currency ?? '', paymentId: detail.paymentId, transactionIds: detail.itemTransactions?.map(x => x.paymentTransactionId)}, detail.basketId);
    return reply.redirect(`${env.FRONTEND_URL}/panel/ilan-alma-hakki/odeme-sonuc?ref=${encodeURIComponent(ref)}`);
  } catch (error) { return handleRouteError(reply, req, error, 'legacy_callback'); }
}
export const legacyWalletIyzico = (req: FastifyRequest, reply: FastifyReply) => legacyCallback(req, reply, 'legacy_wallet', 'iyzico');
export const legacyWalletPaytr = (req: FastifyRequest, reply: FastifyReply) => legacyCallback(req, reply, 'legacy_wallet', 'paytr');
export const legacyBookingIyzico = (req: FastifyRequest, reply: FastifyReply) => legacyCallback(req, reply, 'legacy_booking', 'iyzico');
export const legacyBookingPaytr = (req: FastifyRequest, reply: FastifyReply) => legacyCallback(req, reply, 'legacy_booking', 'paytr');
