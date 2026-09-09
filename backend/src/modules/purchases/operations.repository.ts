import { randomUUID } from 'node:crypto';
import { and, desc, eq, like, or, sql } from 'drizzle-orm';
import { db } from '@/db/client';
import { users } from '../auth/schema';
import { paymentSessions } from './session.schema';
import { paymentEvents, creditAdjustments } from './event.schema';
import { creditLedger, userCredits } from './schema';
const fail = (code:string,statusCode=409) => Object.assign(new Error(code),{statusCode});
export async function repoListPaymentOperations(p:{state?:string;search?:string;limit:number;offset:number}) {
  const where=and(p.state?eq(paymentSessions.state,p.state):undefined,p.search?or(like(paymentSessions.payment_ref,`%${p.search}%`),like(paymentSessions.user_id,`%${p.search}%`)):undefined);
  const [data,[count]]=await Promise.all([
    db.select({payment_ref:paymentSessions.payment_ref,user_id:paymentSessions.user_id,kind:paymentSessions.kind,provider:paymentSessions.provider,amount:paymentSessions.amount,state:paymentSessions.state,error_code:paymentSessions.error_code,provider_payment_id:paymentSessions.provider_payment_id,created_at:paymentSessions.created_at,updated_at:paymentSessions.updated_at,expires_at:paymentSessions.expires_at}).from(paymentSessions).where(where).orderBy(desc(paymentSessions.created_at)).limit(p.limit).offset(p.offset),
    db.select({total:sql<number>`count(*)`}).from(paymentSessions).where(where),
  ]);
  return {data,total:Number(count.total)};
}
export async function repoPaymentOperation(ref:string) {
  const [row]=await db.select({payment_ref:paymentSessions.payment_ref,user_id:paymentSessions.user_id,ilan_id:paymentSessions.ilan_id,kind:paymentSessions.kind,provider:paymentSessions.provider,amount:paymentSessions.amount,state:paymentSessions.state,error_code:paymentSessions.error_code,provider_payment_id:paymentSessions.provider_payment_id,receipt:paymentSessions.receipt,created_at:paymentSessions.created_at,updated_at:paymentSessions.updated_at}).from(paymentSessions).where(eq(paymentSessions.payment_ref,ref));
  if(!row)return null;
  const events=await db.select().from(paymentEvents).where(eq(paymentEvents.payment_ref,ref)).orderBy(desc(paymentEvents.created_at));
  return {...row,events};
}
export async function repoAddPaymentNote(ref:string,actor:string,note:string) {
  return db.transaction(async tx=>{
    const [row]=await tx.select().from(paymentSessions).where(eq(paymentSessions.payment_ref,ref)).for('update');
    if(!row)throw fail('payment_not_found',404);
    await tx.insert(paymentEvents).values({id:randomUUID(),payment_ref:ref,actor_id:actor,event:'admin_note',note});
    return {ok:true};
  });
}
export async function repoAdminCredits(search:string,limit:number,offset:number) {
  const where=search?or(like(users.email,`%${search}%`),eq(users.id,search)):undefined;
  const [data,[count]]=await Promise.all([
    db.select({user_id:users.id,email:users.email,balance:sql<number>`COALESCE(${userCredits.balance},0)`}).from(users).leftJoin(userCredits,eq(users.id,userCredits.user_id)).where(where).orderBy(users.email).limit(limit).offset(offset),
    db.select({total:sql<number>`count(*)`}).from(users).where(where),
  ]);
  return {data,total:Number(count.total)};
}
export async function repoAdjustCredits(p:{id:string;user_id:string;delta:number;reason:string},actor:string) {
  return db.transaction(async tx=>{
    const [user]=await tx.select({id:users.id}).from(users).where(eq(users.id,p.user_id)).for('update');
    if(!user)throw fail('user_not_found',404);
    const [existing]=await tx.select().from(creditAdjustments).where(eq(creditAdjustments.id,p.id));
    if(existing){
      const [entry]=await tx.select().from(creditLedger).where(eq(creditLedger.ref_id,p.id));
      if(existing.user_id!==p.user_id||existing.actor_id!==actor||existing.reason!==p.reason||entry?.delta!==p.delta)throw fail('idempotency_conflict');
      return {ok:true,already_processed:true,balance:entry.balance_after};
    }
    await tx.insert(userCredits).values({id:randomUUID(),user_id:p.user_id,balance:0}).onDuplicateKeyUpdate({set:{balance:sql`balance`}});
    const [balance]=await tx.select().from(userCredits).where(eq(userCredits.user_id,p.user_id)).for('update');
    const next=balance.balance+p.delta;
    if(!Number.isSafeInteger(next)||next<0||next>2147483647)throw fail('invalid_balance');
    await tx.insert(creditAdjustments).values({id:p.id,user_id:p.user_id,actor_id:actor,reason:p.reason});
    await tx.update(userCredits).set({balance:next}).where(eq(userCredits.user_id,p.user_id));
    await tx.insert(creditLedger).values({id:randomUUID(),user_id:p.user_id,delta:p.delta,reason:'admin_grant',ref_id:p.id,balance_after:next});
    return {ok:true,already_processed:false,balance:next};
  });
}
export async function repoCommerceSummary() {
  const [rows]=await db.execute(sql`SELECT
   (SELECT COUNT(*) FROM ilanlar WHERE status='active' AND departure_date>UTC_TIMESTAMP()) active_listings,
   (SELECT COUNT(*) FROM ilanlar WHERE status='pending_approval' AND departure_date>UTC_TIMESTAMP()) moderation,
   (SELECT COUNT(*) FROM ilan_purchases WHERE status='completed') contact_sales,
   (SELECT COALESCE(SUM(price_paid),0) FROM ilan_purchases WHERE status='completed' AND pay_method='card') listing_receipts,
   (SELECT COALESCE(SUM(amount),0) FROM payment_sessions WHERE state='completed' AND kind='credits') package_receipts,
   (SELECT COUNT(*) FROM ilan_purchases WHERE status='completed' AND pay_method='credit') credit_spends,
   (SELECT COUNT(*) FROM payment_sessions WHERE state IN ('initializing','pending','review','refund_pending')) payment_queue`);
  return (rows as unknown as Record<string,unknown>[])[0];
}
