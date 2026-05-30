"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { getCreditPackages, getListingCreditPrice } from "@/modules/pricing/pricing.service";
import type { CreditPackage } from "@/modules/pricing/pricing.type";
import { getMyCredits } from "@/modules/purchases/purchases.service";
import type { MyCreditsResponse } from "@/modules/purchases/purchases.type";

export default function IlanAlmaHakkiPage() {
  const [credits, setCredits] = useState<MyCreditsResponse | null>(null);
  const [listingPrice, setListingPrice] = useState<number | null>(null);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyCredits(), getListingCreditPrice(), getCreditPackages()])
      .then(([creditInfo, price, packageList]) => {
        setCredits(creditInfo);
        setListingPrice(price);
        setPackages(packageList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (value: number | string) => `₺${Number(value).toLocaleString("tr-TR")}`;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <section className="rounded-[2rem] bg-panel-surface/90 p-6 shadow-xl shadow-navy/10 ring-1 ring-white/70 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-brand">İlan Alma Hakkı</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-panel-ink">
              Kalan hak: {loading ? "—" : credits?.balance ?? 0} adet
            </h1>
            <p className="mt-2 text-sm font-bold text-panel-ink/60">
              Satın aldığınız her ilan iletişimi 1 hak düşer.
            </p>
            <p className="mt-3 text-sm font-black text-brand">
              Tekil ilan hakkı: {loading || listingPrice === null ? "—" : formatPrice(listingPrice)}
            </p>
          </div>
          <span className="grid size-24 place-items-center rounded-full bg-blue-soft">
            <Icon name="ilan-alma-hakki" size={76} alt="" />
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {packages.map((pack) => (
          <article key={pack.key} className="rounded-2xl bg-panel-surface p-5 shadow-sm ring-1 ring-white/70">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-panel-ink">{pack.credits} adet ilan hakkı</h2>
                <p className="mt-1 text-sm font-bold text-panel-ink/60">Kontör paketi</p>
              </div>
              <p className="text-xl font-black text-brand">{formatPrice(pack.price)}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl bg-panel-surface p-5 shadow-sm ring-1 ring-white/70">
        <h2 className="text-lg font-black text-panel-ink">Hak Hareketleri</h2>
        <div className="mt-4 divide-y divide-border-soft">
          {(credits?.ledger ?? []).length === 0 ? (
            <p className="py-4 text-sm font-bold text-panel-ink/60">Henüz hak hareketi yok.</p>
          ) : (
            credits?.ledger.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-black text-panel-ink">
                    {item.reason === "reveal_spend" ? "İletişim açma" : item.reason === "package_purchase" ? "Hak satın alma" : item.reason}
                  </p>
                  <p className="text-xs font-bold text-panel-ink/55">
                    {new Date(item.created_at).toLocaleString("tr-TR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${item.delta < 0 ? "text-danger" : "text-success"}`}>
                    {item.delta > 0 ? "+" : ""}{item.delta} hak
                  </p>
                  <p className="text-xs font-bold text-panel-ink/55">Kalan: {item.balance_after}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
