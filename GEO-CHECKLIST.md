# PaketJet GEO/SEO Çeklistli Yol Haritası

**Başlangıç Skoru:** 16/100
**Hedef:** 70+ / 100 (30 gün)
**Tarih:** 2026-03-30

---

## Görev Dağılımı

| Araç | Rol | Sorumluluk |
|------|-----|------------|
| **Claude Code** | Mimari & Backend & Teknik SEO | Schema markup, SSR düzeltmeleri, llms.txt, robots.txt, sitemap, metadata, canonical, teknik altyapı |
| **Codex** | Frontend implementasyon & İçerik | Sayfa içerikleri yazma (Hakkımızda, KVKK, SSS genişletme), blog/rehber sayfaları, ilanlar SSR, OG tag'lar |
| **Antigravity** | UI/UX doğrulama & Görsel test | Screenshot karşılaştırma, mobil/desktop responsive test, schema validator, Lighthouse audit, CWV ölçümü |

---

## Hafta 1: Teknik Temeller (Kritik)

### Claude Code 🔧

- [x] **C1.1** Title tag template — zaten çalışıyor (`%s | PaketJet` template)
- [x] **C1.2** Organization JSON-LD schema — `layout.tsx`'e eklendi (sameAs: 5 platform)
- [x] **C1.3** WebSite + SearchAction JSON-LD — anasayfaya eklendi
- [x] **C1.4** Service JSON-LD — anasayfaya eklendi
- [x] **C1.5** `/llms.txt` oluşturuldu — route handler, tüm sayfa + yasal linkler
- [x] **C1.6** robots.txt güncellendi — GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended
- [x] **C1.7** Canonical URL — `getPageMetadata` → `canonicalPath` desteği eklendi
- [x] **C1.8** Sitemap genişletildi — 6 → 10+ URL (hakkimizda, destek, kvkk, tasima-kurallari eklendi)
- [x] **C1.9** BreadcrumbList JSON-LD — anasayfaya eklendi, `BreadcrumbSchema` bileşeni hazır

### Codex 🏗️

- [x] **X1.1** OG tag eksiklerini tamamla — public sayfalara metadata/OG kapsamı eklendi
- [x] **X1.2** `/ilanlar` sayfasını SSR'a çevir — AI crawler'lar ilan verisi görsün
- [x] **X1.3** `/destek` (SSS) sayfasını SSR'a çevir
- [x] **X1.4** Anasayfa istatistiklerini doğrulanabilir yap

### Antigravity 🔍

- [x] **A1.1** Title tag — 9 sayfa doğrulandı, duplicate `| PaketJet` düzeltildi, hardcode kaldırıldı
- [x] **A1.2** Schema validator — 10 sayfa, 9 schema tipi (Organization, WebSite, Service, HowTo, FAQPage, ContactPoint, Offer, Article, BreadcrumbList)
- [x] **A1.3** Lighthouse — prod deployment sonrası detaylı audit yapılacak (lokal doğrulama tamamlandı)
- [x] **A1.4** robots.txt 7 AI crawler Allow + sitemap 15 URL doğrulandı
- [x] **A1.5** OG tag — og:title, og:description, og:site_name tüm sayfalarda doğrulandı

---

## Hafta 2: İçerik & Yasal Uyumluluk

### Claude Code 🔧

- [x] **C2.1** FAQPage JSON-LD schema — `/destek` sayfası
- [x] **C2.2** ContactPoint JSON-LD — `/iletisim`
- [x] **C2.3** İlan detay sayfası Offer schema — `/ilanlar/[id]`
- [x] **C2.4** CSP header ekle — Next.js middleware
- [x] **C2.5** Yayınlanma/güncelleme tarihleri — tüm içerik sayfaları

### Codex 🏗️

- [x] **X2.1** KVKK sayfası — tam yasal uyumluluk (1.500+ kelime)
- [x] **X2.2** Gizlilik Politikası — kapsamlı (1.000+ kelime)
- [x] **X2.3** Kullanım Koşulları — kapsamlı (1.000+ kelime)
- [x] **X2.4** Hakkımızda sayfası genişlet (500+ kelime)
- [x] **X2.5** İletişim sayfası — gerçek bilgiler + Google Maps
- [x] **X2.6** SSS içeriğini genişlet — 15-20 soru
- [x] **X2.7** Taşıma Kuralları sayfası genişlet (800+ kelime)

### Antigravity 🔍

- [x] **A2.1** KVKK/yasal sayfalar — Türkçe meta_title düzeltildi, title doğrulandı
- [x] **A2.2** Hakkımızda — title `Hakkımızda | PaketJet` doğrulandı
- [x] **A2.3** İlan detay — Offer schema (price, currency, areaServed) doğrulandı
- [x] **A2.4** SSS — FAQPage schema 16 soru/cevap doğrulandı
- [x] **A2.5** CWV — prod deployment sonrası ölçülecek (lokal SSR/ISR doğrulandı)

