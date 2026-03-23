"use client";
import { useState, useEffect } from "react";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import type { CustomPage } from "@/modules/customPage/customPage.type";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useAuthStore } from "@/modules/auth/auth.store";
import { CarrierDashboardOverview } from "@/modules/dashboard/components/CarrierDashboardHeader";
import { CustomerDashboardOverview } from "@/modules/dashboard/components/CustomerDashboardHeader";

export default function PanelTasimaKurallariPage() {
  const { user } = useAuthStore();
  const isCarrier = user?.role === "carrier";
  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getCustomPageBySlug("tasima-kurallari")
      .then(setPage)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl flex flex-col gap-4">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={6} />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="text-center py-12 text-muted">
        <p className="text-sm font-semibold">Taşıma kuralları yüklenemedi.</p>
      </div>
    );
  }

  let displayHtml = page.content ?? "<p>İçerik bulunamadı.</p>";
  if (page.content && page.content.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(page.content);
      if (parsed && typeof parsed.html === "string") {
        displayHtml = parsed.html;
      }
    } catch {}
  }

  return (
    <div className="max-w-3xl">
      {isCarrier ? <CarrierDashboardOverview /> : <CustomerDashboardOverview />}
      <h1 className="text-2xl font-extrabold text-foreground mb-2">{page.title}</h1>
      {page.summary && <p className="text-sm text-muted mb-6">{page.summary}</p>}
      <div className="bg-surface rounded-xl border border-border-soft p-6">
        <article
          className="prose prose-neutral max-w-none prose-headings:font-extrabold prose-a:text-brand prose-sm"
          dangerouslySetInnerHTML={{ __html: displayHtml }}
        />
      </div>
    </div>
  );
}
