import {locationFilter} from './location-filter';
import {listingEvents} from './event.schema';
import {ilanPurchases} from '../purchases/schema';
// =============================================================
// FILE: src/modules/ilanlar/admin.repository.ts
// Admin-only ilan DB queries
// =============================================================
import { db } from '@/db/client';
import { and, desc, eq, like, sql } from 'drizzle-orm';
import { ilanlar } from './schema';
import { users } from '../auth/schema';

export async function repoAdminListIlans(params: {
  status?: string;
  user_id?: string;
  from_city?: string;
  to_city?: string;
  limit: number;
  offset: number;
}) {
  const conditions: ReturnType<typeof eq>[] = [];
  if (params.status) conditions.push(eq(ilanlar.status, params.status));
  if (params.user_id) conditions.push(eq(ilanlar.user_id, params.user_id));
  if (params.from_city) conditions.push(locationFilter('from',params.from_city));
  if (params.to_city) conditions.push(locationFilter('to',params.to_city));
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [countRow]] = await Promise.all([
    db.select({ ilan: ilanlar, carrier_name: users.full_name, carrier_email: users.email })
      .from(ilanlar)
      .leftJoin(users, eq(ilanlar.user_id, users.id))
      .where(where)
      .orderBy(desc(ilanlar.created_at))
      .limit(params.limit)
      .offset(params.offset),
    db.select({ total: sql<number>`COUNT(*)` }).from(ilanlar).where(where),
  ]);

  return {
    data: rows.map((r) => ({ ...r.ilan, carrier_name: r.carrier_name, carrier_email: r.carrier_email })),
    total: Number(countRow?.total ?? 0),
  };
}

export async function repoAdminListingHistory(id:string){
 const [events,purchases]=await Promise.all([
 db.select().from(listingEvents).where(eq(listingEvents.ilan_id,id)).orderBy(desc(listingEvents.created_at)),
 db.select({id:ilanPurchases.id,buyer_id:ilanPurchases.buyer_id,status:ilanPurchases.status,created_at:ilanPurchases.created_at}).from(ilanPurchases).where(eq(ilanPurchases.ilan_id,id)),
 ]); return {events,purchases};
}
