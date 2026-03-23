// src/modules/ratings/repository.ts
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { avg, count, desc, eq } from "drizzle-orm";
import { toCarrierRatingStats } from "./helpers";
import { ratings, type NewRating } from "./schema";
import { users } from "../auth/schema";

export async function repoGetRatingByBooking(bookingId: string) {
  const rows = await db
    .select()
    .from(ratings)
    .where(eq(ratings.booking_id, bookingId))
    .limit(1);
  return rows[0] ?? null;
}

export async function repoGetCarrierRatings(carrierId: string, limit = 20, offset = 0) {
  const rows = await db
    .select({
      id: ratings.id,
      booking_id: ratings.booking_id,
      score: ratings.score,
      comment: ratings.comment,
      created_at: ratings.created_at,
      customer_name: users.full_name,
    })
    .from(ratings)
    .leftJoin(users, eq(ratings.customer_id, users.id))
    .where(eq(ratings.carrier_id, carrierId))
    .orderBy(desc(ratings.created_at))
    .limit(limit)
    .offset(offset);

  return rows;
}

export async function repoGetCarrierAvgRating(carrierId: string): Promise<{ avg: number; count: number }> {
  const rows = await db
    .select({
      avg_score: avg(ratings.score),
      total: count(ratings.id),
    })
    .from(ratings)
    .where(eq(ratings.carrier_id, carrierId));

  const row = rows[0];
  return toCarrierRatingStats(row);
}

export async function repoCreateRating(input: Omit<NewRating, "id" | "created_at">) {
  const id = randomUUID();
  await db.insert(ratings).values({ id, ...input });
  const rows = await db.select().from(ratings).where(eq(ratings.id, id)).limit(1);
  return rows[0]!;
}
