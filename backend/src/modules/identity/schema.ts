// src/modules/identity/schema.ts
import { mysqlTable, char, varchar, int, mysqlEnum, datetime } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const identityDocuments = mysqlTable('identity_documents', {
  id: char('id', { length: 36 }).primaryKey().notNull(),
  user_id: char('user_id', { length: 36 }).notNull(),
  side: varchar('side', { length: 16 }).notNull().default('front'),
  file_path: varchar('file_path', { length: 255 }).notNull(),
  mime: varchar('mime', { length: 64 }).notNull(),
  size: int('size', { unsigned: true }).notNull(),
  status: mysqlEnum('status', ['pending', 'approved', 'rejected']).notNull().default('pending'),
  reject_reason: varchar('reject_reason', { length: 255 }),
  reviewed_by: char('reviewed_by', { length: 36 }),
  reviewed_at: datetime('reviewed_at', { fsp: 3 }),
  created_at: datetime('created_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at: datetime('updated_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
});

export type IdentityDocumentRow = typeof identityDocuments.$inferSelect;
export type IdentityStatus = IdentityDocumentRow['status'];
