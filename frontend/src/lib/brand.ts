// Marka ve kurum bilgisi tek kaynaktan: admin panelindeki site ayarlari (kodda marka yazmaz).
import { cache } from "react";
import { getPublicJson } from "@/lib/public-fetch";
import { API } from "@/config/api-endpoints";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
const setting = async <T,>(key: string, locale = "*") => (await getPublicJson<{ value?: T }>(`${API.siteSettings.byKey(key)}?locale=${locale}`))?.value ?? null;
const abs = (p?: string | null) => (p ? (p.startsWith("/") ? `${SITE_URL}${p}` : p) : undefined);

export type Brand = { name: string; url: string; logo?: string; description?: string; email?: string; phone?: string; sameAs: string[] };

export const getBrand = cache(async (): Promise<Brand> => {
  const [name, logo, icons, profile, contact, socials] = await Promise.all([
    setting<string>("brand_display_name"),
    setting<string>("brand_logo"),
    setting<Record<string, string>>("seo_app_icons"),
    setting<{ about?: string }>("company_profile", "tr"),
    setting<{ email?: string; email_2?: string; phone?: string }>("contact_info", "tr"),
    setting<Record<string, string>>("socials", "tr"),
  ]);
  return {
    name: name ?? "",
    url: SITE_URL,
    logo: abs(icons?.logoIcon512 ?? logo),
    description: profile?.about,
    email: contact?.email_2 || contact?.email,
    phone: contact?.phone,
    sameAs: Object.values(socials ?? {}).filter((u): u is string => typeof u === "string" && /^https:\/\//.test(u)),
  };
});
