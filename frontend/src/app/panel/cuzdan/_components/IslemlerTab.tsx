"use client";
import { useState, useEffect } from "react";
import { getTransactions } from "@/modules/wallet/wallet.service";
import type { WalletTransaction } from "@/modules/wallet/wallet.type";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";

const TYPE_LABEL: Record<string, string> = {
  deposit:          "Bakiye Yükleme",
  booking_payment:  "Rezervasyon Ödemesi",
  booking_earning:  "Taşıma Kazancı",
  booking_refund:   "Rezervasyon İadesi",
  withdrawal:       "Para Çekme",
  withdrawal_refund: "Reddedilen Çekim İadesi",
};

const TYPE_COLOR: Record<string, "success" | "danger" | "brand" | "muted"> = {
  deposit:          "success",
  booking_payment:  "danger",
  booking_earning:  "success",
  booking_refund:   "brand",
  withdrawal:       "danger",
  withdrawal_refund: "success",
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

export default function IslemlerTab() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [total, setTotal]             = useState(0);

  useEffect(() => {
    setLoading(true);
    getTransactions(page)
      .then((res) => {
        setTransactions(res.data);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  if (loading && transactions.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <p className="text-sm font-semibold">Henüz hiç işlem yok</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((t) => (
        <div key={t.id} className="bg-surface rounded-xl border border-border-soft px-4 py-3 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground truncate">{TYPE_LABEL[t.purpose] ?? "İşlem"}</p>
              <Badge color={TYPE_COLOR[t.purpose] ?? "brand"}>
                {t.type === "credit" ? "+" : "-"} ₺{t.amount}
              </Badge>
            </div>
            <p className="text-[10px] text-muted font-medium mt-1">{formatDate(t.created_at)}</p>
            {t.description && <p className="text-xs text-muted mt-1 italic">"{t.description}"</p>}
          </div>
          <div className="text-right shrink-0">
             <p className={`text-sm font-extrabold ${t.type === "credit" ? "text-success" : "text-danger"}`}>
               {t.type === "credit" ? "+" : "-"}₺{t.amount}
             </p>
             <p className="text-[10px] text-muted">{t.payment_status === "completed" ? "Tamamlandı" : "Bekliyor"}</p>
          </div>
        </div>
      ))}

      {total > 20 && (
         <div className="flex items-center justify-between mt-4 px-1">
            <button
               onClick={() => setPage(p => Math.max(1, p - 1))}
               disabled={page === 1}
               className="text-xs font-bold text-brand disabled:opacity-30"
            >
               ← Önceki
            </button>
            <span className="text-xs text-muted font-medium">Sayfa {page} / {Math.ceil(total / 20)}</span>
            <button
               onClick={() => setPage(p => p + 1)}
               disabled={page >= Math.ceil(total / 20)}
               className="text-xs font-bold text-brand disabled:opacity-30"
            >
               Sonraki →
            </button>
         </div>
      )}
    </div>
  );
}
