// src/modules/partner-api/validation.ts
import { z } from 'zod';
import { createIlanSchema, updateIlanSchema } from '@/modules/ilanlar';

export const MAX_ACTIVE_KEYS = 5;
export const MAX_OPEN_LISTINGS = 200;

export const createKeySchema = z.object({ name: z.string().trim().min(2).max(100) }).strict();

const externalRef = z.string().trim().regex(/^[A-Za-z0-9._:-]{1,100}$/, 'external_ref_format');
export const partnerCreateSchema = createIlanSchema.and(z.object({ external_ref: externalRef.optional() }));
export const partnerUpdateSchema = updateIlanSchema;
export const partnerStatusSchema = z.object({ status: z.enum(['paused', 'cancelled', 'pending_approval']) }).strict();
export const partnerListSchema = z.object({
  status: z.enum(['active', 'pending_approval', 'paused', 'cancelled', 'sold', 'expired', 'removed']).optional(),
  external_ref: externalRef.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
