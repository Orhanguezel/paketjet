// src/modules/ratings/validation.ts
import { z } from "zod";

export const createRatingSchema = z.object({
  booking_id: z.string().uuid(),
  score: z.number().int().min(1).max(5),
  comment: z.string().trim().max(500).optional(),
});

export type CreateRatingInput = z.infer<typeof createRatingSchema>;
