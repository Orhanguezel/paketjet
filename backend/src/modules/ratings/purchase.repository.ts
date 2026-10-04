import { randomUUID } from 'node:crypto';
import { and, avg, count, desc, eq, inArray, or } from 'drizzle-orm';
import { db } from '@/db/client';
import { users } from '../auth/schema';
import { ilanPurchases } from '../purchases/schema';
import { ilanlar } from '../ilanlar/schema';
import { purchaseRatings } from './purchase.schema';
import { MEMBER_LABEL } from '@/core/brand';

export async function repoCreatePurchaseRating(purchaseId: string, reviewerId: string, score: number, comment: string | null) {
  return db.transaction(async tx => {
    const [purchase] = await tx.select().from(ilanPurchases).where(eq(ilanPurchases.id, purchaseId)).for('update');
    if (!purchase) return { ok: false as const, code: 'not_found' as const };
    if (purchase.status !== 'completed') return { ok: false as const, code: 'not_eligible' as const };
    if (reviewerId !== purchase.buyer_id && reviewerId !== purchase.seller_id) return { ok: false as const, code: 'forbidden' as const };
    const [existing] = await tx.select({ id: purchaseRatings.id }).from(purchaseRatings).where(and(eq(purchaseRatings.purchase_id, purchaseId), eq(purchaseRatings.reviewer_id, reviewerId)));
    if (existing) return { ok: false as const, code: 'already_rated' as const };
    const targetId = reviewerId === purchase.buyer_id ? purchase.seller_id : purchase.buyer_id;
    const id = randomUUID();
    await tx.insert(purchaseRatings).values({ id, purchase_id: purchaseId, reviewer_id: reviewerId, member_id: targetId, score, comment });
    return { ok: true as const, id, member_id: targetId };
  });
}

export async function repoGetMemberPurchaseRatings(memberId: string) {
  const [member] = await db.select({ id: users.id, full_name: users.full_name }).from(users).where(eq(users.id, memberId)).limit(1);
  if (!member) return null;
  const [[stats], list] = await Promise.all([
    db.select({ average: avg(purchaseRatings.score), total: count(purchaseRatings.id) }).from(purchaseRatings).where(eq(purchaseRatings.member_id, memberId)),
    db.select({ id: purchaseRatings.id, score: purchaseRatings.score, comment: purchaseRatings.comment, created_at: purchaseRatings.created_at }).from(purchaseRatings).where(eq(purchaseRatings.member_id, memberId)).orderBy(desc(purchaseRatings.created_at)).limit(30),
  ]);
  return { member_id: memberId, member_name: member.full_name || MEMBER_LABEL, average: stats?.average == null ? null : Number(stats.average), total: Number(stats?.total || 0), data: list };
}

export async function repoGetEligiblePurchaseRatings(userId: string) {
  const rows = await db.select({ purchase_id: ilanPurchases.id, buyer_id: ilanPurchases.buyer_id, seller_id: ilanPurchases.seller_id, title: ilanlar.title, from_city: ilanlar.from_city, to_city: ilanlar.to_city, created_at: ilanPurchases.created_at })
    .from(ilanPurchases).leftJoin(ilanlar, eq(ilanPurchases.ilan_id, ilanlar.id))
    .where(and(eq(ilanPurchases.status, 'completed'), or(eq(ilanPurchases.buyer_id, userId), eq(ilanPurchases.seller_id, userId))))
    .orderBy(desc(ilanPurchases.created_at)).limit(100);
  const targetIds = [...new Set(rows.map(row => row.buyer_id === userId ? row.seller_id : row.buyer_id))];
  const [members, rated] = await Promise.all([
    targetIds.length ? db.select({ id: users.id, name: users.full_name }).from(users).where(inArray(users.id, targetIds)) : [],
    rows.length ? db.select({ purchase_id: purchaseRatings.purchase_id }).from(purchaseRatings).where(and(eq(purchaseRatings.reviewer_id, userId), inArray(purchaseRatings.purchase_id, rows.map(row => row.purchase_id)))) : [],
  ]);
  const names = new Map(members.map(member => [member.id, member.name]));
  const ratedIds = new Set(rated.map(row => row.purchase_id));
  return rows.map(row => {
    const memberId = row.buyer_id === userId ? row.seller_id : row.buyer_id;
    return { purchase_id: row.purchase_id, member_id: memberId, member_name: names.get(memberId) || MEMBER_LABEL, title: row.title || `${row.from_city} → ${row.to_city}`, created_at: row.created_at, rated: ratedIds.has(row.purchase_id) };
  });
}
