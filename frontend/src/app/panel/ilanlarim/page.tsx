"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyIlans, updateIlanStatus, deleteIlan } from "@/modules/ilan/ilan.service";
import type { Ilan } from "@/modules/ilan/ilan.type";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Icon } from "@/components/ui";

const ILAN_STATUS_COLOR: Record<string, "success" | "muted" | "danger" | "brand" | "warning"> = {
  active: "success",
  pending_approval: "warning",
  paused: "muted",
  completed: "brand",
  sold: "brand",
  cancelled: "danger",
};

const ILAN_STATUS_LABEL: Record<string, string> = {
  active: "Aktif",
  pending_approval: "Onay Bekliyor",
  paused: "Durduruldu",
  completed: "Tamamlandı",
  sold: "Satıldı",
  cancelled: "İptal",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function IlanlarimPage() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getMyIlans()
      .then((data) => {
        if (alive) setIlanlar(data);
      })
      .catch(console.error)
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  async function toggleStatus(ilan: Ilan) {
    const next = ilan.status === "active" ? "paused" : "active";
    setActionId(ilan.id);
    try {
      const updated = await updateIlanStatus(ilan.id, next);
      setIlanlar((prev) => prev.map((i) => (i.id === ilan.id ? updated : i)));
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    setActionId(id);
    try {
      await deleteIlan(id);
      setIlanlar((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <section className="rounded-[2rem] bg-panel-surface/90 px-6 py-7 shadow-xl shadow-navy/10 ring-1 ring-white/70 md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-brand">İlan Yönetimi</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-panel-ink md:text-4xl">İlanlarım</h1>
            <p className="mt-2 text-sm font-bold text-panel-ink/60">
              Gönderici olarak açtığınız kargo ilanları. Taşıyıcılar bu ilanların iletişim bilgilerini satın alarak sizinle irtibata geçer.
            </p>
          </div>
          <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-blue-soft">
            <Icon name="ilanlarim" size={60} alt="" />
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
        ) : ilanlar.length === 0 ? (
          <div className="py-16 text-center text-muted">
            <p className="text-lg font-semibold">Henüz ilanınız bulunmuyor</p>
            <p className="mt-1 text-sm">Ücretsiz ilan açarak kargonuz için uygun taşıyıcıyı bulabilirsiniz.</p>
            <Link
              href="/ilan-ver"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-cta px-6 text-sm font-black text-white hover:bg-cta-dark transition-colors"
            >
              Hızlı İlan Aç
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {ilanlar.map((ilan) => (
              <div
                key={ilan.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-border-soft p-4 transition-all hover:bg-blue-xsoft sm:flex-row sm:items-center"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-base font-black text-panel-ink">
                      {ilan.from_city} → {ilan.to_city}
                    </p>
                    <Badge color={ILAN_STATUS_COLOR[ilan.status] ?? "muted"}>
                      {ILAN_STATUS_LABEL[ilan.status] ?? ilan.status}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-xs font-bold text-panel-ink/60">
                    <p>Paket Tarihi: {formatDate(ilan.departure_date)}</p>
                    {ilan.estimated_value && (
                      <p className="text-brand">
                        Tahmini Değer: ₺{Number(ilan.estimated_value).toLocaleString("tr-TR")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {ilan.status !== "pending_approval" && ilan.status !== "sold" && (
                    <Button
                      size="sm"
                      variant={ilan.status === "active" ? "secondary" : "success"}
                      loading={actionId === ilan.id}
                      onClick={() => toggleStatus(ilan)}
                    >
                      {ilan.status === "active" ? "Durdur" : "Aktif Et"}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    loading={actionId === ilan.id}
                    onClick={() => handleDelete(ilan.id)}
                  >
                    Sil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
