import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { paymentEvents } from './event.schema';
import { paymentSessions } from './session.schema';
import type { PurchaseTx } from './session.repository';
export async function repoTransitionPayment(tx: PurchaseTx, ref: string, state: string, errorCode: string | null) {
  await tx.update(paymentSessions).set({state, error_code:errorCode}).where(eq(paymentSessions.payment_ref, ref));
  await tx.insert(paymentEvents).values({id:randomUUID(),payment_ref:ref,actor_id:'provider_callback',event:state,note:errorCode});
}
