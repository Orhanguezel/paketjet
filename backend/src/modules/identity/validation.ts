// src/modules/identity/validation.ts
import { z } from 'zod';

export const IDENTITY_MAX_BYTES = 8 * 1024 * 1024;
export const IDENTITY_MIMES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const identityReviewSchema = z
  .object({
    status: z.enum(['approved', 'rejected']),
    reject_reason: z.string().trim().max(255).optional(),
  })
  .refine((v) => v.status === 'approved' || !!v.reject_reason, { message: 'reject_reason_required', path: ['reject_reason'] });

export const identityAdminListSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export type IdentityReviewInput = z.infer<typeof identityReviewSchema>;
