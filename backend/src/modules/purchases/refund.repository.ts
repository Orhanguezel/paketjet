// src/modules/purchases/refund.repository.ts
// Kart odemesi iadesi: baslatma, saglayici iade kimligi, tamamlaninca hak/erisimin geri alinmasi.
// Tum gecisler oturum satiri kilitlenerek ve idempotent yapilir.
import { randomUUID } from 'node:crypto';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/db/client';
import { paymentEvents } from './event.schema';
import { creditLedger, creditPackagePurchases, ilanPurchasePayments, ilanPurchases, userCredits } from './schema';
import { paymentSessions, type PaymentSession } from './session.schema';

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
const REFUNDABLE = ['completed', 'refund_pending', 'review'];

async function lockSession(tx: Tx, ref: string) {
  const [row] = await tx.select().from(paymentSessions).where(eq(paymentSessions.payment_ref, ref)).for('update');
  return row;
}
async function event(tx: Tx, ref: string, actor: string, name: string, note: string | null) {
  await tx.insert(paymentEvents).values({ id: randomUUID(), payment_ref: ref, actor_id: actor, event: name, note });
}

export async function repoPaymentByProviderPayment(provider: string, providerPaymentId: string) {
  const [row] = await db.select().from(paymentSessions).where(and(eq(paymentSessions.provider, provider), eq(paymentSessions.provider_payment_id, providerPaymentId))).limit(1);
  return row;
}

export type BeginRefund = { ok: true; session: PaymentSession } | { ok: false; code: 'not_found' | 'not_refundable' | 'already_requested' };

/** Iade talebini kaydeder; saglayiciya istek bundan SONRA gider (cift talebi kilitle engeller). */
export async function repoBeginRefund(ref: string, actor: string, note: string): Promise<BeginRefund> {
  return db.transaction(async (tx) => {
    const s = await lockSession(tx, ref);
    if (!s) return { ok: false, code: 'not_found' as const };
    if (s.receipt?.refundId) return { ok: false, code: 'already_requested' as const };
    if (s.provider !== 'shopier' || !s.provider_payment_id || !REFUNDABLE.includes(s.state)) return { ok: false, code: 'not_refundable' as const };
    await tx.update(paymentSessions).set({ state: 'refund_pending', error_code: 'refund_requested' }).where(eq(paymentSessions.payment_ref, ref));
    await event(tx, ref, actor, 'refund_pending', note);
    return { ok: true as const, session: s };
  });
}

/** Saglayici iade kimligini kaydeder. Ayni odemeye ikinci farkli iade kaydedilmez. */
export async function repoSaveRefundId(ref: string, refundId: string, actor: string) {
  return db.transaction(async (tx) => {
    const s = await lockSession(tx, ref);
    if (!s) return false;
    if (s.receipt?.refundId && s.receipt.refundId !== refundId) return false;
    if (!s.receipt?.refundId) {
      await tx.update(paymentSessions).set({ receipt: { ...(s.receipt ?? {}), refundId } }).where(eq(paymentSessions.payment_ref, ref));
      if (s.state !== 'refund_pending') await tx.update(paymentSessions).set({ state: 'refund_pending', error_code: 'refund_requested' }).where(eq(paymentSessions.payment_ref, ref));
      await event(tx, ref, actor, 'refund_requested', `shopier_refund:${refundId}`);
    }
    return true;
  });
}

/** Iade basarisiz/kismi: otomatik geri alma YOK, admin incelemesine duser. */
export async function repoRefundNeedsReview(ref: string, code: string, actor: string) {
  await db.transaction(async (tx) => {
    const s = await lockSession(tx, ref);
    if (!s || s.state === 'refunded') return;
    await tx.update(paymentSessions).set({ state: 'review', error_code: code }).where(eq(paymentSessions.payment_ref, ref));
    await event(tx, ref, actor, 'review', code);
  });
}

export type FinalizeRefund = { ok: true; already: boolean; revokedCredits?: number; shortfall?: number } | { ok: false; code: 'not_found' };

/** Tam iade tamamlandi: hak paketi → kalan haklardan dus; ilan → iletisim erisimini kapat. Ilan tekrar satisa acilmaz. */
export async function repoFinalizeRefund(ref: string, actor: string): Promise<FinalizeRefund> {
  return db.transaction(async (tx) => {
    const s = await lockSession(tx, ref);
    if (!s) return { ok: false, code: 'not_found' as const };
    if (s.state === 'refunded') return { ok: true as const, already: true };
    let revokedCredits: number | undefined, shortfall: number | undefined;
    if (s.kind === 'credits') {
      const [purchase] = await tx.select().from(creditPackagePurchases).where(eq(creditPackagePurchases.payment_ref, ref)).for('update');
      if (purchase?.status === 'completed') {
        await tx.insert(userCredits).values({ id: randomUUID(), user_id: purchase.user_id, balance: 0 }).onDuplicateKeyUpdate({ set: { balance: sql`balance` } });
        const [credit] = await tx.select().from(userCredits).where(eq(userCredits.user_id, purchase.user_id)).for('update');
        const balance = credit?.balance ?? 0;
        revokedCredits = Math.min(balance, purchase.credits);
        shortfall = purchase.credits - revokedCredits;
        if (revokedCredits > 0) {
          await tx.update(userCredits).set({ balance: balance - revokedCredits }).where(eq(userCredits.user_id, purchase.user_id));
          await tx.insert(creditLedger).values({ id: randomUUID(), user_id: purchase.user_id, delta: -revokedCredits, reason: 'payment_refund', ref_id: purchase.id, balance_after: balance - revokedCredits });
        }
      }
      if (purchase) await tx.update(creditPackagePurchases).set({ status: 'refunded' }).where(eq(creditPackagePurchases.id, purchase.id));
    } else if (s.kind === 'listing') {
      await tx.update(ilanPurchasePayments).set({ status: 'refunded' }).where(eq(ilanPurchasePayments.payment_ref, ref));
      await tx.update(ilanPurchases).set({ status: 'refunded' }).where(eq(ilanPurchases.payment_ref, ref));
    }
    await tx.update(paymentSessions).set({ state: 'refunded', error_code: shortfall ? 'refund_credits_already_used' : null }).where(eq(paymentSessions.payment_ref, ref));
    await event(tx, ref, actor, 'refunded', revokedCredits === undefined ? null : `revoked_credits:${revokedCredits};used_before_refund:${shortfall}`);
    return { ok: true as const, already: false, revokedCredits, shortfall };
  });
}
