// src/modules/ilanlar/validation.ts
import { z } from "zod";

const vehicleTypes = ["van", "truck", "motorcycle", "car", "other"] as const;
const ilanStatuses = ["active", "pending_approval", "paused", "completed", "cancelled"] as const;

export const createIlanSchema = z.object({
  from_city: z.string().min(1).max(128),
  to_city: z.string().min(1).max(128),
  from_district: z.string().max(128).optional().nullish(),
  to_district: z.string().max(128).optional().nullish(),
  departure_date: z.string().datetime({ offset: true }).or(z.string().min(1)),
  arrival_date: z.string().datetime({ offset: true }).or(z.string().min(1)).optional().nullish(),

  // Yeni model: kapasite/kg satışı yok — opsiyonel (DB NOT NULL için 0 default)
  total_capacity_kg: z.coerce.number().min(0).max(50000).optional().default(0),
  price_per_kg: z.coerce.number().min(0).max(99999).optional().default(0),
  currency: z.string().length(3).optional().default("TRY"),
  is_negotiable: z.coerce.number().int().min(0).max(1).optional().default(0),

  // NOT (2026-05-30 düzeltmesi): İlanı açan = TAŞIYICI (aracıyla paket taşıyan).
  // Kargonun değerini ve içeriğini bilmez. Bu yüzden ilan oluştururken ARTIK alınmaz:
  // - "Kargo bedeli" (estimated_value) -> satın alan müşteri bildirir (purchases)
  // - "İçerik onayı" -> satın alan müşteri/kargo sahibi onaylar (purchases)

  vehicle_type: z.enum(vehicleTypes).optional().default("car"),
  title: z.string().max(255).optional().nullish(),
  description: z.string().optional().nullish(),

  contact_phone: z.string().min(1).max(50),
  contact_email: z.string().email().optional().nullish(),
  contact_name: z.string().max(160).optional().nullish(),
  contact_address: z.string().optional().nullish(),
});

export const updateIlanSchema = createIlanSchema.partial();

export const searchIlansSchema = z.object({
  from_city: z.string().optional(),
  to_city: z.string().optional(),
  date: z.string().optional(), // YYYY-MM-DD
  vehicle_type: z.enum(vehicleTypes).optional(),
  status: z.enum(ilanStatuses).optional().default("active"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const updateIlanStatusSchema = z.object({
  status: z.enum(ilanStatuses),
});
