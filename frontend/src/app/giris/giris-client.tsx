"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { safeReturnPath } from "@/lib/safe-redirect";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, type LoginFormData } from "@/modules/auth/auth.schema";
import { login, googleLogin } from "@/modules/auth/auth.service";
import { useAuthStore } from "@/modules/auth/auth.store";
import { ROUTES } from "@/config/routes";
import LoginFrame from "./login-frame";
import { PasswordInput } from "@/components/ui/PasswordInput";
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
    "w-full px-4 py-3 rounded-xl border text-foreground text-base outline-none transition bg-surface",
    "placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-surface",
    err ? "border-danger" : "border-border"
  );

function GirisForm({ logoUrl }: { logoUrl?: string | null }) {
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


  return <LoginFrame logoUrl={logoUrl}>
    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tekrar hoş geldin</h1>
    <p className="mt-3 mb-8 text-muted">Hesabına giriş yap.</p>
    <form method="post" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {searchParams.get("passwordChanged")==="1"&&<p role="status" className="rounded-xl bg-brand-bg px-4 py-3 text-sm text-brand">Şifren değiştirildi. Yeni şifrenle giriş yapabilirsin.</p>}
      {serverError && <div role="alert" className="rounded-xl border border-danger/20 bg-danger-bg px-4 py-3 text-sm text-danger">{serverError}</div>}
      <div><label htmlFor="login-email" className="mb-2 block text-sm font-medium">E-posta</label>
        <input disabled={!ready||loading} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} id="login-email" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="E-posta adresin" className={inputCls(errors.email)}/>
        {errors.email&&<p id="email-error" role="alert" className="mt-2 text-sm text-danger">{errors.email}</p>}
      </div>
      <div><label htmlFor="login-password" className="mb-2 block text-sm font-medium">Şifre</label>
        <PasswordInput disabled={!ready||loading} aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} id="login-password" name="password" autoComplete="current-password" value={form.password} onChange={handleChange} placeholder="Şifren" className={inputCls(errors.password)}/>
        {errors.password&&<p id="password-error" role="alert" className="mt-2 text-sm text-danger">{errors.password}</p>}
        <Link href={ROUTES.auth.forgotPassword} className="mt-2 flex min-h-11 items-center justify-end text-sm font-medium text-brand hover:underline">Şifremi unuttum</Link>
      </div>
      <button type="submit" disabled={loading||!ready} data-ready={ready} className="min-h-13 w-full rounded-xl bg-action px-5 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60">{loading?'Giriş yapılıyor…':'Giriş yap'}</button>
    </form>
    {GOOGLE_CLIENT_ID&&<div className="mt-5"><div className="mb-4 flex items-center gap-3"><span className="h-px flex-1 bg-border-soft"/><span className="text-xs text-muted">veya</span><span className="h-px flex-1 bg-border-soft"/></div><div ref={googleBtnRef} className="flex justify-center"/></div>}
    <p className="mt-7 border-t border-border-soft pt-6 text-center text-sm text-muted">Hesabın yok mu? <Link href={ROUTES.auth.register} className="font-semibold text-brand hover:underline">Hemen üye ol</Link></p>
  </LoginFrame>;
}
export default function GirisClient({logoUrl}:{logoUrl?:string|null}) { return <Suspense><GirisForm logoUrl={logoUrl}/></Suspense>; }
