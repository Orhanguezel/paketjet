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
import {type ExportRequestLogQuery,type ExportAuthEventQuery} from './repository.shared';
export function buildRequestLogExportConds(q: ExportRequestLogQuery): SQL[] {
  const conds: SQL[] = [];

  if (q.q?.trim()) {
    const s = `%${q.q.trim()}%`;
    const c = or(like(auditRequestLogs.path, s), like(auditRequestLogs.url, s));
    if (c) conds.push(c);
  }
  if (q.method?.trim()) conds.push(eq(auditRequestLogs.method, q.method.trim().toUpperCase()));
  if (typeof q.status_code === 'number') conds.push(eq(auditRequestLogs.status_code, q.status_code));
  if (q.user_id) conds.push(eq(auditRequestLogs.user_id, q.user_id));
  if (q.ip) conds.push(eq(auditRequestLogs.ip, q.ip));
  if (typeof q.only_admin !== 'undefined' && isTruthyBoolLike(q.only_admin)) {
    conds.push(eq(auditRequestLogs.is_admin, 1));
  }
  if (typeof q.exclude_localhost !== 'undefined' && isTruthyBoolLike(q.exclude_localhost)) {
    conds.push(excludeLocalhostCond(auditRequestLogs));
  }
  if (q.created_from?.trim()) conds.push(gte(auditRequestLogs.created_at, parseDateTime3(q.created_from.trim())));
  if (q.created_to?.trim()) conds.push(lte(auditRequestLogs.created_at, parseDateTime3(q.created_to.trim())));

  return conds;
}
export function buildAuthEventExportConds(q: ExportAuthEventQuery): SQL[] {
  const conds: SQL[] = [];

  if (q.event) conds.push(eq(auditAuthEvents.event, q.event));
  if (q.user_id) conds.push(eq(auditAuthEvents.user_id, q.user_id));
  if (q.email) conds.push(eq(auditAuthEvents.email, q.email));
  if (q.ip) conds.push(eq(auditAuthEvents.ip, q.ip));
  if (typeof q.exclude_localhost !== 'undefined' && isTruthyBoolLike(q.exclude_localhost)) {
    conds.push(excludeLocalhostCond(auditAuthEvents));
  }
  if (q.created_from?.trim()) conds.push(gte(auditAuthEvents.created_at, parseDateTime3(q.created_from.trim())));
  if (q.created_to?.trim()) conds.push(lte(auditAuthEvents.created_at, parseDateTime3(q.created_to.trim())));

  return conds;
}