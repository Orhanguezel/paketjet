"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCustomerDashboard, type CustomerDashboard } from "@/modules/dashboard/dashboard.service";
import { ROUTES } from "@/config/routes";

export function CustomerDashboardOverview() {
  const [dashboard, setDashboard] = useState<CustomerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomerDashboard()
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Aktif Gönderi", value: loading ? "—" : (dashboard?.active_bookings ?? 0) },
    { label: "Toplam Gönderi", value: loading ? "—" : (dashboard?.total_bookings ?? 0) },
    { label: "Cüzdan Bakiyesi", value: loading ? "—" : `₺${dashboard?.balance ?? "0.00"}` },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Müşteri Paneli</h1>
        <Link href="/ilanlar" className="inline-flex px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors">
          Hemen Kargo Gönder
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface rounded-2xl border border-border-soft p-5 transition-all hover:border-brand/30">
            <p className="text-3xl font-black text-foreground">{s.value}</p>
            <p className="text-xs font-bold text-muted uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
