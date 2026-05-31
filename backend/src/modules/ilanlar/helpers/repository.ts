// src/modules/ilanlar/helpers/repository.ts
import { and, desc, eq, gte, like, lte, type SQL } from "drizzle-orm";
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
export function stripIlanContact<
  T extends {
    contact_phone?: unknown;
    contact_email?: unknown;
    contact_name?: unknown;
    contact_address?: unknown;
  },
>(ilan: T) {
  const { contact_phone, contact_email, contact_name, contact_address, ...rest } = ilan;
  return { ...rest, contact_locked: true as const };
}

export function buildIlanListWhere(filters: {
  from_city?: string;
  to_city?: string;
  date?: string;
  vehicle_type?: string;
  status?: string;
}) {
  const conditions: SQL[] = [eq(ilanlar.status, filters.status ?? "active")];

  if (filters.from_city) {
    conditions.push(like(ilanlar.from_city, `%${filters.from_city}%`));
  }
  if (filters.to_city) {
    conditions.push(like(ilanlar.to_city, `%${filters.to_city}%`));
  }
  if (filters.date) {
    const start = new Date(filters.date);
    const end = new Date(filters.date);
    end.setDate(end.getDate() + 1);
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
