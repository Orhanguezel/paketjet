// Footer'daki guvenli odeme alani. Yalniz kartla odeme gercekten acikken gosterilir (veri API'den gelir).
const CARD_BADGE = "inline-flex h-7 items-center justify-center rounded bg-media-canvas px-2";

function Visa() {
  return <span className={CARD_BADGE} title="Visa"><svg viewBox="0 0 48 16" width="38" height="13" role="img" aria-label="Visa"><text x="0" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontStyle="italic" fontWeight="900" fill="#1A1F71">VISA</text></svg></span>;
}
function Mastercard() {
  return <span className={CARD_BADGE} title="Mastercard"><svg viewBox="0 0 32 20" width="30" height="19" role="img" aria-label="Mastercard"><circle cx="12" cy="10" r="8" fill="#EB001B"/><circle cx="20" cy="10" r="8" fill="#F79E1B"/><path d="M16 3.6a8 8 0 0 1 0 12.8 8 8 0 0 1 0-12.8z" fill="#FF5F00"/></svg></span>;
}
function Troy() {
  return <span className={CARD_BADGE} title="Troy"><svg viewBox="0 0 40 16" width="34" height="14" role="img" aria-label="Troy"><text x="0" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" fill="#00A3AD">troy</text></svg></span>;
}

export default function SecurePayment({ provider }: { provider: string }) {
  const name = provider === "shopier" ? "Shopier" : provider;
  return (
    <section aria-label="Güvenli ödeme" className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-on-dark/10 p-5">
      <div className="flex max-w-xl items-start gap-3">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="mt-0.5 shrink-0"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>
        <div>
          <p className="text-sm font-semibold">Güvenli ödeme</p>
          <p className="footer-muted mt-1 text-xs leading-5">Kartla ödemeler {name} güvenli ödeme sayfasında, 3D Secure doğrulamasıyla alınır. Kart bilgilerin sitemize iletilmez ve saklanmaz. Bağlantı 256-bit SSL ile şifrelidir.</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Visa /><Mastercard /><Troy />
        <span className="inline-flex h-7 items-center rounded border border-on-dark/20 px-2 text-xs font-semibold">3D Secure</span>
        <span className="inline-flex h-7 items-center gap-1 rounded border border-on-dark/20 px-2 text-xs font-semibold"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>SSL</span>
        <span className="inline-flex h-7 items-center rounded border border-on-dark/20 px-2 text-xs font-semibold">{name}</span>
      </div>
    </section>
  );
}
