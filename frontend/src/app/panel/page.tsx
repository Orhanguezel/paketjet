"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/auth.store";

export default function PanelRoot() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);

  useEffect(() => {
    if (role === "carrier") {
      router.replace("/panel/tasiyici");
    } else {
      router.replace("/panel/musteri");
    }
  }, [role, router]);

  return <div className="p-8 text-muted text-sm font-semibold">Yönlendiriliyorsunuz...</div>;
}
