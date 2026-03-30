"use client";
import { useState, useEffect, useCallback } from "react";
import { adminListBookings, adminUpdateBookingStatus, adminConfirmTransferPayment } from "@/modules/admin/admin.service";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";

type Row = Record<string, unknown>;

const STATUS_COLOR: Record<string, "muted" | "brand" | "warning" | "success" | "danger"> = {
  pending: "muted", confirmed: "brand", in_transit: "warning", delivered: "success", cancelled: "danger", disputed: "danger",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Bekliyor", confirmed: "Onaylandı", in_transit: "Yolda", delivered: "Teslim", cancelled: "İptal", disputed: "İtiraz",
};
const NEXT_STATUS: Record<string, string> = {
  pending: "confirmed", confirmed: "in_transit", in_transit: "delivered",
};

const FILTER_OPTIONS = [
  { value: "", label: "Tümü" },
  { value: "pending",    label: "Bekliyor" },
  { value: "confirmed",  label: "Onaylandı" },
  { value: "in_transit", label: "Yolda" },
  { value: "delivered",  label: "Teslim" },
  { value: "cancelled",  label: "İptal" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export default function AdminBookingsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async (p: number, status: string) => {
    setLoading(true);
    try {
      const res = await adminListBookings({ page: p, limit: 20, ...(status ? { status } : {}) });
      setRows(res.data); setTotal(res.total);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page, statusFilter); }, [page, statusFilter, load]);

  function handleFilterChange(val: string) {
    setStatusFilter(val);
    setPage(1);
  }

  async function advance(id: string, status: string) {
    const next = NEXT_STATUS[status];
    if (!next) return;
    setActionId(id);
    try { await adminUpdateBookingStatus(id, next); await load(page, statusFilter); }
    catch (e) { console.error(e); } finally { setActionId(null); }
  }

  async function confirmTransfer(id: string) {
    if (!confirm("Havale ödemesini onaylamak istediğinize emin misiniz?")) return;
    setActionId(id);
    try { await adminConfirmTransferPayment(id); await load(page, statusFilter); }
    catch (e) { console.error(e); } finally { setActionId(null); }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Rezervasyonlar</h1>
        <p className="text-sm text-muted">{total} rezervasyon</p>
      </div>

      {/* Durum filtresi */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleFilterChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === opt.value
                ? "bg-brand text-white"
                : "bg-bg-alt text-muted hover:bg-border-soft hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3,4,5].map((i) => <SkeletonCard key={i} lines={2} />)}</div>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((r) => {
            const status = String(r.status);
            return (
              <div key={String(r.id)} className="bg-surface rounded-xl border border-border-soft p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-foreground">
                      {r.from_city && r.to_city
                        ? `${String(r.from_city)} → ${String(r.to_city)}`
                        : `#${String(r.id).slice(0, 8)}`}
                    </span>
                    <Badge color={STATUS_COLOR[status] ?? "muted"}>{STATUS_LABEL[status] ?? status}</Badge>
                  </div>
                  <p className="text-xs text-muted">
                    {String(r.kg_amount)} kg · ₺{String(r.total_price)} · {String(r.customer_name ?? r.customer_email ?? "—")} · {formatDate(String(r.created_at))}
                  </p>
                  {String(r.payment_status) === "awaiting_transfer" && r.payment_ref ? (
                    <p className="text-xs mt-0.5">
                      <Badge color="warning">Havale Bekleniyor</Badge>
                      <span className="ml-2 font-mono font-semibold text-brand">{String(r.payment_ref)}</span>
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {String(r.payment_status) === "awaiting_transfer" && (
                    <Button size="sm" loading={actionId === String(r.id)} onClick={() => confirmTransfer(String(r.id))}>
                      Havale Onayla
                    </Button>
                  )}
                  {NEXT_STATUS[status] && (
                    <Button size="sm" variant="secondary" loading={actionId === String(r.id)} onClick={() => advance(String(r.id), status)}>
                      → {STATUS_LABEL[NEXT_STATUS[status]]}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {rows.length === 0 && (
            <p className="text-center text-muted py-12 text-sm">Bu filtreye ait rezervasyon yok.</p>
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
