"use client";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "../booking.type";

interface Props {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  walletBalance?: string;
  totalPrice?: number;
}

const METHODS: { value: PaymentMethod; label: string; desc: string; icon: string }[] = [
  { value: "wallet", label: "Cüzdan", desc: "Bakiyeden ödeme", icon: "💳" },
  { value: "card", label: "Kredi Kartı (İyzico)", desc: "İyzico güvenli ödeme", icon: "🇮" },
  { value: "paytr", label: "Kredi Kartı (PayTR)", desc: "PayTR güvenli ödeme", icon: "🇵" },
  { value: "transfer", label: "Havale / EFT", desc: "Banka havalesi", icon: "🏦" },
];

export default function PaymentMethodSelector({ selected, onChange, walletBalance, totalPrice }: Props) {
  const balance = parseFloat(walletBalance ?? "0");
  const insufficient = totalPrice !== undefined && balance < totalPrice;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-foreground mb-1">Ödeme Yöntemi</p>
      {METHODS.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all text-sm",
            selected === m.value
              ? "border-brand bg-brand/5 ring-1 ring-brand/20"
              : "border-border-soft bg-surface hover:border-border"
          )}
        >
          <span className="text-xl">{m.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">{m.label}</p>
            <p className="text-xs text-muted">
              {m.value === "wallet" && walletBalance !== undefined
                ? `Bakiye: ₺${walletBalance}${insufficient ? " (yetersiz)" : ""}`
                : m.desc}
            </p>
          </div>
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
            selected === m.value ? "border-brand" : "border-border"
          )}>
            {selected === m.value && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
          </div>
        </button>
      ))}
    </div>
  );
}
