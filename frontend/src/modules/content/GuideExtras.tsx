// Rehber sayfaları için ortak bloklar: yazar satırı, bölüm gövdesi (paragraf/liste/tablo),
// temel bilgiler, canlı fiyat tablosu (sistemdeki gerçek fiyatlar), SSS, kaynaklar ve güvence bağlantıları.
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { getBrand } from "@/lib/brand";
import { getPublicJson } from "@/lib/public-fetch";
import type { ArticleContent, ContentSection } from "./content.type";
import { readingMinutes } from "./content.data";

const fmt = (iso: string) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
const money = (n: number) => n.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

export async function GuideByline({ item }: { item: ArticleContent }) {
  const brand = await getBrand();
  return (
    <p className="blog-detail-meta">
      Yazan: <Link href={ROUTES.static.hakkinda}>{brand.name ? `${brand.name} Editör Ekibi` : "Editör Ekibi"}</Link> · Yayın: <time dateTime={item.publishedAt}>{fmt(item.publishedAt)}</time> · Son güncelleme: <time dateTime={item.updatedAt}>{fmt(item.updatedAt)}</time> · {readingMinutes(item)} dk okuma
    </p>
  );
}

export function GuideSection({ section, id }: { section: ContentSection; id: string }) {
  return (
    <section id={id}>
      {section.title ? <h2>{section.title}</h2> : null}
      {section.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      {section.list && <ul>{section.list.map((li, i) => <li key={i}>{li}</li>)}</ul>}
      {section.table && (
        <table>
          <thead><tr>{section.table[0]!.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
          <tbody>{section.table.slice(1).map((row, r) => <tr key={r}>{row.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>)}</tbody>
        </table>
      )}
    </section>
  );
}

export function GuideKeyFacts({ facts }: { facts?: string[] }) {
  if (!facts?.length) return null;
  return (
    <aside aria-label="Kısaca" className="guide-keyfacts">
      <p className="guide-keyfacts-title">Kısaca</p>
      <ul>{facts.map((f, i) => <li key={i}>{f}</li>)}</ul>
    </aside>
  );
}

/** Sistemdeki güncel iletişim erişim fiyatları (yönetici ayarından). */
export async function GuidePriceTable() {
  const [packs, single] = await Promise.all([
    getPublicJson<{ data?: { key: string; credits: number; price: number }[] }>("/api/ilan-alma-hakki/paketler"),
    getPublicJson<{ value?: number }>("/api/site_settings/pricing.listing_credit_price?locale=tr"),
  ]);
  const rows = (packs?.data ?? []).filter((p) => p.credits > 0 && p.price > 0);
  if (!rows.length && !single?.value) return null;
  return (
    <section id="ucretler">
      <h2>Güncel iletişim erişim ücretleri</h2>
      <p>Aşağıdaki fiyatlar sistemdeki güncel ayardan okunur. Ücret yalnız ilanın iletişim bilgilerine erişim içindir; taşıma bedelini kapsamaz.</p>
      <table>
        <thead><tr><th scope="col">Seçenek</th><th scope="col">Erişim hakkı</th><th scope="col">Fiyat</th><th scope="col">Hak başına</th></tr></thead>
        <tbody>
          {single?.value ? <tr><th scope="row">Tek ilan (kartla)</th><td>1</td><td>{money(Number(single.value))}</td><td>{money(Number(single.value))}</td></tr> : null}
          {rows.map((p) => <tr key={p.key}><th scope="row">{p.credits} hak paketi</th><td>{p.credits}</td><td>{money(p.price)}</td><td>{money(Math.round(p.price / p.credits))}</td></tr>)}
        </tbody>
      </table>
    </section>
  );
}

export function GuideFaqs({ item }: { item: ArticleContent }) {
  if (!item.faqs?.length) return null;
  return (
    <section id="sss">
      <h2>Sıkça sorulan sorular</h2>
      {item.faqs.map((f, i) => (
        <div key={i}>
          <h3>{f.question}</h3>
          <p>{f.answer}</p>
        </div>
      ))}
    </section>
  );
}

export function GuideSources({ item }: { item: ArticleContent }) {
  if (!item.sources?.length) return null;
  return (
    <section id="kaynaklar">
      <h2>Kaynaklar ve ilgili mevzuat</h2>
      <ul>
        {item.sources.map((s) => (
          <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>{s.note ? ` — ${s.note}` : ""}</li>
        ))}
      </ul>
      <p>Bu rehber genel bilgilendirme amaçlıdır; hukuki danışmanlık yerine geçmez.</p>
    </section>
  );
}

export function GuideTrust() {
  return (
    <aside aria-label="Güvence" className="guide-trust">
      <ShieldCheck size={22} aria-hidden="true" />
      <div>
        <p className="guide-trust-title">Güvenli ve şeffaf erişim</p>
        <p>
          Kartla ödemeler güvenli ödeme sayfasında 3D Secure ile alınır; kart bilgilerin sitemize iletilmez. İletişim bilgileri yalnızca erişim alan kullanıcıya açılır.
          {" "}<Link href={ROUTES.static.kullanim}>Kullanım koşulları</Link> · <Link href={ROUTES.static.kvkk}>KVKK</Link> · <Link href={ROUTES.static.tasimaKurallari}>Taşıma kuralları</Link>
        </p>
      </div>
    </aside>
  );
}
