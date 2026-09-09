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

export async function repoExportRequestLogs(params: {
  conds: SQL[];
  limit: number;
}) {
  const whereCond = params.conds.length > 0
    ? and(...params.conds)
    : undefined;

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
      created_at: auditRequestLogs.created_at,
      user_email: users.email,
      user_full_name: users.full_name,
    })
    .from(auditRequestLogs)
    .leftJoin(users, eq(auditRequestLogs.user_id, users.id));

  const rowsQuery = whereCond ? baseQuery.where(whereCond as SQL) : baseQuery;
  return rowsQuery.orderBy(desc(auditRequestLogs.created_at)).limit(params.limit);
}
export async function repoExportAuthEvents(params: {
  conds: SQL[];
  limit: number;
}) {
  const whereCond = params.conds.length > 0
    ? and(...params.conds)
    : undefined;

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
  return rowsQuery.orderBy(desc(auditAuthEvents.created_at)).limit(params.limit);
}
export function safeJsonStringify(v: unknown) {
  try {
    return JSON.stringify(v ?? null);
  } catch {
    return JSON.stringify({ _error: 'meta_not_serializable' });
  }
}
export async function repoPersistAuditEvent(evt: {
  ts: string | number;
  level?: string;
  topic?: string;
  message?: string | null;
  actor_user_id?: string | null;
  ip?: string | null;
  entity?: { type?: string; id?: string | number } | null;
  meta?: unknown;
}) {
  const row: NewAuditEventRow = {
    ts: new Date(evt.ts),
    level: String(evt.level || 'info'),
    topic: String(evt.topic || 'app.event'),
    message: evt.message ?? null,
    actor_user_id: evt.actor_user_id ?? null,
    ip: evt.ip ?? null,
    entity_type: evt.entity?.type ?? null,
    entity_id: evt.entity?.id != null ? String(evt.entity.id) : null,
    meta_json: evt.meta ? safeJsonStringify(evt.meta) : null,
  };
  await db.insert(auditEvents).values(row);
}
export async function repoDeleteOldRequestLogs(retentionDays: number) {
  await db.execute(
    sql`DELETE FROM audit_request_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ${retentionDays} DAY)`,
  );
}
export async function repoDeleteOldAuthEvents(retentionDays: number) {
  await db.execute(
    sql`DELETE FROM audit_auth_events WHERE created_at < DATE_SUB(NOW(), INTERVAL ${retentionDays} DAY)`,
  );
}
export async function repoDeleteOldAuditEvents(retentionDays: number) {
  await db.execute(
    sql`DELETE FROM audit_events WHERE ts < DATE_SUB(NOW(), INTERVAL ${retentionDays} DAY)`,
  );
}
export async function repoInsertRequestLog(data: {
  req_id: string;
  method: string;
  url: string;
  path: string;
  status_code: number;
  response_time_ms: number;
  ip: string;
  user_agent: string | null;
  referer: string | null;
  user_id: string | null;
  is_admin: number;
  country: string | null;
  city: string | null;
  error_message: string | null;
  error_code: string | null;
  request_body: string | null;
}) {
  const row: NewAuditRequestLogRow = {
    ...data,
    created_at: new Date(),
  };
  await db.insert(auditRequestLogs).values(row);
}