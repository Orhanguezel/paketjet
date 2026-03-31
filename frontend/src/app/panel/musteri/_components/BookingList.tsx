"use client";
import { useState } from "react";
import Link from "next/link";
import { cancelBooking, confirmDelivery } from "@/modules/booking/booking.service";
import type { Booking } from "@/modules/booking/booking.type";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import BookingChat from "@/modules/booking/components/BookingChat";
import DisputeSection from "@/modules/booking/components/DisputeSection";
import RatingForm from "./RatingForm";

const STATUS_LABEL: Record<string, string> = {
  pending: "Bekliyor", confirmed: "Onaylandı", in_transit: "Yolda",
  awaiting_delivery_confirmation: "Teslim Onayı Bekliyor",
  delivered: "Teslim Edildi", cancelled: "İptal", disputed: "İtiraz",
};
const STATUS_COLOR: Record<string, "muted" | "brand" | "success" | "warning" | "danger"> = {
  pending: "warning", confirmed: "brand", in_transit: "brand",
  awaiting_delivery_confirmation: "warning",
  delivered: "success", cancelled: "muted", disputed: "danger",
};
const CANCELLABLE = ["pending", "confirmed"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

interface Props {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  ratedBookings: Set<string>;
  onRated: (bookingId: string) => void;
  loading: boolean;
  onDashboardUpdate: () => void;
}

export default function BookingList({ bookings, setBookings, ratedBookings, onRated, loading, onDashboardUpdate }: Props) {
  const [actionId, setActionId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleCancel(id: string) {
    if (!confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")) return;
    setActionId(id);
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b)));
      onDashboardUpdate();
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  async function handleConfirmDelivery(id: string) {
    if (!confirm("Kargonuzu teslim aldığınızı onaylıyor musunuz? Ödeme taşıyıcıya aktarılacak.")) return;
    setActionId(id);
    try {
      const updated = await confirmDelivery(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      onDashboardUpdate();
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  if (loading) return <div className="flex flex-col gap-3">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>;

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-lg font-semibold">Henüz rezervasyon yok</p>
        <p className="text-sm mt-1">İlanları inceleyerek taşıma talebi oluşturabilirsiniz.</p>
        <Link href="/ilanlar" className="mt-4 inline-block px-5 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors">
          İlanları Gör
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {bookings.map((b) => (
        <div key={b.id} className={`bg-surface rounded-xl border p-4 ${b.status === "delivered" ? "border-success/30" : "border-border-soft"}`}>
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-foreground text-sm">{b.from_city ?? "—"} → {b.to_city ?? "—"}</p>
                <Badge color={STATUS_COLOR[b.status] ?? "muted"}>{STATUS_LABEL[b.status] ?? b.status}</Badge>
              </div>
              <p className="text-xs text-muted">{b.kg_amount} kg · ₺{b.total_price}</p>
              {["confirmed", "in_transit", "delivered"].includes(b.status) && b.carrier_name && (
                <p className="text-xs text-foreground font-medium mt-0.5">Taşıyıcı: {b.carrier_name}</p>
              )}
              <p className="text-xs text-muted mt-0.5">{formatDate(b.created_at)}</p>
              {b.payment_status === "awaiting_transfer" && (
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge color="warning">Havale Bekleniyor</Badge>
                  {b.payment_ref && <span className="text-xs font-mono font-semibold text-brand">{b.payment_ref}</span>}
                </div>
              )}
              {b.payment_status === "failed" && <Badge color="danger">Ödeme Başarısız</Badge>}
              {b.customer_notes && <p className="text-xs text-muted mt-1 italic">&quot;{b.customer_notes}&quot;</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {b.status === "awaiting_delivery_confirmation" && (
                <Button size="sm" variant="success" loading={actionId === b.id} onClick={() => handleConfirmDelivery(b.id)}>
                  Teslim Aldım
                </Button>
              )}
              {CANCELLABLE.includes(b.status) && (
                <Button size="sm" variant="ghost" loading={actionId === b.id} onClick={() => handleCancel(b.id)} className="text-danger hover:bg-danger/10">
                  İptal
                </Button>
              )}
            </div>
          </div>

          {/* Kargo takip */}
          {["confirmed", "in_transit", "awaiting_delivery_confirmation", "delivered"].includes(b.status) && (
            <div className="mt-3 pt-3 border-t border-border-soft">
              <div className="flex items-center gap-0">
                {(["confirmed", "in_transit", "awaiting_delivery_confirmation", "delivered"] as const).map((step, i) => {
                  const steps = ["confirmed", "in_transit", "awaiting_delivery_confirmation", "delivered"];
                  const currentIdx = steps.indexOf(b.status);
                  const isDone = i <= currentIdx;
                  const labels = ["Onaylandı", "Kargo Alındı", "Teslim Onayı", "Tamamlandı"];
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isDone ? "bg-brand text-white" : "bg-bg-alt text-muted"}`}>
                          {i + 1}
                        </div>
                        <span className={`text-[10px] font-medium whitespace-nowrap ${isDone ? "text-brand" : "text-faint"}`}>{labels[i]}</span>
                      </div>
                      {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${i < currentIdx ? "bg-brand" : "bg-border-soft"}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mesajlaşma + Anlaşmazlık toggle */}
          {["confirmed", "in_transit", "awaiting_delivery_confirmation"].includes(b.status) && (
            <div className="mt-3 pt-3 border-t border-border-soft">
              <button
                onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                className="text-xs text-brand font-semibold hover:underline"
              >
                {expandedId === b.id ? "Mesajları Gizle" : "Mesaj Gönder / Detay"}
              </button>
              {expandedId === b.id && (
                <div className="mt-3 space-y-3">
                  <BookingChat bookingId={b.id} bookingStatus={b.status} />
                  <DisputeSection bookingId={b.id} bookingStatus={b.status} />
                </div>
              )}
            </div>
          )}

          {/* Değerlendirme */}
          {b.status === "delivered" && (
            <div className="mt-3 pt-3 border-t border-border-soft">
              <RatingForm bookingId={b.id} isRated={ratedBookings.has(b.id)} onRated={onRated} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
