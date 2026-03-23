"use client";
import { useState } from "react";
import type { BankDetails } from "../booking.type";

interface Props {
  bankDetails: BankDetails;
  paymentRef: string;
}

export default function BankTransferInfo({ bankDetails, paymentRef }: Props) {
  const [copied, setCopied] = useState(false);

  function copyRef() {
    navigator.clipboard.writeText(paymentRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-surface rounded-xl border border-border-soft p-5">
      <p className="text-sm font-bold text-foreground mb-3">Havale / EFT Bilgileri</p>
      {bankDetails.description && (
        <p className="text-xs text-muted mb-4">{bankDetails.description}</p>
      )}

      <div className="space-y-2 text-sm mb-4">
        {bankDetails.bank_name && (
          <div className="flex justify-between">
            <span className="text-muted">Banka</span>
            <span className="font-semibold text-foreground">{bankDetails.bank_name}</span>
          </div>
        )}
        {bankDetails.account_name && (
          <div className="flex justify-between">
            <span className="text-muted">Hesap Adı</span>
            <span className="font-semibold text-foreground">{bankDetails.account_name}</span>
          </div>
        )}
        {bankDetails.iban && (
          <div className="flex justify-between">
            <span className="text-muted">IBAN</span>
            <span className="font-mono font-semibold text-foreground text-xs">{bankDetails.iban}</span>
          </div>
        )}
      </div>

      <div className="bg-brand/5 border border-brand/20 rounded-lg px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted uppercase font-bold tracking-wider">Referans Kodu</p>
          <p className="text-lg font-black text-brand tracking-wide">{paymentRef}</p>
        </div>
        <button
          onClick={copyRef}
          className="text-xs font-semibold text-brand hover:underline shrink-0"
        >
          {copied ? "Kopyalandı!" : "Kopyala"}
        </button>
      </div>

      <p className="text-xs text-warning mt-3 font-medium">
        Havale açıklamasına referans kodunu yazmayı unutmayın. Admin onayından sonra rezervasyonunuz aktif olacaktır.
      </p>
    </div>
  );
}
