"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getIlan } from "@/modules/ilan/ilan.service";
import { createBooking, initiateBookingPayment } from "@/modules/booking/booking.service";
import { getWallet } from "@/modules/wallet/wallet.service";
import { useAuthStore } from "@/modules/auth/auth.store";
import type { Ilan } from "@/modules/ilan/ilan.type";
import type { PaymentMethod, BankDetails } from "@/modules/booking/booking.type";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import PaymentMethodSelector from "@/modules/booking/components/PaymentMethodSelector";
import BankTransferInfo from "@/modules/booking/components/BankTransferInfo";
import PaymentModal from "@/components/PaymentModal";

const RouteMap = dynamic(() => import("@/components/RouteMap").then((m) => m.RouteMap), {
  ssr: false,
  loading: () => <div className="h-75 bg-surface-alt animate-pulse rounded-xl" />,
});

const VEHICLE_LABELS: Record<string, string> = {
  car: "Otomobil", van: "Minivan", truck: "Kamyon", motorcycle: "Motosiklet", other: "Diğer",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function CapacityBar({ available, total }: { available: string; total: string }) {
  const avail = parseFloat(available);
  const tot = parseFloat(total);
  const pct = tot > 0 ? Math.round((avail / tot) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-muted">Müsait kapasite</span>
        <span className="font-bold text-foreground">{avail} / {tot} kg</span>
      </div>
      <div className="h-2 bg-bg-alt rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", pct > 50 ? "bg-success" : pct > 20 ? "bg-brand" : "bg-red-400")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function IlanDetailClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [ilan, setIlan] = useState<Ilan | null>(null);
  const [loading, setLoading] = useState(true);
  const [kgInput, setKgInput] = useState("");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingDone, setBookingDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wallet");
  const [walletBalance, setWalletBalance] = useState<string | undefined>();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentContent, setPaymentContent] = useState("");
  const [paymentIframeUrl, setPaymentIframeUrl] = useState("");
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [paymentRef, setPaymentRef] = useState("");

  useEffect(() => {
    getIlan(id)
      .then(setIlan)
      .catch(() => router.push(ROUTES.ilanlar.list))
      .finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => {
    if (isAuthenticated) {
      getWallet().then((w) => setWalletBalance(w.balance)).catch(() => {});
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 pt-8">
          <div className="h-64 bg-surface rounded-2xl border border-border-soft animate-pulse" />
        </div>
      </main>
    );
  }

  if (!ilan) return null;

  const pricePerKg = parseFloat(ilan.price_per_kg);
  const kgValue = parseFloat(kgInput) || 0;
  const totalPrice = kgValue * pricePerKg;
  const available = parseFloat(ilan.available_capacity_kg);

  function handleBookingError(err: unknown) {
    const code = (err as { code?: string })?.code ?? (err as { message?: string })?.message ?? "";
    if (code.includes("cannot_book_own_ilan")) {
      setBookingError("Kendi ilanınıza rezervasyon yapamazsınız.");
    } else if (code.includes("insufficient_balance")) {
      setBookingError("Cüzdan bakiyeniz yetersiz. Lütfen bakiye yükleyin.");
    } else if (code.includes("insufficient_capacity") || code.includes("capacity")) {
      setBookingError("Yeterli kapasite yok.");
    } else if (code.includes("ilan_not_available")) {
      setBookingError("Bu ilan artık aktif değil.");
    } else {
      setBookingError("Rezervasyon oluşturulamadı. Tekrar deneyin.");
    }
  }

  async function handleRezerve(e: React.FormEvent) {
    e.preventDefault();
    setBookingError("");

    if (!isAuthenticated) {
      router.push(`${ROUTES.auth.login}?next=/ilanlar/${id}`);
      return;
    }

    if (!kgValue || kgValue <= 0) {
      setBookingError("Lütfen kg miktarı girin");
      return;
    }
    if (kgValue > available) {
      setBookingError(`Maksimum ${available} kg rezerve edebilirsiniz`);
      return;
    }

    setBooking(true);
    try {
      const res = await createBooking({
        ilan_id: id,
        kg_amount: kgValue,
        customer_notes: notes || undefined,
        payment_method: paymentMethod,
      });

      if (paymentMethod === "wallet") {
        setBookingDone(true);
        setTimeout(() => router.push(ROUTES.panel.musteri), 1500);
      } else if (paymentMethod === "card" || paymentMethod === "paytr") {
        const payRes = await initiateBookingPayment(res.id);
        if (payRes.provider === "iyzico") {
          setPaymentContent(payRes.checkoutFormContent ?? "");
          setPaymentIframeUrl("");
        } else {
          setPaymentIframeUrl(payRes.iframeUrl ?? "");
          setPaymentContent("");
        }
        setShowPaymentModal(true);
      } else if (paymentMethod === "transfer") {
        setPaymentRef(res.payment_ref ?? "");
        if (res.bank_details) setBankDetails(res.bank_details);
        setBookingDone(true);
      }
    } catch (err: unknown) {
      handleBookingError(err);
    } finally {
      setBooking(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">

      <div className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href={ROUTES.ilanlar.list} className="hover:text-brand transition-colors">İlanlar</Link>
          <span>›</span>
          <span className="text-foreground">{ilan.from_city} → {ilan.to_city}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Sol — İlan detayları */}
          <div className="lg:col-span-2 bg-surface rounded-2xl border border-border-soft p-6 shadow-sm">
            {/* Güzergah başlık */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                  {ilan.from_city} <span className="text-brand">→</span> {ilan.to_city}
                </h1>
                {(ilan.from_district || ilan.to_district) && (
                  <p className="text-sm text-muted mt-0.5">
                    {ilan.from_district && <>{ilan.from_district}, </>}
                    {ilan.from_city} → {ilan.to_district && <>{ilan.to_district}, </>}{ilan.to_city}
                  </p>
                )}
              </div>
              <span className={cn(
                "shrink-0 px-3 py-1 rounded-full text-xs font-semibold",
                ilan.status === "active" ? "bg-success/10 text-success" : "bg-bg-alt text-muted"
              )}>
                {ilan.status === "active" ? "Aktif" : ilan.status}
              </span>
            </div>

            {/* Detaylar grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-background rounded-xl p-4">
                <p className="text-xs text-muted mb-1">Kalkış</p>
                <p className="font-semibold text-foreground text-sm">{formatDate(ilan.departure_date)}</p>
              </div>
              {ilan.arrival_date && (
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Varış (tahmini)</p>
                  <p className="font-semibold text-foreground text-sm">{formatDate(ilan.arrival_date)}</p>
                </div>
              )}
              <div className="bg-background rounded-xl p-4">
                <p className="text-xs text-muted mb-1">Araç tipi</p>
                <p className="font-semibold text-foreground text-sm">{VEHICLE_LABELS[ilan.vehicle_type] ?? ilan.vehicle_type}</p>
              </div>
              <div className="bg-background rounded-xl p-4">
                <p className="text-xs text-muted mb-1">Fiyat</p>
                <p className="font-semibold text-brand text-sm">
                  ₺{pricePerKg} / kg {ilan.is_negotiable ? <span className="text-xs text-muted">(pazarlıklı)</span> : ""}
                </p>
              </div>
            </div>

            {/* Kapasite */}
            <div className="mb-6">
              <CapacityBar available={ilan.available_capacity_kg} total={ilan.total_capacity_kg} />
            </div>

            {/* Güzergah haritası */}
            <div className="mb-6">
              <RouteMap fromCity={ilan.from_city} toCity={ilan.to_city} height={300} />
            </div>

            {/* Taşıyıcı */}
            <div className="flex items-center gap-3 p-4 bg-background rounded-xl mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-xlight flex items-center justify-center text-brand font-bold text-sm">
                {(ilan.carrier_name ?? "?")[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{ilan.carrier_name ?? "Taşıyıcı"}</p>
                <p className="text-xs text-muted">Taşıyıcı</p>
              </div>
            </div>

            {ilan.description && (
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Açıklama</p>
                <p className="text-sm text-muted leading-relaxed">{ilan.description}</p>
              </div>
            )}
          </div>

          {/* Sağ — Rezervasyon kartı */}
          <div className="bg-surface rounded-2xl border border-border-soft p-6 shadow-sm">
            <div className="mb-4">
              <p className="text-xl font-extrabold text-brand">₺{pricePerKg} <span className="text-sm font-normal text-muted">/ kg</span></p>
              {ilan.is_negotiable === 1 && <p className="text-xs text-muted mt-0.5">Fiyat pazarlıklı</p>}
            </div>

            {bookingDone && paymentMethod === "transfer" && bankDetails ? (
              <div className="flex flex-col gap-4">
                <p className="text-success font-semibold text-sm text-center">
                  Rezervasyon oluşturuldu! Havale bilgileri aşağıdadır.
                </p>
                <BankTransferInfo bankDetails={bankDetails} paymentRef={paymentRef} />
                <button
                  onClick={() => router.push(ROUTES.panel.musteri)}
                  className="w-full py-3 rounded-lg text-sm font-bold bg-brand text-white hover:bg-brand/90 transition-colors"
                >
                  Panele Git
                </button>
              </div>
            ) : bookingDone ? (
              <div className="text-center py-6">
                <p className="text-success font-semibold text-sm">
                  Rezervasyon oluşturuldu! Panele yönlendiriliyorsunuz...
                </p>
              </div>
            ) : (
              <form onSubmit={handleRezerve} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Kaç kg göndermek istiyorsunuz?</label>
                  <input
                    type="number" value={kgInput} onChange={(e) => setKgInput(e.target.value)}
                    placeholder={`Max ${available} kg`} min="0.1" max={available} step="0.1"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Not (opsiyonel)</label>
                  <textarea
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Kırılgan eşya, özel talimat..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 resize-none"
                  />
                </div>

                <PaymentMethodSelector
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                  walletBalance={walletBalance}
                  totalPrice={kgValue > 0 ? totalPrice : undefined}
                />

                {kgValue > 0 && (
                  <div className="flex items-center justify-between py-3 border-t border-border-soft">
                    <span className="text-sm text-muted">Toplam tutar</span>
                    <span className="font-bold text-foreground">₺{totalPrice.toFixed(2)}</span>
                  </div>
                )}

                {bookingError && (
                  <p className="text-xs text-danger">{bookingError}</p>
                )}

                <button
                  type="submit"
                  disabled={booking || available <= 0}
                  className={cn(
                    "w-full py-3 rounded-lg text-sm font-bold transition-colors",
                    available <= 0
                      ? "bg-bg-alt text-muted cursor-not-allowed"
                      : "bg-success text-white hover:bg-success/90 disabled:opacity-60"
                  )}
                >
                  {booking
                    ? "İşleniyor..."
                    : available <= 0
                      ? "Kapasite Dolu"
                      : isAuthenticated
                        ? "Rezerve Et"
                        : "Giriş Yap & Rezerve Et"}
                </button>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-border-soft">
              <CapacityBar available={ilan.available_capacity_kg} total={ilan.total_capacity_kg} />
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        checkoutFormContent={paymentContent}
        iframeUrl={paymentIframeUrl}
        title="Rezervasyon Ödemesi"
      />
    </main>
  );
}
