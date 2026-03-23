"use client";
import { useState, useEffect, Suspense } from "react";
import { useAuthStore } from "@/modules/auth/auth.store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getMyIlans } from "@/modules/ilan/ilan.service";
import { getCarrierDashboard } from "@/modules/dashboard/dashboard.service";
import { getCarrierBookings } from "@/modules/booking/booking.service";
import type { Ilan } from "@/modules/ilan/ilan.type";
import type { CarrierDashboard } from "@/modules/dashboard/dashboard.service";
import type { Booking } from "@/modules/booking/booking.type";
import TaleplerTab from "./_components/TaleplerTab";
import IlanlarimTab from "./_components/IlanlarimTab";
import GecmisTab from "./_components/GecmisTab";
import FinansTab from "./_components/FinansTab";
import AbonelikTab from "./_components/AbonelikTab";
import IlanVerForm from "@/modules/ilan/components/IlanVerForm";
import { CarrierDashboardOverview } from "@/modules/dashboard/components/CarrierDashboardHeader";

type Tab = "talepler" | "ilanlar" | "gecmis" | "finans" | "abonelik" | "yeni-ilan";

const VALID_TABS: Tab[] = ["talepler", "ilanlar", "gecmis", "finans", "abonelik", "yeni-ilan"];

function TasiyiciContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [hydrated, setHydrated] = useState(false);

  const initialTab = VALID_TABS.includes(searchParams.get("tab") as Tab)
    ? (searchParams.get("tab") as Tab)
    : "talepler";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [dashboard, setDashboard] = useState<CarrierDashboard | null>(null);
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const allowed = user?.role === "carrier" || user?.role === "admin";

  useEffect(() => {
    const t = searchParams.get("tab") as Tab;
    if (VALID_TABS.includes(t)) setTab(t);
  }, [searchParams]);

  useEffect(() => {
    if (!hydrated || !allowed) return;
    Promise.all([getCarrierDashboard(), getMyIlans(), getCarrierBookings(undefined)])
      .then(([dash, list, bList]) => {
        setDashboard(dash);
        setIlanlar(list);
        setBookings(bList.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [hydrated, allowed]);

  if (!hydrated) {
    return <div className="text-muted text-sm text-center py-12">Yükleniyor...</div>;
  }

  if (!allowed) {
    return <div className="text-danger font-bold text-center py-12">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "talepler", label: "Gelen Talepler", count: pendingCount },
    { key: "ilanlar",  label: "İlanlarım" },
    { key: "yeni-ilan", label: "+ Yeni İlan" },
    { key: "gecmis",   label: "Geçmiş" },
    { key: "finans",   label: "Finans" },
    { key: "abonelik", label: "Abonelik" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Taşıyıcı Paneli</h1>
        <Link href="/panel/tasiyici?tab=yeni-ilan" className="inline-flex px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors">
          + Yeni İlan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Aktif İlan",       value: loading ? "—" : dashboard?.active_ilanlar },
          { label: "Bekleyen Talep",   value: loading ? "—" : pendingCount },
          { label: "Toplam Rezerv.",   value: loading ? "—" : dashboard?.total_bookings },
          { label: "Bakiye",           value: loading ? "—" : `₺${dashboard?.balance ?? "0.00"}` },
          { label: "Bekleyen Kazanç",  value: loading ? "—" : `₺${dashboard?.pending_earnings?.toFixed(2) ?? "0.00"}` },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-xl border border-border-soft p-4 text-center">
            <p className="text-xl font-extrabold text-foreground">{s.value}</p>
            <p className="text-xs text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-alt rounded-lg p-1 mb-6 overflow-x-auto">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              tab === key ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            {label}
            {count !== undefined && count > 0 && (
              <span className="bg-brand text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">{count}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "talepler" && <TaleplerTab bookings={bookings} setBookings={setBookings} loading={loading} />}
      {tab === "ilanlar" && <IlanlarimTab ilanlar={ilanlar} setIlanlar={setIlanlar} loading={loading} />}
      {tab === "gecmis" && <GecmisTab bookings={bookings} loading={loading} />}
      {tab === "finans" && <FinansTab dashboard={dashboard} />}
      {tab === "abonelik" && <AbonelikTab />}
      {tab === "yeni-ilan" && <div className="mt-4"><IlanVerForm /></div>}
    </div>
  );
}

export default function TasiyiciPage() {
  return (
    <Suspense fallback={<div className="text-muted text-sm">Yükleniyor...</div>}>
      <TasiyiciContent />
    </Suspense>
  );
}
