"use client";
import { useState, useEffect } from "react";
import { adminGetKpi, adminGetLocations, type KpiReport, type LocationReport } from "@/modules/admin/admin.service";
import { AdminPageHeader, AdminListSkeleton } from "@/components/admin";

export default function AdminReportsPage() {
  const [kpi, setKpi] = useState<KpiReport | null>(null);
  const [locations, setLocations] = useState<LocationReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [k, l] = await Promise.all([adminGetKpi(), adminGetLocations()]);
        setKpi(k);
        setLocations(l);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div><AdminPageHeader title="Raporlar" /><AdminListSkeleton count={4} /></div>;

  const kpiCards = kpi ? [
    { label: "Toplam Kullanici", value: kpi.total_users },
    { label: "Toplam Ilan", value: kpi.total_ilanlar },
    { label: "Toplam Rezervasyon", value: kpi.total_bookings },
    { label: "Toplam Gelir", value: `₺${kpi.total_revenue}` },
    { label: "Ort. Rezervasyon", value: `₺${kpi.avg_booking_value}` },
  ] : [];

  return (
    <div>
      <AdminPageHeader title="Raporlar" />

      {kpi && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {kpiCards.map((c) => (
            <div key={c.label} className="bg-surface rounded-xl border border-border-soft p-4 text-center">
              <p className="text-xs text-muted mb-1">{c.label}</p>
              <p className="text-xl font-bold text-foreground">{c.value}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-bold text-foreground mb-4">Sehir Bazli Dagilim</h2>
      {locations.length === 0 ? (
        <p className="text-sm text-muted">Konum verisi bulunamadi.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-border-soft">
                <th className="pb-2 font-medium">Sehir</th>
                <th className="pb-2 font-medium text-right">Ilan Sayisi</th>
                <th className="pb-2 font-medium text-right">Rezervasyon</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((l) => (
                <tr key={l.city} className="border-b border-border-soft/50 hover:bg-bg-alt/50">
                  <td className="py-2 text-foreground font-medium">{l.city}</td>
                  <td className="py-2 text-muted text-right">{l.ilan_count}</td>
                  <td className="py-2 text-muted text-right">{l.booking_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
