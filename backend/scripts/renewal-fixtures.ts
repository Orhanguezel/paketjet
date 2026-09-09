/** Isolated browser fixtures. Credentials are written only to a private /tmp file. */
import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { db } from '../src/db/client';
import { repoAssignRole } from '../src/modules/auth/repository';
import { userCredits } from '../src/modules/purchases/schema';
import { getTestApp, registerUser, closeTestApp } from '../src/test/setup';
import { listing } from '../src/test/purchase-fixtures';
if (process.env.NODE_ENV !== 'test' || !process.env.DB_NAME?.startsWith('paketjet_test_')) throw new Error('isolated_test_only');
const app = await getTestApp();
const fixtures: Record<string, any> = {};
for (const role of ['seller','buyer','admin']) {
  const email = `browser-${role}-${randomUUID()}@example.test`, password = randomUUID();
  const result = await registerUser(app,{email,password,full_name:`Tarayıcı ${role}`,role:role==='seller'?'carrier':'user'});
  if(result.status!==200)throw new Error(`signup_${result.status}`);
  const id=result.body.user.id;
  if(role==='admin')await repoAssignRole(id,'admin');
  if(role==='buyer')await db.insert(userCredits).values({id:randomUUID(),user_id:id,balance:5});
  fixtures[role]={id,email,password};
}
fixtures.listing=await listing(fixtures.seller.id);
writeFileSync('/tmp/paketjet-renewal-20260909/browser-fixtures.json',JSON.stringify(fixtures),{mode:0o600});
await closeTestApp();
process.exit(0);
