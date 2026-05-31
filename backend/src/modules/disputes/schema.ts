// src/modules/disputes/schema.ts
import { mysqlTable, char, text, varchar, datetime, decimal, index, uniqueIndex, foreignKey } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "../auth/schema";
import { bookings } from "../bookings/schema";
import { ilanlar } from "../ilanlar/schema";
import { ilanPurchases } from "../purchases/schema";

export const disputeStatuses = ["open", "under_review", "resolved", "closed"] as const;
export type DisputeStatus = (typeof disputeStatuses)[number];

export const disputes = mysqlTable(
  "disputes",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    booking_id: char("booking_id", { length: 36 }),
    ilan_id: char("ilan_id", { length: 36 }),
    purchase_id: char("purchase_id", { length: 36 }),
    opened_by: char("opened_by", { length: 36 }).notNull(),
    opened_against: char("opened_against", { length: 36 }),
    issue_type: varchar("issue_type", { length: 40 }).notNull().default("other"),
    declared_value: decimal("declared_value", { precision: 12, scale: 2 }),
    declared_value_currency: varchar("declared_value_currency", { length: 10 }).notNull().default("TRY"),
    reason: text("reason").notNull(),
    status: varchar("status", { length: 30 }).notNull().default("open").$type<DisputeStatus>(),
    resolution: text("resolution"),
    resolved_by: char("resolved_by", { length: 36 }),
    resolved_at: datetime("resolved_at", { fsp: 3 }),
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("uq_dispute_booking").on(t.booking_id),
    uniqueIndex("uq_dispute_purchase").on(t.purchase_id),
    index("idx_dispute_status").on(t.status),
    index("idx_dispute_ilan").on(t.ilan_id),
    foreignKey({ columns: [t.booking_id], foreignColumns: [bookings.id], name: "fk_dispute_booking" }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({ columns: [t.ilan_id], foreignColumns: [ilanlar.id], name: "fk_dispute_ilan" }).onDelete("set null").onUpdate("cascade"),
    foreignKey({ columns: [t.purchase_id], foreignColumns: [ilanPurchases.id], name: "fk_dispute_purchase" }).onDelete("set null").onUpdate("cascade"),
    foreignKey({ columns: [t.opened_by], foreignColumns: [users.id], name: "fk_dispute_opener" }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({ columns: [t.opened_against], foreignColumns: [users.id], name: "fk_dispute_opened_against" }).onDelete("set null").onUpdate("cascade"),
    foreignKey({ columns: [t.resolved_by], foreignColumns: [users.id], name: "fk_dispute_resolver" }).onDelete("set null").onUpdate("cascade"),
  ]
);

export type Dispute = typeof disputes.$inferSelect;
