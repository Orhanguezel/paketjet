// src/modules/purchases/schema.ts
// Lead-reveal satın alma + İlan Alma Hakkı (kontör). DB: 041_lead_purchases_schema.sql
import {
  mysqlTable,
  char,
  varchar,
  decimal,
  int,
  tinyint,
  json,
  datetime,
  uniqueIndex,
  index,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "../auth/schema";
import { ilanlar } from "../ilanlar/schema";

export interface ContactSnapshot {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface PurchaseDeclaration {
  estimated_value: number;
  estimated_value_currency?: string;
  content_declared: true;
}

/** ilan_purchases — lead-reveal satın alma (UNIQUE(ilan_id) → tek alıcı) */
export const ilanPurchases = mysqlTable(
  "ilan_purchases",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    ilan_id: char("ilan_id", { length: 36 }).notNull(),
    buyer_id: char("buyer_id", { length: 36 }).notNull(),
    seller_id: char("seller_id", { length: 36 }).notNull(),

    price_paid: decimal("price_paid", { precision: 12, scale: 2 }).notNull().default("0.00"),
    pay_method: varchar("pay_method", { length: 20 }).notNull().default("credit"), // credit | card
    credit_used: tinyint("credit_used").notNull().default(0),
    payment_ref: varchar("payment_ref", { length: 255 }),

    estimated_value_snapshot: decimal("estimated_value_snapshot", { precision: 12, scale: 2 }),
    estimated_value_currency: varchar("estimated_value_currency", { length: 10 }).notNull().default("TRY"),
    content_declared: tinyint("content_declared").notNull().default(0),
    content_declared_at: datetime("content_declared_at", { fsp: 3 }),
    content_declared_ip: varchar("content_declared_ip", { length: 64 }),
    contact_snapshot: json("contact_snapshot").$type<ContactSnapshot | null>().default(null),

    status: varchar("status", { length: 20 }).notNull().default("completed"), // completed | refunded
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("uniq_ilan_purchase").on(t.ilan_id),
    index("ilan_purchases_buyer_idx").on(t.buyer_id),
    index("ilan_purchases_seller_idx").on(t.seller_id),
    foreignKey({ columns: [t.ilan_id], foreignColumns: [ilanlar.id], name: "fk_ilanpur_ilan" }).onDelete("restrict").onUpdate("cascade"),
    foreignKey({ columns: [t.buyer_id], foreignColumns: [users.id], name: "fk_ilanpur_buyer" }).onDelete("restrict").onUpdate("cascade"),
    foreignKey({ columns: [t.seller_id], foreignColumns: [users.id], name: "fk_ilanpur_seller" }).onDelete("restrict").onUpdate("cascade"),
  ]
);

/** user_credits — İlan Alma Hakkı bakiyesi (adet) */
export const userCredits = mysqlTable(
  "user_credits",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    user_id: char("user_id", { length: 36 }).notNull(),
    balance: int("balance").notNull().default(0),
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("uniq_user_credits").on(t.user_id),
    foreignKey({ columns: [t.user_id], foreignColumns: [users.id], name: "fk_user_credits_user" }).onDelete("cascade").onUpdate("cascade"),
  ]
);

/** credit_ledger — hak hareketleri */
export const creditLedger = mysqlTable(
  "credit_ledger",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    user_id: char("user_id", { length: 36 }).notNull(),
    delta: int("delta").notNull(),
    reason: varchar("reason", { length: 40 }).notNull(), // package_purchase | reveal_spend | admin_grant | refund
    ref_id: char("ref_id", { length: 36 }),
    balance_after: int("balance_after").notNull(),
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  },
  (t) => [
    index("credit_ledger_user_idx").on(t.user_id),
    foreignKey({ columns: [t.user_id], foreignColumns: [users.id], name: "fk_credit_ledger_user" }).onDelete("cascade").onUpdate("cascade"),
  ]
);

/** credit_package_purchases — hak paketi ödeme kayıtları */
export const creditPackagePurchases = mysqlTable(
  "credit_package_purchases",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    user_id: char("user_id", { length: 36 }).notNull(),
    package_key: varchar("package_key", { length: 80 }).notNull(),
    credits: int("credits").notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    provider: varchar("provider", { length: 20 }).notNull(),
    payment_ref: varchar("payment_ref", { length: 255 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("uniq_credit_package_payment_ref").on(t.payment_ref),
    index("credit_package_purchases_user_idx").on(t.user_id),
    foreignKey({ columns: [t.user_id], foreignColumns: [users.id], name: "fk_credit_pkg_user" }).onDelete("cascade").onUpdate("cascade"),
  ]
);

/** ilan_purchase_payments — tekil iletişim erişimi ödeme kayıtları */
export const ilanPurchasePayments = mysqlTable(
  "ilan_purchase_payments",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    ilan_id: char("ilan_id", { length: 36 }).notNull(),
    buyer_id: char("buyer_id", { length: 36 }).notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    provider: varchar("provider", { length: 20 }).notNull(),
    payment_ref: varchar("payment_ref", { length: 255 }).notNull(),
    estimated_value_snapshot: decimal("estimated_value_snapshot", { precision: 12, scale: 2 }),
    estimated_value_currency: varchar("estimated_value_currency", { length: 10 }).notNull().default("TRY"),
    content_declared: tinyint("content_declared").notNull().default(0),
    content_declared_at: datetime("content_declared_at", { fsp: 3 }),
    content_declared_ip: varchar("content_declared_ip", { length: 64 }),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("uniq_ilan_payment_ref").on(t.payment_ref),
    index("ilan_purchase_payments_ilan_idx").on(t.ilan_id),
    index("ilan_purchase_payments_buyer_idx").on(t.buyer_id),
    foreignKey({ columns: [t.ilan_id], foreignColumns: [ilanlar.id], name: "fk_ilanpay_ilan" }).onDelete("restrict").onUpdate("cascade"),
    foreignKey({ columns: [t.buyer_id], foreignColumns: [users.id], name: "fk_ilanpay_buyer" }).onDelete("restrict").onUpdate("cascade"),
  ]
);

export type IlanPurchase = typeof ilanPurchases.$inferSelect;
export type NewIlanPurchase = typeof ilanPurchases.$inferInsert;
export type UserCredit = typeof userCredits.$inferSelect;
export type CreditLedger = typeof creditLedger.$inferSelect;
export type CreditPackagePurchase = typeof creditPackagePurchases.$inferSelect;
export type IlanPurchasePayment = typeof ilanPurchasePayments.$inferSelect;
