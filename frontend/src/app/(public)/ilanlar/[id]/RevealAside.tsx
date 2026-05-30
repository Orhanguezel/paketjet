import Link from "next/link";
import { ROUTES } from "@/config/routes";
import type { ContactSnapshot } from "@/modules/purchases/purchases.type";

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
  onReveal: () => void;
}

export function RevealAside({
  contact,
  error,
  isAuthenticated,
  isActive,
  listingPrice,
  revealing,
  onReveal,
}: RevealAsideProps) {
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
          {error && <p className="text-xs font-bold text-danger">{error}</p>}
          {error.includes("hakkınız yok") && (
            <Link href={ROUTES.panel.ilanAlmaHakki} className="text-sm font-black text-brand hover:underline">
              İlan alma hakkı paketlerini incele
            </Link>
          )}
          <button
            type="button"
            disabled={revealing || !isActive}
            onClick={onReveal}
            className="w-full rounded-lg bg-cta py-3 text-sm font-black text-white transition-colors hover:bg-cta-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {revealing ? "Açılıyor..." : isAuthenticated ? "İletişimi Gör" : "Giriş Yap & İletişimi Gör"}
          </button>
        </div>
      )}
    </aside>
  );
}
