"use client";
import { useState, useEffect } from "react";
import { getCarrierDashboard } from "@/modules/dashboard/dashboard.service";
import { getCarrierBookings } from "@/modules/booking/booking.service";
import type { CarrierDashboard } from "@/modules/dashboard/dashboard.service";
import { cn } from "@/lib/utils";

interface StatsProps {
  loading: boolean;
  dashboard: CarrierDashboard | null;
  pendingCount: number;
}

import Link from "next/link";

export function CarrierDashboardOverview() {
  const [dashboard, setDashboard] = useState<CarrierDashboard | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCarrierDashboard(), getCarrierBookings("pending")])
      .then(([dash, bList]) => {
        setDashboard(dash);
        setPendingCount(bList.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Aktif İlan",       value: loading ? "—" : dashboard?.active_ilanlar },
    { label: "Bekleyen Talep",   value: loading ? "—" : pendingCount },
    { label: "Toplam Rezerv.",   value: loading ? "—" : dashboard?.total_bookings },
    { label: "Bakiye",           value: loading ? "—" : `₺${dashboard?.balance ?? "0.00"}` },
    { label: "Bekleyen Kazanç",  value: loading ? "—" : `₺${dashboard?.pending_earnings?.toFixed(2) ?? "0.00"}` },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Taşıyıcı Paneli</h1>
        <Link href="/panel/tasiyici?tab=yeni-ilan" className="inline-flex px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors">
          + Yeni İlan
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface rounded-xl border border-border-soft p-4 text-center">
            <p className="text-xl font-extrabold text-foreground">{s.value}</p>
            <p className="text-xs text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
