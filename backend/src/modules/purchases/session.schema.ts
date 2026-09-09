import { mysqlTable, varchar, char, datetime, decimal, json, index, uniqueIndex } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const paymentSessions = mysqlTable('payment_sessions', {
  payment_ref: varchar('payment_ref', { length: 255 }).primaryKey(),
  user_id: char('user_id', { length: 36 }).notNull(),
  ilan_id: char('ilan_id', { length: 36 }),
  kind: varchar('kind', { length: 16 }).notNull(),
  provider: varchar('provider', { length: 20 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  token_hash: char('token_hash', { length: 64 }),
  provider_payment_id: varchar('provider_payment_id', { length: 255 }),
  receipt: json('receipt').$type<{ paymentId?: string; transactionIds?: string[] }>(),
  state: varchar('state', { length: 24 }).notNull().default('initializing'),
  error_code: varchar('error_code', { length: 100 }),
  expires_at: datetime('expires_at', { fsp: 3 }).notNull(),
  created_at: datetime('created_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: datetime('updated_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
}, t => [index('payment_session_listing').on(t.ilan_id), index('payment_session_user').on(t.user_id), uniqueIndex('payment_session_token').on(t.token_hash), uniqueIndex('payment_session_provider_receipt').on(t.provider, t.provider_payment_id)]);
export type PaymentSession = typeof paymentSessions.$inferSelect;
