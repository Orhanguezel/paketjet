import { db } from '@/db/client';
import { auditRequestLogs } from './schema';
import { users } from '@/modules/auth';
import { and, eq, gte, lte, sql, type SQL } from 'drizzle-orm';
import { excludeLocalhostCond } from './repository';
import { isTruthyBoolLike } from './validation';
import {type AuditBoolLike,type AnalyticsDateRangeOpts,type TopEndpointRow,type SlowestEndpointRow,type TopUserRow,type TopIpRow} from './analytics.repository.shared';
export function dateRangeConds(opts: AnalyticsDateRangeOpts): SQL[] {
  const conds: SQL[] = [];
  if (opts.created_from?.trim()) {
    conds.push(gte(auditRequestLogs.created_at, sql`CAST(${opts.created_from.trim()} AS DATETIME(3))`));
  }
  if (opts.created_to?.trim()) {
    conds.push(lte(auditRequestLogs.created_at, sql`CAST(${opts.created_to.trim()} AS DATETIME(3))`));
  }
  if (typeof opts.exclude_localhost !== 'undefined' && isTruthyBoolLike(opts.exclude_localhost)) {
    conds.push(excludeLocalhostCond(auditRequestLogs));
  }
  return conds;
}
export async function repoGetTopEndpoints(opts: {
  created_from?: string;
  created_to?: string;
  exclude_localhost?: AuditBoolLike;
  limit?: number;
}): Promise<TopEndpointRow[]> {
  const conds = dateRangeConds(opts);
  const where = conds.length ? and(...conds) : undefined;
  const take = Math.min(opts.limit ?? 20, 100);

  const rows = await db
    .select({
      path: auditRequestLogs.path,
      request_count: sql<number>`COUNT(*)`,
      avg_response_time: sql<number>`ROUND(AVG(${auditRequestLogs.response_time_ms}), 1)`,
      error_rate: sql<number>`ROUND(SUM(CASE WHEN ${auditRequestLogs.status_code} >= 400 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2)`,
    })
    .from(auditRequestLogs)
    .where(where)
    .groupBy(auditRequestLogs.path)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(take);

  return rows.map((r) => ({
    path: String(r.path),
    request_count: Number(r.request_count ?? 0),
    avg_response_time: Number(r.avg_response_time ?? 0),
    error_rate: Number(r.error_rate ?? 0),
  }));
}
export async function repoGetSlowestEndpoints(opts: {
  created_from?: string;
  created_to?: string;
  exclude_localhost?: AuditBoolLike;
  limit?: number;
}): Promise<SlowestEndpointRow[]> {
  const conds = dateRangeConds(opts);
  const where = conds.length ? and(...conds) : undefined;
  const take = Math.min(opts.limit ?? 20, 100);

  const rows = await db
    .select({
      path: auditRequestLogs.path,
      avg_response_time: sql<number>`ROUND(AVG(${auditRequestLogs.response_time_ms}), 1)`,
      max_response_time: sql<number>`MAX(${auditRequestLogs.response_time_ms})`,
      request_count: sql<number>`COUNT(*)`,
    })
    .from(auditRequestLogs)
    .where(where)
    .groupBy(auditRequestLogs.path)
    .having(sql`COUNT(*) >= 5`)
    .orderBy(sql`AVG(${auditRequestLogs.response_time_ms}) DESC`)
    .limit(take);

  return rows.map((r) => ({
    path: String(r.path),
    avg_response_time: Number(r.avg_response_time ?? 0),
    max_response_time: Number(r.max_response_time ?? 0),
    request_count: Number(r.request_count ?? 0),
  }));
}
export async function repoGetTopUsers(opts: {
  created_from?: string;
  created_to?: string;
  exclude_localhost?: AuditBoolLike;
  limit?: number;
}): Promise<TopUserRow[]> {
  const conds: SQL[] = [sql`${auditRequestLogs.user_id} IS NOT NULL`];
  conds.push(...dateRangeConds(opts));
  const where = and(...conds);
  const take = Math.min(opts.limit ?? 20, 100);

  const rows = await db
    .select({
      user_id: auditRequestLogs.user_id,
      email: users.email,
      full_name: users.full_name,
      request_count: sql<number>`COUNT(*)`,
      last_seen: sql<string>`MAX(${auditRequestLogs.created_at})`,
    })
    .from(auditRequestLogs)
    .leftJoin(users, eq(auditRequestLogs.user_id, users.id))
    .where(where)
    .groupBy(auditRequestLogs.user_id, users.email, users.full_name)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(take);

  return rows.map((r) => ({
    user_id: String(r.user_id),
    email: r.email ?? null,
    full_name: r.full_name ?? null,
    request_count: Number(r.request_count ?? 0),
    last_seen: String(r.last_seen ?? ''),
  }));
}
export async function repoGetTopIps(opts: {
  created_from?: string;
  created_to?: string;
  exclude_localhost?: AuditBoolLike;
  limit?: number;
}): Promise<TopIpRow[]> {
  const conds = dateRangeConds(opts);
  const where = conds.length ? and(...conds) : undefined;
  const take = Math.min(opts.limit ?? 20, 100);

  const rows = await db
    .select({
      ip: auditRequestLogs.ip,
      country: sql<string>`MAX(${auditRequestLogs.country})`,
      request_count: sql<number>`COUNT(*)`,
      last_seen: sql<string>`MAX(${auditRequestLogs.created_at})`,
    })
    .from(auditRequestLogs)
    .where(where)
    .groupBy(auditRequestLogs.ip)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(take);

  return rows.map((r) => ({
    ip: String(r.ip),
    country: r.country ?? null,
    request_count: Number(r.request_count ?? 0),
    last_seen: String(r.last_seen ?? ''),
  }));
}