import {locationValueSchema} from '../../locations/validation';
import {locationFilter,provinceFilter} from '../location-filter';
// src/modules/ilanlar/helpers/repository.ts
import { and, desc, eq, gte, lte, type SQL } from "drizzle-orm";
import { ilanlar, type NewIlan } from "../schema";

export function mapIlanRow(row: {
  ilan: typeof ilanlar.$inferSelect;
  user_full_name?: string | null;
  carrier_name?: string | null;
}) {
  return {
    ...row.ilan,
    carrier_name: row.user_full_name ?? row.carrier_name ?? null,
  };
}

/**
 * Lead-reveal güvenlik: public yanıtlardan iletişim alanlarını çıkarır.
 * İletişim yalnızca satın alma sonrası ayrı reveal endpoint ile açılır.
 * Yalnızca PUBLIC repo fonksiyonlarında kullanılır (liste + slug/id detay);
 * sahip/ownership ve reveal akışları tam veriyi kullanır.
 */
function publicDate(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  const raw = String(value).replace(' ', 'T');
  const date = new Date(/[Zz]|[+-]\d{2}:\d{2}$/.test(raw) ? raw : `${raw}Z`);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

/** Explicit public contract. Never spread a DB/user row into public output. */
export function stripIlanContact<T extends Record<string, unknown>>(ilan: T) {
  const departure = publicDate(ilan.departure_date);
  return {
    from_location: locationValueSchema.safeParse(ilan.from_location).data ?? null, to_location: locationValueSchema.safeParse(ilan.to_location).data ?? null,
    id: ilan.id, slug: ilan.slug, from_city: ilan.from_city, to_city: ilan.to_city,
    from_district: ilan.from_district, to_district: ilan.to_district,
    departure_date: departure, arrival_date: publicDate(ilan.arrival_date),
    vehicle_type: ilan.vehicle_type, title: ilan.title, description: ilan.description,
    status: ilan.status === 'active' && departure && new Date(departure).getTime() <= Date.now() ? 'expired' : ilan.status,
    created_at: publicDate(ilan.created_at), updated_at: publicDate(ilan.updated_at),
    contact_locked: true as const, is_sample: Number(ilan.is_sample) === 1,
  };
}

export function buildIlanListWhere(filters: {
  from_city?: string;
  to_city?: string;
  from_province?: string;
  to_province?: string;
  date?: string;
  vehicle_type?: string;
  status?: string;
}) {
  const conditions: SQL[] = [eq(ilanlar.status, "active"), gte(ilanlar.departure_date, new Date())];

  if (filters.from_city) conditions.push(locationFilter('from',filters.from_city));
  if (filters.to_city) conditions.push(locationFilter('to',filters.to_city));
  if (filters.from_province) conditions.push(provinceFilter('from',filters.from_province));
  if (filters.to_province) conditions.push(provinceFilter('to',filters.to_province));
  if (filters.date) {
    const start = new Date(`${filters.date}T00:00:00+03:00`);
    const end = new Date(start.getTime() + 86400000 - 1);
    conditions.push(gte(ilanlar.departure_date, start), lte(ilanlar.departure_date, end));
  }
  if (filters.vehicle_type) {
    conditions.push(eq(ilanlar.vehicle_type, filters.vehicle_type));
  }

  return and(...conditions);
}

import { generateIlanSlug } from "../slug";

export function buildCreateIlanInsert(
  userId: string,
  data: Omit<NewIlan, "id" | "user_id" | "available_capacity_kg">,
  id: string,
): NewIlan {
  const slug = generateIlanSlug({
    from_city: data.from_city,
    to_city: data.to_city,
    vehicle_type: data.vehicle_type ?? undefined,
    departure_date: data.departure_date,
  });

  return {
    ...data,
    id,
    slug,
    user_id: userId,
    available_capacity_kg: data.total_capacity_kg,
  };
}

export function getUserIlanOrder() {
  return desc(ilanlar.created_at);
}
