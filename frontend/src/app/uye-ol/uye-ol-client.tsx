"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterFormData } from "@/modules/auth/auth.schema";
import { register } from "@/modules/auth/auth.service";
import { useAuthStore } from "@/modules/auth/auth.store";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

type FormErrors = Partial<Record<string, string>>;

const inputCls = (err?: string) =>
  cn(
    "w-full px-4 py-3 rounded-xl border text-foreground text-sm outline-none transition bg-bg-alt",
    "placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-surface",
    err ? "border-red-400" : "border-border"
  );

interface FullFormState extends Omit<RegisterFormData, "rules_accepted" | "kvkk_explicit_consent"> {
  rules_accepted: boolean;
  kvkk_explicit_consent: boolean;
}

export default function UyeOlClient({ bgImageUrl, logoUrl }: { bgImageUrl?: string | null; logoUrl?: string | null }) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState<FullFormState>({
    full_name: "", email: "", phone: "", password: "", confirmPassword: "",
    rules_accepted: false, kvkk_explicit_consent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  }

  function handleCheckbox(name: "rules_accepted" | "kvkk_explicit_consent", checked: boolean) {
    setForm((p) => ({ ...p, [name]: checked }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword: _, ...payload } = result.data;
      const res = await register(payload as Parameters<typeof register>[0]);
      setUser(res.user);
      router.push(ROUTES.panel.root);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      setServerError(
        code === "email_already_exists"
          ? "Bu e-posta adresi zaten kayıtlı."
          : "Kayıt olunamadı, lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
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
              <img src={logoUrl} alt="PaketJet" className="h-16 w-auto max-w-44 object-contain" />
            ) : (
              <span className="text-2xl font-extrabold text-white tracking-tight">paket<span className="text-brand">jet</span></span>
            )}
          </Link>
          <div>
            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              Türkiye&apos;nin<br />
              <span className="text-brand">esnek</span><br />
              kargo ağı
            </h1>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              İlan aç, taşıyıcılarla direkt bağlantı kur.<br />
              Ücretsiz · Hızlı · Güvenli.
            </p>
            <ul className="space-y-3">
              {[
                "Ücretsiz ilan aç",
                "Türkiye geneli 81 şehir",
                "İletişim bilgileriniz korunur",
                "Güvenli destek akışı",
              ].map((item) => (
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
      <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-background overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-6">
            <Link href={ROUTES.home} className="text-xl font-extrabold text-brand tracking-tight">
              paket<span className="text-foreground">jet</span>
            </Link>
          </div>

          <div className="bg-surface rounded-2xl border border-border-soft shadow-sm px-8 py-8">
            <h2 className="text-2xl font-extrabold text-foreground mb-1">Hesap Oluştur</h2>
            <p className="text-sm text-muted mb-6">
              Zaten üye misin?{" "}
              <Link href={ROUTES.auth.login} className="text-brand font-semibold hover:underline">
                Giriş yap
              </Link>
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {serverError && (
                <div className="px-4 py-3 bg-danger-bg border border-danger/20 rounded-xl text-sm text-danger">{serverError}</div>
              )}

              <div>
                <label htmlFor="reg-name" className="block text-sm font-medium text-foreground mb-1.5">Ad Soyad</label>
                <input id="reg-name" name="full_name" autoComplete="name" value={form.full_name} onChange={handleChange} placeholder="Ahmet Yılmaz" className={inputCls(errors.full_name)} />
                {errors.full_name && <p className="mt-1 text-xs text-danger">{errors.full_name}</p>}
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-foreground mb-1.5">E-posta</label>
                <input id="reg-email" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="ornek@mail.com" className={inputCls(errors.email)} />
                {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="reg-phone" className="block text-sm font-medium text-foreground mb-1.5">
                  Telefon <span className="text-muted font-normal">(isteğe bağlı)</span>
                </label>
                <input id="reg-phone" type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={handleChange} placeholder="05xx xxx xx xx" className={inputCls(errors.phone)} />
                {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-pass" className="block text-sm font-medium text-foreground mb-1.5">Şifre</label>
                  <input id="reg-pass" type="password" name="password" autoComplete="new-password" value={form.password} onChange={handleChange} placeholder="En az 6 karakter" className={inputCls(errors.password)} />
                  {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
                </div>
                <div>
                  <label htmlFor="reg-pass2" className="block text-sm font-medium text-foreground mb-1.5">Şifre Tekrar</label>
                  <input id="reg-pass2" type="password" name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} placeholder="Tekrar girin" className={inputCls(errors.confirmPassword)} />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-danger">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Checkbox 1 — Sözleşme (zorunlu) */}
              <div className="flex items-start gap-2.5 mt-2 p-3 rounded-xl bg-bg-alt border border-border">
                <input
                  type="checkbox"
                  id="rules_accepted"
                  name="rules_accepted"
                  checked={form.rules_accepted}
                  onChange={(e) => handleCheckbox("rules_accepted", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-border text-brand focus:ring-brand cursor-pointer shrink-0"
                />
                <label htmlFor="rules_accepted" className="text-xs text-muted leading-relaxed cursor-pointer select-none">
                  <Link href={ROUTES.static.kullanim} target="_blank" className="text-brand font-bold hover:underline">Kullanıcı Sözleşmesi</Link>
                  {", "}
                  <Link href={ROUTES.static.gizlilik} target="_blank" className="text-brand font-bold hover:underline">Gizlilik Politikası</Link>
                  {" ve "}
                  <Link href={ROUTES.static.tasimaKurallari} target="_blank" className="text-brand font-bold hover:underline">Taşıma Kuralları</Link>
                  {"'nı okudum ve kabul ediyorum."}{" "}
                  <span className="text-danger font-bold">*</span>
                  {errors.rules_accepted && <span className="block mt-1 text-danger font-bold">{errors.rules_accepted}</span>}
                </label>
              </div>

              {/* Checkbox 2 — KVKK Açık Rıza (zorunlu, başta işaretsiz) */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-bg-alt border border-border">
                <input
                  type="checkbox"
                  id="kvkk_explicit_consent"
                  name="kvkk_explicit_consent"
                  checked={form.kvkk_explicit_consent}
                  onChange={(e) => handleCheckbox("kvkk_explicit_consent", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-border text-brand focus:ring-brand cursor-pointer shrink-0"
                />
                <label htmlFor="kvkk_explicit_consent" className="text-xs text-muted leading-relaxed cursor-pointer select-none">
                  <Link href={ROUTES.static.kvkk} target="_blank" className="text-brand font-bold hover:underline">KVKK Aydınlatma Metni</Link>
                  {" kapsamında; iletişim ve adres bilgilerimin, ilan bedelini ödeyen üçüncü kişi taşıyıcılarla paylaşılmasına "}
                  <span className="font-bold text-foreground">AÇIK RIZA</span>
                  {" veriyorum."}{" "}
                  <span className="text-danger font-bold">*</span>
                  {errors.kvkk_explicit_consent && <span className="block mt-1 text-danger font-bold">{errors.kvkk_explicit_consent}</span>}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-sm"
              >
                {loading ? "Kaydediliyor…" : "Üye Ol →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
