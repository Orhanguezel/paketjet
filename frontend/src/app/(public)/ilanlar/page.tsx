"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import IlanCard from "@/components/IlanCard";
import { listIlans } from "@/modules/ilan/ilan.service";
import type { Ilan, VehicleType } from "@/modules/ilan/ilan.type";
import { cn } from "@/lib/utils";

const VEHICLE_OPTIONS: { value: VehicleType | ""; label: string }[] = [
  { value: "", label: "Tüm araçlar" },
  { value: "car", label: "Otomobil" },
  { value: "van", label: "Minivan" },
  { value: "truck", label: "Kamyon" },
  { value: "motorcycle", label: "Motosiklet" },
];

function IlanlarList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // URL params → initial filter state
  const [fromCity, setFromCity] = useState(searchParams.get("from") ?? "");
  const [toCity, setToCity] = useState(searchParams.get("to") ?? "");
  const [date, setDate] = useState(searchParams.get("date") ?? "");
  const [vehicleType, setVehicleType] = useState<VehicleType | "">(
    (searchParams.get("vehicle") as VehicleType) ?? ""
  );
  const [minKg, setMinKg] = useState(searchParams.get("min_kg") ?? "");

  // active filters applied (submitted)
  const [activeFilters, setActiveFilters] = useState({
    from_city: searchParams.get("from") ?? "",
    to_city: searchParams.get("to") ?? "",
    date: searchParams.get("date") ?? "",
    vehicle_type: (searchParams.get("vehicle") ?? "") as VehicleType | "",
    min_kg: searchParams.get("min_kg") ?? "",
  });

  const fetchIlans = useCallback(async (f: typeof activeFilters, p: number) => {
    setLoading(true);
    try {
      const res = await listIlans({
        from_city: f.from_city || undefined,
        to_city: f.to_city || undefined,
        date: f.date || undefined,
        vehicle_type: f.vehicle_type || undefined,
        min_kg: f.min_kg ? Number(f.min_kg) : undefined,
        page: p,
        limit: 20,
      });
      setIlanlar(res.data);
      setTotal(res.total);
    } catch {
      setIlanlar([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIlans(activeFilters, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeFilters, page, fetchIlans]);

  function handleFilter(e: React.FormEvent) {
    e.preventDefault();
    const f = { from_city: fromCity.trim(), to_city: toCity.trim(), date, vehicle_type: vehicleType, min_kg: minKg };
    setActiveFilters(f);
    setPage(1);

    // URL'e yaz
    const params = new URLSearchParams();
    if (f.from_city)   params.set("from", f.from_city);
    if (f.to_city)     params.set("to", f.to_city);
    if (f.date)        params.set("date", f.date);
    if (f.vehicle_type) params.set("vehicle", f.vehicle_type);
    if (f.min_kg)      params.set("min_kg", f.min_kg);
    const qs = params.toString();
    router.replace(qs ? `/ilanlar?${qs}` : "/ilanlar", { scroll: false });
  }

  function handleReset() {
    setFromCity(""); setToCity(""); setDate(""); setVehicleType(""); setMinKg("");
    setActiveFilters({ from_city: "", to_city: "", date: "", vehicle_type: "", min_kg: "" });
    setPage(1);
    router.replace("/ilanlar", { scroll: false });
  }

  const hasFilters = Object.values(activeFilters).some(Boolean);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-16">
        {/* Başlık */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Taşıma İlanları</h1>
          <p className="mt-1 text-muted text-sm">{loading ? "Yükleniyor…" : `${total} ilan listeleniyor`}</p>
        </div>

        {/* Filtreler */}
        <form onSubmit={handleFilter} className="flex flex-wrap gap-3 mb-6 items-end">
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-surface text-sm text-foreground">
            <svg className="w-4 h-4 text-faint shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <input
              type="text" value={fromCity} onChange={(e) => setFromCity(e.target.value)}
              placeholder="Nereden" className="outline-none w-28 placeholder:text-faint bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-surface text-sm text-foreground">
            <svg className="w-4 h-4 text-faint shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <input
              type="text" value={toCity} onChange={(e) => setToCity(e.target.value)}
              placeholder="Nereye" className="outline-none w-28 placeholder:text-faint bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-surface text-sm text-foreground">
            <input
              type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="outline-none text-sm placeholder:text-faint bg-transparent text-foreground"
            />
          </div>

          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as VehicleType | "")}
            className="border border-border rounded-lg px-3 py-2 bg-surface text-sm text-foreground outline-none"
          >
            {VEHICLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-surface text-sm text-foreground">
            <input
              type="number" value={minKg} onChange={(e) => setMinKg(e.target.value)}
              placeholder="Min kg" min="0" className="outline-none w-20 placeholder:text-faint bg-transparent"
            />
          </div>

          <button type="submit" className="px-5 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors">
            Filtrele
          </button>
          {hasFilters && (
            <button type="button" onClick={handleReset} className="px-4 py-2 text-sm text-muted border border-border rounded-lg hover:bg-bg-alt transition-colors">
              Temizle
            </button>
          )}
        </form>

        {/* Liste */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-surface rounded-xl border border-border-soft animate-pulse" />
            ))}
          </div>
        ) : ilanlar.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p className="text-lg font-semibold">İlan bulunamadı</p>
            <p className="text-sm mt-1">Farklı filtreler deneyebilirsiniz.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {ilanlar.map((ilan) => <IlanCard key={ilan.id} ilan={ilan} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg disabled:opacity-40 hover:bg-bg-alt transition-colors"
            >
              Önceki
            </button>
            <span className="text-sm text-muted px-2">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg disabled:opacity-40 hover:bg-bg-alt transition-colors"
            >
              Sonraki
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IlanlarPage() {
  return (
    <Suspense>
      <IlanlarList />
    </Suspense>
  );
}
