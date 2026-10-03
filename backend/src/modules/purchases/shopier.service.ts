// src/modules/purchases/shopier.service.ts
// Shopier odeme akisi: odeme sayfasi (tek kullanimlik urun) olustur, siparisi API'den okuyup dogrula,
// hak/iletisimi ac. Webhook ve kullanicinin "kontrol et" istegi ayni settle yolunu kullanir.
import type { FastifyBaseLogger } from 'fastify';
import { repoInvalidateDashboardCache, repoInvalidateIlanCache } from '@/modules/_shared';
import { repoCompleteCreditPackagePayment, repoCompleteIlanPayment, repoFailCreditPackagePayment, repoFailIlanPayment } from './payment.repository';
import { repoMarkPayment, repoPaymentByCheckout, repoPaymentByRef, repoSaveCheckout } from './session.repository';
import type { PaymentSession } from './session.schema';
import { checkShopierOrder, createShopierCheckout, deleteShopierCheckout, findShopierOrdersForProduct, getShopierOrder, type ShopierOrder } from './shopier';

type Kind = 'credits' | 'listing';

async function failSession(ref: string, kind: Kind, code: string) {
  await (kind === 'credits' ? repoFailCreditPackagePayment(ref) : repoFailIlanPayment(ref));
  await repoMarkPayment(ref, 'failed', code);
}

/** Oturum zaten olusturulmus olmali (state=initializing). Basarida Shopier odeme sayfasi URL'si doner. */
export async function startShopierCheckout(input: { ref: string; kind: Kind; amount: number; title: string }, log: FastifyBaseLogger) {
  let product;
  try {
    product = await createShopierCheckout({
      title: `${input.title} · ${input.ref.slice(-8).toUpperCase()}`,
      description: `İşlem referansı: ${input.ref}. Ödeme tamamlanınca hakkınız hesabınıza otomatik tanımlanır.`,
      amount: input.amount,
    });
  } catch (err) {
    log.error({ err, event: 'shopier_checkout_create_failed', ref: input.ref }, 'shopier_checkout_create_failed');
    await failSession(input.ref, input.kind, 'shopier_checkout_failed');
    throw Object.assign(new Error('payment_provider_unavailable'), { statusCode: 503 });
  }
  if (!(await repoSaveCheckout(input.ref, product.id))) {
    await deleteShopierCheckout(product.id).catch(() => undefined);
    throw Object.assign(new Error('payment_state_conflict'), { statusCode: 409 });
  }
  return product.url;
}

async function invalidate(session: PaymentSession) {
  await repoInvalidateDashboardCache([session.user_id]);
  if (session.ilan_id) await repoInvalidateIlanCache(session.ilan_id);
}

export type SettleResult = { ref: string; outcome: 'completed' | 'already' | 'review' | 'ignored' };

/** Bir Shopier siparisini, ait oldugu odeme oturumuna gore isler. Idempotent. */
async function settleOrderForSession(order: ShopierOrder, session: PaymentSession, log: FastifyBaseLogger): Promise<SettleResult> {
  const ref = session.payment_ref;
  const kind = session.kind as Kind;
  if (!session.provider_checkout_id || (kind !== 'credits' && kind !== 'listing')) return { ref, outcome: 'ignored' };
  if (session.state === 'completed') return { ref, outcome: 'already' };
  const check = checkShopierOrder(order, { productId: session.provider_checkout_id, amount: Number(session.amount) });
  if (!check.ok) {
    await repoMarkPayment(ref, 'review', `shopier_${check.reason}`);
    log.warn({ event: 'shopier_order_mismatch', ref, orderId: order.id, reason: check.reason }, 'shopier_order_mismatch');
    return { ref, outcome: 'review' };
  }
  const proof = { provider: 'shopier', amount: check.amount, currency: 'TRY', paymentId: check.orderId };
  const result = kind === 'credits' ? await repoCompleteCreditPackagePayment(ref, proof) : await repoCompleteIlanPayment(ref, proof);
  if (!result.ok) {
    if (result.code === 'verification_failed') await repoMarkPayment(ref, 'review', 'shopier_receipt_conflict');
    log.warn({ event: 'shopier_settle_not_completed', ref, code: result.code }, 'shopier_settle_not_completed');
    return { ref, outcome: 'review' };
  }
  await invalidate(session);
  await deleteShopierCheckout(session.provider_checkout_id).catch((err) =>
    log.warn({ err, event: 'shopier_checkout_delete_failed', ref }, 'shopier_checkout_delete_failed'));
  log.info({ event: 'shopier_payment_completed', ref, orderId: check.orderId }, 'shopier_payment_completed');
  return { ref, outcome: 'already_processed' in result && result.already_processed ? 'already' : 'completed' };
}

/** Webhook: siparisi govdeden degil API'den okur; urun kimliklerinden oturumu bulur. */
export async function settleShopierOrder(orderId: string, log: FastifyBaseLogger): Promise<SettleResult[]> {
  const order = await getShopierOrder(orderId);
  const results: SettleResult[] = [];
  for (const item of order.lineItems ?? []) {
    const session = item.productId ? await repoPaymentByCheckout('shopier', String(item.productId)) : undefined;
    if (session) results.push(await settleOrderForSession(order, session, log));
  }
  return results;
}

/** Kullanici "odemeyi kontrol et" dediginde: webhook kacmissa urunun siparislerini API'den arar. */
export async function reconcileShopierPayment(ref: string, userId: string, log: FastifyBaseLogger) {
  const session = await repoPaymentByRef(ref);
  if (!session || session.user_id !== userId || session.provider !== 'shopier' || !session.provider_checkout_id) return null;
  if (!['pending', 'review'].includes(session.state)) return session.state;
  const orders = await findShopierOrdersForProduct(session.provider_checkout_id);
  for (const listed of orders) {
    const order = listed.lineItems ? listed : await getShopierOrder(String(listed.id));
    const r = await settleOrderForSession(order, session, log);
    if (r.outcome === 'completed' || r.outcome === 'already') break;
  }
  return (await repoPaymentByRef(ref))?.state ?? null;
}
