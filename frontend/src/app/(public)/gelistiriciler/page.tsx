import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { BreadcrumbSchema } from "@/components/JsonLd";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com").replace(/\/$/, "");
const API = `${SITE}/api/v1/partner/listings`;

export const metadata: Metadata = {
  title: "Geliştiriciler için API — otomatik ilan oluşturma",
  description: "Kendi sisteminizden REST API ile güzergâh ilanı oluşturun, güncelleyin ve kapatın. API anahtarı, uç noktalar, alanlar, örnek kodlar ve hata kodları.",
  alternates: { canonical: `${SITE}/gelistiriciler` },
};

const curl = `curl -X POST ${API} \\
  -H "Authorization: Bearer pj_live_XXXXXXXXXXXX" \\
  -H "Content-Type: application/json" \\
  -d '{
    "external_ref": "SEFER-2026-1042",
    "from_city": "İstanbul",
    "to_city": "Ankara",
    "departure_date": "2026-10-20T08:00:00+03:00",
    "vehicle_type": "van",
    "total_capacity_kg": 800,
    "price_per_kg": 4.5,
    "currency": "TRY",
    "title": "İstanbul → Ankara, kamyonette boş yer",
    "contact_name": "Sefer Masası",
    "contact_phone": "+90 555 000 00 00"
  }'`;

const js = `// Node.js 18+ — anahtarı ortam değişkeninde tutun, tarayıcıya göndermeyin.
const res = await fetch("${API}", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.PAKET_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    external_ref: "SEFER-2026-1042",
    from_city: "İstanbul",
    to_city: "Ankara",
    departure_date: "2026-10-20T08:00:00+03:00",
    vehicle_type: "van",
    total_capacity_kg: 800,
    contact_phone: "+90 555 000 00 00",
  }),
});
const ilan = await res.json();
if (!res.ok) throw new Error(ilan.error?.message ?? res.status);
console.log(ilan.id, ilan.status); // "pending_approval"`;

const php = `<?php
$ch = curl_init("${API}");
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer " . getenv("PAKET_API_KEY"),
    "Content-Type: application/json",
  ],
  CURLOPT_POSTFIELDS => json_encode([
    "external_ref" => "SEFER-2026-1042",
    "from_city" => "İstanbul",
    "to_city" => "Ankara",
    "departure_date" => "2026-10-20T08:00:00+03:00",
    "vehicle_type" => "van",
    "total_capacity_kg" => 800,
    "contact_phone" => "+90 555 000 00 00",
  ]),
]);
$ilan = json_decode(curl_exec($ch), true);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE); // 201 yeni, 200 tekrar`;

const endpoints: [string, string, string][] = [
  ["GET", "/api/v1/partner/listings", "Kendi ilanlarınız. Filtre: status, external_ref, page, limit (en fazla 100)."],
  ["GET", "/api/v1/partner/listings/{id}", "Tek ilan."],
  ["POST", "/api/v1/partner/listings", "Yeni ilan. Yanıt 201; aynı external_ref tekrar gelirse 200 ve mevcut ilan."],
  ["PATCH", "/api/v1/partner/listings/{id}", "Gönderdiğiniz alanları günceller. İlan yeniden onaya düşer."],
  ["POST", "/api/v1/partner/listings/{id}/status", "{\"status\": \"paused\" | \"cancelled\" | \"pending_approval\"}"],
  ["DELETE", "/api/v1/partner/listings/{id}", "İlanı kaldırır (geçmiş kayıtlar korunur)."],
];

const fields: [string, string, string][] = [
  ["from_city, to_city", "zorunlu", "Kalkış ve varış ili/şehri (1–128 karakter)."],
  ["departure_date", "zorunlu", "ISO 8601, saat dilimi dahil, gelecekte olmalı. Örn. 2026-10-20T08:00:00+03:00"],
  ["contact_phone", "zorunlu", "İletişim erişimini satın alan kullanıcıya açılır. +90 555 000 00 00 biçiminde."],
  ["external_ref", "önerilir", "Kendi sefer/kayıt numaranız (harf, rakam, . _ : -; en fazla 100). Hesabınızda benzersizdir."],
  ["arrival_date", "isteğe bağlı", "ISO 8601; kalkıştan önce olamaz."],
  ["from_district, to_district", "isteğe bağlı", "İlçe (en fazla 128 karakter)."],
  ["vehicle_type", "isteğe bağlı", "car, van, truck, motorcycle, other (varsayılan car)."],
  ["total_capacity_kg", "isteğe bağlı", "0–50000."],
  ["price_per_kg, currency, is_negotiable", "isteğe bağlı", "Fiyat bilgisi; currency 3 harf (TRY), is_negotiable 0/1."],
  ["title, description", "isteğe bağlı", "Başlık (255), açıklama (4000 karakter)."],
  ["contact_name, contact_email, contact_address", "isteğe bağlı", "Ek iletişim bilgileri."],
];

