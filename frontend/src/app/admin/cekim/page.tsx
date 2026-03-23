"use client";
import { useState, useEffect } from "react";
import { adminListWithdrawals, adminProcessWithdrawal } from "@/modules/admin/admin.service";
import type { WithdrawalRequest } from "@/modules/withdrawal/withdrawal.type";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";

const STATUS_LABEL: Record<string, string> = {
  pending: "Bekliyor",
  processing: "İşleniyor",
  completed: "Tamamlandı",
  rejected: "Reddedildi",
};

const STATUS_COLOR: Record<string, "warning" | "brand" | "success" | "danger"> = {
  pending: "warning",
  processing: "brand",
  completed: "success",
  rejected: "danger",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { 
    day: "numeric", 
    month: "short", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function AdminCekimPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = () => {
    setLoading(true);
    adminListWithdrawals({ page, limit: 20 })
      .then(res => {
        setWithdrawals(res.data);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  async function handleProcess(id: string, status: "completed" | "rejected") {
    if (status === "rejected" && !rejectNote) {
       alert("Lütfen reddetme nedenini giriniz.");
       return;
    }
    setProcessingId(id);
    try {
      await adminProcessWithdrawal(id, status, rejectNote);
      setRejectNote("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-foreground mb-6">Para Çekme Talepleri</h1>

      {loading && withdrawals.length === 0 ? (
        <div className="flex flex-col gap-4">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
      ) : withdrawals.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border">
           <p className="text-muted font-bold">Herhangi bir talep bulunamadı.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {withdrawals.map((w) => (
            <div key={w.id} className="bg-surface rounded-2xl border border-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge color={STATUS_COLOR[w.status]}>{STATUS_LABEL[w.status]}</Badge>
                  <span className="text-sm font-bold text-foreground">₺{w.amount}</span>
                </div>
                <p className="text-sm font-black text-foreground">{w.user_name || "Bilinmiyor"} ({w.user_email})</p>
                <div className="mt-3 p-3 bg-bg-alt rounded-xl border border-border-soft">
                   <p className="text-[10px] font-black text-muted uppercase mb-1">Banka Bilgileri</p>
                   <p className="text-xs font-mono font-bold text-brand">{w.iban || "N/A"}</p>
                   <p className="text-[10px] text-muted font-bold">{w.account_holder} · {w.bank_name}</p>
                </div>
                <p className="text-[10px] text-muted font-bold mt-2">
                   Talep: {formatDate(w.requested_at)}
                   {w.processed_at && ` · İşlem: ${formatDate(w.processed_at)}`}
                </p>
                {w.admin_notes && (
                   <p className="mt-2 text-xs text-danger font-bold italic">Not: "{w.admin_notes}"</p>
                )}
              </div>

              {w.status === "pending" && (
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <Input 
                    placeholder="Red Nedeni (Sadece reddederken)" 
                    value={rejectNote} 
                    onChange={e => setRejectNote(e.target.value)}
                    className="text-xs"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleProcess(w.id, "completed")} 
                      loading={processingId === w.id}
                      className="flex-1 bg-success hover:bg-green-600"
                    >
                      Onayla
                    </Button>
                    <Button 
                      onClick={() => handleProcess(w.id, "rejected")} 
                      loading={processingId === w.id}
                      variant="secondary"
                      className="flex-1 border-danger text-danger hover:bg-red-50"
                    >
                      Reddet
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {total > 20 && (
         <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="secondary" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Önceki</Button>
            <span className="text-sm font-bold">Sayfa {page} / {Math.ceil(total / 20)}</span>
            <Button variant="secondary" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)}>Sonraki</Button>
         </div>
      )}
    </div>
  );
}
