// src/modules/bookings/validation.ts
import { z } from "zod";

const idLike = z.string().length(36);

export const createBookingSchema = z.object({
  ilan_id: idLike,
  kg_amount: z.coerce.number().positive().max(50000),
  pickup_address: z.string().min(1).optional(),
  delivery_address: z.string().min(1).optional(),
  customer_notes: z.string().max(1000).optional(),
  payment_method: z.enum(["wallet", "card", "transfer", "paytr"]).optional().default("wallet"),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["confirmed", "in_transit", "delivered", "cancelled", "disputed"]),
  carrier_notes: z.string().max(1000).optional(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().max(500).optional(),
});
