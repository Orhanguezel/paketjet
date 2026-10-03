// src/modules/purchases/refund.service.ts
// Shopier iade akisi. Admin istegi ve Shopier panelinden yapilan iade ayni senkron yolundan gecer:
// iade durumu her zaman API'den okunur (webhook govdesine guvenilmez).
import type { FastifyBaseLogger } from 'fastify';
import { repoInvalidateDashboardCache, repoInvalidateIlanCache } from '@/modules/_shared';
import { repoBeginRefund, repoFinalizeRefund, repoPaymentByProviderPayment, repoRefundNeedsReview, repoSaveRefundId } from './refund.repository';
import { repoPaymentByRef } from './session.repository';
import { ShopierApiError, createShopierRefund, getShopierRefund, type ShopierRefund } from './shopier';

const cents = (v: unknown) => Math.round(Number(v) * 100);

async function applyRefund(refund: ShopierRefund, actor: string, log: FastifyBaseLogger) {
  if (!refund.orderId) return { outcome: 'ignored' as const };
  const session = await repoPaymentByProviderPayment('shopier', String(refund.orderId));
  if (!session) {
    log.warn({ event: 'shopier_refund_unknown_order', refundId: refund.id, orderId: refund.orderId }, 'shopier_refund_unknown_order');
    return { outcome: 'ignored' as const };
  }
  const ref = session.payment_ref;
  if (!(await repoSaveRefundId(ref, refund.id, actor))) {
    await repoRefundNeedsReview(ref, 'shopier_refund_conflict', actor);
    return { ref, outcome: 'review' as const };
  }
  if (refund.status === 'failed') {
    await repoRefundNeedsReview(ref, 'shopier_refund_failed', actor);
    return { ref, outcome: 'review' as const };
  }
  if (refund.status !== 'succeeded') return { ref, outcome: 'pending' as const };
  if (refund.currency && refund.currency !== 'TRY') {
    await repoRefundNeedsReview(ref, 'shopier_refund_currency', actor);
    return { ref, outcome: 'review' as const };
  }
  if (cents(refund.total) !== cents(session.amount)) {
    // Kismi iade: erisimin ne kadarinin geri alinacagi is karari → admin.
    await repoRefundNeedsReview(ref, 'shopier_partial_refund', actor);
    return { ref, outcome: 'review' as const };
  }
  const result = await repoFinalizeRefund(ref, actor);
  if (result.ok && !result.already) {
    await repoInvalidateDashboardCache([session.user_id]);
    if (session.ilan_id) await repoInvalidateIlanCache(session.ilan_id);
    log.info({ event: 'shopier_refund_completed', ref, refundId: refund.id, revokedCredits: result.revokedCredits, shortfall: result.shortfall }, 'shopier_refund_completed');
  }
  return { ref, outcome: 'refunded' as const };
}

/** Webhook (refund.requested / refund.updated) ve admin "durumu yenile". */
export async function syncShopierRefund(refundId: string, actor: string, log: FastifyBaseLogger) {
  return applyRefund(await getShopierRefund(refundId), actor, log);
}

export type RefundRequestResult =
  | { ok: true; state: string; refundId: string }
  | { ok: false; code: 'not_found' | 'not_refundable' | 'already_requested' | 'provider_rejected' };

/** Admin: tam tutar iadesini Shopier'de baslatir. */
export async function requestShopierRefund(ref: string, adminId: string, note: string, log: FastifyBaseLogger): Promise<RefundRequestResult> {
  const begin = await repoBeginRefund(ref, adminId, note);
  if (!begin.ok) return begin;
  let refund: ShopierRefund;
  try {
    refund = await createShopierRefund({ orderId: begin.session.provider_payment_id!, amount: Number(begin.session.amount), note });
  } catch (err) {
    log.error({ err, event: 'shopier_refund_request_failed', ref }, 'shopier_refund_request_failed');
    await repoRefundNeedsReview(ref, err instanceof ShopierApiError && err.status < 500 ? 'shopier_refund_rejected' : 'shopier_refund_uncertain', adminId);
    return { ok: false, code: 'provider_rejected' };
  }
  await applyRefund({ ...refund, orderId: refund.orderId ?? begin.session.provider_payment_id! }, adminId, log);
  return { ok: true, state: (await repoPaymentByRef(ref))?.state ?? 'refund_pending', refundId: refund.id };
}
