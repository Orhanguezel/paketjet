// src/modules/subscription/validation.ts
import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/),
  price: z.number().min(0),
  ilan_limit: z.number().int().min(0),
  duration_days: z.number().int().min(1).default(30),
  features: z.array(z.string()).default([]),
  sort_order: z.number().int().default(0),
  is_active: z.number().int().min(0).max(1).default(1),
});

export const updatePlanSchema = createPlanSchema.partial();

export const purchasePlanSchema = z.object({
  plan_id: z.string().uuid(),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
