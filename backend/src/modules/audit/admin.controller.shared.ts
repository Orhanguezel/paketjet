import type { FastifyRequest, FastifyReply } from 'fastify';
import { handleRouteError } from "@/modules/_shared";
import {
  auditAuthEventsListQuerySchema,
  auditRequestLogsListQuerySchema,
  auditMetricsDailyQuerySchema,
  auditGeoStatsQuerySchema,
  auditClearQuerySchema,
  type AuditAuthEventsListQuery,
  type AuditRequestLogsListQuery,
  type AuditMetricsDailyQuery,
  isTruthyBoolLike,
  repoListAuditRequestLogs,
  repoListAuditAuthEvents,
  repoGetAuditMetricsDaily,
  repoGetAuditGeoStats,
  repoGetAuditGeoCities,
  repoClearAuditLogs,
} from './helpers';
import { setContentRange } from '@/modules/_shared';
export type ListResponse<T> = { items: T[]; total: number };
export type ListResultShape<T> =
  | T[]
  | { items?: T[]; data?: T[]; total?: number | string }
  | null
  | undefined;
