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
export type AuditIpTable = typeof auditRequestLogs | typeof auditAuthEvents;
export type AuditGeoStatsBool = boolean | 0 | 1 | '0' | '1' | 'true' | 'false' | undefined;
export type ExportRequestLogQuery = {
  q?: string;
  method?: string;
  status_code?: number;
  user_id?: string;
  ip?: string;
  only_admin?: AuditGeoStatsBool;
  exclude_localhost?: AuditGeoStatsBool;
  created_from?: string;
  created_to?: string;
};
export type ExportAuthEventQuery = {
  event?: string;
  user_id?: string;
  email?: string;
  ip?: string;
  exclude_localhost?: AuditGeoStatsBool;
  created_from?: string;
  created_to?: string;
};
export type AuditRequestLogEnriched = AuditRequestLogRow & {
  user_email: string | null;
  user_full_name: string | null;
};
export type AuditAuthEventEnriched = AuditAuthEventRow & {
  user_full_name: string | null;
};
export type AuditGeoStatsRow = {
  country: string;
  count: number;
  unique_ips: number;
};
export type AuditGeoStatsQuery = {
  days?: number;
  only_admin?: AuditGeoStatsBool;
  exclude_localhost?: AuditGeoStatsBool;
  source?: 'requests' | 'auth';
};
export type AuditGeoCityRow = {
  country: string;
  city: string;
  hits: number;
  unique_ips: number;
};
export type ClearAuditTarget = 'requests' | 'auth' | 'all';
export type AuditMetricsDailyRow = {
  date: string; // "YYYY-MM-DD"
  requests: number;
  unique_ips: number;
  errors: number;
};
