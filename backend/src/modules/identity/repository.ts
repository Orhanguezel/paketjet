// src/modules/identity/repository.ts
import { db } from '@/db/client';
import { and, desc, eq } from 'drizzle-orm';
import { users } from '@/modules/auth/schema';
import { identityDocuments, type IdentityStatus } from './schema';

export async function repoGetIdentityFront(userId: string) {
  const [row] = await db
    .select()
    .from(identityDocuments)
    .where(and(eq(identityDocuments.user_id, userId), eq(identityDocuments.side, 'front')))
    .limit(1);
  return row ?? null;
}

/** Yeni gorsel yuklenince kayit yeniden incelemeye (pending) duser. */
export async function repoUpsertIdentityFront(data: { id: string; user_id: string; file_path: string; mime: string; size: number }) {
  const existing = await repoGetIdentityFront(data.user_id);
  const reset = { status: 'pending' as const, reject_reason: null, reviewed_by: null, reviewed_at: null, updated_at: new Date() };
  if (existing) {
    await db
      .update(identityDocuments)
      .set({ file_path: data.file_path, mime: data.mime, size: data.size, ...reset })
      .where(eq(identityDocuments.id, existing.id));
  } else {
    await db.insert(identityDocuments).values({ ...data, side: 'front' });
  }
  return { previousPath: existing?.file_path ?? null, row: await repoGetIdentityFront(data.user_id) };
}

export async function repoDeleteIdentityFront(userId: string) {
  await db.delete(identityDocuments).where(and(eq(identityDocuments.user_id, userId), eq(identityDocuments.side, 'front')));
}

export async function repoListIdentityDocuments(status?: IdentityStatus) {
  return db
    .select({
      id: identityDocuments.id,
      user_id: identityDocuments.user_id,
      email: users.email,
      full_name: users.full_name,
      status: identityDocuments.status,
      reject_reason: identityDocuments.reject_reason,
      reviewed_at: identityDocuments.reviewed_at,
      created_at: identityDocuments.created_at,
      updated_at: identityDocuments.updated_at,
    })
    .from(identityDocuments)
    .innerJoin(users, eq(users.id, identityDocuments.user_id))
    .where(status ? eq(identityDocuments.status, status) : undefined)
    .orderBy(desc(identityDocuments.updated_at))
    .limit(200);
}

export async function repoReviewIdentityFront(userId: string, reviewerId: string, status: 'approved' | 'rejected', reason: string | null) {
  await db
    .update(identityDocuments)
    .set({ status, reject_reason: status === 'rejected' ? reason : null, reviewed_by: reviewerId, reviewed_at: new Date(), updated_at: new Date() })
    .where(and(eq(identityDocuments.user_id, userId), eq(identityDocuments.side, 'front')));
  return repoGetIdentityFront(userId);
}
