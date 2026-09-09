import { afterAll, expect, it } from 'bun:test';
import { buyer } from './purchase-fixtures';
import { authHeaders, closeTestApp, getTestApp } from './setup';
afterAll(closeTestApp);
it('legacy booking creation and checkout cannot start a new transaction',async()=>{const app=await getTestApp(),a=await buyer();expect((await app.inject({method:'POST',url:'/api/bookings',headers:authHeaders(a.token),payload:{}})).statusCode).toBe(410);expect((await app.inject({method:'POST',url:'/api/bookings/unknown/pay',headers:authHeaders(a.token)})).statusCode).toBe(410);});
it('forged legacy callbacks cannot create ledger effects',async()=>{const app=await getTestApp();for(const url of ['/api/bookings/pay/paytr-callback','/api/wallet/deposit/paytr-callback']){expect((await app.inject({method:'POST',url,payload:{merchant_oid:'fake',status:'success',total_amount:'5000',hash:'fake'}})).statusCode).toBe(400);}});
