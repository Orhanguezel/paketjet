// src/modules/carrier-kyc/validation.ts
import { z } from "zod";
import { kycDocumentTypes, kycDocumentStatuses } from "./schema";

export const uploadDocumentSchema = z.object({
  document_type: z.enum(kycDocumentTypes),
  tc_identity: z.string().length(11, "TC kimlik numarası 11 haneli olmalıdır").regex(/^\d+$/, "Sadece rakam").optional(),
  iban: z.string().regex(/^TR\d{24}$/, "Geçerli bir TR IBAN giriniz").optional(),
  tax_number: z.string().max(20).optional(),
  tax_office: z.string().max(100).optional(),
  legal_company_title: z.string().max(255).optional(),
});

export const adminReviewSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  admin_note: z.string().max(1000).optional(),
});
