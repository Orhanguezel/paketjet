import {afterAll, expect, it} from 'bun:test';
import {readFileSync} from 'node:fs';
import mysql from 'mysql2/promise';
import {eq} from 'drizzle-orm';
import {db} from '@/db/client';
import {ilanlar} from '@/modules/ilanlar/schema';
import {repoListingAccess} from '@/modules/purchases/access.repository';
import {repoGrantCredits,repoGetCreditBalance,repoPurchaseIlan} from '@/modules/purchases/repository';
import {repoCreateIlanPayment,repoCompleteIlanPayment} from '@/modules/purchases/listing-payment.repository';
import {repoReportBankTransfer} from '@/modules/purchases/bank-transfer.repository';
import {repoMyPayment} from '@/modules/purchases/session.repository';
import {creditLedger,ilanPurchases} from '@/modules/purchases/schema';
import {paymentSessions} from '@/modules/purchases/session.schema';
import {buyer,declaration,listing} from './purchase-fixtures';
import {closeTestApp} from './setup';
afterAll(closeTestApp);
it('sample listing can be bought with an existing right',async()=>{
 const owner=await buyer(), user=await buyer(),id=await listing(owner.id);
 await db.update(ilanlar).set({is_sample:1}).where(eq(ilanlar.id,id));
 await repoGrantCredits(user.id,2,'admin_grant');
 expect((await repoListingAccess(id,user.id))?.state).toBe('credit');
 const purchase=await repoPurchaseIlan(id,user.id,declaration,'127.0.0.1');
 expect(purchase.ok).toBe(true);
 expect((await repoListingAccess(id,user.id))?.state).toBe('purchased');
 expect(await repoGetCreditBalance(user.id)).toBe(1);
 expect(await db.select().from(creditLedger).where(eq(creditLedger.user_id,user.id))).toHaveLength(2);
 expect(await db.select().from(ilanPurchases).where(eq(ilanPurchases.ilan_id,id))).toHaveLength(1);
 expect(await db.select().from(paymentSessions).where(eq(paymentSessions.ilan_id,id))).toHaveLength(0);
});
it('sample listing can be bought by Shopier without a preexisting right',async()=>{
 const owner=await buyer(), user=await buyer(), id=await listing(owner.id);
 await db.update(ilanlar).set({is_sample:1}).where(eq(ilanlar.id,id));
 expect((await repoListingAccess(id,user.id))?.state).toBe('card');
 const payment=await repoCreateIlanPayment(id,user.id,'shopier',declaration,'127.0.0.1');
 if(!payment.ok)throw new Error('fixture');
 const result=await repoCompleteIlanPayment(payment.payment.payment_ref,{provider:'shopier',amount:payment.price,currency:'TRY',paymentId:payment.payment.payment_ref});
 expect(result.ok).toBe(true);
 expect((await repoListingAccess(id,user.id))?.state).toBe('purchased');
 expect(await repoGetCreditBalance(user.id)).toBe(0);
 expect((await db.select().from(ilanPurchases).where(eq(ilanPurchases.ilan_id,id)))[0]?.price_paid).toBe(payment.price.toFixed(2));
});
it('sample listing can complete the allowlisted test bank flow',async()=>{
 const owner=await buyer(), user=await buyer(), id=await listing(owner.id);
 await db.update(ilanlar).set({is_sample:1}).where(eq(ilanlar.id,id));
 const payment=await repoCreateIlanPayment(id,user.id,'bank_test',declaration,'127.0.0.1');
 if(!payment.ok)throw new Error('fixture');
 await repoReportBankTransfer(payment.payment.payment_ref,user.id);
 const result=await repoCompleteIlanPayment(payment.payment.payment_ref,{provider:'bank_test',amount:payment.price,currency:'TRY',paymentId:`TEST-${payment.payment.payment_ref}`});
 expect(result.ok).toBe(true);
 expect((await repoListingAccess(id,user.id))?.state).toBe('purchased');
});
it('a paid listing remains deliverable if it is marked sample before capture',async()=>{
 const owner=await buyer(),user=await buyer(),id=await listing(owner.id);
 const p=await repoCreateIlanPayment(id,user.id,'shopier',declaration,'127.0.0.1');
 if(!p.ok)throw new Error('fixture');
 await db.update(ilanlar).set({is_sample:1}).where(eq(ilanlar.id,id));
 const ref=p.payment.payment_ref;
 expect((await repoCompleteIlanPayment(ref,{provider:'shopier',amount:p.price,currency:'TRY',paymentId:ref})).ok).toBe(true);
 expect((await repoMyPayment(ref,user.id))?.state).toBe('completed');
 expect(await db.select().from(ilanPurchases).where(eq(ilanPurchases.ilan_id,id))).toHaveLength(1);
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
  expect(rows.every(r=>r.title?.startsWith('ÖRNEK İLAN —'))).toBe(true);
  expect(rows.find(r=>r.id===id)?.title).toBe('ÖRNEK İLAN — Düzenlenmiş açıklama');
  expect(rows.find(r=>r.id===id)?.departure_date).toEqual(original.departure_date);
 }finally{await db.update(ilanlar).set({title:original.title}).where(eq(ilanlar.id,id));await conn.end();}
});
