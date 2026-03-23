"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

function OdemeSonucContent() {
  const params    = useSearchParams();
  const router    = useRouter();
  const status    = params.get("status");   // "success" | "fail"
  const amount    = params.get("amount");   // "100.00"
  const reason    = params.get("reason");   // hata kodu (opsiyonel)
  const isSuccess = status === "success";

  const [countdown, setCountdown] = useState(5);

  // Başarılıysa 5 sn sonra cüzdana yönlendir
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push(ROUTES.panel.cuzdan);
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSuccess, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-surface rounded-2xl border border-border-soft shadow-sm p-10 max-w-sm w-full text-center">
        {isSuccess ? (
          <>
            <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-5 text-3xl">
              ✓
            </div>
            <h1 className="text-xl font-extrabold text-foreground mb-2">Ödeme Başarılı</h1>
            {amount && (
              <p className="text-3xl font-bold text-success mb-1">₺{amount}</p>
            )}
            <p className="text-sm text-muted mb-6">
              Bakiyeniz hesabınıza eklendi.
            </p>
            <p className="text-xs text-muted mb-4">
              {countdown} saniye içinde cüzdana yönlendiriliyorsunuz…
            </p>
            <Link
              href={ROUTES.panel.cuzdan}
              className="inline-block px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark transition-colors"
            >
              Cüzdana Dön
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-danger-bg flex items-center justify-center mx-auto mb-5 text-3xl">
              ✕
            </div>
            <h1 className="text-xl font-extrabold text-foreground mb-2">Ödeme Başarısız</h1>
            <p className="text-sm text-muted mb-6">
              {reason === "payment_failed"
                ? "Kart işlemi reddedildi. Kart bilgilerinizi kontrol edip tekrar deneyin."
                : reason === "verification_failed"
                ? "Ödeme doğrulanamadı. Destek ile iletişime geçin."
                : "Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin."}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={ROUTES.panel.cuzdan}
                className="inline-block px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark transition-colors"
              >
                Tekrar Dene
              </Link>
              <Link
                href={ROUTES.panel.musteri}
                className="text-sm text-muted hover:text-foreground"
              >
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
