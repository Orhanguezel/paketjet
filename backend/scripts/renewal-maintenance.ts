/** One-shot server job. Expiry never changes completed purchases or old wallet balances. */
import {db,pool} from '../src/db/client';
import {and,eq,inArray,lte,sql} from 'drizzle-orm';
import {randomUUID} from 'node:crypto';
import {ilanlar} from '../src/modules/ilanlar/schema';
import {listingEvents} from '../src/modules/ilanlar/event.schema';
import {paymentSessions} from '../src/modules/purchases/session.schema';
import {paymentEvents} from '../src/modules/purchases/event.schema';
import {repoInvalidateIlanCache} from '../src/modules/_shared/cache';
const apply=process.argv.includes('--apply');
try {
 const result=await db.transaction(async tx=>{
  const listings=await tx.select({id:ilanlar.id,status:ilanlar.status}).from(ilanlar).where(and(inArray(ilanlar.status,['active','pending_approval','paused']),lte(ilanlar.departure_date,new Date()))).for('update');
  const payments=await tx.select({ref:paymentSessions.payment_ref}).from(paymentSessions).where(and(inArray(paymentSessions.state,['initializing','pending']),lte(paymentSessions.expires_at,new Date()))).for('update');
  if(apply){
   for(const row of listings){await tx.update(ilanlar).set({status:'expired'}).where(eq(ilanlar.id,row.id));await tx.insert(listingEvents).values({id:randomUUID(),ilan_id:row.id,actor_id:'expiry_job',previous_status:row.status,status:'expired'});}
   for(const row of payments){await tx.update(paymentSessions).set({state:'review',error_code:'confirmation_overdue'}).where(eq(paymentSessions.payment_ref,row.ref));await tx.insert(paymentEvents).values({id:randomUUID(),payment_ref:row.ref,actor_id:'expiry_job',event:'review',note:'Confirmation overdue; no assumption about capture or refund.'});}
  }
  return {listings,payments};
 });
 if(apply)for(const row of result.listings)await repoInvalidateIlanCache(row.id);
 const [rows]=await db.execute(sql`SELECT (SELECT COUNT(*) FROM payment_sessions WHERE state IN ('review','refund_pending')) payment_attention, (SELECT COUNT(*) FROM ilanlar WHERE status='active' AND departure_date>UTC_TIMESTAMP()) active_listings`);
 console.log(JSON.stringify({at:new Date().toISOString(),apply,expired:result.listings.length,payment_review:result.payments.length,metrics:rows}));
} finally {await pool.end();}
