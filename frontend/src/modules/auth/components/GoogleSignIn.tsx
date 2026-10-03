"use client";
// Google ile giris/kayit. Client id calisma aninda sunucudan okunur (dogrulayicinin kullandigi ayni kaynak);
// yapilandirilmamissa dugme hic gorunmez. Ilk Google kaydinda Kullanim Kosullari + KVKK onayi istenir.
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { getGoogleConfig, googleLogin } from "@/modules/auth/auth.service";
import type { AuthResponse } from "@/modules/auth/auth.type";

type Gsi = { initialize: (cfg: { client_id: string; callback: (r: { credential?: string }) => void; ux_mode?: string }) => void; renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void };
declare global { interface Window { google?: { accounts?: { id?: Gsi } } } }

let gsiPromise: Promise<Gsi> | null = null;
function loadGsi(): Promise<Gsi> {
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);
  gsiPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => (window.google?.accounts?.id ? resolve(window.google.accounts.id) : reject(new Error("gsi_missing")));
    s.onerror = () => { gsiPromise = null; reject(new Error("gsi_load_failed")); };
    document.head.appendChild(s);
  });
  return gsiPromise;
}

/** Yalniz gosterim icin: e-posta/ad id_token govdesinden okunur (dogrulama sunucuda). */
function tokenProfile(token: string): { email?: string; name?: string } {
  try { return JSON.parse(decodeURIComponent(escape(atob(token.split(".")[1]!.replace(/-/g, "+").replace(/_/g, "/"))))); } catch { return {}; }
}

const MESSAGES: Record<string, string> = {
  email_not_verified: "Google hesabının e-posta adresi doğrulanmamış. Google hesabını doğruladıktan sonra tekrar dene.",
  account_disabled: "Bu hesap kullanıma kapalı. Destek ile iletişime geç.",
  google_oauth_not_configured: "Google ile giriş şu anda kullanılamıyor.",
  legal_content_unavailable: "Sözleşme metinleri şu anda yüklenemedi. Biraz sonra tekrar dene.",
};

export default function GoogleSignIn({ onSuccess, text = "continue_with" }: { onSuccess: (r: AuthResponse) => void; text?: "signin_with" | "signup_with" | "continue_with" }) {
  const id = useId(), box = useRef<HTMLDivElement>(null), done = useRef(onSuccess);
  done.current = onSuccess;
  const [clientId, setClientId] = useState<string | null>(null);
  const [pending, setPending] = useState<{ token: string; email?: string; name?: string } | null>(null);
  const [rules, setRules] = useState(false), [kvkk, setKvkk] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState("");

  useEffect(() => { getGoogleConfig().then((c) => setClientId(c.configured ? c.clientId : null)).catch(() => setClientId(null)); }, []);

  useEffect(() => {
    if (!clientId || !box.current) return;
    let alive = true;
    loadGsi().then((gsi) => {
      if (!alive || !box.current) return;
      gsi.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          if (!credential) return;
          setError(""); setBusy(true);
          try { done.current(await googleLogin(credential)); }
          catch (e) {
            const code = (e as { code?: string }).code ?? "";
            if (code === "consent_required") { setRules(false); setKvkk(false); setPending({ token: credential, ...tokenProfile(credential) }); }
            else setError(MESSAGES[code] ?? "Google ile giriş yapılamadı. Tekrar dene.");
          } finally { setBusy(false); }
        },
      });
      box.current.innerHTML = "";
      gsi.renderButton(box.current, { theme: "outline", size: "large", text, shape: "pill", width: Math.min(box.current.clientWidth || 360, 400), locale: "tr" });
    }).catch(() => alive && setError("Google bağlantısı yüklenemedi. Sayfayı yenileyip tekrar dene."));
    return () => { alive = false; };
  }, [clientId, text]);

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (!pending || !rules || !kvkk) return;
    setBusy(true); setError("");
    try { done.current(await googleLogin(pending.token, { rules_accepted: true, kvkk_explicit_consent: true })); }
    catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setPending(null);
      setError(code === "invalid_google_token" ? "Google oturumunun süresi doldu. Google ile tekrar devam et." : MESSAGES[code] ?? "Hesap oluşturulamadı. Tekrar dene.");
    } finally { setBusy(false); }
  }

  if (!clientId) return null;
  return (
    <div className="mt-5">
      <div className="mb-4 flex items-center gap-3"><span className="h-px flex-1 bg-border-soft" /><span className="text-xs text-muted">veya</span><span className="h-px flex-1 bg-border-soft" /></div>
      <div ref={box} className="flex min-h-11 justify-center" aria-busy={busy} />
      {error && <p role="alert" className="mt-3 text-center text-sm text-danger">{error}</p>}
      {pending && (
        <div role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <form onSubmit={confirm} className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
            <h2 id={`${id}-title`} className="text-xl font-semibold">Hesabını oluştur</h2>
            <p className="mt-2 text-sm text-muted">{pending.email ? <><strong className="text-foreground">{pending.email}</strong> Google hesabıyla ilk kez giriş yapıyorsun.</> : "Google hesabınla ilk kez giriş yapıyorsun."} Devam etmek için aşağıdaki onayları ver.</p>
            <label className="mt-5 flex items-start gap-2.5 rounded-xl border border-border bg-bg-alt p-3 text-sm leading-relaxed text-muted">
              <input type="checkbox" checked={rules} onChange={(e) => setRules(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-brand" />
              <span><Link href={ROUTES.static.kullanim} target="_blank" className="font-semibold text-brand hover:underline">Kullanıcı Sözleşmesi</Link>, <Link href={ROUTES.static.gizlilik} target="_blank" className="font-semibold text-brand hover:underline">Gizlilik Politikası</Link> ve <Link href={ROUTES.static.tasimaKurallari} target="_blank" className="font-semibold text-brand hover:underline">Taşıma Kuralları</Link>&apos;nı okudum ve kabul ediyorum. <span className="font-semibold text-danger">*</span></span>
            </label>
            <label className="mt-3 flex items-start gap-2.5 rounded-xl border border-border bg-bg-alt p-3 text-sm leading-relaxed text-muted">
              <input type="checkbox" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-brand" />
              <span><Link href={ROUTES.static.kvkk} target="_blank" className="font-semibold text-brand hover:underline">KVKK Aydınlatma Metni</Link> kapsamında; ilan için verdiğim özel iletişim bilgilerinin, iletişim erişimini satın alan kullanıcılarla paylaşılmasına <span className="font-semibold text-foreground">AÇIK RIZA</span> veriyorum. <span className="font-semibold text-danger">*</span></span>
            </label>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setPending(null)} className="min-h-11 rounded-xl border border-border px-5 text-sm">Vazgeç</button>
              <button type="submit" disabled={!rules || !kvkk || busy} className="min-h-11 rounded-xl bg-action px-5 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Hesap açılıyor…" : "Onayla ve devam et"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
