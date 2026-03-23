// src/modules/carrier-bank/schema.ts
import {
  mysqlTable,
  char,
  varchar,
  tinyint,
  datetime,
  foreignKey,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "../auth/schema";

export const carrierBankAccounts = mysqlTable(
  "carrier_bank_accounts",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    user_id: char("user_id", { length: 36 }).notNull(),
    iban: varchar("iban", { length: 34 }).notNull(),
    account_holder: varchar("account_holder", { length: 191 }).notNull(),
    bank_name: varchar("bank_name", { length: 100 }).notNull(),
    is_verified: tinyint("is_verified").notNull().default(0),
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("carrier_bank_user_unique").on(t.user_id),
    foreignKey({
      columns: [t.user_id],
      foreignColumns: [users.id],
      name: "fk_carrier_bank_user",
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

export type CarrierBankAccount = typeof carrierBankAccounts.$inferSelect;
export type NewCarrierBankAccount = typeof carrierBankAccounts.$inferInsert;
