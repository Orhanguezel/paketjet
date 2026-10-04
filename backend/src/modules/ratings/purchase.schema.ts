import { mysqlTable, char, tinyint, varchar, datetime, uniqueIndex, index } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const purchaseRatings = mysqlTable('purchase_ratings', {
  id: char('id', { length: 36 }).primaryKey(),
  purchase_id: char('purchase_id', { length: 36 }).notNull(),
  reviewer_id: char('reviewer_id', { length: 36 }).notNull(),
  member_id: char('member_id', { length: 36 }).notNull(),
  score: tinyint('score').notNull(),
  comment: varchar('comment', { length: 500 }),
  created_at: datetime('created_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
}, t => [uniqueIndex('uq_purchase_reviewer').on(t.purchase_id, t.reviewer_id), index('idx_purchase_rating_member').on(t.member_id, t.created_at)]);
