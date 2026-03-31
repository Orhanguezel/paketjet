// src/modules/carrier-kyc/schema.ts
import {
  mysqlTable,
  char,
  varchar,
  text,
  int,
  datetime,
  index,
  uniqueIndex,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "../auth/schema";

export const kycDocumentTypes = [
  "identity_front",
  "identity_back",
  "tax_certificate",
  "address_proof",
  "iban_document",
] as const;
export type KycDocumentType = (typeof kycDocumentTypes)[number];

export const kycDocumentStatuses = ["pending", "approved", "rejected"] as const;
export type KycDocumentStatus = (typeof kycDocumentStatuses)[number];

export const kycStatuses = ["not_submitted", "pending", "approved", "rejected"] as const;
export type KycStatus = (typeof kycStatuses)[number];

export const carrierKycDocuments = mysqlTable(
  "carrier_kyc_documents",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    carrier_id: char("carrier_id", { length: 36 }).notNull(),
    document_type: varchar("document_type", { length: 30 }).notNull().$type<KycDocumentType>(),
    file_path: varchar("file_path", { length: 500 }).notNull(),
    original_name: varchar("original_name", { length: 255 }).notNull(),
    file_size: int("file_size").notNull().default(0),
    status: varchar("status", { length: 20 }).notNull().default("pending").$type<KycDocumentStatus>(),
    admin_note: text("admin_note"),
    reviewed_by: char("reviewed_by", { length: 36 }),
    reviewed_at: datetime("reviewed_at", { fsp: 3 }),
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("uq_carrier_doc_type").on(t.carrier_id, t.document_type),
    index("idx_carrier_kyc_carrier").on(t.carrier_id),
    index("idx_carrier_kyc_status").on(t.status),
    foreignKey({ columns: [t.carrier_id], foreignColumns: [users.id], name: "fk_carrier_kyc_user" }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({ columns: [t.reviewed_by], foreignColumns: [users.id], name: "fk_carrier_kyc_reviewer" }).onDelete("set null").onUpdate("cascade"),
  ]
);

export type CarrierKycDocument = typeof carrierKycDocuments.$inferSelect;
export type NewCarrierKycDocument = typeof carrierKycDocuments.$inferInsert;
