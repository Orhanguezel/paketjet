// src/modules/carriers/validation.ts
import { z } from "zod";

// Sorgu dizesi "true"/"false"/"1"/"0" gelir; z.coerce.boolean "false" metnini true yapar, kullanılmaz.
const queryBool = z.preprocess((v) => (v === "true" || v === "1" ? true : v === "false" || v === "0" ? false : v), z.boolean().optional());

export const CARRIER_IDENTITY_FILTERS = ["none", "incomplete", "pending", "approved", "rejected"] as const;

export const carrierListQuerySchema = z.object({
  search: z.string().optional(),
  is_active: queryBool,
  has_active_ilan: queryBool,
  identity: z.enum(CARRIER_IDENTITY_FILTERS).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export const carrierDetailParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CarrierListQuery = z.infer<typeof carrierListQuerySchema>;
export type CarrierDetailParams = z.infer<typeof carrierDetailParamsSchema>;
