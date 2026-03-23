// src/modules/subscription/schema.ts
import {
  mysqlTable,
  char,
  varchar,
  text,
  decimal,
  int,
  tinyint,
  datetime,
  json,
  index,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "../auth/schema";

// 1. Planlar
export const plans = mysqlTable(
  "plans",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
    ilan_limit: int("ilan_limit").notNull().default(1),
    duration_days: int("duration_days").notNull().default(30),
    features: json("features").$type<string[]>().default([]),
    sort_order: int("sort_order").notNull().default(0),
    is_active: tinyint("is_active").notNull().default(1),
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    index("plans_slug_idx").on(t.slug),
    index("plans_is_active_idx").on(t.is_active),
  ],
);

// 2. Kullanici Abonelikleri
export const userSubscriptions = mysqlTable(
  "user_subscriptions",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    user_id: char("user_id", { length: 36 }).notNull(),
    plan_id: char("plan_id", { length: 36 }).notNull(),
    starts_at: datetime("starts_at", { fsp: 3 }).notNull(),
    expires_at: datetime("expires_at", { fsp: 3 }).notNull(),
    status: varchar("status", { length: 30 }).notNull().default("active"),
    // active | expired | cancelled
    payment_ref: varchar("payment_ref", { length: 100 }),
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  },
  (t) => [
    index("user_subs_user_id_idx").on(t.user_id),
    index("user_subs_status_idx").on(t.status),
    index("user_subs_expires_idx").on(t.expires_at),
    foreignKey({
      columns: [t.user_id],
      foreignColumns: [users.id],
      name: "fk_user_subs_user",
    }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({
      columns: [t.plan_id],
      foreignColumns: [plans.id],
      name: "fk_user_subs_plan",
    }).onDelete("restrict").onUpdate("cascade"),
  ],
);

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type NewUserSubscription = typeof userSubscriptions.$inferInsert;
