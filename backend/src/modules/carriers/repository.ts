// src/modules/carriers/repository.ts
import { db } from "@/db/client";
import { desc, eq, sql } from "drizzle-orm";
import { users } from "@/modules/auth";
import { userRoles } from "@/modules/userRoles";
import { ilanlar } from "@/modules/ilanlar";
import { bookings } from "@/modules/bookings";
import { wallets, walletTransactions } from "@/modules/wallet";
import { ratings } from "@/modules/ratings";
import { buildCarriersWhere, type CarriersListParams } from "./helpers";

export type CarrierListItem = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  email_verified: boolean;
  created_at: Date | string;
  last_sign_in_at: Date | string | null;
  ilan_count: number;
  active_ilan_count: number;
  booking_count: number;
  delivered_booking_count: number;
  rating_avg: number;
  rating_count: number;
  wallet_balance: string;
  wallet_status: string | null;
};

export type CarrierDetailIlan = {
  id: string;
  from_city: string;
  to_city: string;
  departure_date: Date | string;
  status: string;
  available_capacity_kg: string;
  price_per_kg: string;
  currency: string;
  created_at: Date | string;
};

export type CarrierDetailBooking = {
  id: string;
  customer_id: string;
  status: string;
  payment_status: string;
  kg_amount: string;
  total_price: string;
  currency: string;
  created_at: Date | string;
  delivered_at: Date | string | null;
};

export type CarrierDetailRating = {
  id: string;
  customer_id: string;
  score: number;
  comment: string | null;
  created_at: Date | string;
};

export type CarrierDetailStats = {
  ilan_count: number;
  active_ilan_count: number;
  booking_count: number;
  delivered_booking_count: number;
  rating_avg: number;
  rating_count: number;
  wallet_balance: string;
  wallet_status: string | null;
  wallet_total_earnings: string;
  wallet_total_withdrawn: string;
  total_transaction_count: number;
};

export type CarrierDetail = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  email_verified: boolean;
  created_at: Date | string;
  last_sign_in_at: Date | string | null;
  stats: CarrierDetailStats;
  recent_ilanlar: CarrierDetailIlan[];
  recent_bookings: CarrierDetailBooking[];
  recent_ratings: CarrierDetailRating[];
};

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

export async function repoGetCarrierById(id: string): Promise<CarrierDetail | null> {
  const [summaryRow] = await db
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
      wallet_total_earnings: sql<string>`COALESCE(${wallets.total_earnings}, '0.00')`,
      wallet_total_withdrawn: sql<string>`COALESCE(${wallets.total_withdrawn}, '0.00')`,
      total_transaction_count: sql<number>`COUNT(DISTINCT ${walletTransactions.id})`,
    })
    .from(users)
    .innerJoin(userRoles, eq(userRoles.user_id, users.id))
    .leftJoin(ilanlar, eq(ilanlar.user_id, users.id))
    .leftJoin(bookings, eq(bookings.carrier_id, users.id))
    .leftJoin(ratings, eq(ratings.carrier_id, users.id))
    .leftJoin(wallets, eq(wallets.user_id, users.id))
    .leftJoin(walletTransactions, eq(walletTransactions.wallet_id, wallets.id))
    .where(sql`${users.id} = ${id} AND ${userRoles.role} = 'carrier'`)
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
      wallets.total_earnings,
      wallets.total_withdrawn,
    )
    .limit(1);

  if (!summaryRow) return null;

  const [recentIlanlarRows, recentBookingsRows, recentRatingsRows] = await Promise.all([
    db
      .select({
        id: ilanlar.id,
        from_city: ilanlar.from_city,
        to_city: ilanlar.to_city,
        departure_date: ilanlar.departure_date,
        status: ilanlar.status,
        available_capacity_kg: ilanlar.available_capacity_kg,
        price_per_kg: ilanlar.price_per_kg,
        currency: ilanlar.currency,
        created_at: ilanlar.created_at,
      })
      .from(ilanlar)
      .where(eq(ilanlar.user_id, id))
      .orderBy(desc(ilanlar.created_at))
      .limit(5),
    db
      .select({
        id: bookings.id,
        customer_id: bookings.customer_id,
        status: bookings.status,
        payment_status: bookings.payment_status,
        kg_amount: bookings.kg_amount,
        total_price: bookings.total_price,
        currency: bookings.currency,
        created_at: bookings.created_at,
        delivered_at: bookings.delivered_at,
      })
      .from(bookings)
      .where(eq(bookings.carrier_id, id))
      .orderBy(desc(bookings.created_at))
      .limit(5),
    db
      .select({
        id: ratings.id,
        customer_id: ratings.customer_id,
        score: ratings.score,
        comment: ratings.comment,
        created_at: ratings.created_at,
      })
      .from(ratings)
      .where(eq(ratings.carrier_id, id))
      .orderBy(desc(ratings.created_at))
      .limit(5),
  ]);

  return {
    id: summaryRow.id,
    email: summaryRow.email,
    full_name: summaryRow.full_name ?? null,
    phone: summaryRow.phone ?? null,
    is_active: !!summaryRow.is_active,
    email_verified: !!summaryRow.email_verified,
    created_at: summaryRow.created_at,
    last_sign_in_at: summaryRow.last_sign_in_at ?? null,
    stats: {
      ilan_count: Number(summaryRow.ilan_count ?? 0),
      active_ilan_count: Number(summaryRow.active_ilan_count ?? 0),
      booking_count: Number(summaryRow.booking_count ?? 0),
      delivered_booking_count: Number(summaryRow.delivered_booking_count ?? 0),
      rating_avg: Number(summaryRow.rating_avg ?? 0),
      rating_count: Number(summaryRow.rating_count ?? 0),
      wallet_balance: summaryRow.wallet_balance ?? "0.00",
      wallet_status: summaryRow.wallet_status ?? null,
      wallet_total_earnings: summaryRow.wallet_total_earnings ?? "0.00",
      wallet_total_withdrawn: summaryRow.wallet_total_withdrawn ?? "0.00",
      total_transaction_count: Number(summaryRow.total_transaction_count ?? 0),
    },
    recent_ilanlar: recentIlanlarRows.map((row) => ({
      ...row,
      available_capacity_kg: row.available_capacity_kg ?? "0.00",
      price_per_kg: row.price_per_kg ?? "0.00",
      currency: row.currency ?? "TRY",
    })),
    recent_bookings: recentBookingsRows.map((row) => ({
      ...row,
      kg_amount: row.kg_amount ?? "0.00",
      total_price: row.total_price ?? "0.00",
      currency: row.currency ?? "TRY",
      delivered_at: row.delivered_at ?? null,
    })),
    recent_ratings: recentRatingsRows.map((row) => ({
      ...row,
      score: Number(row.score ?? 0),
      comment: row.comment ?? null,
    })),
  };
}
