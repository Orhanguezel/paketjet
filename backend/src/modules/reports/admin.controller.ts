// =============================================================
// FILE: src/modules/reports/admin.controller.ts
// PaketJet — Admin Raporlar
// =============================================================
import type { FastifyRequest, FastifyReply } from 'fastify';
import { handleRouteError } from "@/modules/_shared";
import {
  parseReportsDateRange,
  parseReportsLimit,
  parseReportsPeriod,
  parseReportsUserRole,
} from './helpers';
import { repoGetKpiMetrics, repoGetUsersPerformance, repoGetLocationsStats } from './repository';

/** GET /admin/reports/kpi */
export async function adminReportsKpi(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string>;
    const rows = await repoGetKpiMetrics(parseReportsPeriod(q), parseReportsDateRange(q));
    return reply.send(rows);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_reports_kpi');
  }
}

/** GET /admin/reports/users-performance */
export async function adminReportsUsersPerformance(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string>;
    const rows = await repoGetUsersPerformance(
      parseReportsUserRole(q),
      parseReportsLimit(q),
      parseReportsDateRange(q),
    );
    return reply.send(rows);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_reports_users_performance');
  }
}

/** GET /admin/reports/locations */
export async function adminReportsLocations(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string>;
    const rows = await repoGetLocationsStats(parseReportsLimit(q), parseReportsDateRange(q));
    return reply.send(rows);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_reports_locations');
  }
}
