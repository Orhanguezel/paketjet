// src/modules/ilanlar/validation.ts
import { z } from "zod";

const vehicleTypes = ["van", "truck", "motorcycle", "car", "other"] as const;
const ilanStatuses = ["active", "paused", "completed", "cancelled"] as const;

export const createIlanSchema = z.object({
  from_city: z.string().min(1).max(128),
  to_city: z.string().min(1).max(128),
  from_district: z.string().max(128).optional().nullish(),
  to_district: z.string().max(128).optional().nullish(),
  departure_date: z.string().datetime({ offset: true }).or(z.string().min(1)),
  arrival_date: z.string().datetime({ offset: true }).or(z.string().min(1)).optional().nullish(),

  total_capacity_kg: z.coerce.number().positive().max(50000),
  price_per_kg: z.coerce.number().positive().max(99999),
  currency: z.string().length(3).optional().default("TRY"),
  is_negotiable: z.coerce.number().int().min(0).max(1).optional().default(0),

  vehicle_type: z.enum(vehicleTypes).optional().default("car"),
  title: z.string().max(255).optional().nullish(),
  description: z.string().optional().nullish(),

  contact_phone: z.string().min(1).max(50),
  contact_email: z.string().email().optional().nullish(),
});

export const updateIlanSchema = createIlanSchema.partial();

export const searchIlansSchema = z.object({
  from_city: z.string().optional(),
  to_city: z.string().optional(),
  date: z.string().optional(), // YYYY-MM-DD
  min_kg: z.coerce.number().positive().optional(),
  max_price_per_kg: z.coerce.number().positive().optional(),
  vehicle_type: z.enum(vehicleTypes).optional(),
  status: z.enum(ilanStatuses).optional().default("active"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const updateIlanStatusSchema = z.object({
  status: z.enum(ilanStatuses),
});
