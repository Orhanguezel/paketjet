import { apiGet, apiPost, apiPatch, apiPut, apiDelete } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type {
  Ilan,
  IlanListResponse,
  IlanSearchFilters,
  CreateIlanInput,
} from "./ilan.type";

// ── API Calls ────────────────────────────────────────────────────────────────

export function listIlans(filters?: IlanSearchFilters): Promise<IlanListResponse> {
  const params = new URLSearchParams();
  if (filters?.from_city) params.set("from_city", filters.from_city);
  if (filters?.to_city) params.set("to_city", filters.to_city);
  if (filters?.date) params.set("date", filters.date);
  if (filters?.min_kg) params.set("min_kg", String(filters.min_kg));
  if (filters?.max_price_per_kg) params.set("max_price_per_kg", String(filters.max_price_per_kg));
  if (filters?.vehicle_type) params.set("vehicle_type", filters.vehicle_type);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));

  const qs = params.toString();
  return apiGet<IlanListResponse>(`${API.ilanlar.list}${qs ? `?${qs}` : ""}`);
}

export function getIlan(id: string): Promise<Ilan> {
  return apiGet<Ilan>(API.ilanlar.detail(id));
}

export function getMyIlans(): Promise<Ilan[]> {
  return apiGet<Ilan[]>(API.ilanlar.my);
}

export function createIlan(data: CreateIlanInput): Promise<Ilan> {
  return apiPost<Ilan>(API.ilanlar.list, data);
}

export function updateIlan(id: string, data: Partial<CreateIlanInput>): Promise<Ilan> {
  return apiPut<Ilan>(API.ilanlar.detail(id), data);
}

export function updateIlanStatus(id: string, status: string): Promise<Ilan> {
  return apiPatch<Ilan>(API.ilanlar.status(id), { status });
}

export function deleteIlan(id: string): Promise<{ ok: boolean }> {
  return apiDelete<{ ok: boolean }>(API.ilanlar.detail(id));
}

// ── Mock Data (skeleton / geliştirme için) ───────────────────────────────────

export const MOCK_ILANLAR: Ilan[] = [
  {
    id: "1",
    user_id: "u1",
    carrier_name: "A.H.",
    from_city: "Düzce",
    to_city: "İzmir",
    departure_date: "2026-03-15T14:40:00.000Z",
    total_capacity_kg: "20",
    available_capacity_kg: "15",
    price_per_kg: "8",
    currency: "TRY",
    is_negotiable: 0,
    vehicle_type: "car",
    contact_phone: "5xx xxx xx xx",
    status: "active",
    created_at: "2026-03-12T10:00:00.000Z",
    updated_at: "2026-03-12T10:00:00.000Z",
  },
  {
    id: "2",
    user_id: "u2",
    carrier_name: "B.C.",
    from_city: "Muğla",
    to_city: "Konya",
    departure_date: "2026-03-15T08:00:00.000Z",
    total_capacity_kg: "50",
    available_capacity_kg: "30",
    price_per_kg: "5",
    currency: "TRY",
    is_negotiable: 1,
    vehicle_type: "van",
    contact_phone: "5xx xxx xx xx",
    status: "active",
    created_at: "2026-03-12T10:00:00.000Z",
    updated_at: "2026-03-12T10:00:00.000Z",
  },
  {
    id: "3",
    user_id: "u3",
    carrier_name: "D.E.",
    from_city: "Van",
    to_city: "Bodrum",
    departure_date: "2026-03-15T12:15:00.000Z",
    total_capacity_kg: "10",
    available_capacity_kg: "10",
    price_per_kg: "12",
    currency: "TRY",
    is_negotiable: 0,
    vehicle_type: "car",
    contact_phone: "5xx xxx xx xx",
    status: "active",
    created_at: "2026-03-12T10:00:00.000Z",
    updated_at: "2026-03-12T10:00:00.000Z",
  },
  {
    id: "4",
    user_id: "u4",
    carrier_name: "F.G.",
    from_city: "Adana",
    to_city: "Bursa",
    departure_date: "2026-03-15T09:30:00.000Z",
    total_capacity_kg: "200",
    available_capacity_kg: "150",
    price_per_kg: "3",
    currency: "TRY",
    is_negotiable: 1,
    vehicle_type: "truck",
    contact_phone: "5xx xxx xx xx",
    status: "active",
    created_at: "2026-03-12T10:00:00.000Z",
    updated_at: "2026-03-12T10:00:00.000Z",
  },
];
