import { db } from '@/db/client';
import { and, asc, desc, eq, like, or, sql, type SQL, gte, lte } from 'drizzle-orm';
import {
  auditRequestLogs,
  auditAuthEvents,
  type AuditRequestLogRow,
  type AuditAuthEventRow,
  type NewAuditRequestLogRow,
} from './schema';
import { auditEvents, type NewAuditEventRow } from './audit_events.schema';
import { users } from '@/modules/auth';
import type {
  AuditRequestLogsListQuery,
  AuditAuthEventsListQuery,
  AuditMetricsDailyQuery,
} from './validation';
import { isTruthyBoolLike } from './validation';
import {excludeLocalhostCond} from './repository.parse-date-time3';
import {type AuditGeoStatsQuery,type AuditGeoCityRow,type ClearAuditTarget,type AuditMetricsDailyRow} from './repository.shared';
export async function repoGetAuditGeoCities(
  q: AuditGeoStatsQuery,
): Promise<AuditGeoCityRow[]> {
  const days = Math.max(1, Math.min(90, Number(q.days ?? 30)));
  const startExpr = sql`DATE_SUB(UTC_DATE(), INTERVAL ${days - 1} DAY)`;

  const useAuth = q.source === 'auth';
  const table = useAuth ? auditAuthEvents : auditRequestLogs;

  const conds: (SQL | undefined)[] = [];
  conds.push(sql`DATE(${table.created_at}) >= ${startExpr}`);
  conds.push(sql`${table.city} IS NOT NULL AND ${table.city} != ''`);

  if (!useAuth && typeof q.only_admin !== 'undefined' && isTruthyBoolLike(q.only_admin)) {
    conds.push(eq(auditRequestLogs.is_admin, 1));
  }

  if (typeof q.exclude_localhost !== 'undefined' && isTruthyBoolLike(q.exclude_localhost)) {
    conds.push(excludeLocalhostCond(table));
  }

  const whereCond = and(...(conds.filter(Boolean) as SQL[]));

  const rows = await db
    .select({
      country: table.country,
      city: table.city,
      hits: sql<number>`COUNT(*)`,
      unique_ips: sql<number>`COUNT(DISTINCT ${table.ip})`,
    })
    .from(table)
    .where(whereCond)
    .groupBy(table.country, table.city)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(500);

  return rows.map((r) => ({
    country: String(r.country ?? ''),
    city: String(r.city ?? ''),
    hits: Number(r.hits ?? 0),
    unique_ips: Number(r.unique_ips ?? 0),
  }));
}
export async function repoClearAuditLogs(
  target: ClearAuditTarget = 'all',
): Promise<{ deletedRequests: number; deletedAuth: number }> {
  let deletedRequests = 0;
  let deletedAuth = 0;

  if (target === 'requests' || target === 'all') {
    const countRes = await db.select({ c: sql<number>`COUNT(*)` }).from(auditRequestLogs);
    deletedRequests = Number(countRes[0]?.c ?? 0);
    await db.execute(sql`TRUNCATE TABLE audit_request_logs`);
  }

  if (target === 'auth' || target === 'all') {
    const countRes = await db.select({ c: sql<number>`COUNT(*)` }).from(auditAuthEvents);
    deletedAuth = Number(countRes[0]?.c ?? 0);
    await db.execute(sql`TRUNCATE TABLE audit_auth_events`);
  }

  return { deletedRequests, deletedAuth };
}
export async function repoGetAuditMetricsDaily(
  q: AuditMetricsDailyQuery,
): Promise<{ days: AuditMetricsDailyRow[] }> {
  const conds: (SQL | undefined)[] = [];

  const days = Math.max(1, Math.min(90, Number(q.days ?? 14)));
  const startExpr = sql`DATE_SUB(UTC_DATE(), INTERVAL ${days - 1} DAY)`;

  conds.push(sql`DATE(${auditRequestLogs.created_at}) >= ${startExpr}`);

  if (typeof q.only_admin !== 'undefined' && isTruthyBoolLike(q.only_admin)) {
    conds.push(eq(auditRequestLogs.is_admin, 1));
  }

  if (typeof q.exclude_localhost !== 'undefined' && isTruthyBoolLike(q.exclude_localhost)) {
    conds.push(excludeLocalhostCond(auditRequestLogs));
  }

  if (q.path_prefix && q.path_prefix.trim()) {
    conds.push(like(auditRequestLogs.path, `${q.path_prefix.trim()}%`));
  }

  const whereCond = and(...(conds.filter(Boolean) as SQL[]));

  const rows = await db
    .select({
      date: sql<string>`DATE(${auditRequestLogs.created_at})`,
      requests: sql<number>`COUNT(*)`,
      unique_ips: sql<number>`COUNT(DISTINCT ${auditRequestLogs.ip})`,
      errors: sql<number>`SUM(CASE WHEN ${auditRequestLogs.status_code} >= 400 THEN 1 ELSE 0 END)`,
    })
    .from(auditRequestLogs)
    .where(whereCond)
    .groupBy(sql`DATE(${auditRequestLogs.created_at})`)
    .orderBy(sql`DATE(${auditRequestLogs.created_at}) ASC`);

  const daysOut: AuditMetricsDailyRow[] = rows.map((r) => ({
    date: String(r.date),
    requests: Number(r.requests ?? 0),
    unique_ips: Number(r.unique_ips ?? 0),
    errors: Number(r.errors ?? 0),
  }));

  return { days: daysOut };
}