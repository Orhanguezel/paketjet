// src/modules/reports/helpers/controller.ts
export type ReportsDateRange = { from?: string; to?: string };
export type ReportsPeriod = "day" | "week" | "month";
export type ReportsUserRole = "carrier" | "customer";

export function parseReportsDateRange(query: Record<string, string>): ReportsDateRange {
  return { from: query.from, to: query.to };
}

export function parseReportsPeriod(query: Record<string, string>): ReportsPeriod {
  if (query.period === "day" || query.period === "week") {
    return query.period;
  }

  return "month";
}

export function parseReportsUserRole(query: Record<string, string>): ReportsUserRole {
  return query.role === "customer" ? "customer" : "carrier";
}

export function parseReportsLimit(query: Record<string, string>): number {
  return Math.min(parseInt(query.limit || "50", 10), 200);
}
