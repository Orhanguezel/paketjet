"use client";
import type { Booking } from "@/modules/booking/booking.type";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";

const STATUS_LABEL: Record<string, string> = {
  delivered: "Teslim Edildi", cancelled: "İptal Edildi",
};
const STATUS_COLOR: Record<string, "success" | "danger"> = {
  delivered: "success", cancelled: "danger",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

interface Props {
  bookings: Booking[];
  loading: boolean;
}

export default function GecmisTab({ bookings, loading }: Props) {
  const pastBookings = bookings.filter(b => ["delivered", "cancelled"].includes(b.status));

  if (loading) return <div className="flex flex-col gap-3">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>;

  if (pastBookings.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-lg font-semibold">Henüz geçmiş taşıma yok</p>
        <p className="text-sm mt-1">Teslim edilen veya iptal edilen taşımalar burada görünecek.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {pastBookings.map((b) => (
        <div
          key={b.id}
          className={`bg-surface rounded-xl border p-4 ${
            b.status === "delivered" ? "border-success/30" : "border-danger/30"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-foreground text-sm">
                  {b.from_city && b.to_city ? `${b.from_city} → ${b.to_city}` : "İlan"}
                </p>
                <Badge color={STATUS_COLOR[b.status] ?? "muted"}>
                  {STATUS_LABEL[b.status] ?? b.status}
                </Badge>
              </div>
              <p className="text-xs text-muted">
                {b.kg_amount} kg · ₺{b.total_price}
                {b.commission_amount && parseFloat(b.commission_amount) > 0 && b.status === "delivered" && (
                  <span className="text-success font-semibold ml-1.5">
                    (Kazanç: ₺{(parseFloat(b.total_price) - parseFloat(b.commission_amount)).toFixed(2)})
                  </span>
                )}
                {b.customer_name && ` · ${b.customer_name}`}
                {" · "}{formatDate(b.created_at)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
