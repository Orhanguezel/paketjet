// src/modules/subscription/repository.ts
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { eq, and, gte, sql, desc, asc } from "drizzle-orm";
import { plans, userSubscriptions } from "./schema";
import { ilanlar } from "../ilanlar/schema";
import { users } from "../auth/schema";
import type { NewPlan } from "./schema";

const EARLY_USER_THRESHOLD = 100;
const EARLY_USER_QUOTA = 5;
const DEFAULT_FREE_QUOTA = 1;

// ── Plans ────────────────────────────────────────────────────────────────────

export async function repoListPlans(activeOnly = true) {
  const conditions = activeOnly ? eq(plans.is_active, 1) : undefined;
  return db.select().from(plans).where(conditions).orderBy(asc(plans.sort_order));
}

export async function repoGetPlanById(id: string) {
  const [row] = await db.select().from(plans).where(eq(plans.id, id)).limit(1);
  return row ?? null;
}

export async function repoGetPlanBySlug(slug: string) {
  const [row] = await db.select().from(plans).where(eq(plans.slug, slug)).limit(1);
  return row ?? null;
}

export async function repoCreatePlan(data: Omit<NewPlan, "id">) {
  const id = randomUUID();
  await db.insert(plans).values({ id, ...data });
  return repoGetPlanById(id);
}

export async function repoUpdatePlan(id: string, data: Partial<NewPlan>) {
  await db.update(plans).set(data).where(eq(plans.id, id));
  return repoGetPlanById(id);
}

export async function repoDeletePlan(id: string) {
  await db.delete(plans).where(eq(plans.id, id));
}

// ── User Subscriptions ───────────────────────────────────────────────────────

export async function repoGetActiveSubscription(userId: string) {
  const now = new Date();
  const [row] = await db
    .select({
      id: userSubscriptions.id,
      user_id: userSubscriptions.user_id,
      plan_id: userSubscriptions.plan_id,
      starts_at: userSubscriptions.starts_at,
      expires_at: userSubscriptions.expires_at,
      status: userSubscriptions.status,
      payment_ref: userSubscriptions.payment_ref,
      created_at: userSubscriptions.created_at,
      plan_name: plans.name,
      plan_slug: plans.slug,
      ilan_limit: plans.ilan_limit,
      plan_price: plans.price,
      plan_features: plans.features,
    })
    .from(userSubscriptions)
    .innerJoin(plans, eq(userSubscriptions.plan_id, plans.id))
    .where(
      and(
        eq(userSubscriptions.user_id, userId),
        eq(userSubscriptions.status, "active"),
        gte(userSubscriptions.expires_at, now),
      ),
    )
    .orderBy(desc(userSubscriptions.created_at))
    .limit(1);
  return row ?? null;
}

export async function repoCreateSubscription(
  userId: string,
  planId: string,
  durationDays: number,
  paymentRef?: string,
) {
  const id = randomUUID();
  const now = new Date();
  const expires = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  await db.insert(userSubscriptions).values({
    id,
    user_id: userId,
    plan_id: planId,
    starts_at: now,
    expires_at: expires,
    status: "active",
    payment_ref: paymentRef,
  });

  return repoGetActiveSubscription(userId);
}

export async function repoCancelSubscription(subId: string) {
  await db
    .update(userSubscriptions)
    .set({ status: "cancelled" })
    .where(eq(userSubscriptions.id, subId));
}

export async function repoListUserSubscriptions(userId: string) {
  return db
    .select({
      id: userSubscriptions.id,
      plan_id: userSubscriptions.plan_id,
      starts_at: userSubscriptions.starts_at,
      expires_at: userSubscriptions.expires_at,
      status: userSubscriptions.status,
      created_at: userSubscriptions.created_at,
      plan_name: plans.name,
      plan_slug: plans.slug,
    })
    .from(userSubscriptions)
    .innerJoin(plans, eq(userSubscriptions.plan_id, plans.id))
    .where(eq(userSubscriptions.user_id, userId))
    .orderBy(desc(userSubscriptions.created_at));
}

// ── Ilan Limit Check ─────────────────────────────────────────────────────────

export async function repoCountMonthlyIlans(userId: string): Promise<number> {
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);

  const [row] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(ilanlar)
    .where(
      and(
        eq(ilanlar.user_id, userId),
        gte(ilanlar.created_at, firstOfMonth),
      ),
    );
  return Number(row?.count ?? 0);
}

// ── Free Quota ───────────────────────────────────────────────────────────────

export async function repoGetFreeQuota(userId: string): Promise<{ quota: number; early_user: boolean }> {
  const [row] = await db
    .select({
      rank: sql<number>`(
        SELECT COUNT(*) FROM ${users}
        WHERE ${users.created_at} <= (SELECT ${users.created_at} FROM ${users} WHERE ${users.id} = ${userId})
      )`,
    })
    .from(sql`dual`);

  const rank = Number(row?.rank ?? 9999);
  const isEarly = rank <= EARLY_USER_THRESHOLD;
  return { quota: isEarly ? EARLY_USER_QUOTA : DEFAULT_FREE_QUOTA, early_user: isEarly };
}

// ── Admin ────────────────────────────────────────────────────────────────────

export async function repoListAllSubscriptions(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [countRow] = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(userSubscriptions);

  const data = await db
    .select({
      id: userSubscriptions.id,
      user_id: userSubscriptions.user_id,
      plan_id: userSubscriptions.plan_id,
      starts_at: userSubscriptions.starts_at,
      expires_at: userSubscriptions.expires_at,
      status: userSubscriptions.status,
      created_at: userSubscriptions.created_at,
      plan_name: plans.name,
      plan_slug: plans.slug,
    })
    .from(userSubscriptions)
    .innerJoin(plans, eq(userSubscriptions.plan_id, plans.id))
    .orderBy(desc(userSubscriptions.created_at))
    .limit(limit)
    .offset(offset);

  return { data, total: Number(countRow?.total ?? 0), page, limit };
}
