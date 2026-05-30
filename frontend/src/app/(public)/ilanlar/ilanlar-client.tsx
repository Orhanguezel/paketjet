"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import IlanCard from "@/components/IlanCard";
import CityAutocomplete from "@/components/CityAutocomplete";
import { listIlans } from "@/modules/ilan/ilan.service";
import type { Ilan, VehicleType } from "@/modules/ilan/ilan.type";

const VEHICLE_OPTIONS: { value: VehicleType | ""; label: string }[] = [
  { value: "", label: "Tüm araçlar" },
  { value: "car", label: "Otomobil" },
  { value: "van", label: "Minivan" },
  { value: "truck", label: "Kamyon" },
  { value: "motorcycle", label: "Motosiklet" },
];

type ActiveFilters = {
  from_city: string;
  to_city: string;
  date: string;
  vehicle_type: VehicleType | "";
  min_kg: string;
};

interface IlanlarClientProps {
  initialIlans: Ilan[];
  initialTotal: number;
  initialPage: number;
  initialFilters: ActiveFilters;
  listingCreditPrice?: number | null;
}

export default function IlanlarClient({
  initialIlans,
  initialTotal,
  initialPage,
  initialFilters,
  listingCreditPrice,
}: IlanlarClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ilanlar, setIlanlar] = useState<Ilan[]>(initialIlans);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);

  const [fromCity, setFromCity] = useState(initialFilters.from_city);
  const [toCity, setToCity] = useState(initialFilters.to_city);
  const [date, setDate] = useState(initialFilters.date);
  const [vehicleType, setVehicleType] = useState<VehicleType | "">(initialFilters.vehicle_type);
  const [minKg, setMinKg] = useState(initialFilters.min_kg);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(initialFilters);

  const fetchIlans = useCallback(async (filters: ActiveFilters, nextPage: number) => {
    setLoading(true);
    try {
      const res = await listIlans({
        from_city: filters.from_city || undefined,
        to_city: filters.to_city || undefined,
        date: filters.date || undefined,
        vehicle_type: filters.vehicle_type || undefined,
        min_kg: filters.min_kg ? Number(filters.min_kg) : undefined,
        page: nextPage,
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
    const filtersFromUrl: ActiveFilters = {
      from_city: searchParams.get("from") ?? "",
      to_city: searchParams.get("to") ?? "",
      date: searchParams.get("date") ?? "",
      vehicle_type: (searchParams.get("vehicle") as VehicleType | "") ?? "",
      min_kg: searchParams.get("min_kg") ?? "",
    };
    const urlPage = Number(searchParams.get("page") ?? "1");
    const normalizedPage = Number.isFinite(urlPage) && urlPage > 0 ? urlPage : 1;
    const sameFilters = JSON.stringify(filtersFromUrl) === JSON.stringify(activeFilters);
    const samePage = normalizedPage === page;

    if (sameFilters && samePage) return;

    setFromCity(filtersFromUrl.from_city);
    setToCity(filtersFromUrl.to_city);
    setDate(filtersFromUrl.date);
    setVehicleType(filtersFromUrl.vehicle_type);
    setMinKg(filtersFromUrl.min_kg);
    setActiveFilters(filtersFromUrl);
    setPage(normalizedPage);
    fetchIlans(filtersFromUrl, normalizedPage);
  }, [activeFilters, fetchIlans, page, searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  function handleFilter(event: React.FormEvent) {
    event.preventDefault();
    const filters = {
      from_city: fromCity.trim(),
      to_city: toCity.trim(),
      date,
      vehicle_type: vehicleType,
      min_kg: minKg,
    };
    const params = new URLSearchParams();
    if (filters.from_city) params.set("from", filters.from_city);
    if (filters.to_city) params.set("to", filters.to_city);
    if (filters.date) params.set("date", filters.date);
    if (filters.vehicle_type) params.set("vehicle", filters.vehicle_type);
    if (filters.min_kg) params.set("min_kg", filters.min_kg);
    router.replace(params.toString() ? `/ilanlar?${params}` : "/ilanlar", { scroll: false });
  }

  function handleReset() {
    setFromCity("");
    setToCity("");
    setDate("");
    setVehicleType("");
    setMinKg("");
    router.replace("/ilanlar", { scroll: false });
  }

  const hasFilters = Object.values(activeFilters).some(Boolean);
  const totalPages = Math.ceil(total / 20);

  function handlePagination(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }
    router.replace(params.toString() ? `/ilanlar?${params}` : "/ilanlar", { scroll: false });
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-4 pt-8 pb-16">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Taşıma İlanları</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? "Güncelleniyor..." : `${total} ilan listeleniyor`}
          </p>
        </div>

        <form onSubmit={handleFilter} className="relative z-20 mb-6 flex flex-wrap items-end gap-3">
          <div className="w-40">
            <CityAutocomplete value={fromCity} onChange={setFromCity} placeholder="Nereden" />
          </div>
          <div className="w-40">
            <CityAutocomplete value={toCity} onChange={setToCity} placeholder="Nereye" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground">
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="bg-transparent text-foreground outline-none placeholder:text-faint"
            />
          </div>
          <select
            value={vehicleType}
            onChange={(event) => setVehicleType(event.target.value as VehicleType | "")}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none"
          >
            {VEHICLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground">
            <input
              type="number"
              value={minKg}
              onChange={(event) => setMinKg(event.target.value)}
              placeholder="Min kg"
              min="0"
              className="w-20 bg-transparent outline-none placeholder:text-faint"
            />
          </div>
          <button type="submit" className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
            Filtrele
          </button>
          {hasFilters ? (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:bg-bg-alt"
            >
              Temizle
            </button>
          ) : null}
        </form>

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-xl border border-border-soft bg-surface" />
            ))}
          </div>
        ) : ilanlar.length === 0 ? (
          <div className="rounded-2xl border border-border-soft bg-surface px-6 py-12 text-center text-muted">
            <p className="text-lg font-black text-foreground">İlan bulunamadı</p>
            <p className="mt-1 text-sm">Farklı filtreler deneyebilir veya ücretsiz ilan açabilirsiniz.</p>
            <Link
              href="/ilan-ver"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-cta px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-cta-dark"
            >
              Hızlı İlan Aç
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {ilanlar.map((ilan) => (
              <IlanCard key={ilan.id} ilan={ilan} listingCreditPrice={listingCreditPrice} />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePagination(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-bg-alt disabled:opacity-40"
            >
              Onceki
            </button>
            <span className="px-2 text-sm text-muted">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => handlePagination(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-bg-alt disabled:opacity-40"
            >
              Sonraki
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
