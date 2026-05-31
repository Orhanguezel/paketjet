"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/ui";
import { useAuthStore } from "@/modules/auth/auth.store";
import { getMyIlans } from "@/modules/ilan/ilan.service";
import { getMyCredits, getMyPurchases } from "@/modules/purchases/purchases.service";
import { useNotificationStore } from "@/modules/notification/notification.store";
import type { Ilan } from "@/modules/ilan/ilan.type";

export default function PanelRoot() {
  const user = useAuthStore((s) => s.user);
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [purchasedCount, setPurchasedCount] = useState(0);
  const [remainingRights, setRemainingRights] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    Promise.allSettled([
      getMyIlans(),
      getMyPurchases(),
      getMyCredits(),
      fetchUnreadCount(),
    ])
      .then((results) => {
        if (!alive) return;
        const [ilanRes, purchaseRes, creditRes] = results;
        if (ilanRes.status === "fulfilled") setIlanlar(ilanRes.value);
        if (purchaseRes.status === "fulfilled") setPurchasedCount(purchaseRes.value.data.length);
        if (creditRes.status === "fulfilled") setRemainingRights(creditRes.value.balance);
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

  const activeListings = ilanlar.filter((ilan) => ilan.status === "active").length;
  const soldListings = ilanlar.filter((ilan) => ilan.status === "sold" || ilan.status === "completed").length;

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
          value={loading ? "—" : purchasedCount}
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
          <p className="mt-3 text-sm font-black text-panel-ink/60">İlan açmak ücretsizdir.</p>
        </div>
      </section>
    </div>
  );
}
