"use client";
import { useState } from "react";
import { initiateDeposit, devDeposit } from "@/modules/wallet/wallet.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import PaymentModal from "@/components/PaymentModal";

const isDev = process.env.NODE_ENV === "development";

export default function DepositTab({ onDeposit }: { onDeposit: () => void }) {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositing, setDepositing]       = useState(false);
  const [depositError, setDepositError]   = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentContent, setPaymentContent] = useState("");
  const [paymentIframeUrl, setPaymentIframeUrl] = useState("");
  const [method, setMethod] = useState<"iyzico" | "paytr" | "dev">(isDev ? "dev" : "paytr");

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (!amount || amount < 10) {
      setDepositError("Minimum yükleme tutarı ₺10");
      return;
    }
    setDepositing(true);
    setDepositError("");
    try {
      if (method === "dev") {
        await devDeposit(amount, `DEV: ₺${amount.toFixed(2)} test bakiye`);
        onDeposit();
        setDepositAmount("");
        return;
      }

      const res = await initiateDeposit(amount, method);
      if (res.provider === "iyzico") {
        setPaymentContent(res.checkoutFormContent ?? "");
        setPaymentIframeUrl("");
      } else {
        setPaymentIframeUrl(res.iframeUrl ?? "");
        setPaymentContent("");
      }
      setShowPaymentModal(true);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message?.includes("iyzico_init_failed")
        ? "Ödeme sistemi başlatılamadı, lütfen tekrar deneyin."
        : "Yükleme başarısız oldu";
      setDepositError(msg);
    } finally {
      setDepositing(false);
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-border-soft p-5">
      <p className="text-sm font-semibold text-foreground mb-1">Bakiye Yükle</p>
      <p className="text-xs text-muted mb-4">Güvenli ödeme altyapısıyla bakiye yükleyin.</p>

      {/* Method Selection */}
      <div className="flex gap-2 mb-4">
        {isDev && (
          <button
            onClick={() => setMethod("dev")}
            className={`flex-1 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
              method === "dev" ? "border-success bg-success/5 text-success ring-1 ring-success/20" : "border-border-soft text-muted hover:border-border"
            }`}
          >
            Dev Test
          </button>
        )}
        <button
          onClick={() => setMethod("iyzico")}
          className={`flex-1 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
            method === "iyzico" ? "border-brand bg-brand/5 text-brand ring-1 ring-brand/20" : "border-border-soft text-muted hover:border-border"
          }`}
        >
          Iyzico
        </button>
        <button
          onClick={() => setMethod("paytr")}
          className={`flex-1 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
            method === "paytr" ? "border-brand bg-brand/5 text-brand ring-1 ring-brand/20" : "border-border-soft text-muted hover:border-border"
          }`}
        >
          PayTR
        </button>
      </div>

      <form onSubmit={handleDeposit} className="flex gap-3 items-end">
        <div className="flex-1">
          <Input
            label="Tutar (₺)"
            type="number"
            min="10"
            step="1"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="100"
            error={depositError}
          />
        </div>
        <Button type="submit" loading={depositing} className="shrink-0">
          Yükle
        </Button>
      </form>

      <PaymentModal
        show={showPaymentModal}
        onClose={() => { setShowPaymentModal(false); onDeposit(); }}
        checkoutFormContent={paymentContent}
        iframeUrl={paymentIframeUrl}
        title="Bakiye Yükle"
      />
    </div>
  );
}
