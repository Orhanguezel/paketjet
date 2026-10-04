// /manifest.webmanifest — ad, aciklama ve ikonlar admin panelindeki marka/ikon ayarlarindan.
import type { MetadataRoute } from "next";
import { getPublicJson } from "@/lib/public-fetch";
import { API } from "@/config/api-endpoints";
import { getStorefrontTheme } from "@/lib/storefront-theme-data";

export const revalidate = 30;
const val = async <T,>(key: string) => (await getPublicJson<{ value?: T }>(`${API.siteSettings.byKey(key)}?locale=*`, 3600))?.value ?? null;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const [name, subtitle, icons, theme] = await Promise.all([val<string>("brand_display_name"), val<string>("brand_subtitle"), val<Record<string, string>>("seo_app_icons"), getStorefrontTheme()]);
  const list: MetadataRoute.Manifest["icons"] = [];
  if (icons?.logoIcon192) list.push({ src: icons.logoIcon192, sizes: "192x192", type: "image/png" });
  if (icons?.logoIcon512) list.push({ src: icons.logoIcon512, sizes: "512x512", type: "image/png", purpose: "any" });
  return {
    name: name && subtitle ? `${name} — ${subtitle}` : name ?? "",
    short_name: name ?? "",
    description: subtitle ?? undefined,
    start_url: "/",
    display: "standalone",
    lang: "tr",
    background_color: theme?.colors.background ?? "#ffffff",
    theme_color: theme?.colors.primary ?? "#542bd5",
    icons: list,
  };
}
