import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { creditLedger, ilanPurchases } from '@/modules/purchases/schema';
import { purchaseTermsAcceptances } from '@/modules/purchases/trust.schema';
import { repoGrantCredits, repoGetCreditBalance, repoPurchaseIlan } from '@/modules/purchases/repository';
import { repoGrantPurchaseCreditRemedy } from '@/modules/purchases/credit-remedy.repository';
import { buyer, declaration, listing } from './purchase-fixtures';
import { authHeaders, closeTestApp, getTestApp } from './setup';

afterAll(closeTestApp);

describe('Purchase trust rules', () => {
  it('requires fresh terms acceptance on purchase endpoints', async () => {
    const app = await getTestApp();
    const owner = await buyer(), member = await buyer();
    const ilanId = await listing(owner.id);
    const body = { estimated_value: 1000, content_declared: true };
    const rejected = await app.inject({ method: 'POST', url: `/api/ilanlar/${ilanId}/satin-al`, headers: authHeaders(member.token), payload: body });
    expect(rejected.statusCode).toBe(400);
    const packageRejected = await app.inject({ method: 'POST', url: '/api/ilan-alma-hakki/satin-al', headers: authHeaders(member.token), payload: { package_key: 'one' } });
    expect(packageRejected.statusCode).toBe(400);
  });

  it('stores acceptance and allows one rating per participant, publicly visible', async () => {
    const app = await getTestApp();
    const owner = await buyer(), member = await buyer(), outsider = await buyer();
    const ilanId = await listing(owner.id);
    await repoGrantCredits(member.id, 1, 'admin_grant');
    const purchase = await repoPurchaseIlan(ilanId, member.id, declaration, '127.0.0.1');
    if (!purchase.ok) throw new Error('purchase_failed');
    const [acceptance] = await db.select().from(purchaseTermsAcceptances).where(eq(purchaseTermsAcceptances.reference_id, purchase.purchase_id));
    expect(acceptance?.user_id).toBe(member.id);
    const endpoint = `/api/ratings/purchase/${purchase.purchase_id}`;
    expect((await app.inject({ method:'POST', url:endpoint, headers:authHeaders(outsider.token), payload:{score:5} })).statusCode).toBe(403);
    expect((await app.inject({ method:'POST', url:endpoint, headers:authHeaders(member.token), payload:{score:6} })).statusCode).toBe(400);
    expect((await app.inject({ method:'POST', url:endpoint, headers:authHeaders(member.token), payload:{score:5,comment:'İletişim sorunsuzdu.'} })).statusCode).toBe(201);
    expect((await app.inject({ method:'POST', url:endpoint, headers:authHeaders(member.token), payload:{score:4} })).statusCode).toBe(409);
    const publicResult = await app.inject({ method:'GET', url:`/api/ratings/member/${owner.id}` });
    expect(publicResult.statusCode).toBe(200);
    expect(publicResult.json().average).toBe(5);
    expect(publicResult.json().total).toBe(1);
  });

  it('grants one verified remedy credit only once per purchase', async () => {
    const owner = await buyer(), member = await buyer(), admin = await buyer();
    const ilanId = await listing(owner.id);
    await repoGrantCredits(member.id, 1, 'admin_grant');
    const purchase = await repoPurchaseIlan(ilanId, member.id, declaration, '127.0.0.1');
    if (!purchase.ok) throw new Error('purchase_failed');
    const first = await repoGrantPurchaseCreditRemedy(purchase.purchase_id, admin.id, 'Numaranın yanlış olduğu doğrulandı');
    const second = await repoGrantPurchaseCreditRemedy(purchase.purchase_id, admin.id, 'Tekrar talep');
    expect(first.ok).toBe(true);
    expect(second.ok && second.already_processed).toBe(true);
    expect(await repoGetCreditBalance(member.id)).toBe(1);
    expect((await db.select().from(creditLedger).where(eq(creditLedger.ref_id, purchase.purchase_id))).filter(row=>row.reason==='refund')).toHaveLength(1);
    expect((await db.select().from(ilanPurchases).where(eq(ilanPurchases.id, purchase.purchase_id)))[0]?.status).toBe('completed');
  });
});
