import Link from "next/link";
import type { Ilan } from "@/modules/ilan/ilan.type";

interface IlanCardProps {
  ilan: Ilan;
}

const VEHICLE_LABELS: Record<string, string> = {
  car: "Otomobil", van: "Minivan", truck: "Kamyon", motorcycle: "Motosiklet", other: "Diğer",
};

function LetterAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative shrink-0">
      <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center border-2 border-brand/20">
        <span className="text-brand font-extrabold text-sm tracking-tight">{initials}</span>
      </div>
      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-surface" />
    </div>
  );
}

export default function IlanCard({ ilan }: IlanCardProps) {
  const carrierName = ilan.carrier_name?.trim() || "Taşıyıcı";
  const departureDate = new Date(ilan.departure_date);
  const dateLabel = departureDate.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  const timeLabel = departureDate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  const vehicleLabel = VEHICLE_LABELS[ilan.vehicle_type] ?? ilan.vehicle_type;

  return (
    <Link
      href={`/ilanlar/${ilan.id}`}
      title={`${ilan.from_city} - ${ilan.to_city} kargo ilani`}
      className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border shadow-sm hover:border-brand/40 hover:shadow-md transition-all group"
    >
      {/* Avatar */}
      <LetterAvatar name={carrierName} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted truncate">{carrierName} · {vehicleLabel}</p>
        <p className="text-base font-extrabold text-foreground tracking-tight leading-tight">
          {ilan.from_city}{" "}
          <span className="text-faint font-normal">→</span>{" "}
          {ilan.to_city}
        </p>
        <p className="text-xs text-muted mt-0.5">{dateLabel} · Saat {timeLabel}</p>
      </div>

      {/* Capacity badge */}
      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs text-muted bg-bg-alt px-2.5 py-1 rounded-full">
          {ilan.available_capacity_kg} kg müsait
        </span>
        <span className="text-xs font-bold text-brand">
          {ilan.price_per_kg} ₺/kg
        </span>
      </div>

      {/* CTA */}
      <span className="px-5 py-2.5 text-sm font-bold text-white bg-success group-hover:brightness-95 rounded-lg transition-colors shrink-0">
        Satın Al
      </span>
    </Link>
  );
}
