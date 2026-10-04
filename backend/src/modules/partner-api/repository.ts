// src/modules/partner-api/repository.ts
import { randomUUID } from 'crypto';
import { and, count, desc, eq, inArray, isNull, type SQL } from 'drizzle-orm';
import { db } from '@/db/client';
import { ilanlar } from '@/modules/ilanlar';
import { apiKeys } from './schema';

export async function repoListApiKeys(userId: string) {
  return db.select({ id: apiKeys.id, name: apiKeys.name, prefix: apiKeys.prefix, last_used_at: apiKeys.last_used_at, revoked_at: apiKeys.revoked_at, created_at: apiKeys.created_at })
    .from(apiKeys).where(eq(apiKeys.user_id, userId)).orderBy(desc(apiKeys.created_at));
}
export async function repoCountActiveApiKeys(userId: string) {
  const [r] = await db.select({ n: count() }).from(apiKeys).where(and(eq(apiKeys.user_id, userId), isNull(apiKeys.revoked_at)));
  return Number(r?.n ?? 0);
}
export async function repoCreateApiKey(data: { user_id: string; name: string; prefix: string; key_hash: string }) {
  const id = randomUUID();
  await db.insert(apiKeys).values({ id, ...data });
  return id;
}
export async function repoRevokeApiKey(userId: string, id: string) {
  const r = await db.update(apiKeys).set({ revoked_at: new Date() }).where(and(eq(apiKeys.id, id), eq(apiKeys.user_id, userId), isNull(apiKeys.revoked_at)));
  return (r as unknown as [{ affectedRows?: number }])[0]?.affectedRows ?? 0;
}
export async function repoFindApiKeyByHash(hash: string) {
  const [row] = await db.select().from(apiKeys).where(eq(apiKeys.key_hash, hash)).limit(1);
  return row ?? null;
}
export async function repoTouchApiKey(id: string, ip: string) {
  await db.update(apiKeys).set({ last_used_at: new Date(), last_used_ip: ip.slice(0, 64) }).where(eq(apiKeys.id, id));
}

/* ----- partner ilanlari (yalniz kendi ilanlari) ----- */
export async function repoPartnerListings(userId: string, f: { status?: string; external_ref?: string; limit: number; offset: number }) {
  const conds: SQL[] = [eq(ilanlar.user_id, userId)];
  if (f.status) conds.push(eq(ilanlar.status, f.status));
  if (f.external_ref) conds.push(eq(ilanlar.external_ref, f.external_ref));
  const where = and(...conds);
  const [rows, [total]] = await Promise.all([
    db.select().from(ilanlar).where(where).orderBy(desc(ilanlar.created_at)).limit(f.limit).offset(f.offset),
    db.select({ n: count() }).from(ilanlar).where(where),
  ]);
  return { rows, total: Number(total?.n ?? 0) };
}
export async function repoPartnerListing(userId: string, id: string) {
  const [row] = await db.select().from(ilanlar).where(and(eq(ilanlar.id, id), eq(ilanlar.user_id, userId))).limit(1);
  return row ?? null;
}
export async function repoPartnerListingByRef(userId: string, ref: string) {
  const [row] = await db.select().from(ilanlar).where(and(eq(ilanlar.user_id, userId), eq(ilanlar.external_ref, ref))).limit(1);
  return row ?? null;
}
export async function repoCountOpenListings(userId: string) {
  const [r] = await db.select({ n: count() }).from(ilanlar).where(and(eq(ilanlar.user_id, userId), inArray(ilanlar.status, ['active', 'pending_approval', 'paused'])));
  return Number(r?.n ?? 0);
}
export async function repoSetExternalRef(id: string, ref: string) {
  await db.update(ilanlar).set({ external_ref: ref }).where(eq(ilanlar.id, id));
}
