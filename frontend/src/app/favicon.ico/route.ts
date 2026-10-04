// /favicon.ico — kok adresten istenen ikon (tarayicilar ve arama motorlari).
// Dosya admin panelindeki site ikonu ayarindan gelir; kodda marka varligi yoktur.
import { getPublicJson } from "@/lib/public-fetch";
import { API } from "@/config/api-endpoints";

// Derlemede onceden uretilmez: build aninda API erisilemezse 404 kalici olurdu.
export const dynamic = "force-dynamic";
const API_BASE = (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8078").replace(/\/$/, "");

export async function GET() {
  const row = await getPublicJson<{ value?: { url?: string } | string }>(`${API.siteSettings.byKey("site_favicon")}?locale=*`, 3600);
  const raw = typeof row?.value === "string" ? row.value : row?.value?.url;
  if (!raw || !raw.startsWith("/uploads/") || raw.includes("..")) return new Response(null, { status: 404 });
  try {
    const res = await fetch(`${API_BASE}${raw}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return new Response(null, { status: 404 });
    return new Response(await res.arrayBuffer(), { headers: { "content-type": res.headers.get("content-type") || "image/x-icon", "cache-control": "public, max-age=86400" } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
