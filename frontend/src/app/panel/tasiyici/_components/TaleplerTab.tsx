"use client";
import { useState } from "react";
import { confirmBooking, cancelBooking, updateBookingStatus } from "@/modules/booking/booking.service";
import type { Booking } from "@/modules/booking/booking.type";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";

const BOOKING_STATUS_COLOR: Record<string, "success" | "muted" | "danger" | "brand" | "warning"> = {
  pending: "warning", confirmed: "success", in_transit: "brand",
  delivered: "success", cancelled: "danger", disputed: "danger",
};
const BOOKING_STATUS_LABEL: Record<string, string> = {
  pending: "Bekliyor", confirmed: "Onaylandı", in_transit: "Yolda",
  delivered: "Teslim", cancelled: "İptal", disputed: "Anlaşmazlık",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

interface Props {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  loading: boolean;
}

export default function TaleplerTab({ bookings, setBookings, loading }: Props) {
  const [actionId, setActionId] = useState<string | null>(null);

  // Only show active bookings (not delivered/cancelled)
  const activeBookings = bookings.filter(b => !["delivered", "cancelled"].includes(b.status));

  async function handleConfirm(id: string) {
    setActionId(id);
    try {
      const updated = await confirmBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  async function handleCancel(id: string) {
    if (!confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")) return;
    setActionId(id);
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b)));
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  async function handleTransit(id: string) {
    setActionId(id);
    try {
      const updated = await updateBookingStatus(id, "in_transit");
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  async function handleDeliver(id: string) {
    if (!confirm("Teslimi onaylamak istediğinize emin misiniz? Ödeme cüzdanınıza aktarılacak.")) return;
    setActionId(id);
    try {
      const updated = await updateBookingStatus(id, "delivered");
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  if (loading) return <div className="flex flex-col gap-3">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>;

  if (activeBookings.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-lg font-semibold">Henüz aktif rezervasyon talebi yok</p>
        <p className="text-sm mt-1">İlan verince burada görünecek.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {activeBookings.map((b) => (
        <div key={b.id} className="bg-surface rounded-xl border border-border-soft p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-foreground text-sm">
                  {b.from_city && b.to_city ? `${b.from_city} → ${b.to_city}` : "İlan"}
                </p>
                <Badge color={BOOKING_STATUS_COLOR[b.status] ?? "muted"}>
                  {BOOKING_STATUS_LABEL[b.status] ?? b.status}
                </Badge>
              </div>
              <p className="text-xs text-muted">
                {b.kg_amount} kg · ₺{b.total_price}
                {b.commission_amount && parseFloat(b.commission_amount) > 0 && (
                  <span className="text-success font-semibold ml-1.5">
                    (Hakediş: ₺{(parseFloat(b.total_price) - parseFloat(b.commission_amount)).toFixed(2)})
                  </span>
                )}
                {b.customer_name && ` · ${b.customer_name}`}
                {" · "}{formatDate(b.created_at)}
              </p>
              {b.payment_status === "awaiting_transfer" && (
                <div className="mt-1"><Badge color="warning">Havale Bekleniyor</Badge></div>
              )}
              {b.customer_notes && (
                <p className="text-xs text-muted mt-1 italic">&quot;{b.customer_notes}&quot;</p>
              )}
            </div>
            {b.status === "pending" && (
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="success" loading={actionId === b.id} onClick={() => handleConfirm(b.id)}>Onayla</Button>
                <Button size="sm" variant="danger" loading={actionId === b.id} onClick={() => handleCancel(b.id)}>Reddet</Button>
              </div>
            )}
            {b.status === "confirmed" && (
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="primary" loading={actionId === b.id} onClick={() => handleTransit(b.id)}>Yola Çıktı</Button>
                <Button size="sm" variant="danger" loading={actionId === b.id} onClick={() => handleCancel(b.id)}>İptal</Button>
              </div>
            )}
            {b.status === "in_transit" && (
              <Button size="sm" variant="success" loading={actionId === b.id} onClick={() => handleDeliver(b.id)}>Teslim Edildi</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
