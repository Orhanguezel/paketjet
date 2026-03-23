// src/modules/reports/index.ts
// External module surface for reports. Keep explicit; no export *.

export { registerReportsAdmin } from './admin.routes';

export {
  adminReportsKpi,
  adminReportsUsersPerformance,
  adminReportsLocations,
} from './admin.controller';

export {
  parseReportsDateRange,
  parseReportsLimit,
  parseReportsPeriod,
  parseReportsUserRole,
  getReportsDateFormat,
  buildReportsPeriodSql,
  buildReportsUserIdSql,
  buildReportsRoleSql,
  buildReportsUserOrderSql,
} from './helpers';
export type {
  ReportsDateRange,
  ReportsPeriod,
  ReportsUserRole,
} from './helpers';

export {
  repoGetKpiMetrics,
  repoGetUsersPerformance,
  repoGetLocationsStats,
} from './repository';
