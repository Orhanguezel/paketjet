// src/modules/carrier-kyc/repository.ts
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { and, eq, sql, desc } from "drizzle-orm";
import { carrierKycDocuments, type KycDocumentType, type KycDocumentStatus, type KycStatus } from "./schema";
import { users } from "../auth/schema";

// ── Carrier (kendi belgeleri) ───────────────────────────────────────────────

export async function repoGetDocumentsByCarrier(carrierId: string) {
  return db.select().from(carrierKycDocuments)
    .where(eq(carrierKycDocuments.carrier_id, carrierId))
    .orderBy(carrierKycDocuments.document_type);
}

export async function repoGetDocumentById(id: string) {
  const [row] = await db.select().from(carrierKycDocuments).where(eq(carrierKycDocuments.id, id)).limit(1);
  return row ?? null;
}

export async function repoUpsertDocument(carrierId: string, docType: KycDocumentType, data: {
  file_path: string;
  original_name: string;
  file_size: number;
}) {
  const [existing] = await db.select().from(carrierKycDocuments)
    .where(and(eq(carrierKycDocuments.carrier_id, carrierId), eq(carrierKycDocuments.document_type, docType)))
    .limit(1);

  if (existing) {
    await db.update(carrierKycDocuments).set({
      file_path: data.file_path,
      original_name: data.original_name,
      file_size: data.file_size,
      status: "pending",
      admin_note: null,
      reviewed_by: null,
      reviewed_at: null,
    }).where(eq(carrierKycDocuments.id, existing.id));
    return repoGetDocumentById(existing.id);
  }

  const id = randomUUID();
  await db.insert(carrierKycDocuments).values({
    id,
    carrier_id: carrierId,
    document_type: docType,
    file_path: data.file_path,
    original_name: data.original_name,
    file_size: data.file_size,
  });
  return repoGetDocumentById(id);
}

export async function repoDeleteDocument(id: string) {
  await db.delete(carrierKycDocuments).where(eq(carrierKycDocuments.id, id));
}

// ── KYC durum senkronizasyonu ───────────────────────────────────────────────

export async function repoSyncKycStatus(carrierId: string): Promise<KycStatus> {
  const docs = await repoGetDocumentsByCarrier(carrierId);
  if (docs.length === 0) return repoSetKycStatus(carrierId, "not_submitted");

  const hasRejected = docs.some((d) => d.status === "rejected");
  if (hasRejected) return repoSetKycStatus(carrierId, "rejected");

  const allApproved = docs.length >= 2 && docs.every((d) => d.status === "approved");
  if (allApproved) return repoSetKycStatus(carrierId, "approved");

  return repoSetKycStatus(carrierId, "pending");
}

export async function repoSetKycStatus(carrierId: string, status: KycStatus) {
  const updates: Record<string, unknown> = { kyc_status: status };
  if (status === "pending") updates.kyc_submitted_at = new Date();
  if (status === "approved") updates.kyc_approved_at = new Date();

  await db.update(users).set(updates).where(eq(users.id, carrierId));
  return status;
}

export async function repoGetKycStatus(carrierId: string) {
  const [row] = await db.select({
    kyc_status: users.kyc_status,
    kyc_submitted_at: users.kyc_submitted_at,
    kyc_approved_at: users.kyc_approved_at,
    tc_identity: users.tc_identity,
    tax_number: users.tax_number,
    tax_office: users.tax_office,
    legal_company_title: users.legal_company_title,
    iyzico_sub_merchant_key: users.iyzico_sub_merchant_key,
  }).from(users).where(eq(users.id, carrierId)).limit(1);
  return row ?? null;
}

export async function repoUpdateUserKycFields(carrierId: string, fields: {
  tc_identity?: string;
  tax_number?: string;
  tax_office?: string;
  legal_company_title?: string;
}) {
  const patch: Record<string, string> = {};
  if (fields.tc_identity) patch.tc_identity = fields.tc_identity;
  if (fields.tax_number) patch.tax_number = fields.tax_number;
  if (fields.tax_office) patch.tax_office = fields.tax_office;
  if (fields.legal_company_title) patch.legal_company_title = fields.legal_company_title;
  if (Object.keys(patch).length === 0) return;
  await db.update(users).set(patch).where(eq(users.id, carrierId));
}

// ── Admin ───────────────────────────────────────────────────────────────────

export async function repoAdminListPendingDocuments(params: { status?: string; limit: number; offset: number }) {
  const status = params.status ?? "pending";
  const conditions = [eq(carrierKycDocuments.status, status as KycDocumentStatus)];

  const [rows, [countRow]] = await Promise.all([
    db.select({
      doc: carrierKycDocuments,
      carrier_name: users.full_name,
      carrier_email: users.email,
    })
      .from(carrierKycDocuments)
      .leftJoin(users, eq(carrierKycDocuments.carrier_id, users.id))
      .where(and(...conditions))
      .orderBy(desc(carrierKycDocuments.created_at))
      .limit(params.limit)
      .offset(params.offset),
    db.select({ total: sql<number>`COUNT(*)` }).from(carrierKycDocuments).where(and(...conditions)),
  ]);

  return {
    data: rows.map((r) => ({
      ...r.doc,
      carrier_name: r.carrier_name,
      carrier_email: r.carrier_email,
    })),
    total: Number(countRow?.total ?? 0),
  };
}

export async function repoAdminGetCarrierKyc(carrierId: string) {
  const [user] = await db.select({
    id: users.id,
    email: users.email,
    full_name: users.full_name,
    phone: users.phone,
    tc_identity: users.tc_identity,
    tax_number: users.tax_number,
    tax_office: users.tax_office,
    legal_company_title: users.legal_company_title,
    kyc_status: users.kyc_status,
    kyc_submitted_at: users.kyc_submitted_at,
    kyc_approved_at: users.kyc_approved_at,
    iyzico_sub_merchant_key: users.iyzico_sub_merchant_key,
    iyzico_sub_merchant_type: users.iyzico_sub_merchant_type,
  }).from(users).where(eq(users.id, carrierId)).limit(1);

  if (!user) return null;

  const docs = await repoGetDocumentsByCarrier(carrierId);
  return { ...user, documents: docs };
}

export async function repoReviewDocument(docId: string, reviewerId: string, status: KycDocumentStatus, adminNote?: string) {
  await db.update(carrierKycDocuments).set({
    status,
    admin_note: adminNote ?? null,
    reviewed_by: reviewerId,
    reviewed_at: new Date(),
  }).where(eq(carrierKycDocuments.id, docId));
  return repoGetDocumentById(docId);
}

export async function repoSetIyzicoSubMerchant(carrierId: string, key: string, type: string) {
  await db.update(users).set({
    iyzico_sub_merchant_key: key,
    iyzico_sub_merchant_type: type,
  }).where(eq(users.id, carrierId));
}
