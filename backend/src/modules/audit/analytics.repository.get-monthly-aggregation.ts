import { db } from '@/db/client';
import { auditRequestLogs } from './schema';
import { users } from '@/modules/auth';
import { and, eq, gte, lte, sql, type SQL } from 'drizzle-orm';
import { excludeLocalhostCond } from './repository';
import { isTruthyBoolLike } from './validation';
import {type AuditBoolLike,type MonthlyRow} from './analytics.repository.shared';
export async function repoGetMonthlyAggregation(opts: {
  months?: number;
  exclude_localhost?: AuditBoolLike;
}): Promise<MonthlyRow[]> {
  const monthCount = Math.min(Math.max(opts.months ?? 12, 1), 24);
  const conds: SQL[] = [sql`${auditRequestLogs.created_at} >= DATE_SUB(CURDATE(), INTERVAL ${monthCount} MONTH)`];
  if (typeof opts.exclude_localhost !== 'undefined' && isTruthyBoolLike(opts.exclude_localhost)) {
    conds.push(excludeLocalhostCond(auditRequestLogs));
  }

  const rows = await db
    .select({
      month: sql<string>`DATE_FORMAT(${auditRequestLogs.created_at}, '%Y-%m')`,
      requests: sql<number>`COUNT(*)`,
      unique_ips: sql<number>`COUNT(DISTINCT ${auditRequestLogs.ip})`,
      errors: sql<number>`SUM(CASE WHEN ${auditRequestLogs.status_code} >= 400 THEN 1 ELSE 0 END)`,
      avg_response_time: sql<number>`ROUND(AVG(${auditRequestLogs.response_time_ms}), 1)`,
    })
    .from(auditRequestLogs)
    .where(and(...conds))
    .groupBy(sql`DATE_FORMAT(${auditRequestLogs.created_at}, '%Y-%m')`)
    .orderBy(sql`DATE_FORMAT(${auditRequestLogs.created_at}, '%Y-%m') ASC`);

  return rows.map((r) => ({
    month: String(r.month),
    requests: Number(r.requests ?? 0),
    unique_ips: Number(r.unique_ips ?? 0),
    errors: Number(r.errors ?? 0),
    avg_response_time: Number(r.avg_response_time ?? 0),
  }));
}