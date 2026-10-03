// KVKK cerez tercihi. Tarayicida saklanir; Google Consent Mode v2 sinyallerine cevrilir.
export const CONSENT_KEY = "pj-cookie-consent";
export const CONSENT_VERSION = 1;
export const CONSENT_OPEN_EVENT = "pj:cookie-preferences";
export type Consent = { v: number; analytics: boolean; marketing: boolean; at: string };

export function readConsent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null") as Consent | null;
    return c && c.v === CONSENT_VERSION ? c : null;
  } catch {
    return null;
  }
}

export const consentSignals = (c: Pick<Consent, "analytics" | "marketing"> | null) => ({
  analytics_storage: c?.analytics ? "granted" : "denied",
  ad_storage: c?.marketing ? "granted" : "denied",
  ad_user_data: c?.marketing ? "granted" : "denied",
  ad_personalization: c?.marketing ? "granted" : "denied",
});
