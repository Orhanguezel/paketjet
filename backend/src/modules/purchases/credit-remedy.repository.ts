import { randomUUID } from 'node:crypto';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db/client';
import { users } from '../auth/schema';
import { creditLedger, ilanPurchases, userCredits } from './schema';
import { purchaseCreditRemedies } from './trust.schema';
import { paymentSessions } from './session.schema';

/** An approved service complaint creates one reusable right, once per purchase. */
export async function repoGrantPurchaseCreditRemedy(purchaseId: string, actorId: string, reason: string) {
  return db.transaction(async tx => {
    const [purchase] = await tx.select().from(ilanPurchases).where(eq(ilanPurchases.id, purchaseId)).for('update');
    if (!purchase) return { ok: false as const, code: 'not_found' as const };
    const [existing] = await tx.select().from(purchaseCreditRemedies).where(eq(purchaseCreditRemedies.purchase_id, purchaseId));
    if (existing) return { ok: true as const, already_processed: true, user_id: existing.user_id };
    if (purchase.status !== 'completed') return { ok: false as const, code: 'not_eligible' as const };
    if (purchase.payment_ref) {
      const [payment] = await tx.select({ state: paymentSessions.state }).from(paymentSessions)
        .where(eq(paymentSessions.payment_ref, purchase.payment_ref)).for('update');
      if (!payment || payment.state !== 'completed') return { ok: false as const, code: 'not_eligible' as const };
    }
    await tx.select({ id: users.id }).from(users).where(eq(users.id, purchase.buyer_id)).for('update');
    await tx.insert(userCredits).values({ id: randomUUID(), user_id: purchase.buyer_id, balance: 0 }).onDuplicateKeyUpdate({ set: { balance: sql`balance` } });
    const [credit] = await tx.select().from(userCredits).where(eq(userCredits.user_id, purchase.buyer_id)).for('update');
    const balance = credit.balance + 1;
    await tx.update(userCredits).set({ balance }).where(eq(userCredits.user_id, purchase.buyer_id));
    await tx.insert(purchaseCreditRemedies).values({ id: randomUUID(), purchase_id: purchaseId, user_id: purchase.buyer_id, actor_id: actorId, reason });
    await tx.insert(creditLedger).values({ id: randomUUID(), user_id: purchase.buyer_id, delta: 1, reason: 'refund', ref_id: purchaseId, balance_after: balance });
    return { ok: true as const, already_processed: false, user_id: purchase.buyer_id, balance };
  });
}
