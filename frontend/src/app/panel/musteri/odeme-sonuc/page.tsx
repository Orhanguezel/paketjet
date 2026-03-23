"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

function ResultContent() {
  const params = useSearchParams();
  const status = params.get("status"); // success | fail
  const bookingId = params.get("bookingId");

  const isSuccess = status === "success";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 ${isSuccess ? "bg-success/10" : "bg-danger/10"}`}>
        {isSuccess ? "✓" : "✕"}
      </div>

      <h1 className="text-2xl font-extrabold text-foreground mb-2">
        {isSuccess ? "Ödeme Başarılı" : "Ödeme Başarısız"}
      </h1>

      <p className="text-sm text-muted max-w-md mb-8">
        {isSuccess
          ? "Rezervasyonunuz başarıyla oluşturuldu. Taşıyıcı onayından sonra kargonuz yola çıkacak."
          : "Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın."}
      </p>

      <div className="flex gap-3">
        <Link
          href={ROUTES.panel.musteri}
          className="px-6 py-2.5 rounded-lg bg-brand text-white text-sm font-bold hover:bg-brand/90 transition-colors"
        >
          Rezervasyonlarım
        </Link>
        {!isSuccess && (
          <Link
            href={ROUTES.ilanlar.list}
            className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm font-bold hover:bg-surface transition-colors"
          >
            İlanlara Dön
          </Link>
        )}
      </div>

      {bookingId && isSuccess && (
        <p className="text-xs text-muted mt-6">Rezervasyon: #{bookingId.slice(0, 8)}</p>
      )}
    </div>
  );
}

export default function OdemeSonucPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-muted">Yükleniyor...</div>}>
      <ResultContent />
    </Suspense>
  );
}