const errors: [string, string][] = [
  ["400 validation_error", "Alan eksik veya hatalı. Yanıttaki details hangi alan olduğunu söyler."],
  ["401 api_key_missing / api_key_invalid", "Anahtar yok, hatalı ya da iptal edilmiş."],
  ["403 account_disabled", "Hesap kullanıma kapalı."],
  ["404 not_found", "İlan yok ya da size ait değil."],
  ["409", "İlan satılmış/kaldırılmış, ödeme işlemi sürüyor ya da durum geçişine izin yok."],
  ["429", "Hız sınırı ya da açık ilan sınırı aşıldı; Retry-After başlığına göre bekleyin."],
];

function Code({ children, label }: { children: string; label: string }) {
  return <figure className="mt-3"><figcaption className="mb-1 text-xs font-semibold text-muted">{label}</figcaption><pre className="overflow-x-auto rounded-lg bg-foreground p-4 text-[13px] leading-6 text-background"><code>{children}</code></pre></figure>;
}
const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => <h2 id={id} className="mt-12 scroll-mt-24 text-2xl font-semibold">{children}</h2>;

export default function GelistiricilerPage() {
  return (
    <section className="site-container py-10">
      <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "Geliştiriciler" }]} />
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-brand">Partner API · v1</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Kendi sisteminizden otomatik ilan oluşturun</h1>
        <p className="mt-4 text-lg leading-8 text-muted">Düzenli seferleri olan taşıyıcı ve lojistik firmaları, güzergâh ilanlarını panelden tek tek girmek yerine kendi yazılımlarından (ERP, sefer planlama, web sitesi) REST API ile açabilir, güncelleyebilir ve kapatabilir.</p>
        <nav aria-label="Sayfa içi" className="mt-6 flex flex-wrap gap-2 text-sm">
          {[["baslangic", "Başlangıç"], ["kimlik", "Kimlik doğrulama"], ["uclar", "Uç noktalar"], ["alanlar", "Alanlar"], ["ornekler", "Örnek kod"], ["kurallar", "Kurallar ve sınırlar"], ["hatalar", "Hata kodları"]].map(([id, t]) => <a key={id} href={`#${id}`} className="rounded-full border border-border px-3 py-1.5 hover:border-brand">{t}</a>)}
        </nav>

        <H2 id="baslangic">Başlangıç — 3 adım</H2>
        <ol className="mt-4 list-decimal space-y-2 pl-6 leading-7">
          <li><Link href={ROUTES.auth.register} className="text-brand underline">Hesap açın</Link> veya giriş yapın.</li>
          <li><Link href={ROUTES.panel.gelistirici} className="text-brand underline">Panel → Geliştirici</Link> sayfasından bir API anahtarı oluşturun. Anahtar yalnızca bir kez gösterilir; güvenli bir yerde saklayın.</li>
          <li>Aşağıdaki örneklerden biriyle ilk ilanınızı gönderin. İlan onaydan sonra sitede yayına girer.</li>
        </ol>

        <H2 id="kimlik">Kimlik doğrulama</H2>
        <p className="mt-4 leading-7">Her isteğe anahtarınızı ekleyin: <code className="rounded bg-bg-alt px-1.5 py-0.5">Authorization: Bearer pj_live_…</code> (veya <code className="rounded bg-bg-alt px-1.5 py-0.5">X-API-Key</code> başlığı). Anahtar yalnızca sizin hesabınızın ilanlarına erişir; hesabınızla aynı kurallara tabidir ve yönetici yetkisi taşımaz. Anahtarı yalnızca sunucu tarafında kullanın; tarayıcı koduna, mobil uygulamaya veya herkese açık bir depoya koymayın. Sızdığından şüphelenirseniz panelden hemen iptal edip yenisini oluşturun.</p>

        <H2 id="uclar">Uç noktalar</H2>
        <p className="mt-2 text-sm text-muted">Temel adres: <code>{SITE}</code> · İstek ve yanıtlar JSON (UTF-8).</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border"><table className="w-full text-left text-sm"><tbody>{endpoints.map(([m, p, d]) => <tr key={m + p} className="border-b border-border last:border-0"><td className="whitespace-nowrap px-3 py-2 font-mono font-semibold">{m}</td><td className="whitespace-nowrap px-3 py-2 font-mono">{p}</td><td className="px-3 py-2 text-muted">{d}</td></tr>)}</tbody></table></div>

        <H2 id="alanlar">İlan alanları</H2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border"><table className="w-full text-left text-sm"><tbody>{fields.map(([f, r, d]) => <tr key={f} className="border-b border-border last:border-0"><td className="px-3 py-2 font-mono">{f}</td><td className="whitespace-nowrap px-3 py-2">{r}</td><td className="px-3 py-2 text-muted">{d}</td></tr>)}</tbody></table></div>
        <p className="mt-3 text-sm leading-6 text-muted">Yanıtta ilan; id, external_ref, status, onaylandıktan sonra sitedeki adresi (url) ve gönderdiğiniz alanlarla döner.</p>

        <H2 id="ornekler">Örnek kod</H2>
        <Code label="curl">{curl}</Code>
        <Code label="JavaScript (Node.js)">{js}</Code>
        <Code label="PHP">{php}</Code>

        <H2 id="kurallar">Kurallar ve sınırlar</H2>
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
          <li><strong>Onay:</strong> API ile açılan ve güncellenen her ilan, sitedeki ilanlar gibi önce <code>pending_approval</code> durumuna girer; onaylanınca <code>active</code> olur. Yayına alma API ile yapılamaz.</li>
          <li><strong>Tekrar güvenliği:</strong> <code>external_ref</code> gönderirseniz, ağ hatasında aynı isteği tekrarlamak yeni ilan açmaz; mevcut ilan <code>200</code> ve <code>Idempotent-Replay: true</code> başlığıyla döner. Kaydı sonradan <code>?external_ref=</code> ile bulabilirsiniz.</li>
          <li><strong>Durumlar:</strong> pending_approval, active, paused, cancelled, sold, expired, removed. Kalkış tarihi geçen ilan <code>expired</code> görünür.</li>
          <li><strong>Hız sınırı:</strong> anahtar başına dakikada 30 yazma ve 120 okuma isteği.</li>
          <li><strong>Hesap sınırları:</strong> en fazla 5 etkin API anahtarı ve 200 açık (yayında, onayda veya duraklatılmış) ilan.</li>
          <li><strong>İçerik:</strong> ilanlar <Link href={ROUTES.static.kullanim} className="text-brand underline">Kullanım Koşulları</Link> ve <Link href={ROUTES.static.tasimaKurallari} className="text-brand underline">Taşıma Kuralları</Link>na tabidir. İletişim bilgileri yalnızca erişimi satın alan kullanıcıya gösterilir.</li>
        </ul>

        <H2 id="hatalar">Hata kodları</H2>
        <p className="mt-2 text-sm text-muted">Hata yanıtı: <code>{`{"error": {"message": "…"}}`}</code> (kimlik hatalarında ayrıca <code>code</code>).</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border"><table className="w-full text-left text-sm"><tbody>{errors.map(([c, d]) => <tr key={c} className="border-b border-border last:border-0"><td className="whitespace-nowrap px-3 py-2 font-mono">{c}</td><td className="px-3 py-2 text-muted">{d}</td></tr>)}</tbody></table></div>

        <div className="mt-12 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Entegrasyon için destek</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Toplu ilan aktarımı, farklı bir veri biçimi veya web kancası (webhook) ihtiyacınız varsa <Link href={ROUTES.static.iletisim} className="text-brand underline">bize yazın</Link>.</p>
        </div>
      </div>
    </section>
  );
}
