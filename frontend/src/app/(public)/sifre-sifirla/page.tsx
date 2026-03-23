"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/modules/auth/auth.service";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/config/routes";

function SifreSifirlaForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (!token) {
      setError("Token eksik. Lütfen şifremi unuttum sayfasından tekrar isteyin.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await resetPassword(token, password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => router.push(ROUTES.auth.login), 2500);
      } else {
        setError("Şifre sıfırlanamadı. Token geçersiz veya süresi dolmuş.");
      }
    } catch {
      setError("Şifre sıfırlanamadı. Token geçersiz veya süresi dolmuş.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center text-success text-2xl">
          ✓
        </div>
        <p className="font-semibold text-foreground">Şifreniz güncellendi!</p>
        <p className="text-sm text-muted text-center">
          Giriş sayfasına yönlendiriliyorsunuz…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Sıfırlama Token'ı"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Token'ı buraya yapıştırın"
        required
      />
      <Input
        label="Yeni Şifre"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="En az 6 karakter"
        required
      />
      <Input
        label="Şifre Tekrar"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Şifreyi tekrar girin"
        required
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" loading={loading} disabled={!token || !password || !confirm}>
        Şifremi Güncelle
      </Button>
    </form>
  );
}

export default function SifreSifirlaPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-foreground tracking-tight">
            paket<span className="text-brand">jet</span>
          </Link>
          <h1 className="text-xl font-bold text-foreground mt-4">Şifre Sıfırla</h1>
          <p className="text-sm text-muted mt-1">
            Yeni şifrenizi belirleyin.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-border-soft p-6">
          <Suspense fallback={<div className="h-40 animate-pulse bg-bg-alt rounded-lg" />}>
            <SifreSifirlaForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          <Link href={ROUTES.auth.login} className="text-brand hover:underline">
            ← Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </main>
  );
}
