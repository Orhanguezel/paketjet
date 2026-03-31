"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, type LoginFormData } from "@/modules/auth/auth.schema";
import { login } from "@/modules/auth/auth.service";
import { useAuthStore } from "@/modules/auth/auth.store";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

const inputCls = (err?: string) =>
  cn(
    "w-full px-4 py-3 rounded-xl border text-foreground text-sm outline-none transition bg-bg-alt",
    "placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-surface",
    err ? "border-red-400" : "border-border"
  );

function GirisForm({ bgImageUrl, logoUrl }: { bgImageUrl?: string | null; logoUrl?: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const role = res.user.role;
      const defaultPanel = role === "carrier" ? ROUTES.panel.tasiyici : ROUTES.panel.musteri;
      router.push(nextParam ?? defaultPanel);
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

  async function quickLogin(email: string, password: string) {
    setForm({ email, password });
    await doLogin({ email, password });
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
              <span className="text-2xl font-extrabold text-white tracking-tight">paket<span className="text-brand">jet</span></span>
            )}
          </Link>
          <div>
            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              Hoş geldin<br /><span className="text-brand">tekrar.</span>
            </h1>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              Hesabına giriş yap ve kargo işlemlerine devam et.
            </p>
            <ul className="space-y-3">
              {["Anlık kargo takibi", "Güvenli ödeme sistemi", "7/24 müşteri desteği", "Aktif ilan arama"].map((item) => (
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
          <p className="text-white/30 text-xs">© 2026 PaketJet</p>
        </div>
      </div>

      {/* Sağ — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-6">
            <Link href={ROUTES.home} className="text-xl font-extrabold text-brand tracking-tight">
              paket<span className="text-foreground">jet</span>
            </Link>
          </div>

          <div className="bg-surface rounded-2xl border border-border-soft shadow-sm px-8 py-8">
            <h2 className="text-2xl font-extrabold text-foreground mb-1">Giriş Yap</h2>
            <p className="text-sm text-muted mb-6">
              Hesabın yok mu?{" "}
              <Link href={ROUTES.auth.register} className="text-brand font-semibold hover:underline">Üye ol</Link>
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {serverError && (
                <div className="px-4 py-3 bg-danger-bg border border-danger/20 rounded-xl text-sm text-danger">{serverError}</div>
              )}
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">E-posta</label>
                <input id="login-email" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="ornek@mail.com" className={inputCls(errors.email)} />
                {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-sm font-medium text-foreground">Şifre</label>
                  <Link href={ROUTES.auth.forgotPassword} className="text-xs text-brand hover:underline">Şifremi unuttum</Link>
                </div>
                <input id="login-password" type="password" name="password" autoComplete="current-password" value={form.password} onChange={handleChange} placeholder="Şifreniz" className={inputCls(errors.password)} />
                {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-sm">
                {loading ? "Giriş yapılıyor…" : "Giriş Yap →"}
              </button>
            </form>

            {/* Test hesapları */}
            <div className="mt-6 pt-5 border-t border-border-soft">
              <p className="text-xs text-muted mb-3 text-center">Hızlı giriş (test hesapları)</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => quickLogin("musteri@paketjet.com", "Musteri@2026!")}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-lg border border-border hover:border-brand/40 hover:bg-brand-xlight transition text-foreground disabled:opacity-60"
                >
                  👤 Müşteri
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => quickLogin("satici@paketjet.com", "Tasiyici@2026!")}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-lg border border-border hover:border-brand/40 hover:bg-brand-xlight transition text-foreground disabled:opacity-60"
                >
                  🚚 Taşıyıcı
                </button>
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_ADMIN_URL || "/admin"}/auth/login`}
                className="mt-2 block w-full py-2.5 text-xs font-semibold rounded-lg border border-navy/30 hover:border-navy hover:bg-navy/5 transition text-navy text-center"
              >
                🛡️ Admin Panel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GirisClient({ bgImageUrl, logoUrl }: { bgImageUrl?: string | null; logoUrl?: string | null }) {
  return <Suspense><GirisForm bgImageUrl={bgImageUrl} logoUrl={logoUrl} /></Suspense>;
}
