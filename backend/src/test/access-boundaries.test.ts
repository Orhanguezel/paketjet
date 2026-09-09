import { afterAll, describe, expect, it } from 'bun:test';
import { randomUUID } from 'node:crypto';
import { repoGetUserById } from '@/modules/auth/repository';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { users } from '@/modules/auth/schema';
import { buyer, listing } from './purchase-fixtures';
import { authHeaders, closeTestApp, getTestApp } from './setup';
import { safeStoragePath, validateUpload, safeUploadName } from '@/modules/storage/upload-policy';
import { repoUpdateIlanStatus } from '@/modules/ilanlar/repository';
afterAll(closeTestApp);
describe('Access and public-data boundaries', () => {
  it('reset tokens, missing subject and disabled accounts cannot authenticate', async () => {
    const app = await getTestApp(), a = await buyer();
    for (const token of [app.jwt.sign({sub:a.id,purpose:'password_reset'}),app.jwt.sign({role:'admin'})]) {
      const response = await app.inject({method:'GET',url:'/api/auth/user',headers:authHeaders(token)});
      expect(response.statusCode).toBe(401);
    }
    for (const name of ['access_token','accessToken']) {
      expect((await app.inject({method:'GET',url:'/api/auth/user',cookies:{[name]:a.token}})).statusCode).toBe(200);
    }
    await db.update(users).set({is_active:0}).where(eq(users.id,a.id));
    expect((await app.inject({method:'GET',url:'/api/auth/user',headers:authHeaders(a.token)})).statusCode).toBe(401);
  });
  it('public UUID and slug never reveal contacts and hide moderated records immediately', async () => {
    const app = await getTestApp(), a = await buyer();
    const id = await listing(a.id);
    for (const key of [id,`test-${id}`]) {
      const r = await app.inject({method:'GET',url:`/api/ilanlar/${key}`});
      expect(r.statusCode).toBe(200);
      for (const field of ['contact_phone','contact_name','contact_email','carrier_name','user_id','content_declared_ip']) expect(r.json()).not.toHaveProperty(field);
    }
    await repoUpdateIlanStatus(id,'paused');
    for (const key of [id,`test-${id}`]) expect((await app.inject({method:'GET',url:`/api/ilanlar/${key}`})).statusCode).toBe(404);
    expect((await app.inject({method:'GET',url:`/api/ilanlar/${id}/iletisim`})).statusCode).toBe(401);
  });
  it('anonymous uploads and ordinary user admin bucket/signing are rejected', async () => {
    const app = await getTestApp(), a = await buyer();
    expect((await app.inject({method:'POST',url:'/api/storage/avatars/upload'})).statusCode).toBe(401);
    expect((await app.inject({method:'POST',url:'/api/storage/site/upload',headers:authHeaders(a.token)})).statusCode).toBe(403);
    expect((await app.inject({method:'POST',url:'/api/storage/uploads/sign-put',headers:authHeaders(a.token)})).statusCode).toBe(403);
    expect(()=>validateUpload(Buffer.from('<script>bad</script>'),'image/png')).toThrow();
    expect(()=>safeStoragePath('/tmp/uploads','../outside')).toThrow();
    expect(()=>safeStoragePath('/tmp/uploads','a/../../outside')).toThrow();
  });
  it('mixed cookie and revoked/reset bearer cannot change the other account', async()=>{
    const app=await getTestApp(),a=await buyer(),b=await buyer();
    const before=await repoGetUserById(b.id);
    await db.update(users).set({auth_version:1}).where(eq(users.id,b.id));
    for(const token of [b.token,app.jwt.sign({sub:b.id,purpose:'password_reset'})]){
      const email=`${randomUUID()}@example.test`;
      const result=await app.inject({method:'PUT',url:'/api/auth/user',headers:{cookie:`access_token=${a.token}`,authorization:`Bearer ${token}`},payload:{email}});
      expect(result.statusCode).toBe(200);
      expect((await repoGetUserById(b.id))?.email).toBe(before?.email);
      expect((await repoGetUserById(a.id))?.email).toBe(email);
    }
  });
  it('multi-extension avatar filename stays an image with restrictive serving headers', async()=>{
    const app=await getTestApp(),a=await buyer();
    expect(safeUploadName('uuid-poc.html','image/gif')).toBe('uuid-poc-html.gif');
    const boundary='pj-test-boundary';
    const payload=Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="poc.html.png"\r\nContent-Type: image/gif\r\n\r\nGIF89a<script>document.title='bad'</script>\r\n--${boundary}--\r\n`);
    const upload=await app.inject({method:'POST',url:'/api/storage/avatars/upload',headers:{...authHeaders(a.token),'content-type':`multipart/form-data; boundary=${boundary}`},payload});
    expect(upload.statusCode).toBe(200);
    const url=upload.json().url as string;expect(url.endsWith('.gif')).toBe(true);
    const path=new URL(url,'http://localhost:8079').pathname;
    const address = app.server.listening ? `http://127.0.0.1:${(app.server.address() as {port:number}).port}` : await app.listen({host:'127.0.0.1',port:0});
    const asset=await fetch(`${address}${path}`);expect(asset.status).toBe(200);expect(asset.headers.get('content-type')).toContain('image/gif');expect(asset.headers.get('x-content-type-options')).toBe('nosniff');expect(asset.headers.get('content-security-policy')).toContain('sandbox');expect(await asset.text()).toContain('GIF89a');
  });
  it('disabled gateway cannot initialize checkout and old deposit cannot credit', async () => {
    const app = await getTestApp(), a = await buyer();
    expect((await app.inject({method:'POST',url:'/api/ilan-alma-hakki/satin-al',headers:authHeaders(a.token),payload:{package_key:'test'}})).statusCode).toBe(503);
    expect((await app.inject({method:'POST',url:'/api/wallet/deposit',headers:authHeaders(a.token),payload:{amount:500}})).statusCode).toBe(410);
    expect((await app.inject({method:'GET',url:'/api/payments/unknown',headers:authHeaders(a.token)})).statusCode).toBe(404);
  });
});
