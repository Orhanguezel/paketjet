"use client";
import { useState } from "react";
import Link from "next/link";
import { updateIlanStatus, deleteIlan } from "@/modules/ilan/ilan.service";
import type { Ilan } from "@/modules/ilan/ilan.type";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";

const ILAN_STATUS_COLOR: Record<string, "success" | "muted" | "danger" | "brand"> = {
  active: "success", paused: "muted", completed: "brand", cancelled: "danger",
};
const ILAN_STATUS_LABEL: Record<string, string> = {
  active: "Aktif", paused: "Durduruldu", completed: "Tamamlandı", cancelled: "İptal",
};

interface Props {
  ilanlar: Ilan[];
  setIlanlar: React.Dispatch<React.SetStateAction<Ilan[]>>;
  loading: boolean;
}

export default function IlanlarimTab({ ilanlar, setIlanlar, loading }: Props) {
  const [actionId, setActionId] = useState<string | null>(null);

  async function toggleStatus(ilan: Ilan) {
    const next = ilan.status === "active" ? "paused" : "active";
    setActionId(ilan.id);
    try {
      const updated = await updateIlanStatus(ilan.id, next);
      setIlanlar((prev) => prev.map((i) => (i.id === ilan.id ? updated : i)));
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    setActionId(id);
    try {
      await deleteIlan(id);
      setIlanlar((prev) => prev.filter((i) => i.id !== id));
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  if (loading) return <div className="flex flex-col gap-3">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>;

  if (ilanlar.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-lg font-semibold">Henüz ilan yok</p>
        <p className="text-sm mt-1">Sefer ilanı vererek yük alabilirsiniz.</p>
        <Link href="/ilan-ver" className="mt-4 inline-block px-5 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors">
          İlan Ver
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {ilanlar.map((ilan) => (
        <div key={ilan.id} className="bg-surface rounded-xl border border-border-soft p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-foreground text-sm">{ilan.from_city} → {ilan.to_city}</p>
                <Badge color={ILAN_STATUS_COLOR[ilan.status] ?? "muted"}>
                  {ILAN_STATUS_LABEL[ilan.status] ?? ilan.status}
                </Badge>
              </div>
              <p className="text-xs text-muted">
                {ilan.available_capacity_kg} / {ilan.total_capacity_kg} kg müsait · ₺{ilan.price_per_kg}/kg
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/panel/tasiyici/ilanlar/${ilan.id}/duzenle`}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border text-muted hover:bg-bg-alt transition-colors"
              >
                Düzenle
              </Link>
              <Button size="sm" variant={ilan.status === "active" ? "secondary" : "success"} loading={actionId === ilan.id} onClick={() => toggleStatus(ilan)}>
                {ilan.status === "active" ? "Durdur" : "Aktif Et"}
              </Button>
              <Button size="sm" variant="danger" loading={actionId === ilan.id} onClick={() => handleDelete(ilan.id)}>Sil</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
