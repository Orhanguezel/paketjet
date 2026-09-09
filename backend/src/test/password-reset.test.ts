import {afterAll,describe,it,expect} from 'bun:test';
import {randomUUID} from 'node:crypto';
import {eq} from 'drizzle-orm';
import {db} from '@/db/client';
import {users} from '@/modules/auth/schema';
import {repoCreatePasswordReset} from '@/modules/auth/reset.repository';
import {repoGetUserById} from '@/modules/auth/repository';
import {getTestApp,closeTestApp,authHeaders} from './setup';
import {buyer} from './purchase-fixtures';
afterAll(closeTestApp);
describe('Password reset credentials',()=>{
 it('never returns reset token or reveals account existence; reset-purpose JWT cannot change passwords',async()=>{
  const app=await getTestApp(),user=await buyer(),row=await repoGetUserById(user.id);
  const request=(email:string)=>app.inject({method:'POST',url:'/api/auth/password-reset/request',payload:{email}});
  const [known,unknown]=await Promise.all([request(row!.email),request(`${randomUUID()}@example.test`)]);
  expect(known.statusCode).toBe(200);expect(known.json()).toEqual(unknown.json());expect(known.json().token).toBeUndefined();
  const oldToken=app.jwt.sign({sub:user.id,purpose:'password_reset'});
  expect((await app.inject({method:'POST',url:'/api/auth/password-reset/confirm',payload:{token:oldToken,password:randomUUID()}})).statusCode).toBe(400);
  const status=await app.inject({method:'GET',url:'/api/auth/status',headers:authHeaders(oldToken)});expect(status.json().authenticated).toBe(false);
 });
 it('consumes once under concurrency and invalidates old access sessions; rejects expired token',async()=>{
  const app=await getTestApp(),user=await buyer(),token=await repoCreatePasswordReset(user.id),password=randomUUID();
  const row=await repoGetUserById(user.id);expect(row!.reset_token).not.toBe(token);
  const submit=()=>app.inject({method:'POST',url:'/api/auth/password-reset/confirm',payload:{token,password}});
  const results=await Promise.all([submit(),submit()]);expect(results.map(x=>x.statusCode).sort()).toEqual([200,400]);
  expect((await app.inject({method:'GET',url:'/api/auth/user',headers:authHeaders(user.token)})).statusCode).toBe(401);
  const login=await app.inject({method:'POST',url:'/api/auth/token',payload:{email:row!.email,password}});expect(login.statusCode).toBe(200);
  expect((await app.inject({method:'GET',url:'/api/auth/user',headers:authHeaders(login.json().access_token)})).statusCode).toBe(200);
  const expired=await repoCreatePasswordReset(user.id);await db.update(users).set({reset_token_expires:new Date(Date.now()-1000)}).where(eq(users.id,user.id));
  expect((await app.inject({method:'POST',url:'/api/auth/password-reset/confirm',payload:{token:expired,password:randomUUID()}})).statusCode).toBe(400);
 });
});
