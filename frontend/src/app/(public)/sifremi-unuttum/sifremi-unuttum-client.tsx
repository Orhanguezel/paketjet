"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/modules/auth/auth.service";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/config/routes";

export default function SifremiUnuttumClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setSent(true);
      } else {
        setError("İstek gönderilemedi. Lütfen tekrar deneyin.");
      }
    } catch {
      setError("İstek şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin.");
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
          {sent ? (
            <div role="status" className="space-y-4 text-sm leading-6"><p>Bu e-posta ile etkin bir hesap varsa sıfırlama bağlantısı gönderilecektir.</p><p>Gelen kutunu ve spam klasörünü kontrol et. Bağlantı bir saat geçerlidir ve yalnız bir kez kullanılabilir.</p></div>
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
