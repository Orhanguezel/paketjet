// src/modules/reports/helpers/repository.ts
import { sql } from "drizzle-orm";
import type { ReportsDateRange, ReportsPeriod, ReportsUserRole } from "./controller";

export function getReportsDateFormat(period: ReportsPeriod): string {
  if (period === "day") return "%Y-%m-%d";
  if (period === "week") return "%Y-%u";
  return "%Y-%m";
}

export function buildReportsPeriodSql(period: ReportsPeriod) {
  return sql.raw(`'${period}'`);
}

export function buildReportsUserIdSql(role: ReportsUserRole) {
  const idCol = role === "carrier" ? "carrier_id" : "customer_id";
  return sql.raw(`b.${idCol}`);
}

export function buildReportsRoleSql(role: ReportsUserRole) {
  return sql.raw(`'${role}'`);
}

export function buildReportsUserOrderSql(role: ReportsUserRole) {
  return role === "carrier" ? sql`delivered_bookings` : sql`bookings_total`;
}

export function buildReportsDateRangeSql(range: ReportsDateRange, tableAlias = "") {
  const prefix = tableAlias ? `${tableAlias}.` : "";

  return {
    from: range.from ? sql.raw(`${prefix}created_at`) : null,
    to: range.to ? sql.raw(`${prefix}created_at`) : null,
  };
}
