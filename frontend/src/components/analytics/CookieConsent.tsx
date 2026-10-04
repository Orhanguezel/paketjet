"use client";
// KVKK cerez bandi. Secim yapilana kadar analitik/pazarlama cerezleri kapali (Consent Mode default: denied).
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { CONSENT_KEY, CONSENT_OPEN_EVENT, CONSENT_VERSION, consentSignals, readConsent, type Consent } from "./consent";

type Gtag = (...args: unknown[]) => void;

function apply(analytics: boolean, marketing: boolean) {
  const value: Consent = { v: CONSENT_VERSION, analytics, marketing, at: new Date().toISOString() };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(value)); } catch {}
  const w = window as unknown as { gtag?: Gtag; dataLayer?: unknown[] };
  w.gtag?.("consent", "update", consentSignals(value));
  w.dataLayer?.push({ event: "consent_update", analytics_consent: analytics, marketing_consent: marketing });
}

export default function CookieConsent() {
  const id = useId();
  const [open, setOpen] = useState(false), [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false), [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const current = readConsent();
    if (!current) setOpen(true);
    const reopen = () => { const c = readConsent(); setAnalytics(!!c?.analytics); setMarketing(!!c?.marketing); setDetails(true); setOpen(true); };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;
  const save = (a: boolean, m: boolean) => { apply(a, m); setOpen(false); setDetails(false); };
  const row = (key: string, label: string, text: string, checked: boolean, onChange?: (v: boolean) => void) => (
    <label htmlFor={`${id}-${key}`} className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
      <span><span className="block text-sm font-semibold">{label}</span><span className="mt-1 block text-xs leading-5 text-muted">{text}</span></span>
      <input id={`${id}-${key}`} type="checkbox" className="mt-1 size-5 shrink-0 accent-brand" checked={checked} disabled={!onChange} onChange={(e) => onChange?.(e.target.checked)} />
    </label>
  );

  return (
    <section role="dialog" aria-modal="false" aria-labelledby={`${id}-title`} className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:inset-x-6 sm:bottom-6">
      <h2 id={`${id}-title`} className="text-base font-semibold">Çerez tercihlerin</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Sitenin çalışması için zorunlu çerezleri kullanıyoruz. İzin verirsen ziyaretleri ölçmek (analitik) ve reklam performansını ölçmek (pazarlama) için Google çerezleri de kullanılır. Ayrıntılar: <Link href={ROUTES.static.gizlilik} className="font-medium text-brand underline">Gizlilik Politikası</Link> ve <Link href={ROUTES.static.kvkk} className="font-medium text-brand underline">KVKK Aydınlatma Metni</Link>.
      </p>
      {details && (
        <div className="mt-4 grid gap-2">
          {row("necessary", "Zorunlu", "Oturum, güvenlik ve tercihlerin. Kapatılamaz.", true)}
          {row("analytics", "Analitik", "Google Analytics ile anonim ziyaret istatistikleri.", analytics, setAnalytics)}
          {row("marketing", "Pazarlama", "Reklam dönüşümlerinin ölçülmesi.", marketing, setMarketing)}
        </div>
      )}
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {details ? (
          <button type="button" onClick={() => save(analytics, marketing)} className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold">Seçimimi kaydet</button>
        ) : (
          <button type="button" onClick={() => setDetails(true)} className="min-h-11 rounded-xl px-4 text-sm font-semibold text-brand">Tercihler</button>
        )}
        <button type="button" onClick={() => save(false, false)} className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold">Yalnızca zorunlu</button>
        <button type="button" onClick={() => save(true, true)} className="min-h-11 rounded-xl bg-action px-4 text-sm font-semibold text-on-dark">Tümünü kabul et</button>
      </div>
    </section>
  );
}

/** Footer'dan bandi yeniden acar. */
export function CookiePreferencesLink({ className }: { className?: string }) {
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>Çerez tercihleri</button>;
}
