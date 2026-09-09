import {afterAll,it,expect} from 'bun:test';
import {randomUUID} from 'node:crypto';
import {getTestApp,closeTestApp,registerUser} from './setup';
afterAll(closeTestApp);
it('rotates refresh cookies, rejects replay and revokes logout session',async()=>{
 const app=await getTestApp(),email=`session-${randomUUID()}@example.test`,password=randomUUID();
 await registerUser(app,{email,password});
 const login=await app.inject({method:'POST',url:'/api/auth/token',payload:{email,password}});
 expect(login.statusCode).toBe(200);
 const oldRefresh=login.cookies.find(c=>c.name==='refresh_token')!.value;
 const origin=process.env.FRONTEND_URL||'http://localhost:3079';
 const headers={cookie:`refresh_token=${oldRefresh}`,origin};
 const refreshed=await app.inject({method:'POST',url:'/api/auth/token/refresh',headers});expect(refreshed.statusCode).toBe(200);
 const nextRefresh=refreshed.cookies.find(c=>c.name==='refresh_token')!.value;expect(nextRefresh).not.toBe(oldRefresh);
 expect((await app.inject({method:'POST',url:'/api/auth/token/refresh',headers})).statusCode).toBe(401);
 const logout=await app.inject({method:'POST',url:'/api/auth/logout',headers:{cookie:`refresh_token=${nextRefresh}; access_token=${refreshed.json().access_token}`,origin}});expect(logout.statusCode).toBe(204);
 expect(logout.cookies.find(c=>c.name==='access_token')?.value).toBe('');
 expect((await app.inject({method:'POST',url:'/api/auth/token/refresh',headers:{cookie:`refresh_token=${nextRefresh}`,origin}})).statusCode).toBe(401);
});
