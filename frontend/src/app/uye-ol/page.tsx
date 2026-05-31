import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import { getSiteSettingValue } from "@/lib/site-settings";
import UyeOlClient from "./uye-ol-client";

// Auth gorseli (auth_register_image) admin panelinden degisebilir; build-time bake
// yerine her istekte taze cekilir. Boylece backend/build sirasi sorunlarindan etkilenmez.
export const dynamic = "force-dynamic";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");
type SiteLogo = { url?: string; src?: string; logo_url?: string };

export function generateMetadata(): Metadata {
  return noIndexMetadata("Üye Ol", "PaketJet hesabı oluşturarak ilanları yönetin, rezervasyon sürecini takip edin ve panel özelliklerine erişin.");
}

export default async function UyeOlPage() {
  const [bgImage, logo] = await Promise.all([
    getSiteSettingValue<string>("auth_register_image", "*"),
    getSiteSettingValue<SiteLogo>("site_logo", "*"),
  ]);
  const toUrl = (p?: string) => p ? (p.startsWith("http") ? p : `${API_ORIGIN}${p}`) : null;
  return <UyeOlClient bgImageUrl={toUrl(bgImage ?? undefined)} logoUrl={toUrl(logo?.url || logo?.src || logo?.logo_url)} />;
}
