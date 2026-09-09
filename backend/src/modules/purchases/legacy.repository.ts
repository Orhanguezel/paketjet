import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { paymentSessions } from './session.schema';
import { walletTransactions, wallets } from '../wallet/schema';
import { bookings } from '../bookings/schema';
import type { PaymentProof } from './session.repository';

/** Legacy receipts are quarantined: never reinterpret TL as contact credits. */
export async function repoRecordLegacyReceipt(ref: string, kind: 'legacy_wallet' | 'legacy_booking', proof: PaymentProof, basket?: string) {
  let userId = '';
  if (kind === 'legacy_wallet') {
    const [row] = await db.select().from(walletTransactions).where(eq(walletTransactions.transaction_ref, ref));
    userId = row?.user_id ?? '';
    if (!userId && basket?.startsWith('wallet-')) {
      const [wallet] = await db.select().from(wallets).where(eq(wallets.id, basket.slice(7)));
      userId = wallet?.user_id ?? '';
    }
  } else {
    const [row] = basket?.startsWith('booking-')
      ? await db.select().from(bookings).where(eq(bookings.id, basket.slice(8)))
      : await db.select().from(bookings).where(eq(bookings.payment_ref, ref));
    userId = row?.customer_id ?? '';
  }
  await db.insert(paymentSessions).values({payment_ref: ref, user_id: userId, kind, provider: proof.provider, amount: proof.amount.toFixed(2), provider_payment_id: proof.paymentId, receipt: {paymentId: proof.paymentId, transactionIds: proof.transactionIds}, state: 'review', error_code: 'legacy_receipt_requires_reconciliation', expires_at: new Date()}).onDuplicateKeyUpdate({set: {updated_at: new Date()}});
}
