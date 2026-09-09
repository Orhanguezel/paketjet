import { db } from "@/db/client";
import { desc, eq, sql } from "drizzle-orm";
import { users } from "@/modules/auth";
import { userRoles } from "@/modules/userRoles";
import { ilanlar } from "@/modules/ilanlar";
import { bookings } from "@/modules/bookings";
import { wallets, walletTransactions } from "@/modules/wallet";
import { ratings } from "@/modules/ratings";
import { buildCarriersWhere, type CarriersListParams } from "./helpers";
import {type CarrierListItem} from './repository.shared';
export async function repoListCarriers(params: CarriersListParams) {
  const where = buildCarriersWhere(params);

  const [rows, [countRow]] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        full_name: users.full_name,
        phone: users.phone,
        is_active: users.is_active,
        email_verified: users.email_verified,
        created_at: users.created_at,
        last_sign_in_at: users.last_sign_in_at,
        ilan_count: sql<number>`COUNT(DISTINCT ${ilanlar.id})`,
        active_ilan_count: sql<number>`COUNT(DISTINCT CASE WHEN ${ilanlar.status} = 'active' THEN ${ilanlar.id} END)`,
        booking_count: sql<number>`COUNT(DISTINCT ${bookings.id})`,
        delivered_booking_count: sql<number>`COUNT(DISTINCT CASE WHEN ${bookings.status} = 'delivered' THEN ${bookings.id} END)`,
        rating_avg: sql<number>`COALESCE(AVG(${ratings.score}), 0)`,
        rating_count: sql<number>`COUNT(DISTINCT ${ratings.id})`,
        wallet_balance: sql<string>`COALESCE(${wallets.balance}, '0.00')`,
        wallet_status: wallets.status,
      })
      .from(users)
      .innerJoin(userRoles, eq(userRoles.user_id, users.id))
      .leftJoin(ilanlar, eq(ilanlar.user_id, users.id))
      .leftJoin(bookings, eq(bookings.carrier_id, users.id))
      .leftJoin(ratings, eq(ratings.carrier_id, users.id))
      .leftJoin(wallets, eq(wallets.user_id, users.id))
      .where(where)
      .groupBy(
        users.id,
        users.email,
        users.full_name,
        users.phone,
        users.is_active,
        users.email_verified,
        users.created_at,
        users.last_sign_in_at,
        wallets.balance,
        wallets.status,
      )
      .orderBy(desc(users.created_at))
      .limit(params.limit)
      .offset(params.offset),
    db
      .select({ total: sql<number>`COUNT(DISTINCT ${users.id})` })
      .from(users)
      .innerJoin(userRoles, eq(userRoles.user_id, users.id))
      .where(where),
  ]);

  const data: CarrierListItem[] = rows.map((row) => ({
    id: row.id,
    email: row.email,
    full_name: row.full_name ?? null,
    phone: row.phone ?? null,
    is_active: !!row.is_active,
    email_verified: !!row.email_verified,
    created_at: row.created_at,
    last_sign_in_at: row.last_sign_in_at ?? null,
    ilan_count: Number(row.ilan_count ?? 0),
    active_ilan_count: Number(row.active_ilan_count ?? 0),
    booking_count: Number(row.booking_count ?? 0),
    delivered_booking_count: Number(row.delivered_booking_count ?? 0),
    rating_avg: Number(row.rating_avg ?? 0),
    rating_count: Number(row.rating_count ?? 0),
    wallet_balance: row.wallet_balance ?? "0.00",
    wallet_status: row.wallet_status ?? null,
  }));

  return {
    data,
    total: Number(countRow?.total ?? 0),
  };
}