// src/modules/bookings/schema.ts
import {
  mysqlTable,
  char,
  varchar,
  text,
  decimal,
  datetime,
  index,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "../auth/schema";
import { ilanlar } from "../ilanlar/schema";

export const bookings = mysqlTable(
  "bookings",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    ilan_id: char("ilan_id", { length: 36 }).notNull(),
    customer_id: char("customer_id", { length: 36 }).notNull(),
    carrier_id: char("carrier_id", { length: 36 }).notNull(),

    // Yük bilgisi
    kg_amount: decimal("kg_amount", { precision: 10, scale: 2 }).notNull(),
    total_price: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("TRY"),

    // Adresler
    pickup_address: text("pickup_address"),
    delivery_address: text("delivery_address"),

    // Notlar
    customer_notes: text("customer_notes"),
    carrier_notes: text("carrier_notes"),

    // Durum
    status: varchar("status", { length: 50 }).notNull().default("pending"),
    // pending | confirmed | in_transit | delivered | cancelled | disputed

    // Ödeme
    payment_status: varchar("payment_status", { length: 50 }).notNull().default("unpaid"),
    // unpaid | pending | paid | refunded | awaiting_transfer | failed
    payment_method: varchar("payment_method", { length: 50 }),
    // wallet | card | transfer
    payment_ref: varchar("payment_ref", { length: 255 }),

    // Komisyon
    commission_rate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default("0.00"),
    commission_amount: decimal("commission_amount", { precision: 12, scale: 2 }).notNull().default("0.00"),

    // Zaman damgaları (iş akışı)
    confirmed_at: datetime("confirmed_at", { fsp: 3 }),
    delivered_at: datetime("delivered_at", { fsp: 3 }),
    cancelled_at: datetime("cancelled_at", { fsp: 3 }),

    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    index("bookings_ilan_id_idx").on(t.ilan_id),
    index("bookings_customer_id_idx").on(t.customer_id),
    index("bookings_carrier_id_idx").on(t.carrier_id),
    index("bookings_status_idx").on(t.status),
    foreignKey({ columns: [t.ilan_id], foreignColumns: [ilanlar.id], name: "fk_bookings_ilan" }).onDelete("restrict").onUpdate("cascade"),
    foreignKey({ columns: [t.customer_id], foreignColumns: [users.id], name: "fk_bookings_customer" }).onDelete("restrict").onUpdate("cascade"),
    foreignKey({ columns: [t.carrier_id], foreignColumns: [users.id], name: "fk_bookings_carrier" }).onDelete("restrict").onUpdate("cascade"),
  ]
);

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
