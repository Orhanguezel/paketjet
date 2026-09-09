// All database DATETIME values represent UTC instants.
process.env.TZ = "UTC";
// src/db/client.ts
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { env } from '@/core/env';

if (env.NODE_ENV === 'test' && (!/^paketjet_test_/.test(env.DB.name) || !['127.0.0.1', 'localhost'].includes(env.DB.host))) {
  throw new Error('Tests require an isolated local paketjet_test_* database');
}

export const pool = mysql.createPool({
  host: env.DB.host,
  port: env.DB.port,
  user: env.DB.user,
  password: env.DB.password,
  database: env.DB.name,
  connectionLimit: 10,
  supportBigNumbers: true,
  dateStrings: true,
  timezone: "Z",
});

export const db = drizzle(pool);
