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

  return (
    <section className="bg-surface">
      <div className="site-container py-10">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl">
            <h1 className="text-3xl font-extrabold text-foreground mb-8">Ücretsiz ilan ver</h1>
            <IlanVerForm />
          </div>
        </div>
      </div>
    </section>
  );
}
