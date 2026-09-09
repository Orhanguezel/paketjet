"use client";
import { useState, useEffect } from "react";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import type { CustomPage } from "@/modules/customPage/customPage.type";
import { LegalPageView } from "@/modules/customPage/legal/LegalPageView";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function PanelTasimaKurallariPage() {
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

  return <LegalPageView slug="tasima-kurallari" title={page.title} summary={page.summary} html={page.content} updatedAt={page.updated_at} embedded/>;
}
