# PaketJet — SEO Eksik Madde Analizi ve Cozum Plani

**Tarih:** 2026-03-20
**Canli Site:** https://paketjet.com
**Kaynak:** Site analiz raporu (seoanaliz)

---

## 1. Meta Description Kisa / Statik

**Durum:** Pasif — Mevcut: "Turkiye'nin P2P kargo pazaryeri. Tasiyici ilanlarini kesfet, paketini hizli ve guvenilir sekilde gonder." (~95 karakter)
**Hedef:** 120-155 karakter arasi, anahtar kelime iceren aciklama
**Cozum:**
- `layout.tsx` icindeki statik metadata → `site_settings` tablosundan (DB) cekilmeli
- Admin panel `/admin/seo` icinde "Genel SEO" tabindan duzenlenebilmeli
- Onerilen: "PaketJet | Turkiye'nin P2P kargo pazaryeri. Guvenilir tasiyicilarla paketini hizli ve uygun fiyata gonder. 81 ilde binlerce aktif tasiyici seni bekliyor."

**Dosya:** `frontend/src/app/layout.tsx:12-31`
**Oncelik:** YUKSEK

---

## 2. Meta Author ve Publisher Etiketi Eksik

**Durum:** Pasif — Kullanilmiyor
**Cozum:** Root layout metadata'ya `authors` ve `publisher` eklenmeli

```ts
// layout.tsx metadata objesine ekle:
authors: [{ name: 'PaketJet' }],
publisher: 'PaketJet',
```

**Dosya:** `frontend/src/app/layout.tsx:12-31`
**Oncelik:** DUSUK (SEO etkisi minimal ama tamamlanmali)

---

## 3. Footer Linkleri — href="#" Placeholder'lar

**Durum:** Footer'daki "Gizlilik", "Kullanim Sartlari", "Destek" linkleri `href="#"` — hicbir yere gitmiyor
**Sorun:** Bos linkler crawl butcesi israf eder, kullanici deneyimini bozar
**Cozum (iki adim):**
1. Gercek sayfalara yonlendir VEYA gecici olarak `/iletisim` gibi mevcut sayfalara bagla
2. Ileride `/gizlilik-politikasi`, `/kullanim-sartlari` sayfalari olustur

