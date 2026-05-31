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
