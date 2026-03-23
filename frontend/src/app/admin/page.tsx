"use client";
import { useState, useEffect } from "react";
import { getAdminSummary, getActivityStats, type AdminSummary, type ActivityStats } from "@/modules/admin/admin.service";
import { Skeleton } from "@/components/ui/Skeleton";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-surface rounded-xl border border-border-soft p-5">
      <p className="text-xs font-medium text-muted mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminPage() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [activity, setActivity] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminSummary(), getActivityStats()])
      .then(([s, a]) => { setSummary(s); setActivity(a); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Genel Bakış</h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Toplam Kullanıcı"   value={summary?.users ?? 0} />
            <StatCard label="Aktif İlan"          value={summary?.active_ilanlar ?? 0} />
            <StatCard label="Toplam Rezervasyon"  value={summary?.total_bookings ?? 0} />
            <StatCard label="Platform Geliri"     value={`₺${summary?.total_earnings?.toFixed(2) ?? "0.00"}`} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface rounded-xl border border-border-soft p-5">
              <p className="text-sm font-semibold text-foreground mb-4">Rezervasyon Dağılımı</p>
              <div className="flex flex-col gap-2">
                {summary && ([
                    ["pending",    "Bekliyor",       summary.booking_stats.pending],
                    ["confirmed",  "Onaylandı",      summary.booking_stats.confirmed],
                    ["in_transit", "Yolda",          summary.booking_stats.in_transit],
                    ["delivered",  "Teslim Edildi",  summary.booking_stats.delivered],
                    ["cancelled",  "İptal",          summary.booking_stats.cancelled],
                  ] as const).map(([key, label, val]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-muted">{label}</span>
                    <span className="font-semibold text-foreground">{val ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-border-soft p-5">
              <p className="text-sm font-semibold text-foreground mb-4">Son 7 Gün</p>
              <div className="flex flex-col gap-2">
                {activity && [
                  ["Yeni Kullanıcı", activity.last_7_days.new_users],
                  ["Yeni İlan",      activity.last_7_days.new_ilanlar],
                  ["Yeni Rezerv.",   activity.last_7_days.new_bookings],
                ].map(([label, val]) => (
                  <div key={String(label)} className="flex items-center justify-between text-sm">
                    <span className="text-muted">{label}</span>
                    <span className="font-semibold text-foreground">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
