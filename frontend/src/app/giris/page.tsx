import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import { getSiteSettingValue } from "@/lib/site-settings";
import GirisClient from "./giris-client";

// Auth gorseli (auth_login_image) admin panelinden degisebilir; build-time bake
// yerine her istekte taze cekilir. Boylece backend/build sirasi sorunlarindan etkilenmez.
export const dynamic = "force-dynamic";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");
type SiteLogo = { url?: string; src?: string; logo_url?: string };

export function generateMetadata(): Metadata {
  return noIndexMetadata("Giriş Yap", "PaketJet hesabınıza giriş yaparak ilan, rezervasyon ve destek süreçlerine erişin.");
}

export default async function GirisPage() {
  const [bgImage, logo] = await Promise.all([
    getSiteSettingValue<string>("auth_login_image", "*"),
    getSiteSettingValue<SiteLogo>("site_logo", "*"),
  ]);
  const toUrl = (p?: string) => p ? (p.startsWith("http") ? p : `${API_ORIGIN}${p}`) : null;
  return <GirisClient bgImageUrl={toUrl(bgImage ?? undefined)} logoUrl={toUrl(logo?.url || logo?.src || logo?.logo_url)} />;
}
