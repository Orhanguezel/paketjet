// src/modules/ilanlar/repository.ts
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { repoInvalidateDashboardCache, repoInvalidateIlanCache } from "@/modules/_shared";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { buildCreateIlanInsert, buildIlanListWhere, getUserIlanOrder, mapIlanRow } from "./helpers";
import { ilanlar, ilanPhotos, type NewIlan } from "./schema";
import { users } from "../auth/schema";
export async function repoGetIlanById(id: string) {
  const [row] = await db
    .select({
      ilan: ilanlar,
      user_full_name: users.full_name,
    })
    .from(ilanlar)
    .leftJoin(users, eq(ilanlar.user_id, users.id))
    .where(eq(ilanlar.id, id))
    .limit(1);

  if (!row) return null;

  const photos = await db
    .select()
    .from(ilanPhotos)
    .where(eq(ilanPhotos.ilan_id, id))
    .orderBy(ilanPhotos.order);

  return { ...mapIlanRow(row), photos };
}

export async function repoListIlans(filters: {
  from_city?: string;
  to_city?: string;
  date?: string;
  min_kg?: number;
  max_price_per_kg?: number;
  vehicle_type?: string;
  status?: string;
  page: number;
  limit: number;
}) {
  const { page, limit, status = "active" } = filters;
  const offset = (page - 1) * limit;
  const where = buildIlanListWhere({ ...filters, status });

  const rows = await db
    .select({
      ilan: ilanlar,
      carrier_name: users.full_name,
    })
    .from(ilanlar)
    .leftJoin(users, eq(ilanlar.user_id, users.id))
    .where(where)
    .orderBy(desc(ilanlar.departure_date))
    .limit(limit)
    .offset(offset);

  const [countRow] = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(ilanlar)
    .where(where);

  return {
    data: rows.map(mapIlanRow),
    total: Number(countRow?.total ?? 0),
    page,
    limit,
  };
}

export async function repoCreateIlan(userId: string, data: Omit<NewIlan, "id" | "user_id" | "available_capacity_kg">) {
  const id = randomUUID();
  const insert = buildCreateIlanInsert(userId, data, id);
  await db.insert(ilanlar).values(insert);
  await repoInvalidateIlanCache(id);
  await repoInvalidateDashboardCache([userId]);
  return repoGetIlanById(id);
}

export async function repoUpdateIlan(id: string, data: Partial<NewIlan>) {
  const [current] = await db.select({ user_id: ilanlar.user_id }).from(ilanlar).where(eq(ilanlar.id, id)).limit(1);
  await db.update(ilanlar).set(data).where(eq(ilanlar.id, id));
  await repoInvalidateIlanCache(id);
  await repoInvalidateDashboardCache([String(current?.user_id ?? '')]);
  return repoGetIlanById(id);
}

export async function repoUpdateIlanStatus(id: string, status: string) {
  const [current] = await db.select({ user_id: ilanlar.user_id }).from(ilanlar).where(eq(ilanlar.id, id)).limit(1);
  await db.update(ilanlar).set({ status }).where(eq(ilanlar.id, id));
  await repoInvalidateIlanCache(id);
  await repoInvalidateDashboardCache([String(current?.user_id ?? '')]);
  return repoGetIlanById(id);
}

export async function repoDeleteIlan(id: string) {
  const [current] = await db.select({ user_id: ilanlar.user_id }).from(ilanlar).where(eq(ilanlar.id, id)).limit(1);
  await db.delete(ilanlar).where(eq(ilanlar.id, id));
  await repoInvalidateIlanCache(id);
  await repoInvalidateDashboardCache([String(current?.user_id ?? '')]);
}

export async function repoGetUserIlans(userId: string) {
  return db
    .select()
    .from(ilanlar)
    .where(eq(ilanlar.user_id, userId))
    .orderBy(getUserIlanOrder());
}

/** Booking sırasında mevcut kapasiteden düş */
export async function repoDeductCapacity(ilanId: string, kg: number) {
  const [current] = await db.select({ user_id: ilanlar.user_id }).from(ilanlar).where(eq(ilanlar.id, ilanId)).limit(1);
  await db
    .update(ilanlar)
    .set({
      available_capacity_kg: sql`available_capacity_kg - ${kg}`,
    })
    .where(
      and(
        eq(ilanlar.id, ilanId),
        gte(ilanlar.available_capacity_kg, String(kg))
      )
    );
  await repoInvalidateIlanCache(ilanId);
  await repoInvalidateDashboardCache([String(current?.user_id ?? '')]);
}

/** Booking iptalinde kapasiteyi geri yükle */
export async function repoRestoreCapacity(ilanId: string, kg: number) {
  const [current] = await db.select({ user_id: ilanlar.user_id }).from(ilanlar).where(eq(ilanlar.id, ilanId)).limit(1);
  await db
    .update(ilanlar)
    .set({
      available_capacity_kg: sql`available_capacity_kg + ${kg}`,
    })
    .where(eq(ilanlar.id, ilanId));
  await repoInvalidateIlanCache(ilanId);
  await repoInvalidateDashboardCache([String(current?.user_id ?? '')]);
}

/** Subscription için aktif ilan sayısı */
export async function repoCountActiveIlans(userId: string): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(ilanlar)
    .where(and(eq(ilanlar.user_id, userId), eq(ilanlar.status, "active")));
  return Number(row?.count ?? 0);
}

// ── Fotoğraf ─────────────────────────────────────────────────────────────────

export async function repoAddIlanPhoto(ilanId: string, url: string, order = 0) {
  const id = randomUUID();
  await db.insert(ilanPhotos).values({ id, ilan_id: ilanId, url, order });
  return id;
}

export async function repoDeleteIlanPhoto(photoId: string) {
  await db.delete(ilanPhotos).where(eq(ilanPhotos.id, photoId));
}