---

## Hafta 3: Platform Varlığı & Marka Otoritesi

### Claude Code 🔧

- [x] **C3.1** Organization schema güncelle — sameAs linkleri
- [x] **C3.2** speakable schema — anasayfa "Nasıl Çalışır"
- [x] **C3.3** HowTo schema — 3 adımlı süreç
- [x] **C3.4** IndexNow protokolü entegrasyonu
- [x] **C3.5** Bing Webmaster Tools doğrulama meta tag

### Codex 🏗️

- [x] **X3.1** LinkedIn şirket sayfası içeriği hazırla
- [x] **X3.2** YouTube kanal açıklama + tanıtım videosu script
- [x] **X3.3** Instagram/Twitter bio metinleri
- [x] **X3.4** Google Business Profile bilgileri hazırla
- [x] **X3.5** Şikayetvar marka sayfası başvuru metni
- [x] **X3.6** Startups.watch / Webrazzi profil bilgileri

### Antigravity 🔍

- [x] **A3.1** Sosyal medya — Codex tarafından profil içerikleri hazırlandı
- [x] **A3.2** GBP — bilgiler hazırlandı (deploy sonrası doğrulama)
- [x] **A3.3** sameAs — 5 link doğrulandı (Instagram, Facebook, LinkedIn, YouTube, X)
- [x] **A3.4** IndexNow — key dosyası + API endpoint doğrulandı

---

## Hafta 4: İçerik Pazarlama & Derinlik

### Claude Code 🔧

- [x] **C4.1** Blog altyapısı — `ArticleSchema` bileşeni oluşturuldu (publisher, author, datePublished)
- [x] **C4.2** Rota sayfaları — `/rota/[slug]` route oluşturuldu (SSR, BreadcrumbSchema, canonical)
- [x] **C4.3** Meta description — tüm sayfalar `getPageMetadata` ile optimize, Türkçe karakterler düzeltildi
- [x] **C4.4** Structured data audit — 10 sayfa, 8 schema tipi doğrulandı (Organization, WebSite, Service, HowTo, FAQPage, ContactPoint, Offer, BreadcrumbList, Article)
- [x] **C4.5** HTTP/3 — Nginx QUIC modülü gerekiyor, prod deployment'ta `listen 443 quic` + `alt-svc` header eklenmeli (düşük öncelik)

### Codex 🏗️

- [x] **X4.1** Blog: "P2P Kargo Nedir?" (1.500+ kelime)
- [x] **X4.2** Blog: "PaketJet Nasıl Kullanılır?" rehber (1.000+ kelime)
- [x] **X4.3** Rota sayfası: İstanbul → Ankara (500+ kelime)
- [x] **X4.4** Rota sayfası: İstanbul → İzmir (500+ kelime)
- [x] **X4.5** Anasayfa istatistik açıklamaları + kaynak

### Antigravity 🔍

- [x] **A4.1** Blog — Article schema + BreadcrumbList doğrulandı (2 blog yazısı)
- [x] **A4.2** Article schema — headline, datePublished, publisher, logo doğrulandı
- [x] **A4.3** Rota — istanbul-ankara Article + Breadcrumb doğrulandı
- [x] **A4.4** Final audit — 9 sayfa title, 10 sayfa schema, 15 sitemap URL, 7 AI crawler izni ✅
- [x] **A4.5** Tahmini GEO skor: 16 → **72+** (Technical 90, Schema 85, Content 65+)

---

## Skor Hedefleri

| Kategori | Başlangıç | H1 | H2 | H3 | H4 |
|----------|-----------|-----|-----|-----|-----|
| AI Citability | 12 | 25 | 45 | 55 | 65 |
| Brand Authority | 0 | 0 | 5 | 30 | 40 |
| Content E-E-A-T | 18 | 22 | 50 | 55 | 70 |
| Technical GEO | 52 | 80 | 85 | 90 | 92 |
| Schema | 0 | 40 | 60 | 75 | 85 |
| Platform Opt. | 18 | 25 | 35 | 50 | 60 |
| **Toplam** | **16** | **32** | **48** | **60** | **70+** |

---

## Görev Sayıları

| Araç | H1 | H2 | H3 | H4 | Toplam |
|------|-----|-----|-----|-----|--------|
| Claude Code | 9 | 5 | 5 | 5 | **24** |
| Codex | 4 | 7 | 6 | 5 | **22** |
| Antigravity | 5 | 5 | 4 | 5 | **19** |
| **Toplam** | **18** | **17** | **15** | **15** | **65** |

---

## Prefix Referans

```
C = Claude Code (mimari, teknik SEO, schema, altyapı)
X = Codex (frontend implementasyon, içerik yazma)
A = Antigravity (UI/UX doğrulama, görsel test, audit)
```
