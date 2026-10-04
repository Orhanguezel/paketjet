import { afterEach, expect, it, vi } from "vitest";
import { CONSENT_KEY, CONSENT_VERSION } from "./consent";
import { trackListingSubmitted } from "./listing-events";

afterEach(() => {
  localStorage.clear();
  document.getElementById("ga4-config")?.remove();
  document.getElementById("gtm")?.remove();
  delete (window as typeof window & { gtag?: unknown; dataLayer?: unknown }).gtag;
  delete (window as typeof window & { gtag?: unknown; dataLayer?: unknown }).dataLayer;
});

it("sends one confirmed listing event only with analytics consent", () => {
  const gtag = vi.fn();
  (window as typeof window & { gtag?: unknown }).gtag = gtag;
  const script = document.createElement("script");
  script.id = "ga4-config";
  script.dataset.measurementId = "G-TEST123456";
  document.head.append(script);

  trackListingSubmitted("listing-1");
  expect(gtag).not.toHaveBeenCalled();
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: CONSENT_VERSION, analytics: true, marketing: false, at: new Date().toISOString() }));
  trackListingSubmitted("listing-1");
  expect(gtag).toHaveBeenCalledExactlyOnceWith("event", "listing_submitted", { send_to: "G-TEST123456", listing_id: "listing-1" });
});
