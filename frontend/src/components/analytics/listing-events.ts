import { readConsent } from "./consent";

/** Yalniz basarili yeni ilan kaydinda ve analitik izni varsa gonderilir. */
export function trackListingSubmitted(listingId: string) {
  if (typeof window === "undefined" || !readConsent()?.analytics) return;
  const w = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  };
  const ga4Id = document.getElementById("ga4-config")?.getAttribute("data-measurement-id");
  if (ga4Id && w.gtag) {
    w.gtag("event", "listing_submitted", { send_to: ga4Id, listing_id: listingId });
  } else if (document.getElementById("gtm")) {
    w.dataLayer?.push({ event: "listing_submitted", listing_id: listingId });
  }
}
