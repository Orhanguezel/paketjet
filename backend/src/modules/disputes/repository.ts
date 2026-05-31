// src/modules/disputes/repository.ts
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { and, desc, eq, sql } from "drizzle-orm";
import { disputes, type DisputeStatus } from "./schema";
import { users } from "../auth/schema";
import { ilanlar } from "../ilanlar/schema";
import { ilanPurchases } from "../purchases/schema";
import type { DisputeIssueType } from "./validation";

export async function repoCreateDispute(bookingId: string, openedBy: string, reason: string) {
  const id = randomUUID();
  await db.insert(disputes).values({ id, booking_id: bookingId, opened_by: openedBy, reason });
  return repoGetDisputeById(id);
}

export async function repoCreateIlanDispute(data: {
  ilanId: string;
  purchaseId: string;
  openedBy: string;
  openedAgainst: string;
  reason: string;
  issueType: DisputeIssueType;
  declaredValue?: string | null;
  declaredValueCurrency?: string | null;
}) {
  const id = randomUUID();
  await db.insert(disputes).values({
    id,
    ilan_id: data.ilanId,
    purchase_id: data.purchaseId,
    opened_by: data.openedBy,
    opened_against: data.openedAgainst,
    reason: data.reason,
    issue_type: data.issueType,
    declared_value: data.declaredValue,
    declared_value_currency: data.declaredValueCurrency ?? "TRY",
  });
  return repoGetDisputeById(id);
}

export async function repoGetDisputeById(id: string) {
  const [row] = await db.select().from(disputes).where(eq(disputes.id, id)).limit(1);
  return row ?? null;
}

export async function repoGetDisputeByBooking(bookingId: string) {
  const [row] = await db.select().from(disputes).where(eq(disputes.booking_id, bookingId)).limit(1);
  return row ?? null;
}

export async function repoGetDisputeByIlan(ilanId: string) {
  const [row] = await db.select().from(disputes).where(eq(disputes.ilan_id, ilanId)).limit(1);
  return row ?? null;
}

export async function repoGetIlanDisputeContext(ilanId: string) {
  const [row] = await db
    .select({
      ilan_id: ilanlar.id,
      seller_id: ilanlar.user_id,
      buyer_id: ilanPurchases.buyer_id,
      purchase_id: ilanPurchases.id,
      estimated_value: ilanlar.estimated_value,
      estimated_value_snapshot: ilanPurchases.estimated_value_snapshot,
      estimated_value_currency: ilanPurchases.estimated_value_currency,
    })
    .from(ilanlar)
    .innerJoin(ilanPurchases, eq(ilanPurchases.ilan_id, ilanlar.id))
    .where(eq(ilanlar.id, ilanId))
    .limit(1);
  return row ?? null;
}

export async function repoAdminListDisputes(params: { status?: string; limit: number; offset: number }) {
  const conditions = params.status ? [eq(disputes.status, params.status as DisputeStatus)] : [];
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [countRow]] = await Promise.all([
    db.select({
      dispute: disputes,
      opener_name: users.full_name,
      opener_email: users.email,
      from_city: ilanlar.from_city,
      to_city: ilanlar.to_city,
    })
      .from(disputes)
      .leftJoin(users, eq(disputes.opened_by, users.id))
      .leftJoin(ilanlar, eq(disputes.ilan_id, ilanlar.id))
      .where(where)
      .orderBy(desc(disputes.created_at))
      .limit(params.limit)
      .offset(params.offset),
    db.select({ total: sql<number>`COUNT(*)` }).from(disputes).where(where),
  ]);

  return {
    data: rows.map((r) => ({
      ...r.dispute,
      opener_name: r.opener_name,
      opener_email: r.opener_email,
      from_city: r.from_city,
      to_city: r.to_city,
    })),
    total: Number(countRow?.total ?? 0),
  };
}

export async function repoResolveDispute(id: string, resolvedBy: string, resolution: string, status: DisputeStatus = "resolved") {
  await db.update(disputes).set({ status, resolution, resolved_by: resolvedBy, resolved_at: new Date() }).where(eq(disputes.id, id));
  return repoGetDisputeById(id);
}
