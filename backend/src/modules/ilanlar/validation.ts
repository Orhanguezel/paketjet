import { locationValueSchema } from "../locations/validation";
// src/modules/ilanlar/validation.ts
import { z } from "zod";

const vehicleTypes = ["van", "truck", "motorcycle", "car", "other"] as const;
const ilanStatuses = ["active", "pending_approval", "paused", "completed", "cancelled", "sold", "expired", "removed"] as const;

const ilanFields = z.object({
  from_location: locationValueSchema.optional().nullable(),
  to_location: locationValueSchema.optional().nullable(),
  from_city: z.string().trim().min(1).max(128),
  to_city: z.string().trim().min(1).max(128),
  from_district: z.string().max(128).optional().nullish(),
  to_district: z.string().max(128).optional().nullish(),
  departure_date: z.string().datetime({ offset: true }),
  arrival_date: z.string().datetime({ offset: true }).optional().nullish(),

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
  description: z.string().max(4000).optional().nullish(),

  contact_phone: z.string().regex(/^\+?[0-9 ()-]{10,25}$/, "Geçerli telefon numarası girin"),
  contact_email: z.string().email().optional().nullish(),
  contact_name: z.string().max(160).optional().nullish(),
  contact_address: z.string().max(1000).optional().nullish(),
});

function validateDates(data: {departure_date?: string; arrival_date?: string | null; from_city?:string; to_city?:string; from_district?:string|null; to_district?:string|null}, ctx: z.RefinementCtx) {
  if (data.departure_date && new Date(data.departure_date).getTime() <= Date.now()) ctx.addIssue({code: "custom", path: ["departure_date"], message: "Hareket tarihi gelecekte olmalı"});
  if (data.departure_date && data.arrival_date && new Date(data.arrival_date) < new Date(data.departure_date)) ctx.addIssue({code: "custom", path: ["arrival_date"], message: "Varış hareketten önce olamaz"});
}
export const createIlanSchema = ilanFields.superRefine(validateDates);
export const updateIlanSchema = ilanFields.partial().superRefine(validateDates);

export const searchIlansSchema = z.object({
  from_city: z.string().max(400).optional(),
  to_city: z.string().max(400).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => Number.isFinite(new Date(value).getTime()), "Geçerli tarih girin").optional(),
  vehicle_type: z.enum(vehicleTypes).optional(),
  status: z.enum(ilanStatuses).optional().default("active"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const updateIlanStatusSchema = z.object({
  status: z.enum(ilanStatuses),
});
