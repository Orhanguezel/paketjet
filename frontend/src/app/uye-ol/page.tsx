import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import { getSiteSettingValue } from "@/lib/site-settings";
import UyeOlClient from "./uye-ol-client";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");

export function generateMetadata(): Metadata {
  return noIndexMetadata("Üye Ol", "PaketJet hesabı oluşturarak ilanları yönetin, rezervasyon sürecini takip edin ve panel özelliklerine erişin.");
}

export default async function UyeOlPage() {
  const [bgImage, logo] = await Promise.all([
    getSiteSettingValue<string>("auth_register_image", "*"),
    getSiteSettingValue<{ url?: string }>("site_logo", "*"),
  ]);
  const toUrl = (p?: string) => p ? (p.startsWith("http") ? p : `${API_ORIGIN}${p}`) : null;
  return <UyeOlClient bgImageUrl={toUrl(bgImage ?? undefined)} logoUrl={toUrl(logo?.url)} />;
}
