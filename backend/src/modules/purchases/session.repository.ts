import { creditPackagePurchases, ilanPurchasePayments } from "./schema";
import { createHash,randomUUID } from 'node:crypto';
import {paymentEvents} from './event.schema';
import { and, eq, gt, inArray } from 'drizzle-orm';
import { db } from '@/db/client';
import { paymentSessions, type PaymentSession } from './session.schema';
export type PurchaseTx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export const repoTokenHash = (token: string) => createHash('sha256').update(token).digest('hex');

export async function repoFindReservation(tx: PurchaseTx, ilanId: string) {
  const [row] = await tx.select().from(paymentSessions).where(and(eq(paymentSessions.ilan_id, ilanId), gt(paymentSessions.expires_at, new Date()), inArray(paymentSessions.state, ['initializing', 'pending', 'review']))).limit(1);
  return row;
}
export async function repoSavePaymentToken(ref: string, token: string) {
  await db.transaction(async(tx)=>{
    const [row]=await tx.select().from(paymentSessions).where(eq(paymentSessions.payment_ref,ref)).for('update');
    if(row?.state!=='initializing')return;
    await tx.update(paymentSessions).set({token_hash:repoTokenHash(token),state:'pending'}).where(eq(paymentSessions.payment_ref,ref));
    await tx.insert(paymentEvents).values({id:randomUUID(),payment_ref:ref,actor_id:'checkout',event:'pending'});
  });
}
export async function repoPaymentByToken(token: string) {
  const [row] = await db.select().from(paymentSessions).where(eq(paymentSessions.token_hash, repoTokenHash(token))).limit(1);
  return row;
}
export async function repoPaymentByRef(ref: string) {
  const [row] = await db.select().from(paymentSessions).where(eq(paymentSessions.payment_ref, ref)).limit(1);
  return row;
}
export async function repoMyPayment(ref: string, userId: string) {
  const [row] = await db.select({ payment_ref: paymentSessions.payment_ref, kind: paymentSessions.kind, ilan_id: paymentSessions.ilan_id, amount: paymentSessions.amount, state: paymentSessions.state, error_code: paymentSessions.error_code, updated_at: paymentSessions.updated_at }).from(paymentSessions).where(and(eq(paymentSessions.payment_ref, ref), eq(paymentSessions.user_id, userId))).limit(1);
  return row;
}
export async function repoMarkPayment(ref: string, state: string, errorCode: string | null = null) {
  await db.transaction(async(tx)=>{
    const [row]=await tx.select().from(paymentSessions).where(eq(paymentSessions.payment_ref,ref)).for('update');
    if(!row||!['initializing','pending','review'].includes(row.state)||row.state===state)return;
    await tx.update(paymentSessions).set({state,error_code:errorCode}).where(eq(paymentSessions.payment_ref,ref));
    await tx.insert(paymentEvents).values({id:randomUUID(),payment_ref:ref,actor_id:'checkout',event:state,note:errorCode});
  });
}
export interface PaymentProof {
  provider: string;
  amount: number;
  currency: string;
  paymentId: string;
  transactionIds?: string[];
}
export function matchesPayment(session: PaymentSession, proof: PaymentProof): boolean {
  return session.provider === proof.provider && proof.currency === 'TRY' && Boolean(proof.paymentId) && Number.isFinite(proof.amount) && Math.round(proof.amount * 100) === Math.round(Number(session.amount) * 100);
}
export async function repoAcceptReceipt(tx: PurchaseTx, ref: string, proof: PaymentProof) {
  const [session] = await tx.select().from(paymentSessions).where(eq(paymentSessions.payment_ref, ref)).for('update');
  if (!session || !matchesPayment(session, proof)) return null;
  if (session.provider_payment_id && session.provider_payment_id !== proof.paymentId) return null;
  await tx.update(paymentSessions).set({ provider_payment_id: proof.paymentId, receipt: { paymentId: proof.paymentId, transactionIds: proof.transactionIds } }).where(eq(paymentSessions.payment_ref, ref));
  return session;
}

export async function repoPaymentBasket(ref: string, kind: string) {
  if (kind === "credits") {
    const [row] = await db.select({id: creditPackagePurchases.id}).from(creditPackagePurchases).where(eq(creditPackagePurchases.payment_ref, ref));
    return row ? `credits-${row.id}` : null;
  }
  const [row] = await db.select({id: ilanPurchasePayments.id}).from(ilanPurchasePayments).where(eq(ilanPurchasePayments.payment_ref, ref));
  return row ? `ilan-${row.id}` : null;
}
