import type { PaymentOperation } from "@/integrations/shared";
import { formatIlanPurchaseDate, formatIlanPurchaseMoney, paymentStateLabels } from "@/integrations/shared";

const providerLabel = (provider: string) =>
  provider === "bank_test"
    ? "TEST HAVALESİ · Gerçek tahsilat yok"
    : provider === "bank_transfer"
      ? "Havale"
      : provider === "shopier"
        ? "Shopier (kart)"
        : provider;
const kindLabel = (kind: string) =>
  kind === "listing" ? "İletişim alımı" : kind === "credits" ? "Hak paketi" : "Eski işlem";

export function PaymentOverviewTab({ payment }: { payment: PaymentOperation }) {
  const fields = [
    ["Durum", paymentStateLabels[payment.state] ?? payment.state],
    ["Tutar", formatIlanPurchaseMoney(payment.amount)],
    ["İşlem türü", kindLabel(payment.kind)],
    ["Kullanıcı kimliği", payment.user_id || "Eşleştirme gerekiyor"],
    ["İlan kimliği", payment.ilan_id || "—"],
    ["Sağlayıcı", providerLabel(payment.provider)],
    ["Sağlayıcı işlem kimliği", payment.provider_payment_id ?? "Doğrulanmış bildirim yok"],
    ["Neden / hata kodu", payment.error_code ?? "—"],
    ["Oluşturulma", formatIlanPurchaseDate(payment.created_at)],
    ["Güncellenme", formatIlanPurchaseDate(payment.updated_at)],
    ["Sağlayıcı ödeme kaydı", payment.receipt?.paymentId || "—"],
    ["Sağlayıcı iade kaydı", payment.receipt?.refundId || "—"],
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <p className="text-muted-foreground text-sm">Ödeme tutarı</p>
        <strong className="mt-1 block font-bold text-3xl tracking-tight">
          {formatIlanPurchaseMoney(payment.amount)}
        </strong>
        <span className="mt-2 inline-flex rounded-full bg-accent px-2.5 py-1 font-semibold text-accent-foreground text-xs">
          {paymentStateLabels[payment.state] ?? payment.state}
        </span>
      </div>
      <dl className="grid gap-x-6 gap-y-5 rounded-xl border border-border p-5 text-sm sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="mt-1 break-all font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
