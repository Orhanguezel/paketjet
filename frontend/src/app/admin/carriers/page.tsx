"use client";
import { useState, useEffect, useCallback } from "react";
import { adminListCarriers, adminSetUserActive } from "@/modules/admin/admin.service";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type Row = Record<string, unknown>;

export default function AdminCarriersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await adminListCarriers({ page: p, limit: 20 });
      setRows(res.data); setTotal(res.total);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  async function toggleActive(r: Row) {
    const id = String(r.id);
    const currentlyActive = Boolean(Number(r.is_active));
    setActionId(id);
    try { await adminSetUserActive(id, !currentlyActive); await load(page); }
    catch (e) { console.error(e); } finally { setActionId(null); }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Taşıyıcılar</h1>
        <p className="text-sm text-muted">{total} taşıyıcı</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3,4,5].map((i) => <SkeletonCard key={i} lines={2} />)}</div>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div key={String(r.id)} className="bg-surface rounded-xl border border-border-soft p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-brand-xlight flex items-center justify-center text-brand font-bold text-sm shrink-0">
                {(String(r.full_name ?? r.email ?? "?"))[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground truncate">{String(r.full_name ?? r.email)}</p>
                  <Badge color={Number(r.is_active) ? "success" : "danger"}>
                    {Number(r.is_active) ? "Aktif" : "Pasif"}
                  </Badge>
                </div>
                <p className="text-xs text-muted">
                  {String(r.email)} · {Number(r.ilan_count)} ilan · {Number(r.booking_count)} rezervasyon
                </p>
              </div>
              <Button
                size="sm"
                variant={Number(r.is_active) ? "secondary" : "success"}
                loading={actionId === String(r.id)}
                onClick={() => toggleActive(r)}
              >
                {Number(r.is_active) ? "Pasif Et" : "Aktif Et"}
              </Button>
            </div>
          ))}
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
