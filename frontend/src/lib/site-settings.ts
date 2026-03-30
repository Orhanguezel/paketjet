import { API } from "@/config/api-endpoints";
import { apiGet } from "@/lib/api-client";

export async function getSiteSettingValue<T>(key: string, locale = "tr"): Promise<T | null> {
  try {
    const row = await apiGet<{ value?: T | string | null }>(`${API.siteSettings.byKey(key)}?locale=${locale}`);
    if (row?.value == null) return null;
    if (typeof row.value === "string") {
      try {
        return JSON.parse(row.value) as T;
      } catch {
        return row.value as T;
      }
    }
    return row.value as T;
  } catch {
    return null;
  }
}
