// src/modules/purchases/refund.controller.ts
// Admin: Shopier iadesi baslat / iade durumunu Shopier'den yenile. DB sorgusu yok.
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { getAuthUserId, handleRouteError, sendNotFound } from '@/modules/_shared';
import { requestShopierRefund, syncShopierRefund } from './refund.service';
import { repoPaymentByRef } from './session.repository';

const refundBody = z.object({ note: z.string().trim().min(5).max(250) }).strict();

/** POST /admin/payment-operations/:ref/refund — tam tutar iadesi. */
export async function adminRefundPayment(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ref } = req.params as { ref: string };
    const { note } = refundBody.parse(req.body);
    const result = await requestShopierRefund(ref, getAuthUserId(req), note, req.log);
    if (!result.ok) return reply.code(result.code === 'not_found' ? 404 : result.code === 'provider_rejected' ? 502 : 409).send({ error: { message: result.code } });
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, 'payment_refund');
  }
}

/** POST /admin/payment-operations/:ref/refund/sync — webhook gecikirse iade durumunu Shopier'den okur. */
export async function adminSyncRefund(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ref } = req.params as { ref: string };
    const refundId = (await repoPaymentByRef(ref))?.receipt?.refundId;
    if (!refundId) return sendNotFound(reply);
    await syncShopierRefund(refundId, getAuthUserId(req), req.log);
    return reply.send({ state: (await repoPaymentByRef(ref))?.state ?? null });
  } catch (e) {
    return handleRouteError(reply, req, e, 'payment_refund_sync');
  }
}
