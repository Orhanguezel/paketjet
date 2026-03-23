"use client";
import { useAuthStore } from "@/modules/auth/auth.store";
import { CarrierDashboardOverview } from "@/modules/dashboard/components/CarrierDashboardHeader";
import AbonelikTab from "../tasiyici/_components/AbonelikTab";

export default function AbonelikPage() {
  const { user } = useAuthStore();
  const isCarrier = user?.role === "carrier";

  return (
    <div>
      {isCarrier && <CarrierDashboardOverview />}
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Abonelik Sistemleri</h1>
      <AbonelikTab />
    </div>
  );
}
