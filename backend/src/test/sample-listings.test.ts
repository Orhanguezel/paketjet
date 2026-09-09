import {afterAll, expect, it} from 'bun:test';
import {readFileSync} from 'node:fs';
import mysql from 'mysql2/promise';
import {eq} from 'drizzle-orm';
import {db} from '@/db/client';
import {ilanlar} from '@/modules/ilanlar/schema';
import {stripIlanContact} from '@/modules/ilanlar/helpers/repository';
import {repoListingAccess} from '@/modules/purchases/access.repository';
import {repoGrantCredits,repoGetCreditBalance,repoPurchaseIlan} from '@/modules/purchases/repository';
import {repoCreateIlanPayment,repoCompleteIlanPayment} from '@/modules/purchases/listing-payment.repository';
import {repoMyPayment} from '@/modules/purchases/session.repository';
import {creditLedger,ilanPurchases} from '@/modules/purchases/schema';
import {paymentSessions} from '@/modules/purchases/session.schema';
import {buyer,declaration,listing} from './purchase-fixtures';
import {closeTestApp} from './setup';
afterAll(closeTestApp);
it('sample credit/card/access cannot deliver or debit',async()=>{
 const owner=await buyer(), user=await buyer(),id=await listing(owner.id);
 await db.update(ilanlar).set({is_sample:1}).where(eq(ilanlar.id,id));
 await repoGrantCredits(user.id,2,'admin_grant');
 expect(await repoPurchaseIlan(id,user.id,declaration,'127.0.0.1')).toEqual({ok:false,code:'unavailable'});
 expect(await repoCreateIlanPayment(id,user.id,'iyzico',declaration,'127.0.0.1')).toEqual({ok:false,code:'unavailable'});
 expect((await repoListingAccess(id,user.id))?.state).toBe('unavailable');
 expect(await repoGetCreditBalance(user.id)).toBe(2);
 expect(await db.select().from(creditLedger).where(eq(creditLedger.user_id,user.id))).toHaveLength(1);
 expect(await db.select().from(ilanPurchases).where(eq(ilanPurchases.ilan_id,id))).toHaveLength(0);
 expect(await db.select().from(paymentSessions).where(eq(paymentSessions.ilan_id,id))).toHaveLength(0);
 expect(stripIlanContact({is_sample:1}).is_sample).toBe(true);
 expect(stripIlanContact({is_sample:0}).is_sample).toBe(false);
});
it('a captured payment cannot deliver a listing subsequently marked sample',async()=>{
 const owner=await buyer(),user=await buyer(),id=await listing(owner.id);
 const p=await repoCreateIlanPayment(id,user.id,'iyzico',declaration,'127.0.0.1');
 if(!p.ok)throw new Error('fixture');
 await db.update(ilanlar).set({is_sample:1}).where(eq(ilanlar.id,id));
 const ref=p.payment.payment_ref;
 expect((await repoCompleteIlanPayment(ref,{provider:'iyzico',amount:p.price,currency:'TRY',paymentId:ref})).ok).toBe(false);
 expect((await repoMyPayment(ref,user.id))?.state).toBe('refund_pending');
 expect(await db.select().from(ilanPurchases).where(eq(ilanPurchases.ilan_id,id))).toHaveLength(0);
});
it('sample seed is repeatable, contains 30 future examples and preserves later edits',async()=>{
 const seed=readFileSync(new URL('../db/seed/sql/064_sample_listings.sql',import.meta.url),'utf8');
 const conn=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,multipleStatements:true});
 await conn.query(seed);
 const id='e09a0000-0000-4000-8000-000000000001';
 const [original]=await db.select().from(ilanlar).where(eq(ilanlar.id,id));
 try{
  await db.update(ilanlar).set({title:'ÖRNEK İLAN — Düzenlenmiş açıklama'}).where(eq(ilanlar.id,id));
  await conn.query(seed);
  const rows=await db.select().from(ilanlar).where(eq(ilanlar.user_id,'e09a0000-0000-4000-8000-000000000000'));
  expect(rows).toHaveLength(30);
  expect(rows.every(r=>r.is_sample===1&&r.title?.startsWith('ÖRNEK İLAN —')&&new Date(r.departure_date).getTime()>Date.now())).toBe(true);
  expect(rows.find(r=>r.id===id)?.title).toBe('ÖRNEK İLAN — Düzenlenmiş açıklama');
  expect(rows.find(r=>r.id===id)?.departure_date).toEqual(original.departure_date);
 }finally{await db.update(ilanlar).set({title:original.title}).where(eq(ilanlar.id,id));await conn.end();}
});
