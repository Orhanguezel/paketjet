// =============================================================
// FILE: src/modules/bookings/admin.repository.ts
// Admin-only booking DB queries
// =============================================================
import { db } from '@/db/client';
import { and, desc, eq, sql } from 'drizzle-orm';
import { bookings } from './schema';
import { users } from '../auth/schema';

export async function repoAdminListBookings(params: {
  status?: string;
  customer_id?: string;
  carrier_id?: string;
  limit: number;
  offset: number;
}) {
  const conditions: ReturnType<typeof eq>[] = [];
  if (params.status) conditions.push(eq(bookings.status, params.status));
  if (params.customer_id) conditions.push(eq(bookings.customer_id, params.customer_id));
  if (params.carrier_id) conditions.push(eq(bookings.carrier_id, params.carrier_id));
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [countRow]] = await Promise.all([
    db.select({ booking: bookings, customer_name: users.full_name })
      .from(bookings)
      .leftJoin(users, eq(bookings.customer_id, users.id))
      .where(where)
      .orderBy(desc(bookings.created_at))
      .limit(params.limit)
      .offset(params.offset),
    db.select({ total: sql<number>`COUNT(*)` }).from(bookings).where(where),
  ]);

  return {
    data: rows.map((r) => ({ ...r.booking, customer_name: r.customer_name })),
    total: Number(countRow?.total ?? 0),
  };
}
