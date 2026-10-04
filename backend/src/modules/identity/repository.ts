import { db } from '@/db/client';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { users } from '@/modules/auth/schema';
import { identityDocuments, type IdentityStatus } from './schema';

export type IdentitySide = 'front' | 'back';

export async function repoGetIdentitySide(userId: string, side: IdentitySide) {
  const [row] = await db.select().from(identityDocuments)
    .where(and(eq(identityDocuments.user_id, userId), eq(identityDocuments.side, side))).limit(1);
  return row ?? null;
}

export async function repoGetIdentityDocuments(userId: string) {
  const rows = await db.select().from(identityDocuments).where(eq(identityDocuments.user_id, userId));
  return { front: rows.find((row) => row.side === 'front') ?? null, back: rows.find((row) => row.side === 'back') ?? null };
}

/** Bir yuz degisince iki yuzun ortak inceleme karari gecersiz olur. */
export async function repoUpsertIdentitySide(side: IdentitySide, data: { id: string; user_id: string; file_path: string; mime: string; size: number }) {
  const existing = await repoGetIdentitySide(data.user_id, side);
  const reset = { status: 'pending' as const, reject_reason: null, reviewed_by: null, reviewed_at: null, updated_at: new Date() };
  await db.transaction(async (tx) => {
    await tx.update(identityDocuments).set(reset).where(eq(identityDocuments.user_id, data.user_id));
    if (existing) await tx.update(identityDocuments).set({ file_path: data.file_path, mime: data.mime, size: data.size, ...reset }).where(eq(identityDocuments.id, existing.id));
    else await tx.insert(identityDocuments).values({ ...data, side });
  });
  return { previousPath: existing?.file_path ?? null, documents: await repoGetIdentityDocuments(data.user_id) };
}

export async function repoDeleteIdentitySide(userId: string, side: IdentitySide) {
  await db.transaction(async (tx) => {
    await tx.delete(identityDocuments).where(and(eq(identityDocuments.user_id, userId), eq(identityDocuments.side, side)));
    await tx.update(identityDocuments).set({ status: 'pending', reject_reason: null, reviewed_by: null, reviewed_at: null, updated_at: new Date() })
      .where(eq(identityDocuments.user_id, userId));
  });
}

export async function repoListIdentityDocuments(status?: IdentityStatus) {
  const rows = await db.select({
    id: identityDocuments.id, user_id: identityDocuments.user_id, side: identityDocuments.side,
    email: users.email, full_name: users.full_name, status: identityDocuments.status,
    reject_reason: identityDocuments.reject_reason, reviewed_at: identityDocuments.reviewed_at,
    created_at: identityDocuments.created_at, updated_at: identityDocuments.updated_at,
  }).from(identityDocuments).innerJoin(users, eq(users.id, identityDocuments.user_id))
    .orderBy(desc(identityDocuments.updated_at)).limit(400);
  const grouped = new Map<string, typeof rows>();
  for (const row of rows) grouped.set(row.user_id, [...(grouped.get(row.user_id) ?? []), row]);
  return [...grouped.values()].map((docs) => {
    const latest = docs[0]!;
    return { id: latest.id, user_id: latest.user_id, email: latest.email, full_name: latest.full_name,
      ...summarizeIdentity(docs), created_at: latest.created_at, updated_at: latest.updated_at };
  }).filter((row) => !status || (row.has_front && row.has_back && row.status === status));
}

type IdentityDocSummaryInput = { side: string; status: IdentityStatus; reject_reason: string | null; reviewed_at: Date | null; updated_at: Date };
export type IdentitySummary = { status: IdentityStatus; has_front: boolean; has_back: boolean; reject_reason: string | null; reviewed_at: Date | null; updated_at: Date | null };

/** Iki yuzun ortak karari: biri reddedildiyse reddedildi, ikisi de onayliysa onaylandi, aksi halde inceleniyor. */
function summarizeIdentity(docs: IdentityDocSummaryInput[]): IdentitySummary {
  const front = docs.find((row) => row.side === 'front');
  const back = docs.find((row) => row.side === 'back');
  const status: IdentityStatus = docs.some((row) => row.status === 'rejected') ? 'rejected'
    : front && back && docs.every((row) => row.status === 'approved') ? 'approved' : 'pending';
  return { status, has_front: !!front, has_back: !!back,
    reject_reason: docs.find((row) => row.reject_reason)?.reject_reason ?? null,
    reviewed_at: docs.find((row) => row.reviewed_at)?.reviewed_at ?? null,
    updated_at: docs.reduce<Date | null>((max, row) => (!max || row.updated_at > max ? row.updated_at : max), null) };
}

/** Verilen kullanicilarin kimlik ozeti; belge yuklememis kullanici haritada yer almaz. */
export async function repoIdentitySummaries(userIds: string[]): Promise<Map<string, IdentitySummary>> {
  const result = new Map<string, IdentitySummary>();
  if (!userIds.length) return result;
  const rows = await db.select({ user_id: identityDocuments.user_id, side: identityDocuments.side, status: identityDocuments.status,
    reject_reason: identityDocuments.reject_reason, reviewed_at: identityDocuments.reviewed_at, updated_at: identityDocuments.updated_at })
    .from(identityDocuments).where(inArray(identityDocuments.user_id, userIds));
  const grouped = new Map<string, typeof rows>();
  for (const row of rows) grouped.set(row.user_id, [...(grouped.get(row.user_id) ?? []), row]);
  for (const [userId, docs] of grouped) result.set(userId, summarizeIdentity(docs));
  return result;
}

export async function repoReviewIdentityDocuments(userId: string, reviewerId: string, status: 'approved' | 'rejected', reason: string | null) {
  const documents = await repoGetIdentityDocuments(userId);
  if (!documents.front || !documents.back) return null;
  await db.update(identityDocuments).set({ status, reject_reason: status === 'rejected' ? reason : null,
    reviewed_by: reviewerId, reviewed_at: new Date(), updated_at: new Date() }).where(eq(identityDocuments.user_id, userId));
  return repoGetIdentityDocuments(userId);
}
