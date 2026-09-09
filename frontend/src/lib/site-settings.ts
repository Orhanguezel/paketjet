import { API } from "@/config/api-endpoints";
import { apiGet } from "@/lib/api-client";

export async function getSiteSettingValue<T>(key: string, locale = "tr"): Promise<T | null> {
  try {
    const path = `${API.siteSettings.byKey(key)}?locale=${locale}`;
    let row: {value?: T | string | null};
    if (typeof window === "undefined") {
      const base = (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8078").replace(/\/$/, "");
      const response = await fetch(`${base}${path}`, {next:{revalidate:300},signal:AbortSignal.timeout(5000)});
      if (!response.ok) return null;
      row = await response.json();
    } else {
      row = await apiGet<{value?: T | string | null}>(path);
    }
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
