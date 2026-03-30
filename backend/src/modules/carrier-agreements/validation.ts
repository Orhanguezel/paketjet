// src/modules/carrier-agreements/validation.ts
import { z } from "zod";

export const createAgreementSchema = z.object({
  user_id: z.string().uuid(),
  agreement_type: z.enum(["commission", "subscription"]),
  commission_rate: z.number().min(0).max(100).optional(),
  plan_id: z.string().uuid().optional(),
  admin_note: z.string().max(2000).optional(),
});

export const updateAgreementSchema = z.object({
  agreement_type: z.enum(["commission", "subscription"]).optional(),
  commission_rate: z.number().min(0).max(100).nullable().optional(),
  plan_id: z.string().uuid().nullable().optional(),
  status: z.enum(["active", "suspended", "expired"]).optional(),
  admin_note: z.string().max(2000).nullable().optional(),
});

export type CreateAgreementInput = z.infer<typeof createAgreementSchema>;
export type UpdateAgreementInput = z.infer<typeof updateAgreementSchema>;
