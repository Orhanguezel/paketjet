// src/modules/partner-api/dto.ts — partner yanit sozlesmesi (DB satiri yayilmaz).
import { ilanlar } from '@/modules/ilanlar';

const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : v ? new Date(String(v).replace(' ', 'T') + (/[Zz]|[+-]\d\d:\d\d$/.test(String(v)) ? '' : 'Z')).toISOString() : null);
const siteUrl = () => (process.env.FRONTEND_URL || '').replace(/\/$/, '');

export function toPartnerListing(r: typeof ilanlar.$inferSelect) {
  const departure = iso(r.departure_date);
  const expired = r.status === 'active' && departure !== null && new Date(departure).getTime() <= Date.now();
  return {
    id: r.id,
    external_ref: r.external_ref ?? null,
    status: expired ? 'expired' : r.status,
    url: r.status === 'active' && !expired ? `${siteUrl()}/ilanlar/${r.slug || r.id}` : null,
    title: r.title, description: r.description,
    from_city: r.from_city, from_district: r.from_district, from_location: r.from_location ?? null,
    to_city: r.to_city, to_district: r.to_district, to_location: r.to_location ?? null,
    departure_date: departure, arrival_date: iso(r.arrival_date),
    vehicle_type: r.vehicle_type,
    total_capacity_kg: Number(r.total_capacity_kg), available_capacity_kg: Number(r.available_capacity_kg),
    price_per_kg: Number(r.price_per_kg), currency: r.currency, is_negotiable: Number(r.is_negotiable) === 1,
    contact_name: r.contact_name, contact_phone: r.contact_phone, contact_email: r.contact_email, contact_address: r.contact_address,
    created_at: iso(r.created_at), updated_at: iso(r.updated_at),
  };
}
