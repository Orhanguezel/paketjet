"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/auth.store";
import IlanVerForm from "@/modules/ilan/components/IlanVerForm";

export default function IlanVerClient() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  // Zustand persist rehydrate olana kadar bekle — yoksa giriş yapmış kullanıcı
  // ilk render'da (user=null) yanlışlıkla login'e atılır.
  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/giris?next=/ilan-ver");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted text-sm animate-pulse">Yükleniyor...</p>
      </div>
    );
  }
  if (!user) return null;

  return <section className="listing-page"><div className="site-container"><h1>Ücretsiz ilan ver</h1><p className="listing-page-intro">Güzergâhını paylaş, yeni bağlantılara yer aç.</p><IlanVerForm /></div></section>;
}
