"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "@/config/routes";
import { getIlan } from "@/modules/ilan/ilan.service";
import type { Ilan } from "@/modules/ilan/ilan.type";
import { getListingCreditPrice } from "@/modules/pricing/pricing.service";
import { getIlanContact, purchaseIlan } from "@/modules/purchases/purchases.service";
import type { ContactSnapshot } from "@/modules/purchases/purchases.type";
import { useAuthStore } from "@/modules/auth/auth.store";
import { cn, maskName } from "@/lib/utils";
import { RevealAside } from "./RevealAside";

const RouteMap = dynamic(() => import("@/components/RouteMap").then((m) => m.RouteMap), {
  ssr: false,
  loading: () => <div className="h-75 animate-pulse rounded-xl bg-surface-alt" />,
});

const VEHICLE_LABELS: Record<string, string> = {
  car: "Otomobil", van: "Minivan", truck: "Kamyon", motorcycle: "Motosiklet", other: "Diğer",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "-";
  return `₺${Number(value).toLocaleString("tr-TR")}`;
}

export default function IlanDetailClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [ilan, setIlan] = useState<Ilan | null>(null);
  const [contact, setContact] = useState<ContactSnapshot | null>(null);
  const [listingPrice, setListingPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealing, setRevealing] = useState(false);
  const [revealError, setRevealError] = useState("");

  useEffect(() => {
    Promise.all([getIlan(id), getListingCreditPrice()])
      .then(([ilanData, price]) => {
        setIlan(ilanData);
        setListingPrice(price);
      })
      .catch(() => router.push(ROUTES.ilanlar.list))
      .finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getIlanContact(id)
      .then(setContact)
      .catch(() => {});
  }, [id, isAuthenticated]);

  async function handleReveal() {
    setRevealError("");
    if (!isAuthenticated) {
      router.push(`${ROUTES.auth.login}?next=/ilanlar/${id}`);
      return;
    }

    setRevealing(true);
    try {
      const result = await purchaseIlan(ilan?.id ?? id);
      setContact(result.contact);
    } catch (err) {
      const error = err as { status?: number; code?: string };
      if (error.status === 402 || error.code === "insufficient_credit") {
        setRevealError("İlan alma hakkınız yok. Paket satın alarak iletişimi açabilirsiniz.");
      } else if (error.code === "own_listing") {
        setRevealError("Kendi ilanınızın iletişimini satın alamazsınız.");
      } else if (error.code === "unavailable") {
        setRevealError("Bu ilan artık satın alınamıyor.");
      } else {
        setRevealError("İletişim açılamadı. Lütfen tekrar deneyin.");
      }
    } finally {
      setRevealing(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 pt-8">
          <div className="h-64 animate-pulse rounded-2xl border border-border-soft bg-surface" />
        </div>
      </main>
    );
  }

  if (!ilan) return null;

  const displayName = maskName(ilan.carrier_name ?? "Gönderici");

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href={ROUTES.ilanlar.list} className="transition-colors hover:text-brand">İlanlar</Link>
          <span>›</span>
          <span className="text-foreground">{ilan.from_city} → {ilan.to_city}</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                  {ilan.from_city} <span className="text-brand">→</span> {ilan.to_city}
                </h1>
                {(ilan.from_district || ilan.to_district) && (
                  <p className="mt-0.5 text-sm text-muted">
                    {ilan.from_district && <>{ilan.from_district}, </>}
                    {ilan.from_city} → {ilan.to_district && <>{ilan.to_district}, </>}{ilan.to_city}
                  </p>
                )}
              </div>
              <span className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                ilan.status === "active" ? "bg-success/10 text-success" : "bg-bg-alt text-muted",
              )}>
                {ilan.status === "active" ? "Aktif" : ilan.status === "sold" ? "Satıldı" : ilan.status}
              </span>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-background p-4">
                <p className="mb-1 text-xs text-muted">Kalkış</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(ilan.departure_date)}</p>
              </div>
              {ilan.arrival_date && (
                <div className="rounded-xl bg-background p-4">
                  <p className="mb-1 text-xs text-muted">Varış</p>
                  <p className="text-sm font-semibold text-foreground">{formatDate(ilan.arrival_date)}</p>
                </div>
              )}
              <div className="rounded-xl bg-background p-4">
                <p className="mb-1 text-xs text-muted">Araç tipi</p>
                <p className="text-sm font-semibold text-foreground">{VEHICLE_LABELS[ilan.vehicle_type] ?? ilan.vehicle_type}</p>
              </div>
              <div className="rounded-xl bg-background p-4">
                <p className="mb-1 text-xs text-muted">Beyan edilen değer</p>
                <p className="text-sm font-semibold text-brand">{formatPrice(ilan.estimated_value)}</p>
              </div>
            </div>

            <div className="mb-6">
              <RouteMap fromCity={ilan.from_city} toCity={ilan.to_city} height={300} />
            </div>

            <div className="mb-6 flex items-center gap-3 rounded-xl bg-background p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-xlight text-sm font-bold text-brand">
                {displayName[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted">Gönderici</p>
              </div>
            </div>

            {ilan.description && (
              <div>
                <p className="mb-1 text-sm font-medium text-foreground">Açıklama</p>
                <p className="text-sm leading-relaxed text-muted">{ilan.description}</p>
              </div>
            )}
          </div>

          <RevealAside
            contact={contact}
            error={revealError}
            isAuthenticated={isAuthenticated}
            isActive={ilan.status === "active"}
            listingPrice={listingPrice}
            revealing={revealing}
            onReveal={handleReveal}
          />
        </div>
      </div>
    </main>
  );
}
