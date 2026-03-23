export type VehicleType = "van" | "truck" | "motorcycle" | "car" | "other";
export type IlanStatus = "active" | "paused" | "completed" | "cancelled";

/** Backend API'den gelen ilan objesi */
export interface Ilan {
  id: string;
  user_id: string;
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
  contact_phone: string;
  contact_email?: string | null;
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
  data: Ilan[];
  total: number;
  page: number;
  limit: number;
}

export interface IlanSearchFilters {
  from_city?: string;
  to_city?: string;
  date?: string;
  min_kg?: number;
  max_price_per_kg?: number;
  vehicle_type?: VehicleType;
  page?: number;
  limit?: number;
}

export interface CreateIlanInput {
  from_city: string;
  to_city: string;
  from_district?: string;
  to_district?: string;
  departure_date: string;
  arrival_date?: string;
  total_capacity_kg: number;
  price_per_kg: number;
  currency?: string;
  is_negotiable?: number;
  vehicle_type?: VehicleType;
  title?: string;
  description?: string;
  contact_phone: string;
  contact_email?: string;
}
