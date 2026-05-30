"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyPurchases } from "@/modules/purchases/purchases.service";
import type { MyPurchase } from "@/modules/purchases/purchases.type";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Icon } from "@/components/ui";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SatinAldiklarimPage() {
  const [purchases, setPurchases] = useState<MyPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getMyPurchases()
      .then((res) => {
        if (alive) setPurchases(res.data || []);
      })
      .catch(console.error)
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <section className="rounded-[2rem] bg-panel-surface/90 px-6 py-7 shadow-xl shadow-navy/10 ring-1 ring-white/70 md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-brand">Erişimlerim</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-panel-ink md:text-4xl">Satın Aldıklarım</h1>
            <p className="mt-2 text-sm font-bold text-panel-ink/60">
              İletişim bilgilerini açtığınız ilanlar. Bu bilgileri kullanarak göndericilerle doğrudan iletişim kurabilirsiniz.
            </p>
          </div>
          <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-blue-soft">
            <Icon name="satin-aldiklarim" size={60} alt="" />
          </span>
        </div>
      </section>

      <section className="rounded-[2rem] bg-panel-surface/90 p-6 shadow-xl shadow-navy/10 ring-1 ring-white/70 md:p-8">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="py-16 text-center text-muted">
            <p className="text-lg font-semibold">Henüz satın aldığınız ilan bulunmuyor</p>
            <p className="mt-1 text-sm">Aktif kargo ilanlarını inceleyerek iletişim bilgilerini açabilirsiniz.</p>
            <Link
              href="/ilanlar"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-cta px-6 text-sm font-black text-white hover:bg-cta-dark transition-colors"
            >
              Kargo İlanlarını İncele
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {purchases.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-4 rounded-2xl border border-border-soft p-5 transition-all hover:bg-blue-xsoft"
              >
                <div className="flex flex-col justify-between gap-2 border-b border-border-soft pb-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-base font-black text-panel-ink">
                      {p.from_city} → {p.to_city}
                    </h3>
                    <p className="text-xs font-bold text-panel-ink/50">Açılma Tarihi: {formatDate(p.created_at)}</p>
                  </div>
                  {p.estimated_value && (
                    <span className="inline-flex rounded-full bg-blue-soft px-3 py-1 text-xs font-black text-brand">
                      Değer: ₺{Number(p.estimated_value).toLocaleString("tr-TR")}
                    </span>
                  )}
                </div>

                {p.contact ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-panel-ink/40">İrtibat Kişisi</p>
                      <p className="text-sm font-black text-panel-ink">{p.contact.name || "Belirtilmemiş"}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-panel-ink/40">Telefon</p>
                      {p.contact.phone ? (
                        <a
                          href={`tel:${p.contact.phone}`}
                          className="text-sm font-black text-brand hover:underline"
                        >
                          {p.contact.phone}
                        </a>
                      ) : (
                        <p className="text-sm font-black text-panel-ink/50">Belirtilmemiş</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-panel-ink/40">E-Posta Adresi</p>
                      {p.contact.email ? (
                        <a
                          href={`mailto:${p.contact.email}`}
                          className="text-sm font-black text-brand hover:underline"
                        >
                          {p.contact.email}
                        </a>
                      ) : (
                        <p className="text-sm font-black text-panel-ink/50">Belirtilmemiş</p>
                      )}
                    </div>
                    {p.contact.address && (
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-panel-ink/40">Adres</p>
                        <p className="text-sm font-black text-panel-ink">{p.contact.address}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-bold text-danger">İletişim bilgileri yüklenemedi.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
