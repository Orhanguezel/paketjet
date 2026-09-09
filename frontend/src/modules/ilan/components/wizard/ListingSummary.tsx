import { CalendarDays, Info, Pencil, Car } from "lucide-react";
import type { CreateIlanInput } from "../../ilan.type";
import { displayListingTime, vehicleLabels } from "../../ilan-wizard";
type Props = { form: CreateIlanInput; departure: string; arrival?: string };
export function ListingSummary({ form, departure }: Props) {
  return (
    <aside className="listing-summary" aria-label="İlan özeti">
      <h2>İlan özeti</h2>
      <div className="listing-route">
        <div>
          <span>Kalkış</span>
          <strong>{form.from_location?.label || form.from_city || "Henüz seçilmedi"}</strong>
        </div>
        <div>
          <span>Varış</span>
          <strong>{form.to_location?.label || form.to_city || "Henüz seçilmedi"}</strong>
        </div>
      </div>
      <p className="listing-summary-line">
        <CalendarDays size={21} />
        <span>
          <strong>Hareket</strong>
          {displayListingTime(departure)}
        </span>
      </p>
      <p className="listing-summary-line">
        <Car size={21} />
        <span>
          <strong>Araç</strong>
          {vehicleLabels[form.vehicle_type ?? "car"]}
        </span>
      </p>
      <p className="listing-notice">
        <Info size={20} />
        <span>
          <strong>İlan vermek ücretsiz.</strong>Onaylandıktan sonra yayımlanır.
        </span>
      </p>
    </aside>
  );
}
export function ListingReview({ form, departure, arrival, onEdit }: Props & { onEdit: (step: number) => void }) {
  const rows = [
    {
      title: "Rota ve tarih",
      content: (
        <>
          <p className="font-semibold">
            {form.from_location?.label || form.from_city} → {form.to_location?.label || form.to_city}
          </p>
          <p>Hareket: {displayListingTime(departure)}</p>
          {arrival && <p>Varış: {displayListingTime(arrival)}</p>}
          <p className="text-xs">Türkiye saati (UTC+3)</p>
        </>
      ),
    },
    {
      title: "Araç ve detaylar",
      content: (
        <>
          <p>{vehicleLabels[form.vehicle_type ?? "car"]}</p>
          {form.title && <p className="font-semibold">{form.title}</p>}
          <p className="whitespace-pre-wrap">{form.description || "Açıklama eklenmedi."}</p>
        </>
      ),
    },
    {
      title: "Özel iletişim",
      content: (
        <>
          <p>
            {form.contact_name} · {form.contact_phone}
          </p>
          {form.contact_email && <p>{form.contact_email}</p>}
          {form.contact_address && <p>{form.contact_address}</p>}
          <p className="text-xs">Yalnız ilanını satın alan kişiye gösterilir.</p>
        </>
      ),
    },
  ];
  return (
    <div className="listing-review">
      {rows.map((row, index) => (
        <section key={row.title}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">{row.title}</h3>
            <button
              type="button"
              onClick={() => onEdit(index)}
              aria-label={`${row.title} bilgilerini düzenle`}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm text-brand"
            >
              <Pencil size={15} />
              Düzenle
            </button>
          </div>
          <div className="space-y-2 break-words text-sm leading-6 text-muted">{row.content}</div>
        </section>
      ))}
    </div>
  );
}
