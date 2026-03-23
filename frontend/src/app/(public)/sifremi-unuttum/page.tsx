"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/modules/auth/auth.service";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/config/routes";

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setToken(res.token ?? null);
      } else {
        setError("İstek gönderilemedi. Lütfen tekrar deneyin.");
      }
    } catch {
      setError("E-posta adresi bulunamadı veya bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-foreground tracking-tight">
            paket<span className="text-brand">jet</span>
          </Link>
          <h1 className="text-xl font-bold text-foreground mt-4">Şifremi Unuttum</h1>
          <p className="text-sm text-muted mt-1">
            E-posta adresinizi girin, sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-border-soft p-6">
          {token ? (
            /* Başarı durumu — dev ortamında token gösterimi */
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <span className="text-success text-lg">✓</span>
                <p className="text-sm text-success font-medium">Sıfırlama token'ı oluşturuldu</p>
              </div>
              <p className="text-xs text-muted">
                Aşağıdaki token'ı kopyalayarak şifre sıfırlama sayfasında kullanın.
              </p>
              <div className="bg-bg-alt rounded-lg p-3 break-all">
                <p className="text-xs font-mono text-foreground">{token}</p>
              </div>
              <Link
                href={`${ROUTES.auth.resetPassword}?token=${encodeURIComponent(token)}`}
                className="w-full py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors text-center block"
              >
                Şifremi Sıfırla →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
                required
                autoFocus
              />
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button type="submit" loading={loading} disabled={!email}>
                Sıfırlama Bağlantısı Gönder
              </Button>
            </form>
          )}
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
