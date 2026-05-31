"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { getSiteSettingValue } from "@/lib/site-settings";
import type { ContactSnapshot, PurchaseDeclarationInput } from "@/modules/purchases/purchases.type";

function formatPrice(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "-";
  return `₺${Number(value).toLocaleString("tr-TR")}`;
}

interface RevealAsideProps {
  contact: ContactSnapshot | null;
  error: string;
  isAuthenticated: boolean;
  isActive: boolean;
  listingPrice: number | null;
  revealing: boolean;
  onPay: (declaration: PurchaseDeclarationInput) => void;
  onReveal: (declaration: PurchaseDeclarationInput) => void;
}

interface ContentDeclarationSetting {
  message?: string;
}

export function RevealAside({
  contact,
  error,
  isAuthenticated,
  isActive,
  listingPrice,
  revealing,
  onPay,
  onReveal,
}: RevealAsideProps) {
  const valueInputId = useId();
  const declarationInputId = useId();
  const [estimatedValue, setEstimatedValue] = useState("");
  const [contentDeclared, setContentDeclared] = useState(false);
  const [declarationMessage, setDeclarationMessage] = useState("");
  const estimatedValueNumber = Number(estimatedValue);
  const canSubmit = useMemo(
    () => Number.isFinite(estimatedValueNumber) && estimatedValueNumber > 0 && contentDeclared && declarationMessage.length > 0,
    [estimatedValueNumber, contentDeclared, declarationMessage],
  );

  useEffect(() => {
    getSiteSettingValue<ContentDeclarationSetting>("listing.content_declaration", "tr")
      .then((setting) => setDeclarationMessage(setting?.message?.trim() ?? ""))
      .catch(() => setDeclarationMessage(""));
  }, []);

  function declaration(): PurchaseDeclarationInput {
    return {
      estimated_value: estimatedValueNumber,
      estimated_value_currency: "TRY",
      content_declared: true,
    };
  }

  return (
    <aside className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
      <div className="rounded-xl bg-blue-soft/70 p-4">
        <p className="text-xs font-black uppercase tracking-normal text-brand">İletişim erişimi</p>
        <p className="mt-2 text-2xl font-black text-panel-ink">{listingPrice === null ? "-" : formatPrice(listingPrice)}</p>
        <p className="mt-2 text-xs font-bold leading-relaxed text-panel-ink/65">
          Satın aldığınız hizmet kargo taşıma değil; ilan sahibinin iletişim bilgilerine anlık erişim hizmetidir.
        </p>
      </div>

      {contact ? (
        <div className="mt-5 grid gap-3 text-sm">
          <p className="font-black text-panel-ink">İletişim açıldı</p>
          <p className="font-bold text-panel-ink/75">Ad: {contact.name || "-"}</p>
          <p className="font-bold text-panel-ink/75">Telefon: {contact.phone || "-"}</p>
          <p className="font-bold text-panel-ink/75">E-posta: {contact.email || "-"}</p>
          <p className="font-bold text-panel-ink/75">Adres: {contact.address || "-"}</p>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          <div className="grid gap-3 rounded-xl border border-border-soft bg-background p-4">
            <label htmlFor={valueInputId} className="text-xs font-black uppercase tracking-normal text-panel-ink/65">
              Ürünün tahmini değeri (TL)
            </label>
            <input
              id={valueInputId}
              type="number"
              min="1"
              step="1"
              inputMode="decimal"
              value={estimatedValue}
              onChange={(event) => setEstimatedValue(event.target.value)}
              placeholder="Örn. 2500"
              className="h-11 rounded-lg border border-border-soft bg-surface px-3 text-sm font-bold text-panel-ink outline-none transition-colors focus:border-brand"
            />
            <label htmlFor={declarationInputId} className="flex items-start gap-3 text-xs font-bold leading-relaxed text-panel-ink/75">
              <input
                id={declarationInputId}
                type="checkbox"
                checked={contentDeclared}
                disabled={!declarationMessage}
                onChange={(event) => setContentDeclared(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
              />
              <span>{declarationMessage || "Beyan metni yükleniyor."}</span>
            </label>
          </div>
          {error && <p className="text-xs font-bold text-danger">{error}</p>}
          {error.includes("hakkınız yok") && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={revealing || !isActive || !canSubmit}
                onClick={() => onPay(declaration())}
                className="w-full rounded-lg bg-cta py-3 text-sm font-black text-white transition-colors hover:bg-cta-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                Kartla Öde
              </button>
              <Link href={ROUTES.panel.ilanAlmaHakki} className="text-sm font-black text-brand hover:underline">
                İlan alma hakkı paketlerini incele
              </Link>
            </div>
          )}
          <button
            type="button"
            disabled={revealing || !isActive || !canSubmit}
            onClick={() => onReveal(declaration())}
            className="w-full rounded-lg bg-cta py-3 text-sm font-black text-white transition-colors hover:bg-cta-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {revealing ? "Açılıyor..." : isAuthenticated ? "İletişimi Gör" : "Giriş Yap & İletişimi Gör"}
          </button>
        </div>
      )}
    </aside>
  );
}
