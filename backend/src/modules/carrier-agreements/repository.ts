// src/modules/carrier-agreements/repository.ts
import { db } from "@/db/client";
import { eq, sql, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { carrierAgreements } from "./schema";
import { plans } from "../subscription/schema";
import { users } from "../auth/schema";
import type { CreateAgreementInput, UpdateAgreementInput } from "./validation";

/** Taşıyıcının aktif anlaşmasını getir (plan bilgisiyle) */
export async function repoGetAgreementByUserId(userId: string) {
  const rows = await db
    .select({
      id: carrierAgreements.id,
      user_id: carrierAgreements.user_id,
      agreement_type: carrierAgreements.agreement_type,
      commission_rate: carrierAgreements.commission_rate,
      plan_id: carrierAgreements.plan_id,
      status: carrierAgreements.status,
      starts_at: carrierAgreements.starts_at,
      expires_at: carrierAgreements.expires_at,
      admin_note: carrierAgreements.admin_note,
      created_at: carrierAgreements.created_at,
      updated_at: carrierAgreements.updated_at,
      plan_name: plans.name,
      plan_commission_rate: plans.commission_rate,
    })
    .from(carrierAgreements)
    .leftJoin(plans, eq(carrierAgreements.plan_id, plans.id))
    .where(eq(carrierAgreements.user_id, userId))
    .limit(1);
  return rows[0] ?? null;
}

/** ID ile anlaşma getir */
export async function repoGetAgreementById(id: string) {
  const rows = await db
    .select({
      id: carrierAgreements.id,
      user_id: carrierAgreements.user_id,
      agreement_type: carrierAgreements.agreement_type,
      commission_rate: carrierAgreements.commission_rate,
      plan_id: carrierAgreements.plan_id,
      status: carrierAgreements.status,
      starts_at: carrierAgreements.starts_at,
      expires_at: carrierAgreements.expires_at,
      admin_note: carrierAgreements.admin_note,
      created_at: carrierAgreements.created_at,
      updated_at: carrierAgreements.updated_at,
      plan_name: plans.name,
      plan_commission_rate: plans.commission_rate,
      carrier_name: users.full_name,
      carrier_email: users.email,
    })
    .from(carrierAgreements)
    .leftJoin(plans, eq(carrierAgreements.plan_id, plans.id))
    .leftJoin(users, eq(carrierAgreements.user_id, users.id))
    .where(eq(carrierAgreements.id, id))
    .limit(1);
  return rows[0] ?? null;
}

/** Tüm anlaşmaları listele (admin) */
export async function repoListAgreements(params: {
  status?: string;
  type?: string;
  limit: number;
  offset: number;
}) {
  const conditions = [];
  if (params.status) conditions.push(eq(carrierAgreements.status, params.status));
  if (params.type) conditions.push(eq(carrierAgreements.agreement_type, params.type));

  const where = conditions.length ? and(...conditions) : undefined;

  const [items, countResult] = await Promise.all([
    db
      .select({
        id: carrierAgreements.id,
        user_id: carrierAgreements.user_id,
        agreement_type: carrierAgreements.agreement_type,
        commission_rate: carrierAgreements.commission_rate,
        plan_id: carrierAgreements.plan_id,
        status: carrierAgreements.status,
        starts_at: carrierAgreements.starts_at,
        expires_at: carrierAgreements.expires_at,
        admin_note: carrierAgreements.admin_note,
        created_at: carrierAgreements.created_at,
        carrier_name: users.full_name,
        carrier_email: users.email,
        plan_name: plans.name,
        plan_commission_rate: plans.commission_rate,
      })
      .from(carrierAgreements)
      .leftJoin(users, eq(carrierAgreements.user_id, users.id))
      .leftJoin(plans, eq(carrierAgreements.plan_id, plans.id))
      .where(where)
      .orderBy(carrierAgreements.created_at)
      .limit(params.limit)
      .offset(params.offset),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(carrierAgreements)
      .where(where),
  ]);

  return { items, total: countResult[0]?.count ?? 0 };
}

/** Yeni anlaşma oluştur */
export async function repoCreateAgreement(data: CreateAgreementInput) {
  const id = randomUUID();
  await db.insert(carrierAgreements).values({
    id,
    user_id: data.user_id,
    agreement_type: data.agreement_type,
    commission_rate: data.commission_rate != null ? String(data.commission_rate) : null,
    plan_id: data.plan_id ?? null,
    admin_note: data.admin_note ?? null,
    status: "active",
  });
  return repoGetAgreementById(id);
}

/** Anlaşmayı güncelle */
export async function repoUpdateAgreement(id: string, data: UpdateAgreementInput) {
  const updates: Record<string, unknown> = {};
  if (data.agreement_type !== undefined) updates.agreement_type = data.agreement_type;
  if (data.commission_rate !== undefined) updates.commission_rate = data.commission_rate != null ? String(data.commission_rate) : null;
  if (data.plan_id !== undefined) updates.plan_id = data.plan_id;
  if (data.status !== undefined) updates.status = data.status;
  if (data.admin_note !== undefined) updates.admin_note = data.admin_note;

  if (Object.keys(updates).length === 0) return repoGetAgreementById(id);

  await db.update(carrierAgreements).set(updates).where(eq(carrierAgreements.id, id));
  return repoGetAgreementById(id);
}

/** Anlaşmayı sil */
export async function repoDeleteAgreement(id: string) {
  await db.delete(carrierAgreements).where(eq(carrierAgreements.id, id));
}

/**
 * Taşıyıcının efektif komisyon oranını hesapla
 * Öncelik: carrier_agreements.commission_rate → plan.commission_rate → platform default
 */
export async function repoGetCarrierCommissionRate(carrierId: string): Promise<number | null> {
  const agreement = await repoGetAgreementByUserId(carrierId);
  if (!agreement || agreement.status !== "active") return null;

  // 1. Taşıyıcıya özel oran
  if (agreement.commission_rate != null) return parseFloat(agreement.commission_rate);

  // 2. Plan oranı (subscription tipinde)
  if (agreement.agreement_type === "subscription" && agreement.plan_commission_rate != null) {
    return parseFloat(agreement.plan_commission_rate);
  }

  // 3. null → caller platform default kullanacak
  return null;
}
