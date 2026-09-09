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

export async function getAuditGeoCitiesAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const parsed = auditGeoStatsQuerySchema.safeParse(req.query ?? {});
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: { message: 'invalid_query', issues: parsed.error.flatten() } });
    }

    const q = parsed.data;
    const onlyAdmin =
      typeof q.only_admin === 'undefined' ? undefined : isTruthyBoolLike(q.only_admin);

    const rows = await repoGetAuditGeoCities({
      days: q.days,
      only_admin: onlyAdmin,
      source: q.source,
    });

    return reply.send({ items: rows });
  } catch (e) {
    return handleRouteError(reply, req, e, 'get_audit_geo_cities');
  }
}