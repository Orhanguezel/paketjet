"use client";

import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRefundPaymentMutation, useSyncPaymentRefundMutation } from "@/integrations/hooks";

type Props = {
  reference: string;
  state: string;
  hasOrder: boolean;
  refundRequested: boolean;
  note: string;
  confirmed: boolean;
  message: string;
  onNoteChange: (value: string) => void;
  onConfirmedChange: (value: boolean) => void;
  onMessage: (value: string) => void;
  onDone: () => void;
};

/** Shopier only reverses access after the provider reports a successful refund. */
export default function ShopierRefund({
  reference,
  state,
  hasOrder,
  refundRequested,
  note,
  confirmed,
  message,
  onNoteChange,
  onConfirmedChange,
  onMessage,
  onDone,
}: Props) {
  const id = useId();
  const [refund, refunding] = useRefundPaymentMutation();
  const [sync, syncing] = useSyncPaymentRefundMutation();
  const canRefund = hasOrder && !refundRequested && ["completed", "review", "refund_pending"].includes(state);
  if (state === "refunded")
    return (
      <p className="rounded-xl border border-border p-4 text-sm">
        Bu ödeme Shopier üzerinden iade edildi; hak veya iletişim erişimi geri alındı.
      </p>
    );

  return (
    <section className="space-y-4 rounded-xl border border-border p-4">
      <h3 className="font-semibold">Shopier iadesi</h3>
      {refundRequested ? (
        <>
          <p className="text-muted-foreground text-sm">
            İade Shopier'e iletildi. Shopier iadeyi tamamladığında durum otomatik güncellenir; dilerseniz aşağıdan
            yenileyin.
          </p>
          <Button
            variant="outline"
            disabled={syncing.isLoading}
            onClick={async () => {
              try {
                const result = await sync(reference).unwrap();
                onMessage(`Güncel durum: ${result.state ?? "bilinmiyor"}`);
                onDone();
              } catch {
                onMessage("İade durumu Shopier'den alınamadı. Biraz sonra yeniden deneyin.");
              }
            }}
          >
            İade durumunu yenile
          </Button>
        </>
      ) : canRefund ? (
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const result = await refund({ ref: reference, note }).unwrap();
              onMessage(
                result.state === "refunded" ? "İade tamamlandı." : "İade Shopier'e iletildi; sonucu bekleniyor.",
              );
              onDone();
            } catch (error) {
              const code = (error as { data?: { error?: { message?: string } } }).data?.error?.message;
              onMessage(
                code === "provider_rejected"
                  ? "Shopier iadeyi kabul etmedi. Kayıt incelemeye alındı; Shopier panelinden kontrol edin."
                  : "İade başlatılamadı. Ödeme durumu değişmiş olabilir; detayı yenileyin.",
              );
              onDone();
            }
          }}
        >
          <p className="text-muted-foreground text-sm">
            Tutarın tamamı karta iade edilir. Hak paketiyse kullanılmamış haklar düşülür, ilan iletişimiyse erişim
            kapanır. Kısmi iade için Shopier panelini kullanın; kayıt incelemeye düşer.
          </p>
          <label htmlFor={`${id}-note`} className="block text-sm">
            Alıcıya iade notu
          </label>
          <Textarea
            id={`${id}-note`}
            required
            minLength={5}
            maxLength={250}
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
          />
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              required
              checked={confirmed}
              onChange={(event) => onConfirmedChange(event.target.checked)}
            />
            Tutarın tamamını iade etmek istiyorum
          </label>
          <Button type="submit" variant="destructive" disabled={!confirmed || refunding.isLoading}>
            Shopier'den iade et
          </Button>
        </form>
      ) : (
        <p className="text-muted-foreground text-sm">
          Bu kayıt için iade başlatılamaz: doğrulanmış bir Shopier siparişi yok veya ödeme tamamlanmadı.
        </p>
      )}
      {message && <output className="block text-sm">{message}</output>}
    </section>
  );
}
