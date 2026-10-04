// src/modules/carriers/validation.ts
import { z } from "zod";
import { queryBoolean } from "@/modules/_shared";


export const CARRIER_IDENTITY_FILTERS = ["none", "incomplete", "pending", "approved", "rejected"] as const;

export const carrierListQuerySchema = z.object({
  search: z.string().optional(),
  is_active: queryBoolean,
  has_active_ilan: queryBoolean,
  identity: z.enum(CARRIER_IDENTITY_FILTERS).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export const carrierDetailParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CarrierListQuery = z.infer<typeof carrierListQuerySchema>;
export type CarrierDetailParams = z.infer<typeof carrierDetailParamsSchema>;
