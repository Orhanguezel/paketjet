import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import { getSiteSettingValue } from "@/lib/site-settings";
import GirisClient from "./giris-client";

export const dynamic = "force-dynamic";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");
type SiteLogo = { url?: string; src?: string; logo_url?: string };

export function generateMetadata(): Metadata {
  return noIndexMetadata("Giriş Yap", "PaketJet hesabınıza giriş yaparak ilan, iletişim alımı ve destek süreçlerine erişin.");
}

export default async function GirisPage() {
  const logo = await getSiteSettingValue<SiteLogo>("site_logo", "*");
  const toUrl = (p?: string) => p ? (p.startsWith("http") ? p : `${API_ORIGIN}${p}`) : null;
  return <GirisClient logoUrl={toUrl(logo?.url || logo?.src || logo?.logo_url)} />;
}
