// /og?title=…&kind=… — sayfa basina paylasim gorseli (1200x630). Marka adi admin ayarindan.
import { ImageResponse } from "next/og";
import { getPublicJson } from "@/lib/public-fetch";
import { API } from "@/config/api-endpoints";

export const revalidate = 86400;
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
const clean = (v: string | null, max: number) => (v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const title = clean(q.get("title"), 110);
  const kind = clean(q.get("kind"), 40);
  const brand = (await getPublicJson<{ value?: string }>(`${API.siteSettings.byKey("brand_display_name")}?locale=*`, 86400))?.value ?? "";
  const tagline = (await getPublicJson<{ value?: string }>(`${API.siteSettings.byKey("brand_tagline")}?locale=*`, 86400))?.value ?? "";
  const host = SITE.replace(/^https?:\/\//, "");
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", padding: 72, flexDirection: "column", justifyContent: "space-between", background: "hsl(250, 75%, 97%)", color: "hsl(220, 35%, 14%)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
        <div style={{ display: "flex", width: 18, height: 18, borderRadius: 9, background: "hsl(256, 67%, 49%)" }} />
        {brand}
        {kind ? <div style={{ display: "flex", marginLeft: 12, padding: "6px 18px", borderRadius: 999, fontSize: 24, fontWeight: 600, color: "hsl(256, 67%, 42%)", background: "hsl(256, 80%, 92%)" }}>{kind}</div> : null}
      </div>
      <div style={{ display: "flex", fontSize: title.length > 60 ? 58 : 70, fontWeight: 700, lineHeight: 1.12, maxWidth: 1050 }}>{title || tagline}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "hsl(220, 15%, 40%)" }}>
        <span>{title ? tagline : ""}</span>
        <span style={{ color: "hsl(256, 67%, 49%)", fontWeight: 600 }}>{host}</span>
      </div>
    </div>,
    { width: 1200, height: 630, headers: { "cache-control": "public, max-age=86400, s-maxage=86400" } },
  );
}
