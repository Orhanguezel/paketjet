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
import {type AuditIpTable,type AuditRequestLogEnriched} from './repository.shared';
export function parseDateTime3(s: string) {
  return sql`CAST(${s} AS DATETIME(3))`;
}
export function excludeLocalhostCond(table: AuditIpTable): SQL {
  return sql`${table.ip} NOT IN ('127.0.0.1', '::1', '::ffff:127.0.0.1')`;
}
export async function repoListAuditRequestLogs(
  q: AuditRequestLogsListQuery,
): Promise<{ items: AuditRequestLogEnriched[]; total: number }> {
  const conds: (SQL | undefined)[] = [];

  if (q.q && q.q.trim()) {
    const s = `%${q.q.trim()}%`;
    conds.push(or(like(auditRequestLogs.path, s), like(auditRequestLogs.url, s)));
  }

  if (q.method && q.method.trim()) {
    conds.push(eq(auditRequestLogs.method, q.method.trim().toUpperCase()));
  }

  if (typeof q.status_code === 'number') {
    conds.push(eq(auditRequestLogs.status_code, q.status_code));
  }

  if (q.user_id) conds.push(eq(auditRequestLogs.user_id, q.user_id));
  if (q.ip) conds.push(eq(auditRequestLogs.ip, q.ip));

  if (typeof q.only_admin !== 'undefined' && isTruthyBoolLike(q.only_admin)) {
    conds.push(eq(auditRequestLogs.is_admin, 1));
  }

  if (typeof q.exclude_localhost !== 'undefined' && isTruthyBoolLike(q.exclude_localhost)) {
    conds.push(excludeLocalhostCond(auditRequestLogs));
  }

  if (q.created_from && q.created_from.trim()) {
    conds.push(gte(auditRequestLogs.created_at, parseDateTime3(q.created_from.trim())));
  }
  if (q.created_to && q.created_to.trim()) {
    conds.push(lte(auditRequestLogs.created_at, parseDateTime3(q.created_to.trim())));
  }

  const whereCond =
    conds.length > 0 ? (and(...(conds.filter(Boolean) as SQL[])) as SQL) : undefined;

  const take = q.limit ?? 50;
  const skip = q.offset ?? 0;

  const sort = q.sort ?? 'created_at';
  const dir = q.orderDir ?? 'desc';

  const orderExpr: SQL =
    sort === 'response_time_ms'
      ? dir === 'asc'
        ? asc(auditRequestLogs.response_time_ms)
        : desc(auditRequestLogs.response_time_ms)
      : sort === 'status_code'
      ? dir === 'asc'
        ? asc(auditRequestLogs.status_code)
        : desc(auditRequestLogs.status_code)
      : dir === 'asc'
      ? asc(auditRequestLogs.created_at)
      : desc(auditRequestLogs.created_at);

  const baseQuery = db
    .select({
      id: auditRequestLogs.id,
      req_id: auditRequestLogs.req_id,
      method: auditRequestLogs.method,
      url: auditRequestLogs.url,
      path: auditRequestLogs.path,
      status_code: auditRequestLogs.status_code,
      response_time_ms: auditRequestLogs.response_time_ms,
      ip: auditRequestLogs.ip,
      user_agent: auditRequestLogs.user_agent,
      referer: auditRequestLogs.referer,
      user_id: auditRequestLogs.user_id,
      is_admin: auditRequestLogs.is_admin,
      country: auditRequestLogs.country,
      city: auditRequestLogs.city,
      error_message: auditRequestLogs.error_message,
      error_code: auditRequestLogs.error_code,
      request_body: auditRequestLogs.request_body,
      created_at: auditRequestLogs.created_at,
      user_email: users.email,
      user_full_name: users.full_name,
    })
    .from(auditRequestLogs)
    .leftJoin(users, eq(auditRequestLogs.user_id, users.id));

  const rowsQuery = whereCond ? baseQuery.where(whereCond as SQL) : baseQuery;

  const items = await rowsQuery
    .orderBy(orderExpr, desc(auditRequestLogs.id))
    .limit(take)
    .offset(skip);

  const countBase = db.select({ c: sql<number>`COUNT(*)` }).from(auditRequestLogs);
  const countQuery = whereCond ? countBase.where(whereCond as SQL) : countBase;

  const cnt = await countQuery;
  const total = Number(cnt[0]?.c ?? 0);

  return {
    items: items.map((r) => ({
      ...r,
      user_email: r.user_email ?? null,
      user_full_name: r.user_full_name ?? null,
    })) as AuditRequestLogEnriched[],
    total,
  };
}