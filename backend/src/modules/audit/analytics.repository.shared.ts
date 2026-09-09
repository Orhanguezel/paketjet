import { db } from '@/db/client';
import { auditRequestLogs } from './schema';
import { users } from '@/modules/auth';
import { and, eq, gte, lte, sql, type SQL } from 'drizzle-orm';
import { excludeLocalhostCond } from './repository';
import { isTruthyBoolLike } from './validation';
export type AuditBoolLike = boolean | 0 | 1 | '0' | '1' | 'true' | 'false' | undefined;
export type AnalyticsDateRangeOpts = {
  created_from?: string;
  created_to?: string;
  exclude_localhost?: AuditBoolLike;
};
export type TopEndpointRow = {
  path: string;
  request_count: number;
  avg_response_time: number;
  error_rate: number;
};
export type SlowestEndpointRow = {
  path: string;
  avg_response_time: number;
  max_response_time: number;
  request_count: number;
};
export type TopUserRow = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  request_count: number;
  last_seen: string;
};
export type TopIpRow = {
  ip: string;
  country: string | null;
  request_count: number;
  last_seen: string;
};
export type StatusDistributionRow = {
  status_group: string;
  count: number;
};
export type MethodDistributionRow = {
  method: string;
  count: number;
};
export type HourlyRow = {
  date: string;
  hour: number;
  requests: number;
  errors: number;
  avg_response_time: number;
};
export type ResponseTimeStatsResult = {
  p50: number;
  p95: number;
  p99: number;
  avg: number;
  min: number;
  max: number;
  total_requests: number;
};
export type AuditSummary = {
  today_requests: number;
  today_errors: number;
  today_error_rate: number;
  today_avg_response_time: number;
  today_unique_ips: number;
  today_unique_users: number;
  top_error_endpoint: { path: string; count: number } | null;
  slowest_endpoint: { path: string; avg_ms: number } | null;
};
export type MonthlyRow = {
  month: string;
  requests: number;
  unique_ips: number;
  errors: number;
  avg_response_time: number;
};
