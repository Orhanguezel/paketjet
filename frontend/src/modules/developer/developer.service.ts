import { apiDelete, apiGet, apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";

export type ApiKey = { id: string; name: string; prefix: string; last_used_at: string | null; revoked_at: string | null; created_at: string };
export const listApiKeys = () => apiGet<{ data: ApiKey[]; max_active: number }>(API.apiKeys.list, { cache: "no-store" });
export const createApiKey = (name: string) => apiPost<{ id: string; name: string; prefix: string; key: string }>(API.apiKeys.list, { name });
export const revokeApiKey = (id: string) => apiDelete<{ ok: boolean }>(API.apiKeys.revoke(id));
