// =============================================================
// FILE: src/modules/reports/repository.ts
// Admin raporlar — DB sorguları
// =============================================================
import { db } from '@/db/client';
import { sql } from 'drizzle-orm';
import {
  buildReportsPeriodSql,
  buildReportsRoleSql,
  buildReportsUserIdSql,
  buildReportsUserOrderSql,
  getReportsDateFormat,
  type ReportsDateRange,
  type ReportsPeriod,
  type ReportsUserRole,
} from './helpers';

export async function repoGetKpiMetrics(period: ReportsPeriod, range: ReportsDateRange) {
  const format = getReportsDateFormat(period);

  const rows = await db.execute(sql`
    SELECT
      ${buildReportsPeriodSql(period)}       AS period,
      DATE_FORMAT(created_at, ${format})     AS bucket,
      COUNT(*)                               AS bookings_total,
      SUM(status = 'delivered')              AS delivered_bookings,
      SUM(status IN ('cancelled','disputed')) AS cancelled_bookings,
      COALESCE(SUM(CASE WHEN status = 'delivered' THEN total_price ELSE 0 END), 0) AS total_revenue,
      ROUND(
        SUM(status = 'delivered') / NULLIF(COUNT(*), 0), 4
      )                                      AS success_rate
    FROM bookings
    WHERE 1=1
      ${range.from ? sql`AND created_at >= ${range.from}` : sql``}
      ${range.to   ? sql`AND created_at <= ${range.to}`   : sql``}
    GROUP BY bucket
    ORDER BY bucket ASC
  `);

  return rows;
}

export async function repoGetUsersPerformance(
  role: ReportsUserRole,
  limit: number,
  range: ReportsDateRange,
) {
  const rows = await db.execute(sql`
    SELECT
      ${buildReportsUserIdSql(role)}         AS user_id,
      u.full_name,
      u.email,
      ${buildReportsRoleSql(role)}           AS role,
      COUNT(*)                               AS bookings_total,
      SUM(b.status = 'delivered')            AS delivered_bookings,
      SUM(b.status IN ('cancelled','disputed')) AS cancelled_bookings,
      COALESCE(SUM(CASE WHEN b.status = 'delivered' THEN b.total_price ELSE 0 END), 0) AS total_revenue,
      ROUND(SUM(b.status = 'delivered') / NULLIF(COUNT(*), 0), 4) AS success_rate
    FROM bookings b
    LEFT JOIN users u ON u.id = ${buildReportsUserIdSql(role)}
    WHERE 1=1
      ${range.from ? sql`AND b.created_at >= ${range.from}` : sql``}
      ${range.to   ? sql`AND b.created_at <= ${range.to}`   : sql``}
    GROUP BY ${buildReportsUserIdSql(role)}, u.full_name, u.email
    ORDER BY ${buildReportsUserOrderSql(role)} DESC
    LIMIT ${limit}
  `);

  return rows;
}

export async function repoGetLocationsStats(limit: number, range: ReportsDateRange) {
  const rows = await db.execute(sql`
    SELECT
      i.from_city,
      i.to_city,
      COUNT(*)                                       AS bookings_total,
      SUM(b.status = 'delivered')                    AS delivered_bookings,
      SUM(b.status IN ('cancelled','disputed'))      AS cancelled_bookings,
      COALESCE(SUM(CASE WHEN b.status = 'delivered' THEN b.total_price ELSE 0 END), 0) AS total_revenue,
      ROUND(SUM(b.status = 'delivered') / NULLIF(COUNT(*), 0), 4) AS success_rate
    FROM bookings b
    LEFT JOIN ilanlar i ON i.id = b.ilan_id
    WHERE 1=1
      ${range.from ? sql`AND b.created_at >= ${range.from}` : sql``}
      ${range.to   ? sql`AND b.created_at <= ${range.to}`   : sql``}
    GROUP BY i.from_city, i.to_city
    ORDER BY bookings_total DESC
    LIMIT ${limit}
  `);

  return rows;
}