**Dosya:** `frontend/src/app/page.tsx:173-175`
**Oncelik:** YUKSEK (bos linkler SEO'ya zarar verir)

---

## 4. Nav Link'lerinde title Attribute Eksik

**Durum:** Header ve footer linklerinde `title` attribute yok
**Cozum:** Link component'lerine `title` prop ekle
- Nav: `title="PaketJet Kargo Ilanlari"`, `title="PaketJet Fiyat Planlari"` gibi
- Footer: `title="PaketJet Gizlilik Politikasi"` gibi
- Logo: `title` zaten `aria-label` ile kapsanmis — OK

**Dosyalar:**
- `frontend/src/components/Header.tsx` (nav linkleri: 71-74)
- `frontend/src/app/page.tsx` (footer: 173-175, CTA: 152-164)

**Oncelik:** ORTA

---

## 5. Gzip Yapilandirmasi Eksik — gzip_vary ve SVG

**Durum:** Nginx'te gzip aktif ama `gzip_vary`, `gzip_comp_level` ve `image/svg+xml` eksik
**Mevcut:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
gzip_min_length 1000;
```
**Cozum:** Gzip ayarlarini genislet:

```nginx
gzip on;
gzip_comp_level 6;
gzip_min_length 256;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
gzip_vary on;
```

**Dosya:** `nginx/nginx.conf:11-14`
**Oncelik:** ORTA (temel gzip zaten var, iyilestirme)

---

## 6. Robots.txt — Ek Kurallar Gerekli

**Durum:** Mevcut kurallar yeterli degil
**Mevcut:**
```
User-Agent: *
Allow: /
Disallow: /panel/
Disallow: /admin/
Disallow: /api/
Disallow: /sifre-sifirla
```
**Cozum:** Ek disallow kurallari ekle:

```
Disallow: /giris
Disallow: /uye-ol
Disallow: /sifremi-unuttum
Disallow: /_next/
Disallow: /*?_rsc=
```

**Dosya:** `frontend/src/app/robots.ts`
**Oncelik:** ORTA

---

## 7. Sitemap — lastmod Statik

**Durum:** Tum URL'ler icin `lastModified: new Date()` kullaniliyor — her build'de degisiyor
**Sorun:** Gercek degisiklik tarihini yansitmiyor, arama motorlari icin anlamli degil
**Cozum:**
- Statik sayfalar icin sabit tarih (veya DB'den son guncelleme)
- Ilan sayfalarinda ilan `updated_at` alanini kullan (backend'den dondur)

**Dosya:** `frontend/src/app/sitemap.ts`
**Oncelik:** ORTA

---

## 8. Open Graph Eksikleri

**Durum:** `layout.tsx`'deki OG ayarlari minimal — `og:image`, `og:url` eksik
**Mevcut:**
```ts
openGraph: {
  siteName: "PaketJet",
  type: "website",
  locale: "tr_TR",
},
```
**Cozum:** Default OG image ve URL ekle:

```ts
openGraph: {
  siteName: "PaketJet",
  type: "website",
  locale: "tr_TR",
  url: "https://paketjet.com",
  images: [{ url: "/assets/og-default.png", width: 1200, height: 630, alt: "PaketJet — P2P Kargo Pazaryeri" }],
},
twitter: {
  card: "summary_large_image",
  site: "@paketjet",
},
```

**Dosya:** `frontend/src/app/layout.tsx:26-30`
**Oncelik:** YUKSEK (sosyal medya paylasimlarinda gorsel cikmaz)

---

## 9. Genel SEO Ayarlari DB'den Gelmiyor

**Durum:** `layout.tsx` icindeki tum metadata (title, description, OG, keywords) statik/hardcoded
**Backend:** `site_settings` modulu zaten `site_seo` key'i ile global SEO destegi sunuyor (`seo.validation.ts`'de `site_name`, `title_default`, `title_template`, `description`, `open_graph`, `twitter`, `robots` alanlari)
**Cozum (3 adim):**
1. Admin `/admin/seo` sayfasina "Genel SEO" tabi ekle → `site_seo` + `site_meta_default` key'leri
2. `layout.tsx` → `GET /api/site_settings/seo` ile DB'den oku, fallback olarak mevcut statik degerleri kullan
3. Ilan detay `generateMetadata` → admin template degerleri ile zenginlestir

**Dosyalar:**
- `frontend/src/app/admin/seo/page.tsx` (admin panel)
- `frontend/src/app/layout.tsx` (global metadata)
- `frontend/src/app/ilanlar/[id]/page.tsx` (ilan metadata)

**Oncelik:** YUKSEK (tum SEO yonetiminin merkezi)

---

## 10. Font Boyutu / Okunabilirlik

**Durum:** `globals.css`'de explicit base `font-size` tanimlanmamis — browser default'a (16px) guveniliyor
**Cozum:** Sorun olma ihtimali dusuk (Tailwind 16px default kullanir), ama mobilde kontrol edilmeli
**Kontrol:** DM Sans fontu kullaniliyor, text-sm (14px) siniflarinin yogun kullanimi var — ozellikle mobilde kucuk kalabilir

**Dosya:** `frontend/src/app/globals.css`
**Oncelik:** DUSUK

---

## Uygulama Oncelik Sirasi

| # | Madde | Oncelik | Etki |
|---|-------|---------|------|
| 1 | Genel SEO ayarlarini DB'ye tasi (#9) | YUKSEK | Tum site metadata yonetimi |
| 2 | Open Graph eksikleri (#8) | YUKSEK | Sosyal medya paylasim gorseli |
| 3 | Meta description uzat/DB'den cek (#1) | YUKSEK | SERP goruntuleme |
| 4 | Footer placeholder linkleri duzelt (#3) | YUKSEK | Bos link SEO zarari |
| 5 | Robots.txt genislet (#6) | ORTA | Crawl butcesi |
| 6 | Gzip yapilandirmasini iyilestir (#5) | ORTA | Performans + Core Web Vitals |
| 7 | Title attribute eksik linkler (#4) | ORTA | Erisilebilirlik + SEO |
| 8 | Sitemap lastmod iyilestir (#7) | ORTA | Indeksleme dogrulugu |
| 9 | Author/Publisher meta (#2) | DUSUK | Minimal SEO etkisi |
| 10 | Font boyutu kontrol (#10) | DUSUK | Minimal |
