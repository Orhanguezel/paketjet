// src/modules/carriers/validation.ts
import { z } from "zod";

export const carrierListQuerySchema = z.object({
  search: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
  has_active_ilan: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export const carrierDetailParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CarrierListQuery = z.infer<typeof carrierListQuerySchema>;
export type CarrierDetailParams = z.infer<typeof carrierDetailParamsSchema>;
