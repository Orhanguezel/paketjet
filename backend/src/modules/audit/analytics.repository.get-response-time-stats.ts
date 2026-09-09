import { db } from '@/db/client';
import { auditRequestLogs } from './schema';
import { users } from '@/modules/auth';
import { and, eq, gte, lte, sql, type SQL } from 'drizzle-orm';
import { excludeLocalhostCond } from './repository';
import { isTruthyBoolLike } from './validation';
import {dateRangeConds} from './analytics.repository.date-range-conds';
import {type AuditBoolLike,type ResponseTimeStatsResult,type AuditSummary} from './analytics.repository.shared';
export async function repoGetResponseTimeStats(opts: {
  created_from?: string;
  created_to?: string;
  exclude_localhost?: AuditBoolLike;
  path?: string;
}): Promise<ResponseTimeStatsResult> {
  const conds = dateRangeConds(opts);
  if (opts.path?.trim()) {
    conds.push(eq(auditRequestLogs.path, opts.path.trim()));
  }
  const where = conds.length ? and(...conds) : undefined;

  const [statsRow] = await db
    .select({
      avg: sql<number>`ROUND(AVG(${auditRequestLogs.response_time_ms}), 1)`,
      min: sql<number>`MIN(${auditRequestLogs.response_time_ms})`,
      max: sql<number>`MAX(${auditRequestLogs.response_time_ms})`,
      total: sql<number>`COUNT(*)`,
    })
    .from(auditRequestLogs)
    .where(where);

  const total = Number(statsRow?.total ?? 0);
  if (total === 0) {
    return { p50: 0, p95: 0, p99: 0, avg: 0, min: 0, max: 0, total_requests: 0 };
  }

  const p50Offset = Math.max(0, Math.floor(total * 0.5) - 1);
  const p95Offset = Math.max(0, Math.floor(total * 0.95) - 1);
  const p99Offset = Math.max(0, Math.floor(total * 0.99) - 1);

  const [r50] = await db
    .select({ v: auditRequestLogs.response_time_ms })
    .from(auditRequestLogs)
    .where(where)
    .orderBy(sql`${auditRequestLogs.response_time_ms} ASC`)
    .limit(1)
    .offset(p50Offset);

  const [r95] = await db
    .select({ v: auditRequestLogs.response_time_ms })
    .from(auditRequestLogs)
    .where(where)
    .orderBy(sql`${auditRequestLogs.response_time_ms} ASC`)
    .limit(1)
    .offset(p95Offset);

  const [r99] = await db
    .select({ v: auditRequestLogs.response_time_ms })
    .from(auditRequestLogs)
    .where(where)
    .orderBy(sql`${auditRequestLogs.response_time_ms} ASC`)
    .limit(1)
    .offset(p99Offset);

  return {
    p50: Number(r50?.v ?? 0),
    p95: Number(r95?.v ?? 0),
    p99: Number(r99?.v ?? 0),
    avg: Number(statsRow?.avg ?? 0),
    min: Number(statsRow?.min ?? 0),
    max: Number(statsRow?.max ?? 0),
    total_requests: total,
  };
}
export async function repoGetAuditSummary(opts?: { exclude_localhost?: AuditBoolLike }): Promise<AuditSummary> {
  const baseConds: SQL[] = [sql`DATE(${auditRequestLogs.created_at}) = CURDATE()`];
  if (opts?.exclude_localhost && isTruthyBoolLike(opts.exclude_localhost)) {
    baseConds.push(excludeLocalhostCond(auditRequestLogs));
  }
  const todayCond = and(...baseConds)!;

  const [totals] = await db
    .select({
      requests: sql<number>`COUNT(*)`,
      errors: sql<number>`SUM(CASE WHEN ${auditRequestLogs.status_code} >= 400 THEN 1 ELSE 0 END)`,
      avg_response_time: sql<number>`ROUND(AVG(${auditRequestLogs.response_time_ms}), 1)`,
      unique_ips: sql<number>`COUNT(DISTINCT ${auditRequestLogs.ip})`,
      unique_users: sql<number>`COUNT(DISTINCT ${auditRequestLogs.user_id})`,
    })
    .from(auditRequestLogs)
    .where(todayCond);

  const requests = Number(totals?.requests ?? 0);
  const errors = Number(totals?.errors ?? 0);

  const [topErr] = await db
    .select({
      path: auditRequestLogs.path,
      count: sql<number>`COUNT(*)`,
    })
    .from(auditRequestLogs)
    .where(and(todayCond, sql`${auditRequestLogs.status_code} >= 400`))
    .groupBy(auditRequestLogs.path)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(1);

  const [slowest] = await db
    .select({
      path: auditRequestLogs.path,
      avg_ms: sql<number>`ROUND(AVG(${auditRequestLogs.response_time_ms}), 1)`,
    })
    .from(auditRequestLogs)
    .where(todayCond)
    .groupBy(auditRequestLogs.path)
    .having(sql`COUNT(*) >= 3`)
    .orderBy(sql`AVG(${auditRequestLogs.response_time_ms}) DESC`)
    .limit(1);

  return {
    today_requests: requests,
    today_errors: errors,
    today_error_rate: requests > 0 ? Math.round((errors / requests) * 10000) / 100 : 0,
    today_avg_response_time: Number(totals?.avg_response_time ?? 0),
    today_unique_ips: Number(totals?.unique_ips ?? 0),
    today_unique_users: Number(totals?.unique_users ?? 0),
    top_error_endpoint: topErr ? { path: String(topErr.path), count: Number(topErr.count) } : null,
    slowest_endpoint: slowest ? { path: String(slowest.path), avg_ms: Number(slowest.avg_ms) } : null,
  };
}