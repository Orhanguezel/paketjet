// src/modules/partner-api/schema.ts
import { mysqlTable, char, varchar, datetime, uniqueIndex, index } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const apiKeys = mysqlTable('api_keys', {
  id: char('id', { length: 36 }).primaryKey().notNull(),
  user_id: char('user_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  prefix: varchar('prefix', { length: 24 }).notNull(),
  key_hash: char('key_hash', { length: 64 }).notNull(),
  last_used_at: datetime('last_used_at', { fsp: 3 }),
  last_used_ip: varchar('last_used_ip', { length: 64 }),
  revoked_at: datetime('revoked_at', { fsp: 3 }),
  created_at: datetime('created_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
}, (t) => [uniqueIndex('uq_api_keys_hash').on(t.key_hash), index('idx_api_keys_user').on(t.user_id)]);

export type ApiKeyRow = typeof apiKeys.$inferSelect;
