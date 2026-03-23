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
    "placeholder:text-faint focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-surface",
    err ? "border-red-400" : "border-border"
  );

function GirisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? ROUTES.panel.musteri;
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const result = loginSchema.safeParse(form);
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
      router.push(nextPath);
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

  return (
    <div className="min-h-screen flex">
      {/* Sol panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-navy flex-col justify-between px-12 py-10">
        <Link href={ROUTES.home} className="text-2xl font-extrabold text-white tracking-tight">
          paket<span className="text-brand">jet</span>
        </Link>
        <div>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Hoş geldin<br /><span className="text-brand">tekrar.</span>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Hesabına giriş yap ve kargo işlemlerine devam et.
          </p>
          <ul className="space-y-3">
            {["Anlık kargo takibi", "Güvenli ödeme sistemi", "7/24 müşteri desteği", "1.200+ güvenilir taşıyıcı"].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
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

      {/* Sağ panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-bg-alt">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-6">
            <Link href={ROUTES.home} className="text-xl font-extrabold text-brand tracking-tight">
              paket<span className="text-foreground">jet</span>
            </Link>
          </div>

          <div className="bg-surface rounded-2xl border border-border shadow-sm px-8 py-8">
            <h2 className="text-2xl font-extrabold text-foreground mb-1">Giriş Yap</h2>
            <p className="text-sm text-muted mb-6">
              Hesabın yok mu?{" "}
              <Link href={ROUTES.auth.register} className="text-brand font-semibold hover:underline">Üye ol</Link>
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {serverError && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{serverError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">E-posta</label>
                <input type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="ornek@mail.com" className={inputCls(errors.email)} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">Şifre</label>
                  <Link href={ROUTES.auth.forgotPassword} className="text-xs text-brand hover:underline">Şifremi unuttum</Link>
                </div>
                <input type="password" name="password" autoComplete="current-password" value={form.password} onChange={handleChange} placeholder="Şifreniz" className={inputCls(errors.password)} />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-sm">
                {loading ? "Giriş yapılıyor…" : "Giriş Yap →"}
              </button>
            </form>
          </div>

          {/* Test hesaplari notu */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 bg-surface rounded-2xl border border-border-soft px-6 py-5">
              <p className="text-xs font-bold text-muted mb-3 uppercase tracking-wide">Test Hesaplari</p>
              <div className="space-y-2.5 text-xs text-muted">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Admin</span>
                  <span>orhanguzell@gmail.com / admin123</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Tasiyici</span>
                  <span>satici@paketjet.com / Tasiyici@2026!</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Musteri</span>
                  <span>musteri@kamanilan.com / Musteri@2026!</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GirisPage() {
  return <Suspense><GirisForm /></Suspense>;
}
