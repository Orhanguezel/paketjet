// src/modules/carrier-agreements/schema.ts
import {
  mysqlTable,
  char,
  varchar,
  text,
  decimal,
  datetime,
  index,
  uniqueIndex,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "../auth/schema";
import { plans } from "../subscription/schema";

export const carrierAgreements = mysqlTable(
  "carrier_agreements",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    user_id: char("user_id", { length: 36 }).notNull(),

    agreement_type: varchar("agreement_type", { length: 30 }).notNull().default("commission"),
    // 'commission' | 'subscription'

    commission_rate: decimal("commission_rate", { precision: 5, scale: 2 }),
    // Taşıyıcıya özel oran; NULL ise plan veya platform default

    plan_id: char("plan_id", { length: 36 }),
    // subscription tipinde hangi plan

    status: varchar("status", { length: 30 }).notNull().default("active"),
    // active | suspended | expired

    starts_at: datetime("starts_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    expires_at: datetime("expires_at", { fsp: 3 }),

    admin_note: text("admin_note"),

    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("uq_carrier_agreement_user").on(t.user_id),
    index("idx_ca_status").on(t.status),
    index("idx_ca_type").on(t.agreement_type),
    foreignKey({ columns: [t.user_id], foreignColumns: [users.id], name: "fk_ca_user" }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({ columns: [t.plan_id], foreignColumns: [plans.id], name: "fk_ca_plan" }).onDelete("set null").onUpdate("cascade"),
  ],
);

export type CarrierAgreement = typeof carrierAgreements.$inferSelect;
export type NewCarrierAgreement = typeof carrierAgreements.$inferInsert;
