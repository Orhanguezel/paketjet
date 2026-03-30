"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/auth.store";

export default function IlanVerPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/uye-ol");
    } else if (user?.role === "carrier" || user?.role === "admin") {
      router.replace("/panel/tasiyici?tab=yeni-ilan");
    } else {
      // Müşteri rolündeyse taşıyıcı olması gerektiğini belirt
      router.replace("/uye-ol");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted text-sm animate-pulse">Yönlendiriliyorsunuz...</p>
    </div>
  );
}
