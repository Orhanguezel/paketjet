"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/config/routes";

function OdemeSonucContent() {
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get("status");
  const amount = params.get("amount");
  const reason = params.get("reason");
  const isSuccess = status === "success";
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(timer);
          router.push(ROUTES.panel.ilanAlmaHakki);
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSuccess, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border-soft bg-surface p-10 text-center shadow-sm">
        {isSuccess ? (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-3xl">
              ✓
            </div>
            <h1 className="mb-2 text-xl font-extrabold text-foreground">Ödeme Başarılı</h1>
            {amount && <p className="mb-1 text-3xl font-bold text-success">₺{amount}</p>}
            <p className="mb-6 text-sm text-muted">İşleminiz hesabınıza eklendi.</p>
            <p className="mb-4 text-xs text-muted">
              {countdown} saniye içinde ilan hakkı ekranına yönlendiriliyorsunuz...
            </p>
            <Link
              href={ROUTES.panel.ilanAlmaHakki}
              className="inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              İlan Hakkına Dön
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-danger-bg text-3xl">
              ✕
            </div>
            <h1 className="mb-2 text-xl font-extrabold text-foreground">Ödeme Başarısız</h1>
            <p className="mb-6 text-sm text-muted">
              {reason === "payment_failed"
                ? "Kart işlemi reddedildi. Kart bilgilerinizi kontrol edip tekrar deneyin."
                : reason === "verification_failed"
                  ? "Ödeme doğrulanamadı. Destek ile iletişime geçin."
                  : "Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin."}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={ROUTES.panel.ilanAlmaHakki}
                className="inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Tekrar Dene
              </Link>
              <Link href={ROUTES.panel.root} className="text-sm text-muted hover:text-foreground">
                Panele Dön
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function OdemeSonucPage() {
  return (
    <Suspense>
      <OdemeSonucContent />
    </Suspense>
  );
}
