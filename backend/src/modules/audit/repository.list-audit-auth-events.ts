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
import {parseDateTime3,excludeLocalhostCond} from './repository.parse-date-time3';
import {type AuditAuthEventEnriched,type AuditGeoStatsRow,type AuditGeoStatsQuery} from './repository.shared';
export async function repoListAuditAuthEvents(
  q: AuditAuthEventsListQuery,
): Promise<{ items: AuditAuthEventEnriched[]; total: number }> {
  const conds: (SQL | undefined)[] = [];

  if (q.event) conds.push(eq(auditAuthEvents.event, q.event));
  if (q.user_id) conds.push(eq(auditAuthEvents.user_id, q.user_id));
  if (q.email) conds.push(eq(auditAuthEvents.email, q.email));
  if (q.ip) conds.push(eq(auditAuthEvents.ip, q.ip));

  if (typeof q.exclude_localhost !== 'undefined' && isTruthyBoolLike(q.exclude_localhost)) {
    conds.push(excludeLocalhostCond(auditAuthEvents));
  }

  if (q.created_from && q.created_from.trim()) {
    conds.push(gte(auditAuthEvents.created_at, parseDateTime3(q.created_from.trim())));
  }
  if (q.created_to && q.created_to.trim()) {
    conds.push(lte(auditAuthEvents.created_at, parseDateTime3(q.created_to.trim())));
  }

  const whereCond =
    conds.length > 0 ? (and(...(conds.filter(Boolean) as SQL[])) as SQL) : undefined;

  const take = q.limit ?? 50;
  const skip = q.offset ?? 0;

  const dir = q.orderDir ?? 'desc';
  const orderExpr: SQL =
    dir === 'asc' ? asc(auditAuthEvents.created_at) : desc(auditAuthEvents.created_at);

  const baseQuery = db
    .select({
      id: auditAuthEvents.id,
      event: auditAuthEvents.event,
      user_id: auditAuthEvents.user_id,
      email: auditAuthEvents.email,
      ip: auditAuthEvents.ip,
      user_agent: auditAuthEvents.user_agent,
      country: auditAuthEvents.country,
      city: auditAuthEvents.city,
      created_at: auditAuthEvents.created_at,
      user_full_name: users.full_name,
    })
    .from(auditAuthEvents)
    .leftJoin(users, eq(auditAuthEvents.user_id, users.id));

  const rowsQuery = whereCond ? baseQuery.where(whereCond as SQL) : baseQuery;

  const items = await rowsQuery
    .orderBy(orderExpr, desc(auditAuthEvents.id))
    .limit(take)
    .offset(skip);

  const countBase = db.select({ c: sql<number>`COUNT(*)` }).from(auditAuthEvents);
  const countQuery = whereCond ? countBase.where(whereCond as SQL) : countBase;

  const cnt = await countQuery;
  const total = Number(cnt[0]?.c ?? 0);

  return {
    items: items.map((r) => ({
      ...r,
      user_full_name: r.user_full_name ?? null,
    })) as AuditAuthEventEnriched[],
    total,
  };
}
export async function repoGetAuditGeoStats(
  q: AuditGeoStatsQuery,
): Promise<AuditGeoStatsRow[]> {
  const days = Math.max(1, Math.min(90, Number(q.days ?? 30)));
  const startExpr = sql`DATE_SUB(UTC_DATE(), INTERVAL ${days - 1} DAY)`;

  const useAuth = q.source === 'auth';
  const table = useAuth ? auditAuthEvents : auditRequestLogs;

  const conds: (SQL | undefined)[] = [];
  conds.push(sql`DATE(${table.created_at}) >= ${startExpr}`);
  conds.push(sql`${table.country} IS NOT NULL AND ${table.country} != ''`);

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
      count: sql<number>`COUNT(*)`,
      unique_ips: sql<number>`COUNT(DISTINCT ${table.ip})`,
    })
    .from(table)
    .where(whereCond)
    .groupBy(table.country)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(200);

  return rows.map((r) => ({
    country: String(r.country ?? ''),
    count: Number(r.count ?? 0),
    unique_ips: Number(r.unique_ips ?? 0),
  }));
}