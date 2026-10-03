// GTM / GA4 / Search Console ayarlari admin panelinden (site_settings, locale '*') gelir.
// Degerler sayfaya script olarak yazildigi icin SIKI bicim kontrolunden gecer; uymayan deger yok sayilir.
import { getPublicJson } from "@/lib/public-fetch";
import { API } from "@/config/api-endpoints";

const GTM = /^GTM-[A-Z0-9]{4,12}$/;
const GA4 = /^G-[A-Z0-9]{6,14}$/;
const VERIFY = /^[A-Za-z0-9_-]{10,100}$/;

async function setting(key: string): Promise<string> {
  const row = await getPublicJson<{ value?: unknown }>(`${API.siteSettings.byKey(key)}?locale=*`);
  return typeof row?.value === "string" ? row.value.trim() : "";
}

export type AnalyticsConfig = { gtmId: string | null; ga4Id: string | null; googleVerification: string | null };

export async function getAnalyticsConfig(): Promise<AnalyticsConfig> {
  const [gtm, ga4, verify] = await Promise.all([setting("gtm_container_id"), setting("ga4_measurement_id"), setting("google_site_verification")]);
  const envVerify = process.env.GOOGLE_SITE_VERIFICATION?.trim() ?? "";
  return {
    gtmId: GTM.test(gtm.toUpperCase()) ? gtm.toUpperCase() : null,
    ga4Id: GA4.test(ga4.toUpperCase()) ? ga4.toUpperCase() : null,
    googleVerification: VERIFY.test(verify) ? verify : VERIFY.test(envVerify) ? envVerify : null,
  };
}
