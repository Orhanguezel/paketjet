"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/auth.store";
import IlanVerForm from "@/modules/ilan/components/IlanVerForm";

export default function IlanVerPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.replace("/giris?next=/ilan-ver");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-16">
        <div className="flex flex-col items-center">
           <div className="w-full max-w-lg">
             <h1 className="text-3xl font-extrabold text-foreground mb-8">Yeni İlan Oluştur</h1>
             <IlanVerForm />
           </div>
        </div>
      </div>
    </main>
  );
}
