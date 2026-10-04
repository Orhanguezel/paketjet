import type { PaymentOperation } from "@/integrations/shared";
import { formatIlanPurchaseDate } from "@/integrations/shared";

export function PaymentHistoryTab({ events }: { events: PaymentOperation["events"] }) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-semibold">İşlem geçmişi</h3>
        <p className="mt-1 text-muted-foreground text-sm">
          Ödeme ve inceleme olayları, kaydedildiği sırayla gösterilir.
        </p>
      </div>
      <ol className="space-y-3">
        {events?.map((event) => (
          <li key={event.id} className="rounded-xl border border-border p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong>{event.event}</strong>
              <time className="text-muted-foreground text-xs">{formatIlanPurchaseDate(event.created_at)}</time>
            </div>
            <p className="mt-1 break-all text-muted-foreground text-xs">İşlemi yapan: {event.actor_id}</p>
            {event.note && <p className="mt-3 whitespace-pre-wrap break-words">{event.note}</p>}
          </li>
        ))}
        {!events?.length && (
          <li className="rounded-xl border border-border border-dashed p-6 text-muted-foreground text-sm">
            Bu eski kayıt için yeni denetim olayı henüz yok.
          </li>
        )}
      </ol>
    </section>
  );
}
