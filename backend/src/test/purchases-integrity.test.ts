import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { ilanlar } from '@/modules/ilanlar/schema';
import { paymentSessions } from '@/modules/purchases/session.schema';
import { creditLedger, ilanPurchases } from '@/modules/purchases/schema';
import { repoGetCreditBalance, repoGetCreditPackages, repoGrantCredits, repoPurchaseIlan } from '@/modules/purchases/repository';
import { repoCreateIlanPayment, repoCompleteIlanPayment, repoCreateCreditPackagePayment, repoCompleteCreditPackagePayment, repoFailCreditPackagePayment } from '@/modules/purchases/payment.repository';
import { repoMyPayment } from '@/modules/purchases/session.repository';
import { buyer, declaration, listing } from './purchase-fixtures';
import { closeTestApp } from './setup';
afterAll(closeTestApp);
const proof = (amount: number, paymentId: string) => ({provider: 'iyzico', amount, currency: 'TRY', paymentId});

describe('Contact purchase integrity with real MySQL locks', () => {
  it('two credit buyers yield one purchase and one debit; winner replay is free', async () => {
    const owner = await buyer(), a = await buyer(), b = await buyer();
    const id = await listing(owner.id);
    await Promise.all([repoGrantCredits(a.id, 2, 'admin_grant'), repoGrantCredits(b.id, 2, 'admin_grant')]);
    const results = await Promise.all([repoPurchaseIlan(id, a.id, declaration, '127.0.0.1'), repoPurchaseIlan(id, b.id, declaration, '127.0.0.1')]);
    expect(results.filter(x => x.ok)).toHaveLength(1);
    const winner = results[0].ok ? a : b;
    const again = await repoPurchaseIlan(id, winner.id, declaration, '127.0.0.1');
    expect(again.ok).toBe(true);
    expect(await repoGetCreditBalance(winner.id)).toBe(1);
    expect(await db.select().from(ilanPurchases).where(eq(ilanPurchases.ilan_id,id))).toHaveLength(1);
  });
  it('card reservation excludes another card buyer and credit spend', async () => {
    const owner = await buyer(), a = await buyer(), b = await buyer();
    const id = await listing(owner.id);
    await repoGrantCredits(b.id, 2, 'admin_grant');
    const results = await Promise.all([repoCreateIlanPayment(id,a.id,'iyzico',declaration,'127.0.0.1'),repoCreateIlanPayment(id,b.id,'iyzico',declaration,'127.0.0.1')]);
    expect(results.filter(x => x.ok)).toHaveLength(1);
    expect((await repoPurchaseIlan(id,b.id,declaration,'127.0.0.1')).ok).toBe(false);
    const payment = results.find(x => x.ok)!;
    if (!payment.ok) throw new Error('fixture');
    const ref = payment.payment.payment_ref;
    expect((await repoCompleteIlanPayment(ref,proof(payment.price+1,ref))).ok).toBe(false);
    expect((await repoCompleteIlanPayment(ref,{...proof(payment.price,ref),currency:'USD'})).ok).toBe(false);
    const callbacks = await Promise.all([repoCompleteIlanPayment(ref,proof(payment.price,ref)),repoCompleteIlanPayment(ref,proof(payment.price,ref))]);
    expect(callbacks.every(x=>x.ok)).toBe(true);
    expect(await db.select().from(ilanPurchases).where(eq(ilanPurchases.ilan_id,id))).toHaveLength(1);
    expect(await repoMyPayment(ref,owner.id)).toBeUndefined();
  });
  it('late captured payment is recorded for refund and does not deliver', async () => {
    const owner = await buyer(), a = await buyer();
    const id = await listing(owner.id);
    const payment = await repoCreateIlanPayment(id,a.id,'iyzico',declaration,'127.0.0.1');
    if (!payment.ok) throw new Error('fixture');
    await db.update(paymentSessions).set({expires_at:new Date(Date.now()-1000)}).where(eq(paymentSessions.payment_ref,payment.payment.payment_ref));
    const result = await repoCompleteIlanPayment(payment.payment.payment_ref,proof(payment.price,'late-'+id));
    expect(result.ok).toBe(false);
    expect((await repoMyPayment(payment.payment.payment_ref,a.id))?.state).toBe('refund_pending');
    expect(await db.select().from(ilanPurchases).where(eq(ilanPurchases.ilan_id,id))).toHaveLength(0);
  });
  it('duplicate package callbacks credit once; first balance creation is serialized', async () => {
    const a = await buyer();
    const [pack] = await repoGetCreditPackages();
    expect(pack).toBeDefined();
    const p = await repoCreateCreditPackagePayment(a.id,pack.key,'iyzico');
    const q = await repoCreateCreditPackagePayment(a.id,pack.key,'iyzico');
    if (!p.ok || !q.ok) throw new Error('fixture');
    const pProof = proof(Number(p.purchase.price),p.purchase.payment_ref);
    const qProof = proof(Number(q.purchase.price),q.purchase.payment_ref);
    await Promise.all([repoCompleteCreditPackagePayment(p.purchase.payment_ref,pProof),repoCompleteCreditPackagePayment(p.purchase.payment_ref,pProof),repoCompleteCreditPackagePayment(q.purchase.payment_ref,qProof)]);
    expect(await repoGetCreditBalance(a.id)).toBe(pack.credits*2);
    expect(await db.select().from(creditLedger).where(eq(creditLedger.user_id,a.id))).toHaveLength(2);
    await repoFailCreditPackagePayment(p.purchase.payment_ref);
    expect((await repoCompleteCreditPackagePayment(p.purchase.payment_ref,pProof)).ok).toBe(true);
  });
  it('own, expired and insufficient credit do not create purchases', async () => {
    const a = await buyer(), b = await buyer();
    const own = await listing(a.id), expired = await listing(a.id,'active',-1);
    expect((await repoPurchaseIlan(own,a.id,declaration,'127.0.0.1')).ok).toBe(false);
    expect((await repoPurchaseIlan(expired,b.id,declaration,'127.0.0.1')).ok).toBe(false);
    expect((await repoPurchaseIlan(own,b.id,declaration,'127.0.0.1')).ok).toBe(false);
    expect((await repoCreateIlanPayment(expired,b.id,'iyzico',declaration,'127.0.0.1')).ok).toBe(false);
  });
});
