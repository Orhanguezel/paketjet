"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { safeReturnPath } from "@/lib/safe-redirect";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, type LoginFormData } from "@/modules/auth/auth.schema";
import { login, googleLogin } from "@/modules/auth/auth.service";
import { useAuthStore } from "@/modules/auth/auth.store";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

// Google Identity Services (GSI) minimal tip
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (cfg: { client_id: string; callback: (resp: { credential?: string }) => void }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const inputCls = (err?: string) =>
  cn(
    "w-full px-4 py-3 rounded-lg border text-foreground text-sm outline-none transition bg-bg-alt",
    "placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-surface",
    err ? "border-red-400" : "border-border"
  );

function GirisForm({ bgImageUrl, logoUrl }: { bgImageUrl?: string | null; logoUrl?: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = safeReturnPath(searchParams.get("next"));
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const [showPassword, setShowPassword] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  function afterAuth(user: { role?: string }) {
    setUser(user as Parameters<typeof setUser>[0]);
    router.push(nextParam ?? ROUTES.panel.root);
  }

  // Google Identity Services butonu (yalnızca NEXT_PUBLIC_GOOGLE_CLIENT_ID tanımlıysa)
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    function init() {
      const id = window.google?.accounts?.id;
      if (!id || !googleBtnRef.current) return;
      id.initialize({
        client_id: GOOGLE_CLIENT_ID!,
        callback: async (resp) => {
          if (!resp.credential) return;
          try {
            const res = await googleLogin(resp.credential);
            afterAuth(res.user);
          } catch {
            setServerError("Google ile giriş yapılamadı.");
          }
        },
      });
      googleBtnRef.current.innerHTML = "";
      id.renderButton(googleBtnRef.current, { theme: "outline", size: "large", text: "continue_with", shape: "pill", width: 360, locale: "tr" });
    }
    if (window.google?.accounts?.id) { init(); return; }
    const existing = document.getElementById("google-gsi") as HTMLScriptElement | null;
    if (existing) { existing.addEventListener("load", init); return; }
    const s = document.createElement("script");
    s.id = "google-gsi";
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = init;
    document.head.appendChild(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function doLogin(data: LoginFormData) {
    setServerError("");
    setErrors({});
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Partial<LoginFormData> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LoginFormData;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await login(result.data);
      setUser(res.user);
      router.push(nextParam ?? ROUTES.panel.root);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      setServerError(
        code === "invalid_credentials"
          ? "E-posta veya şifre hatalı."
          : "Giriş yapılamadı, lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await doLogin(form);
  }


  return (
    <div className="min-h-screen flex">
      {/* Sol — Görsel panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        {bgImageUrl ? (
          <img src={bgImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-navy" />
        )}
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative z-10 flex flex-col justify-between px-12 py-10 w-full">
          <Link href={ROUTES.home}>
            {logoUrl ? (
              <img src={logoUrl} alt="PaketJet" className="h-16 w-auto max-w-44 object-contain " />
            ) : (
              <span className="text-2xl font-semibold text-white tracking-tight">paket<span className="text-brand">jet</span></span>
            )}
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Hoş geldin<br /><span className="text-brand">tekrar.</span>
            </h1>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              İlanlarını yönet, satın aldığın iletişim bilgilerine dön.
            </p>
            <ul className="space-y-3">
              {["Güzergâha göre ilan ara", "İletişim bilgilerine eriş", "Taşıyıcıyla doğrudan görüş"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-white/70 text-xs">© 2026 PaketJet</p>
        </div>
      </div>

      {/* Sağ — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-6">
            <Link href={ROUTES.home} className="text-xl font-semibold text-brand tracking-tight">
              {logoUrl ? <img src={logoUrl} alt="PaketJet" className="h-12 w-auto max-w-36 object-contain"/> : <>paket<span className="text-foreground">jet</span></>}
            </Link>
          </div>

          <div className="bg-surface rounded-lg border border-border-soft shadow-sm px-8 py-8">
            <h2 className="text-2xl font-semibold text-foreground mb-1">Giriş Yap</h2>
            <p className="text-sm text-muted mb-6">
              Hesabın yok mu?{" "}
              <Link href={ROUTES.auth.register} className="text-brand font-semibold hover:underline">Üye ol</Link>
            </p>

            <form method="post" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {serverError && (
                <div role="alert" className="px-4 py-3 bg-danger-bg border border-danger/20 rounded-lg text-sm text-danger">{serverError}</div>
              )}
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">E-posta</label>
                <input aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} id="login-email" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="ornek@mail.com" className={inputCls(errors.email)} />
                {errors.email && <p id="email-error" role="alert" className="mt-1 text-xs text-danger">{errors.email}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-sm font-medium text-foreground">Şifre</label>
                  <Link href={ROUTES.auth.forgotPassword} className="text-xs text-brand hover:underline">Şifremi unuttum</Link>
                </div>
                <input aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} id="login-password" type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" value={form.password} onChange={handleChange} placeholder="Şifreniz" className={inputCls(errors.password)} />
                <button type="button" aria-controls="login-password" aria-pressed={showPassword} onClick={() => setShowPassword(v => !v)} className="min-h-11 text-sm text-brand">{showPassword ? "Şifreyi gizle" : "Şifreyi göster"}</button>
                {errors.password && <p id="password-error" role="alert" className="mt-1 text-xs text-danger">{errors.password}</p>}
              </div>
              <button type="submit" disabled={loading || !ready} data-ready={ready} className="w-full py-3.5 bg-action text-white font-bold rounded-lg hover:bg-brand-dark transition disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-sm">
                {loading ? "Giriş yapılıyor…" : "Giriş Yap →"}
              </button>
            </form>

            {/* Google ile giriş (NEXT_PUBLIC_GOOGLE_CLIENT_ID tanımlıysa) */}
            {GOOGLE_CLIENT_ID && (
              <div className="mt-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px flex-1 bg-border-soft" />
                  <span className="text-xs text-muted">veya</span>
                  <span className="h-px flex-1 bg-border-soft" />
                </div>
                <div ref={googleBtnRef} className="flex justify-center" />
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
}

export default function GirisClient({ bgImageUrl, logoUrl }: { bgImageUrl?: string | null; logoUrl?: string | null }) {
  return <Suspense><GirisForm bgImageUrl={bgImageUrl} logoUrl={logoUrl} /></Suspense>;
}
