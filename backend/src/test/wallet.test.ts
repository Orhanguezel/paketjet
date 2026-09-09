import { afterAll, expect, it } from 'bun:test';
import { buyer } from './purchase-fixtures';
import { authHeaders, closeTestApp, getTestApp } from './setup';
afterAll(closeTestApp);
it('legacy wallet is a read-only TL archive, not contact rights',async()=>{const app=await getTestApp(),a=await buyer();const res=await app.inject({method:'GET',url:'/api/wallet',headers:authHeaders(a.token)});expect(res.statusCode).toBe(200);expect(res.json()).toMatchObject({unit:'TRY',read_only:true});expect(res.json()).not.toHaveProperty('remaining_rights');});
it('all legacy deposit entry points are retired without adding balance',async()=>{const app=await getTestApp(),a=await buyer();for(const path of ['/api/wallet/deposit','/api/wallet/deposit/dev','/api/wallet/deposit/initiate']){expect((await app.inject({method:'POST',url:path,headers:authHeaders(a.token),payload:{amount:100}})).statusCode).toBe(410);}const r=await app.inject({method:'GET',url:'/api/wallet/transactions',headers:authHeaders(a.token)});expect(r.json().data).toHaveLength(0);});
it('unauthenticated wallet access is rejected',async()=>{const app=await getTestApp();expect((await app.inject({method:'POST',url:'/api/wallet/deposit'})).statusCode).toBe(401);});
