import { mysqlTable, char, varchar, text, datetime, index } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
export const paymentEvents = mysqlTable('payment_events', {
  id: char('id', {length:36}).primaryKey(),
  payment_ref: varchar('payment_ref', {length:255}).notNull(),
  actor_id: varchar('actor_id', {length:64}).notNull(),
  event: varchar('event', {length:48}).notNull(),
  note: text('note'),
  created_at: datetime('created_at', {fsp:3}).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
}, t => [index('payment_events_ref').on(t.payment_ref)]);
export const creditAdjustments = mysqlTable('credit_adjustments', {
  id: char('id', {length:36}).primaryKey(),
  user_id: char('user_id', {length:36}).notNull(),
  actor_id: char('actor_id', {length:36}).notNull(),
  reason: text('reason').notNull(),
  created_at: datetime('created_at', {fsp:3}).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
});
