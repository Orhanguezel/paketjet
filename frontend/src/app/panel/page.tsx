"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/ui";
import { useAuthStore } from "@/modules/auth/auth.store";
import { getCarrierDashboard, getCustomerDashboard } from "@/modules/dashboard/dashboard.service";
import { getMyIlans } from "@/modules/ilan/ilan.service";
import { getMyBookings } from "@/modules/booking/booking.service";
import { getMySubscription } from "@/modules/subscription/subscription.service";
import { useNotificationStore } from "@/modules/notification/notification.store";
import type { CarrierDashboard, CustomerDashboard } from "@/modules/dashboard/dashboard.service";
import type { Ilan } from "@/modules/ilan/ilan.type";

export default function PanelRoot() {
  const user = useAuthStore((s) => s.user);
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  const [carrierDashboard, setCarrierDashboard] = useState<CarrierDashboard | null>(null);
  const [customerDashboard, setCustomerDashboard] = useState<CustomerDashboard | null>(null);
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [remainingRights, setRemainingRights] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    Promise.allSettled([
      getCarrierDashboard(),
      getCustomerDashboard(),
      getMyIlans(),
      getMyBookings(),
      getMySubscription(),
      fetchUnreadCount(),
    ])
      .then((results) => {
        if (!alive) return;
        const [carrierRes, customerRes, ilanRes, bookingRes, subscriptionRes] = results;
        if (carrierRes.status === "fulfilled") setCarrierDashboard(carrierRes.value);
        if (customerRes.status === "fulfilled") setCustomerDashboard(customerRes.value);
        if (ilanRes.status === "fulfilled") setIlanlar(ilanRes.value);
        if (bookingRes.status === "fulfilled") {
          setCustomerDashboard((prev) => prev ?? {
            active_bookings: bookingRes.value.data.filter((b) => b.status === "confirmed").length,
            total_bookings: bookingRes.value.data.length,
            balance: "0.00",
          });
        }
        if (subscriptionRes.status === "fulfilled") setRemainingRights(subscriptionRes.value.usage?.remaining ?? null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [fetchUnreadCount]);

  const firstName = useMemo(() => {
    const fullName = user?.full_name?.trim();
    if (!fullName) return "PaketJet Üyesi";
    return fullName.split(/\s+/)[0] ?? fullName;
  }, [user?.full_name]);

  const activeListings = carrierDashboard?.active_ilanlar ?? ilanlar.filter((ilan) => ilan.status === "active").length;
  const soldListings = ilanlar.filter((ilan) => ilan.status === "completed").length;
  const purchased = customerDashboard?.total_bookings ?? 0;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <section className="rounded-[2rem] bg-panel-surface/90 px-6 py-7 shadow-xl shadow-navy/10 ring-1 ring-white/70 md:px-8">
        <p className="text-sm font-black uppercase tracking-normal text-brand">Özet</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal text-panel-ink md:text-4xl">
          Hoş geldiniz, {firstName}!
        </h1>
        <p className="mt-2 text-sm font-bold text-panel-ink/60">Gönderi Özeti</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="İlanlarım"
          value={loading ? "—" : `${activeListings} aktif / ${soldListings} satılan`}
          icon="ilanlarim"
        />
        <StatCard
          title="Satın Aldıklarım"
          value={loading ? "—" : purchased}
          icon="satin-aldiklarim"
        />
        <StatCard
          title="Okunmamış Bildirim"
          value={loading ? "—" : unreadCount}
          icon="bildirimler"
        />
        <StatCard
          title="Kalan İlan Alma Hakkı"
          value={loading ? "—" : remainingRights ?? 0}
          icon="ilan-alma-hakki"
        />
      </section>

      <section className="flex justify-center">
        <div className="text-center">
          <Link
            href="/ilan-ver"
            className="inline-flex min-h-16 items-center justify-center rounded-full bg-cta px-10 text-lg font-black text-white shadow-xl shadow-cta/25 transition-colors hover:bg-cta-dark"
          >
            Hızlı İlan Aç
          </Link>
          <p className="mt-3 text-sm font-black text-panel-ink/60">Kalan hakkınızdan ücretsiz düşer.</p>
        </div>
      </section>
    </div>
  );
}
