"use client";
import { useState, useEffect } from "react";
import { getRevenueStats, type RevenueStats } from "@/modules/admin/admin.service";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminGelirPage() {
  const [data, setData] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRevenueStats()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const maxRevenue = data
    ? Math.max(...data.monthly.map((m) => parseFloat(m.revenue) || 0), 1)
    : 1;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Gelir Raporu</h1>

      {loading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : (
        <>
          {/* Aylık gelir grafiği */}
          <div className="bg-surface rounded-xl border border-border-soft p-6 mb-6">
            <p className="text-sm font-semibold text-foreground mb-5">Son 12 Ay — Aylık Gelir</p>
            {data && data.monthly.length > 0 ? (
              <div className="flex items-end gap-2 h-40">
                {data.monthly.map((m) => {
                  const val = parseFloat(m.revenue) || 0;
                  const heightPct = Math.round((val / maxRevenue) * 100);
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="relative w-full flex items-end justify-center" style={{ height: "120px" }}>
                        <div
                          className="w-full bg-brand/20 group-hover:bg-brand/40 rounded-t transition-colors"
                          style={{ height: `${Math.max(heightPct, 2)}%` }}
                          title={`₺${val.toFixed(2)}`}
                        />
                      </div>
                      <p className="text-[10px] text-muted text-center leading-tight">
                        {m.month.slice(5)}
                      </p>
                      <p className="text-[10px] font-semibold text-foreground">
                        ₺{val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val.toFixed(0)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted text-center py-8">Henüz gelir verisi yok.</p>
            )}
          </div>

          {/* Top taşıyıcılar */}
          <div className="bg-surface rounded-xl border border-border-soft p-6">
            <p className="text-sm font-semibold text-foreground mb-4">En Çok Kazanan Taşıyıcılar</p>
            {data && data.top_carriers.length > 0 ? (
              <div className="flex flex-col gap-2">
                {data.top_carriers.map((c, i) => (
                  <div key={c.carrier_id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-alt transition-colors">
                    <span className="w-6 text-center text-xs font-bold text-muted shrink-0">
                      {i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-brand-xlight flex items-center justify-center text-brand font-bold text-sm shrink-0">
                      {(c.carrier_name ?? c.carrier_email ?? "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {c.carrier_name ?? c.carrier_email ?? "—"}
                      </p>
                      <p className="text-xs text-muted">{c.total_bookings} rezervasyon</p>
                    </div>
                    <p className="text-sm font-bold text-success shrink-0">
                      ₺{parseFloat(c.total_revenue).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted text-center py-8">Henüz veri yok.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
