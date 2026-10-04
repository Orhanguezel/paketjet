import { mysqlTable, char, varchar, datetime, uniqueIndex, index } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const purchaseTermsAcceptances = mysqlTable('purchase_terms_acceptances', {
  id: char('id', { length: 36 }).primaryKey(),
  user_id: char('user_id', { length: 36 }).notNull(),
  flow: varchar('flow', { length: 32 }).notNull(),
  reference_id: char('reference_id', { length: 36 }).notNull(),
  terms_version: varchar('terms_version', { length: 80 }).notNull(),
  accepted_at: datetime('accepted_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
}, t => [uniqueIndex('uq_terms_flow_reference').on(t.flow, t.reference_id), index('idx_terms_user').on(t.user_id)]);

export const purchaseCreditRemedies = mysqlTable('purchase_credit_remedies', {
  id: char('id', { length: 36 }).primaryKey(),
  purchase_id: char('purchase_id', { length: 36 }).notNull(),
  user_id: char('user_id', { length: 36 }).notNull(),
  actor_id: char('actor_id', { length: 36 }).notNull(),
  reason: varchar('reason', { length: 500 }).notNull(),
  created_at: datetime('created_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
}, t => [uniqueIndex('uq_credit_remedy_purchase').on(t.purchase_id)]);
