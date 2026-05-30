"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LegacyPaymentRedirectContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const query = params.toString();
    router.replace(`/panel/ilan-alma-hakki/odeme-sonuc${query ? `?${query}` : ""}`);
  }, [params, router]);

  return <div className="p-8 text-sm font-semibold text-muted">Yönlendiriliyorsunuz...</div>;
}

export default function LegacyPaymentRedirectPage() {
  return (
    <Suspense>
      <LegacyPaymentRedirectContent />
    </Suspense>
  );
}
