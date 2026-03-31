// =============================================================
// FILE: src/modules/reports/admin.routes.ts
// PaketJet — Admin Raporlar API
// GET /admin/reports/kpi
// GET /admin/reports/users-performance
// GET /admin/reports/locations
// =============================================================
import type { FastifyInstance } from 'fastify';
import { adminReportsKpi, adminReportsUsersPerformance, adminReportsLocations, adminReportsCommissions } from './admin.controller';

export async function registerReportsAdmin(app: FastifyInstance) {
  const B = '/reports';

  app.get(`${B}/kpi`,                adminReportsKpi);
  app.get(`${B}/users-performance`,  adminReportsUsersPerformance);
  app.get(`${B}/locations`,          adminReportsLocations);
  app.get(`${B}/commissions`,        adminReportsCommissions);
}
