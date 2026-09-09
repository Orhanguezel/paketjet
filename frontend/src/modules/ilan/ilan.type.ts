import type {LocationValue} from '@paketjet/locations';
export type VehicleType = "van" | "truck" | "motorcycle" | "car" | "other";
export type IlanStatus = "active" | "pending_approval" | "paused" | "sold" | "expired" | "removed" | "completed" | "cancelled";

/** Backend API'den gelen ilan objesi */
export interface Ilan {
  id: string;
  slug?: string;
  is_sample?: boolean;
  user_id: string;
  from_location?: LocationValue | null;
  to_location?: LocationValue | null;
  from_city: string;
  to_city: string;
  from_district?: string | null;
  to_district?: string | null;
  departure_date: string; // ISO datetime
  arrival_date?: string | null;
  total_capacity_kg: string; // decimal string
  available_capacity_kg: string;
  price_per_kg: string;
  currency: string;
  is_negotiable: number;
  vehicle_type: VehicleType;
  title?: string | null;
  description?: string | null;
  contact_phone?: string;
  contact_email?: string | null;
  contact_name?: string | null;
  contact_address?: string | null;
  contact_locked?: boolean;
  status: IlanStatus;
  carrier_name?: string | null;
  photos?: IlanPhoto[];
  created_at: string;
  updated_at: string;
}

export interface IlanPhoto {
  id: string;
  ilan_id: string;
  url: string;
  order: number;
  created_at: string;
}

export interface IlanListResponse {
  data: PublicIlan[];
  total: number;
  page: number;
  limit: number;
}

export interface IlanSearchFilters {
  from_city?: string;
  to_city?: string;
  from_province?: string;
  to_province?: string;
  date?: string;
  vehicle_type?: VehicleType;
  page?: number;
  limit?: number;
}

export interface CreateIlanInput {
  from_location?: LocationValue | null;
  to_location?: LocationValue | null;
  from_city: string;
  to_city: string;
  from_district?: string;
  to_district?: string;
  departure_date: string;
  arrival_date?: string | null;
  total_capacity_kg?: number;
  price_per_kg?: number;
  currency?: string;
  is_negotiable?: number;
  vehicle_type?: VehicleType;
  title?: string;
  description?: string;
  contact_phone: string;
  contact_email?: string | null;
  contact_name?: string;
  contact_address?: string;
}

export type PublicIlan = Pick<Ilan, 'id'|'slug'|'from_location'|'to_location'|'is_sample'|'from_city'|'to_city'|'from_district'|'to_district'|'departure_date'|'arrival_date'|'vehicle_type'|'title'|'description'|'status'|'created_at'|'updated_at'|'photos'|'contact_locked'>;
export type OwnerIlan = Ilan;
