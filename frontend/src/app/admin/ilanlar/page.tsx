"use client";
import { useState, useEffect, useCallback } from "react";
import { adminListIlanlar, adminUpdateIlanStatus, adminDeleteIlan } from "@/modules/admin/admin.service";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";

type Row = Record<string, unknown>;

const STATUS_COLOR: Record<string, "success" | "muted" | "danger" | "brand"> = {
  active: "success", paused: "muted", completed: "brand", cancelled: "danger",
};
const STATUS_LABEL: Record<string, string> = {
  active: "Aktif", paused: "Durduruldu", completed: "Tamamlandı", cancelled: "İptal",
};

export default function AdminIlanlarPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [cityFilter, setCityFilter] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async (p: number, city: string) => {
    setLoading(true);
    try {
      const res = await adminListIlanlar({ page: p, limit: 20, ...(city ? { from_city: city } : {}) });
      setRows(res.data);
      setTotal(res.total);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page, cityFilter); }, [page, cityFilter, load]);

  function handleCitySearch(e: React.FormEvent) {
    e.preventDefault();
    setCityFilter(cityInput.trim());
    setPage(1);
  }

  function clearFilter() {
    setCityFilter("");
    setCityInput("");
    setPage(1);
  }

  async function toggleStatus(id: string, status: string) {
    const next = status === "active" ? "paused" : "active";
    setActionId(id);
    try { await adminUpdateIlanStatus(id, next); await load(page, cityFilter); }
    catch (e) { console.error(e); } finally { setActionId(null); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu ilanı silmek istiyor musunuz?")) return;
    setActionId(id);
    try { await adminDeleteIlan(id); await load(page, cityFilter); }
    catch (e) { console.error(e); } finally { setActionId(null); }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">İlanlar</h1>
        <p className="text-sm text-muted">{total} ilan</p>
      </div>

      {/* Şehir filtresi */}
      <form onSubmit={handleCitySearch} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Çıkış şehri filtrele..."
          className="flex-1 max-w-xs px-3 py-1.5 text-sm bg-bg-alt border border-border-soft rounded-lg text-foreground placeholder:text-faint focus:outline-none focus:border-brand"
        />
        <Button type="submit" size="sm" variant="secondary">Ara</Button>
        {cityFilter && (
          <Button type="button" size="sm" variant="ghost" onClick={clearFilter}>
            × Temizle
          </Button>
        )}
      </form>

      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3,4,5].map((i) => <SkeletonCard key={i} lines={2} />)}</div>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div key={String(r.id)} className="bg-surface rounded-xl border border-border-soft p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm text-foreground">{String(r.from_city)} → {String(r.to_city)}</span>
                  <Badge color={STATUS_COLOR[String(r.status)] ?? "muted"}>
                    {STATUS_LABEL[String(r.status)] ?? String(r.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted">{String(r.carrier_name ?? r.carrier_email ?? "—")} · {String(r.available_capacity_kg)} kg · ₺{String(r.price_per_kg)}/kg</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="secondary" loading={actionId === String(r.id)} onClick={() => toggleStatus(String(r.id), String(r.status))}>
                  {String(r.status) === "active" ? "Durdur" : "Aktif"}
                </Button>
                <Button size="sm" variant="danger" loading={actionId === String(r.id)} onClick={() => handleDelete(String(r.id))}>
                  Sil
                </Button>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-center text-muted py-12 text-sm">
              {cityFilter ? `"${cityFilter}" için ilan bulunamadı.` : "Henüz ilan yok."}
            </p>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Önceki</Button>
          <span className="text-sm text-muted">{page} / {totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Sonraki →</Button>
        </div>
      )}
    </div>
  );
}
