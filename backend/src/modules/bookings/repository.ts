// src/modules/bookings/repository.ts
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { repoInvalidateDashboardCache } from "@/modules/_shared";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { bookings } from "./schema";
import { buildBookingStatusPatch, buildCreateBookingInsert, mapBookingRow, type BookingStatusExtra } from "./helpers";
import { ilanlar } from "../ilanlar/schema";
import { users } from "../auth/schema";

const customers = users;

export async function repoGetBookingById(id: string) {
  const carrierUsers = db.$with("carrier_users").as(
    db.select({ id: users.id, name: users.full_name }).from(users)
  );

  const [row] = await db
    .select({
      booking: bookings,
      from_city: ilanlar.from_city,
      to_city: ilanlar.to_city,
      customer_name: customers.full_name,
      carrier_name: sql<string | null>`(SELECT full_name FROM users WHERE id = ${bookings.carrier_id})`,
    })
    .from(bookings)
    .leftJoin(ilanlar, eq(bookings.ilan_id, ilanlar.id))
    .leftJoin(customers, eq(bookings.customer_id, customers.id))
    .where(eq(bookings.id, id))
    .limit(1);

  if (!row) return null;
  return mapBookingRow(row);
}

export async function repoListBookings(opts: {
  userId?: string;
  role?: "customer" | "carrier";
  status?: string;
  page: number;
  limit: number;
}) {
  const { page, limit } = opts;
  const offset = (page - 1) * limit;

  const conditions: ReturnType<typeof eq>[] = [];
  if (opts.userId && opts.role === "customer") conditions.push(eq(bookings.customer_id, opts.userId));
  if (opts.userId && opts.role === "carrier")  conditions.push(eq(bookings.carrier_id, opts.userId));
  if (opts.status) {
    const statuses = opts.status.split(',').map(s => s.trim()).filter(Boolean);
    if (statuses.length === 1) {
      conditions.push(eq(bookings.status, statuses[0]!));
    } else if (statuses.length > 1) {
      conditions.push(inArray(bookings.status, statuses));
    }
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [countRow]] = await Promise.all([
    db
      .select({
        booking: bookings,
        from_city: ilanlar.from_city,
        to_city: ilanlar.to_city,
        customer_name: customers.full_name,
        carrier_name: sql<string | null>`(SELECT full_name FROM users WHERE id = ${bookings.carrier_id})`,
      })
      .from(bookings)
      .leftJoin(ilanlar, eq(bookings.ilan_id, ilanlar.id))
      .leftJoin(customers, eq(bookings.customer_id, customers.id))
      .where(where)
      .orderBy(desc(bookings.created_at))
      .limit(limit)
      .offset(offset),
    db.select({ total: sql<number>`COUNT(*)` }).from(bookings).where(where),
  ]);

  return {
    data: rows.map(mapBookingRow),
    total: Number(countRow?.total ?? 0),
    page,
    limit,
  };
}

export async function repoCreateBooking(data: {
  ilanId: string;
  customerId: string;
  carrierId: string;
  kgAmount: number;
  totalPrice: number;
  currency: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  customerNotes?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentRef?: string;
}) {
  const id = randomUUID();
  const insert = buildCreateBookingInsert({ ...data, id });
  await db.insert(bookings).values(insert);
  await repoInvalidateDashboardCache([data.customerId, data.carrierId]);
  return repoGetBookingById(id);
}

export async function repoUpdateBookingStatus(
  id: string,
  status: string,
  extra?: BookingStatusExtra
) {
  const [current] = await db
    .select({ customer_id: bookings.customer_id, carrier_id: bookings.carrier_id })
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  const set = buildBookingStatusPatch(status, extra);
  await db.update(bookings).set(set).where(eq(bookings.id, id));
  await repoInvalidateDashboardCache([
    String(current?.customer_id ?? ''),
    String(current?.carrier_id ?? ''),
  ]);
  return repoGetBookingById(id);
}

export async function repoUpdatePaymentStatus(id: string, paymentStatus: string) {
  const [current] = await db
    .select({ customer_id: bookings.customer_id, carrier_id: bookings.carrier_id })
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  await db.update(bookings).set({ payment_status: paymentStatus }).where(eq(bookings.id, id));
  await repoInvalidateDashboardCache([
    String(current?.customer_id ?? ''),
    String(current?.carrier_id ?? ''),
  ]);
}

export async function repoUpdatePaymentRef(id: string, paymentRef: string) {
  await db.update(bookings).set({ payment_ref: paymentRef }).where(eq(bookings.id, id));
}

export async function repoUpdateBookingCommission(id: string, commissionRate: number, commissionAmount: number) {
  await db.update(bookings).set({
    commission_rate: String(commissionRate),
    commission_amount: String(commissionAmount),
  }).where(eq(bookings.id, id));
}
