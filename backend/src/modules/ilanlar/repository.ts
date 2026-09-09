import {listingEvents} from './event.schema';
// src/modules/ilanlar/repository.ts
import { repoFindReservation } from "../purchases/session.repository";
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { repoInvalidateDashboardCache, repoInvalidateIlanCache } from "@/modules/_shared";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { buildCreateIlanInsert, buildIlanListWhere, getUserIlanOrder, mapIlanRow, stripIlanContact } from "./helpers";
import { ilanlar, ilanPhotos, type NewIlan } from "./schema";
import { users } from "../auth/schema";

/** Slug veya ID ile ilan getir */
export async function repoGetIlanBySlugOrId(slugOrId: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
  const condition = isUuid ? eq(ilanlar.id, slugOrId) : eq(ilanlar.slug, slugOrId);

  const [row] = await db
    .select({ ilan: ilanlar, user_full_name: users.full_name })
    .from(ilanlar)
    .leftJoin(users, eq(ilanlar.user_id, users.id))
    .where(condition)
    .limit(1);

  if (!row || ["removed", "cancelled", "pending_approval", "paused"].includes(row.ilan.status)) return null;

  const ilanId = row.ilan.id;
  const photos = await db.select().from(ilanPhotos).where(eq(ilanPhotos.ilan_id, ilanId)).orderBy(ilanPhotos.order);

  // PUBLIC detay → iletişim gizli (reveal ayrı endpoint)
  return { ...stripIlanContact(mapIlanRow(row)), photos };
}

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
    // PUBLIC liste → iletişim gizli (reveal ayrı endpoint)
    data: rows.map(mapIlanRow).map(stripIlanContact),
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

export async function repoUpdateIlan(id: string, data: Partial<NewIlan>, admin = false, actor?:string) {
  const userId = await db.transaction(async tx => {
    const [current] = await tx.select().from(ilanlar).where(eq(ilanlar.id, id)).for("update");
    if (!current) throw Object.assign(new Error("not_found"), {statusCode: 404});
    if (["sold", "removed"].includes(current.status)) throw Object.assign(new Error("listing_closed"), {statusCode: 409});
    if (await repoFindReservation(tx, id)) throw Object.assign(new Error("payment_pending"), {statusCode: 409});
    if (data.status === "sold") throw Object.assign(new Error("invalid_transition"), {statusCode: 409});
    if (data.status === "active" && (!admin || new Date(current.departure_date).getTime() <= Date.now())) throw Object.assign(new Error("approval_required"), {statusCode: 409});
    const departure = data.departure_date ?? current.departure_date;
    const arrival = data.arrival_date === undefined ? current.arrival_date : data.arrival_date;
    if (arrival && new Date(arrival) < new Date(departure)) throw Object.assign(new Error("invalid_arrival_date"), {statusCode: 400});
    await tx.update(ilanlar).set({...data, ...(!admin && !data.status ? {status: "pending_approval"} : {})}).where(eq(ilanlar.id, id));
    await tx.insert(listingEvents).values({id:randomUUID(),ilan_id:id,actor_id:actor??(admin?'admin':current.user_id),previous_status:current.status,status:data.status??(!admin?'pending_approval':current.status)});
    return current.user_id;
  });
  await repoInvalidateIlanCache(id);
  await repoInvalidateDashboardCache([userId]);
  return repoGetIlanById(id);
}

export async function repoUpdateIlanStatus(id: string, status: string, admin = false, actor?:string) {
  if (!admin && !["paused", "cancelled", "pending_approval"].includes(status)) throw Object.assign(new Error("invalid_transition"), {statusCode: 409});
  return repoUpdateIlan(id, {status}, admin, actor);
}

export async function repoDeleteIlan(id: string) {
  // Archive rather than destroy purchase history and contact snapshots.
  return repoUpdateIlan(id, {status: "removed"}, true);
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
