import { db } from '@/db/client';
import { auditRequestLogs } from './schema';
import { users } from '@/modules/auth';
import { and, eq, gte, lte, sql, type SQL } from 'drizzle-orm';
import { excludeLocalhostCond } from './repository';
import { isTruthyBoolLike } from './validation';
import {dateRangeConds} from './analytics.repository.date-range-conds';
import {type AuditBoolLike,type StatusDistributionRow,type MethodDistributionRow,type HourlyRow} from './analytics.repository.shared';
export async function repoGetStatusDistribution(opts: {
  created_from?: string;
  created_to?: string;
  exclude_localhost?: AuditBoolLike;
}): Promise<StatusDistributionRow[]> {
  const conds = dateRangeConds(opts);
  const where = conds.length ? and(...conds) : undefined;

  const rows = await db
    .select({
      status_group: sql<string>`CASE
        WHEN ${auditRequestLogs.status_code} BETWEEN 200 AND 299 THEN '2xx'
        WHEN ${auditRequestLogs.status_code} BETWEEN 300 AND 399 THEN '3xx'
        WHEN ${auditRequestLogs.status_code} BETWEEN 400 AND 499 THEN '4xx'
        WHEN ${auditRequestLogs.status_code} >= 500 THEN '5xx'
        ELSE 'other'
      END`,
      count: sql<number>`COUNT(*)`,
    })
    .from(auditRequestLogs)
    .where(where)
    .groupBy(sql`CASE
      WHEN ${auditRequestLogs.status_code} BETWEEN 200 AND 299 THEN '2xx'
      WHEN ${auditRequestLogs.status_code} BETWEEN 300 AND 399 THEN '3xx'
      WHEN ${auditRequestLogs.status_code} BETWEEN 400 AND 499 THEN '4xx'
      WHEN ${auditRequestLogs.status_code} >= 500 THEN '5xx'
      ELSE 'other'
    END`)
    .orderBy(sql`1`);

  return rows.map((r) => ({
    status_group: String(r.status_group ?? 'other'),
    count: Number(r.count ?? 0),
  }));
}
export async function repoGetMethodDistribution(opts: {
  created_from?: string;
  created_to?: string;
  exclude_localhost?: AuditBoolLike;
}): Promise<MethodDistributionRow[]> {
  const conds = dateRangeConds(opts);
  const where = conds.length ? and(...conds) : undefined;

  const rows = await db
    .select({
      method: auditRequestLogs.method,
      count: sql<number>`COUNT(*)`,
    })
    .from(auditRequestLogs)
    .where(where)
    .groupBy(auditRequestLogs.method)
    .orderBy(sql`COUNT(*) DESC`);

  return rows.map((r) => ({
    method: String(r.method),
    count: Number(r.count ?? 0),
  }));
}
export async function repoGetHourlyBreakdown(opts: {
  created_from: string;
  created_to: string;
  exclude_localhost?: AuditBoolLike;
}): Promise<HourlyRow[]> {
  const conds = dateRangeConds(opts);
  const where = conds.length ? and(...conds) : undefined;

  const rows = await db
    .select({
      date: sql<string>`DATE(${auditRequestLogs.created_at})`,
      hour: sql<number>`HOUR(${auditRequestLogs.created_at})`,
      requests: sql<number>`COUNT(*)`,
      errors: sql<number>`SUM(CASE WHEN ${auditRequestLogs.status_code} >= 400 THEN 1 ELSE 0 END)`,
      avg_response_time: sql<number>`ROUND(AVG(${auditRequestLogs.response_time_ms}), 1)`,
    })
    .from(auditRequestLogs)
    .where(where)
    .groupBy(
      sql`DATE(${auditRequestLogs.created_at})`,
      sql`HOUR(${auditRequestLogs.created_at})`,
    )
    .orderBy(
      sql`DATE(${auditRequestLogs.created_at}) ASC`,
      sql`HOUR(${auditRequestLogs.created_at}) ASC`,
    );

  return rows.map((r) => ({
    date: String(r.date),
    hour: Number(r.hour ?? 0),
    requests: Number(r.requests ?? 0),
    errors: Number(r.errors ?? 0),
    avg_response_time: Number(r.avg_response_time ?? 0),
  }));
}