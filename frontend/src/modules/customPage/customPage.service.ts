import { apiGet } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { CustomPage, CustomPageListParams } from "./customPage.type";

function toQS(params: CustomPageListParams = {}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") qs.set(key, String(value));
  }
  return qs.toString();
}

export function listCustomPages(params: CustomPageListParams = {}) {
  return apiGet<CustomPage[]>(`${API.customPages.list}?${toQS(params)}`);
}

export function getCustomPageById(id: string, locale = "tr") {
  return apiGet<CustomPage>(`${API.customPages.detail(id)}?locale=${locale}`);
}

export function getCustomPageBySlug(slug: string, locale = "tr") {
  return apiGet<CustomPage>(`${API.customPages.bySlug(slug)}?locale=${locale}`);
}
