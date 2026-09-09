import {afterAll,describe,it,expect} from 'bun:test';
import {randomUUID} from 'node:crypto';
import {getTestApp,closeTestApp,registerAdminUser,authHeaders} from './setup';
import {buyer,listing,declaration} from './purchase-fixtures';
import {repoCreateIlanPayment} from '@/modules/purchases/listing-payment.repository';
import {repoGetCreditBalance,repoListCreditLedger} from '@/modules/purchases/repository';
afterAll(closeTestApp);
describe('Commerce operations permissions and audit',()=>{
 it('requires admin; credit adjustment is audited, replay safe and cannot overdraw',async()=>{
  const app=await getTestApp(),admin=await registerAdminUser(app),user=await buyer();
  const payload={id:randomUUID(),user_id:user.id,delta:3,reason:'Isolated support adjustment test'};
  expect((await app.inject({method:'GET',url:'/api/admin/credits'})).statusCode).toBe(401);
  expect((await app.inject({method:'POST',url:'/api/admin/credits/adjust',headers:authHeaders(user.token),payload})).statusCode).toBe(403);
  const submit=()=>app.inject({method:'POST',url:'/api/admin/credits/adjust',headers:authHeaders(admin.token!),payload});
  const results=await Promise.all([submit(),submit()]);expect(results.map(x=>x.statusCode)).toEqual([200,200]);
  expect(await repoGetCreditBalance(user.id)).toBe(3);expect((await repoListCreditLedger(user.id)).length).toBe(1);
  expect((await app.inject({method:'POST',url:'/api/admin/credits/adjust',headers:authHeaders(admin.token!),payload:{...payload,delta:4}})).statusCode).toBe(409);
  expect((await app.inject({method:'POST',url:'/api/admin/credits/adjust',headers:authHeaders(admin.token!),payload:{...payload,id:randomUUID(),delta:-4}})).statusCode).toBe(409);
  expect(await repoGetCreditBalance(user.id)).toBe(3);
 });
 it('payment queue exposes reference, records actor note and does not grant access',async()=>{
  const app=await getTestApp(),admin=await registerAdminUser(app),owner=await buyer(),customer=await buyer();
  const ilanId=await listing(owner.id);const payment=await repoCreateIlanPayment(ilanId,customer.id,'paytr',declaration,'127.0.0.1');if(!payment.ok)throw new Error('fixture');
  const ref=payment.payment.payment_ref,url=`/api/admin/payment-operations/${ref}`;
  expect((await app.inject({method:'GET',url,headers:authHeaders(customer.token)})).statusCode).toBe(403);
  expect((await app.inject({method:'POST',url:`${url}/notes`,headers:authHeaders(admin.token!),payload:{note:'Provider case test reference'}})).statusCode).toBe(200);
  const detail=await app.inject({method:'GET',url,headers:authHeaders(admin.token!)});expect(detail.statusCode).toBe(200);const body=detail.json();expect(body.events).toHaveLength(1);expect(body.events[0].actor_id).toBe(admin.body.user.id);expect(body.state).toBe('initializing');expect(body.token_hash).toBeUndefined();
  const summary=await app.inject({method:'GET',url:'/api/admin/commerce-summary',headers:authHeaders(admin.token!)});expect(summary.statusCode).toBe(200);expect(summary.json().payment_queue).toBeGreaterThan(0);
 });
 it('cookie mutations reject untrusted origins without blocking server bearer requests',async()=>{
  const app=await getTestApp(),user=await buyer();
  expect((await app.inject({method:'POST',url:'/api/auth/logout',headers:{cookie:`access_token=${user.token}`,origin:'https://outside.example'}})).statusCode).toBe(403);
  expect((await app.inject({method:'POST',url:'/api/auth/logout',headers:{cookie:`access_token=${user.token}`,origin:'http://localhost:3079'}})).statusCode).toBe(204);
 });
});
