"use client";
import { useState, useEffect } from "react";
import { getWallet } from "@/modules/wallet/wallet.service";
import type { Wallet } from "@/modules/wallet/wallet.type";
import { useAuthStore } from "@/modules/auth/auth.store";
import BakiyeCard from "./_components/BakiyeCard";
import IslemlerTab from "./_components/IslemlerTab";
import ParaCekTab from "./_components/ParaCekTab";
import DepositTab from "./_components/DepositTab";
import { CarrierDashboardOverview } from "@/modules/dashboard/components/CarrierDashboardHeader";
import { CustomerDashboardOverview } from "@/modules/dashboard/components/CustomerDashboardHeader";

type Tab = "deposit" | "islemler" | "para-cek";

export default function CuzdanPage() {
  const { user } = useAuthStore();
  const isCarrier = user?.role === "carrier";
  
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("islemler");

  const refreshWallet = () => {
    getWallet()
      .then(setWallet)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshWallet();
  }, []);

  const tabs: { key: Tab, label: string }[] = [
    { key: "islemler", label: "İşlemler" },
    { key: "deposit",  label: "Bakiye Yükle" },
  ];

  if (isCarrier) {
    tabs.push({ key: "para-cek", label: "Para Çek" });
  }

  return (
    <div className="max-w-3xl">
      {isCarrier ? <CarrierDashboardOverview /> : <CustomerDashboardOverview />}
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Cüzdanım</h1>

      <BakiyeCard wallet={wallet} loading={loading} />

      {/* Tabs Menu */}
      <div className="flex gap-1 bg-bg-alt rounded-lg p-1 mb-6 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "islemler" && <IslemlerTab />}
        {tab === "deposit" && <DepositTab onDeposit={refreshWallet} />}
        {tab === "para-cek" && isCarrier && <ParaCekTab onWithdraw={refreshWallet} />}
      </div>
    </div>
  );
}
