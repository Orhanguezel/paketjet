"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/config/routes";

function LegacyCustomerPaymentResultRedirect() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const query = params.toString();
    router.replace(`${ROUTES.panel.ilanAlmaHakki}/odeme-sonuc${query ? `?${query}` : ""}`);
  }, [params, router]);

  return <div className="p-8 text-sm font-semibold text-muted">Yönlendiriliyorsunuz...</div>;
}

export default function LegacyCustomerPaymentResultPage() {
  return (
    <Suspense>
      <LegacyCustomerPaymentResultRedirect />
    </Suspense>
  );
}
