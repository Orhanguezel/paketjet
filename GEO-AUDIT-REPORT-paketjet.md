# GEO Audit Report: PaketJet

**Audit Date:** 2026-03-30
**URL:** https://paketjet.com
**Business Type:** P2P Cargo Marketplace (Platform/SaaS Hybrid)
**Pages Analyzed:** 7
**Framework:** Next.js (App Router, React Server Components, ISR)

---

## Executive Summary

**Overall GEO Score: 16/100 (Critical)**

PaketJet, Turkiye'nin P2P kargo pazaryeri olarak konumlanmis ancak AI arama motorlari icin neredeyse tamamen gorunmez durumda. Site teknik altyapi olarak Next.js SSR kullanmasi sayesinde orta seviye bir temel sunuyor, ancak **sifir schema markup**, **sifir dis platform varligi**, **son derece yetersiz icerik** (~900 kelime toplam), ve **bozuk title tag'leri** nedeniyle hicbir AI sistemi bu siteyi kaynak olarak gosteremez veya oneremez. En kritik sorunlar: listeleme sayfasinin (`/ilanlar`) iceriginin tamamen client-side yuklenmesi nedeniyle AI crawler'larin goremedigi bos sayfa, yasal uyumluluk sayfalarinin placeholder olmasi ve markanin hicbir harici platformda var olmamasi.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 12/100 | 25% | 3.0 |
| Brand Authority | 0/100 | 20% | 0.0 |
| Content E-E-A-T | 18/100 | 20% | 3.6 |
| Technical GEO | 52/100 | 15% | 7.8 |
| Schema & Structured Data | 0/100 | 10% | 0.0 |
| Platform Optimization | 18/100 | 10% | 1.8 |
| **Overall GEO Score** | | | **16/100** |

---

## Critical Issues (Fix Immediately)

### 1. Bozuk Title Tag -- Tum Sayfalarda
- **Sorun:** `<title>` tag'i `{{title}} | PaketJet` seklinde template degiskeni olarak render ediliyor. Gercek baslik olusturulmuyor.
- **Etki:** Google, Bing ve tum AI crawler'lar bu literal string'i sayfa basligi olarak indeksliyor. SEO'nun en temel unsuru bozuk.
- **Cozum:** Next.js App Router'da `metadata` export veya `generateMetadata` fonksiyonunu kontrol edin. Her sayfada benzersiz, aciklayici title uretilmeli.

### 2. /ilanlar Sayfasi AI Crawler'lara Gorunmuyor
- **Sorun:** En degerli sayfa olan listeleme sayfasi, HTML'de sifir gercek ilan verisi iceriyor. Sadece skeleton placeholder'lar ve "Sayfa hazirlaniyor..." yukleme metni mevcut.
- **Etki:** GPTBot, ClaudeBot, PerplexityBot ve diger AI crawler'lar bu sayfada hicbir icerik goremiyor. Googlebot JS calistirsa bile dusuk oncelikle indeksliyor.
- **Cozum:** Server-side data fetching ile ilk sayfa verilerini SSR ile render edin. `fetch()` in Server Components veya `getServerSideProps` kullanin.

### 3. Yasal Sayfalar Placeholder -- KVKK Uyumsuzlugu
- **Sorun:** Gizlilik Politikasi (~35 kelime), KVKK (~25 kelime), Kullanim Kosullari (~25 kelime) sayfalarinin tamami placeholder/stub icerik.
- **Etki:** Turk KVKK (6698 Sayili Kanun) kapsaminda veri sorumlusu kapsamli aciklama yapmak zorunda. Mevcut durum yasal ceza riski tasiyor ve guven sinyallerini tamamen ortadan kaldiriyor.
- **Cozum:** Her yasal sayfa icin kapsamli, gercek icerik uretilmeli. KVKK sayfasi en az: veri kategorileri, isleme amaclari, saklama sureleri, ucuncu taraf paylasimi, kullanici haklari ve DPO iletisim bilgilerini icermeli.

### 4. Sifir Schema.org Markup
- **Sorun:** Sitede hicbir sayfada JSON-LD, Microdata veya RDFa formunda schema markup yok.
- **Etki:** AI modelleri PaketJet'i bir entity olarak tanimlamiyor. Google rich result'lara uygun degil. Hicbir yapisal veri mevcut degil.
- **Cozum:** Asagidaki siralamayla eklenmeli: Organization (site geneli) > WebSite+SearchAction (anasayfa) > Service (anasayfa) > FAQPage (/destek) > BreadcrumbList (tum sayfalar) > Offer (/ilanlar/[id]).

### 5. Sifir Dis Platform Varligi
- **Sorun:** PaketJet markasi Wikipedia, LinkedIn, YouTube, Reddit, Eksi Sozluk, Sikayetvar, Trustpilot, Google Business veya herhangi bir harici platformda bulunmuyor.
- **Etki:** AI modelleri entity tanimasi icin harici kaynaklara guvenirler. Sifir dis varligi = AI icin "var olmayan" marka.
- **Cozum:** LinkedIn sirket sayfasi, YouTube kanali, Eksi Sozluk girisi, Sikayetvar profili olusturulmali. Turk startup dizinlerine (Startups.watch, Webrazzi) kayit yapilmali.

---

## High Priority Issues

### 6. llms.txt Dosyasi Yok
- **Sorun:** `/llms.txt` 404 donuyor.
- **Cozum:** Asagidaki sablonla olusturun:
```markdown
# PaketJet

> Turkiye'nin P2P kargo pazaryeri. Bireysel tasiyicilar ve kargo gondericileri arasinda guvenli platform.

## Ana Sayfalar
- [Ana Sayfa](https://paketjet.com): P2P kargo pazaryeri
- [Ilanlar](https://paketjet.com/ilanlar): Aktif tasiyici ilanlari
- [Ilan Ver](https://paketjet.com/ilan-ver): Yeni ilan olusturma
- [Destek](https://paketjet.com/destek): SSS ve destek merkezi

## Yasal
- [Gizlilik](https://paketjet.com/gizlilik-politikasi): Gizlilik politikasi
- [KVKK](https://paketjet.com/kvkk): Kisisel verilerin korunmasi
- [Kullanim Kosullari](https://paketjet.com/kullanim-kosullari): Platform kullanim sartlari
```

### 7. FAQ Icerigi SSR ile Render Edilmiyor
- **Sorun:** `/destek` sayfasindaki SSS icerigi tamamen client-side yukleniyor. AI crawler'lar soru-cevap icerigini goremiyor.
- **Etki:** FAQ icerigi AI sistemleri icin en yuksek alintilanabilirlik degerine sahip icerik tipi.
- **Cozum:** FAQ verilerini server-side render edin ve `FAQPage` JSON-LD schema ekleyin.

### 8. Canonical URL'ler Eksik
- **Sorun:** Hicbir sayfada `<link rel="canonical">` yok.
- **Etki:** Tekrar icerik riski, URL sinyallerinde belirsizlik.
- **Cozum:** Her sayfaya self-referencing canonical URL ekleyin.

### 9. Hakkimizda Sayfasi Yetersiz (~35 kelime)
- **Sorun:** Kurulus hikayesi, ekip bilgileri, sirket tescil numarasi, yetkinlikler, sosyal kanit yok.
- **Cozum:** Minimum 500 kelimelik kapsamli bir Hakkimizda sayfasi olusturun: kurucu hikayesi, ekip uyeleri, misyon, vizyon, istatistikler.

### 10. Iletisim Bilgileri Eksik ve Placeholder
- **Sorun:** Telefon numarasi placeholder (+90 500 000 00 00). Fiziksel adres yok. Sosyal medya linkleri yok.
- **Etki:** Bir lojistik pazaryeri icin dogrulanabilir adres olmamasi guven acigi.
- **Cozum:** Gercek telefon numarasi, is adresi, sosyal medya profilleri eklenmeli.

---

## Medium Priority Issues

### 11. Sitemap Cok Zayif (Sadece 6 URL)
- **Sorun:** Sitemap'te sadece 6 URL var. `/hakkimizda`, `/destek`, `/kvkk`, `/tasima-kurallari` eksik. Bireysel ilan sayfalari dahil degil.
- **Cozum:** Tum genel sayfalari ekleyin. Dinamik ilan sayfalarini otomatik dahil edin. Hedef: 20+ URL.

### 12. Icerik Son Derece Yetersiz (~900 Toplam Kelime)
- **Sorun:** 7 sayfada toplam ~900 kelime icerik. Blog, rehber, kaynak sayfasi yok.
- **Cozum:** Minimum 5.000+ kelimelik faydali icerik ekleyin: SSS (2.000 kelime), P2P Kargo Nasil Calisir rehberi (1.500 kelime), gonderim kilavuzu (1.000 kelime).

### 13. OG Tag'lar Eksik
- **Sorun:** Anasayfada `og:image` ve `og:url` eksik. `og:type` yok.
- **Cozum:** Tum OG tag'lari tamamlanmali.

### 14. Content-Security-Policy Header Eksik
- **Sorun:** CSP header tanimli degil (diger guvenlik header'lari mevcut).
- **Cozum:** Temel bir CSP politikasi olusturun.

### 15. AI Crawler Kuralları Eksik
- **Sorun:** robots.txt'te AI crawler'lar icin ozel kural yok.
- **Cozum:** GPTBot, ClaudeBot, PerplexityBot icin acik `Allow: /` kurallari ekleyin.

---

## Low Priority Issues

### 16. IndexNow Protokolu Yok
- Bing icin hizli indeksleme icin IndexNow API entegrasyonu yapilabilir.

### 17. speakable Schema Yok
- Anasayfadaki "Nasil Calisir" bolumu icin `speakable` property eklenebilir.

### 18. HTTP/3 Destegi Yok
- HTTP/2 mevcut, HTTP/3 (QUIC) marjinal performans iyilestirmesi saglayabilir.

### 19. Meta Keywords Tag Mevcut (Dusuk Deger)
- `paketjet,kargo gonder,tasiyici ilan,p2p kargo,kargo rezervasyon` -- zararli degil ama SEO degeri yok.

### 20. Hero Image 3840px
- Next.js Image optimize ediyor ancak kaynak dosya boyutu yavas baglantilarda sorun olabilir.

---

## Category Deep Dives

### AI Citability (12/100)

PaketJet'in icerigi AI sistemleri tarafindan alintılanabilir durumda degil. Temel sorunlar:

| Blok | Citability Skoru | Sorun |
|---|---|---|
| Hero/H1 | 10/100 | Jenerik pazarlama slogani, veri yok |
| Meta Description | 15/100 | Hizmet tanimi var ama spesifik detay yok |
| Nasil Calisir | 20/100 | Surec aciklamasi var ama olculebilir iddia yok |
| Genel Icerik | 14/100 | Ozellik aciklamalari veri noktasi icermiyor |

**Temel Sorunlar:**
- **Sifir istatistik yogunlugu:** Sayfa genelinde sayi, tarih, yuzde, kullanici sayisi yok
- **FAQ icerigi statik HTML'de yok:** AI crawler'lar goremiyor
- **Benzersiz veri yok:** Sayfadaki hicbir sey baska bir kargo sitesi hakkinda soylenemeyen bir sey degil
- **Sadece 350-400 kelime:** 1.500+ kelime esiginin cok altinda

**Iyilestirme Ornekleri:**
- "Paketini hizli gonder" → "PaketJet ile 81 ilde 1.200+ tasiyicidan kargo gonder -- ortalama 24 saatte teslim, geleneksel kargoya gore %40 daha uygun"
- "Turkiye'nin P2P kargo pazaryeri" → "2024'ten bu yana 48.000+ gonderim tamamlayan PaketJet, Turkiye'nin ilk P2P kargo pazaryeri olarak tasiyici ve gonderici arasinda dogrudan baglanti kurar"

---

### Brand Authority (0/100)

| Platform | Durum | Detay |
|---|---|---|
| Wikipedia (TR/EN) | Yok | Makale veya referans yok |
| LinkedIn | Yok | Sirket sayfasi bulunamadi |
| YouTube | Yok | Kanal, video veya referans yok |
| Reddit | Yok | Sifir bahsetme |
| Eksi Sozluk | Yok | Giris yok |
| Sikayetvar | Yok | Profil yok |
| Trustpilot | Yok | Profil yok |
| Google Business | Yok | Profil yok |
| Basin/Medya | Yok | Haber kapsamı yok |

**Etki:** AI modelleri entity tanimasi icin harici kaynaklara dayanir. Sifir dis referans = AI icin tanimlanamayan marka.

---

### Content E-E-A-T (18/100)

| Boyut | Skor | Bulgular |
|---|---|---|
| Experience (Deneyim) | 2/25 | Orijinal veri yok, vaka calismasi yok, surec dokumantasyonu yok. Anasayfa istatistikleri (1.200+ tasiyici, 48.000+ gonderim, %98 memnuniyet) dogrulanmamis iddialar. |
| Expertise (Uzmanlik) | 4/25 | Yazar atfi sifir. Ekip sayfasi yok. Kurucu bilgisi yok. Sektör terminolojisi temel duzeyde. |
| Authoritativeness (Otorite) | 3/25 | Dis referans sifir. Medya kapsamı yok. Sertifika/odul yok. Hakkimizda sayfasi 35 kelime. |
| Trustworthiness (Guven) | 9/25 | HTTPS mevcut. Yasal sayfa URL'leri var ama icerik stub. Placeholder telefon numarasi. Fiziksel adres yok. |

**Toplam Icerik Metrikleri:**
- Site geneli toplam kelime: ~900
- Anasayfa: ~380 kelime (minimum 800 bekleniyor)
- Hakkimizda: ~35 kelime (minimum 500 bekleniyor)
- Yasal sayfalar: ~25-35 kelime (islevsel degil)
- Blog/Rehber/Kaynak: Sifir
- Harici link: Sifir (bilgi ekosisteminden izole)
- Yayinlanma tarihi: Hicbir sayfada yok

---

### Technical GEO (52/100)

| Kategori | Skor | Durum |
|---|---|---|
| SSR Kalitesi | 45/100 | Statik sayfalar iyi, dinamik sayfalar (ilanlar, destek) bos |
| Meta Tag'lar | 40/100 | Title tag bozuk, canonical eksik, OG eksik |
| Crawlability | 65/100 | robots.txt iyi, sitemap zayif (6 URL) |
| Guvenlik | 85/100 | HSTS+preload, X-Frame, nosniff, referrer -- sadece CSP eksik |
| Core Web Vitals | 50/100 | ISR iyi TTFB (~163ms), skeleton→icerik CLS riski |
| Mobil | 75/100 | Viewport, Tailwind responsive, Next.js Image |
| URL Yapisi | 85/100 | Temiz, kisa, aciklayici Turkce slug'lar |
| Yanit/Durum | 90/100 | HTTP/2, Nginx, ISR cache, 301 redirect'ler dogru |

**Olumlu Bulgular:**
- HTTPS + HSTS preload
- HTTP/2, Nginx, ISR cache (s-maxage=60, stale-while-revalidate)
- TTFB ~163ms (mukemmel)
- www → non-www 301 redirect dogru
- robots.txt admin/auth sayfalarini dogru blokluyor
- URL yapisi temiz ve tutarli

**Kritik Teknik Sorunlar:**
1. `<title>` tag'i `{{title}} | PaketJet` olarak render -- template degiskeni cozulmuyor
2. `/ilanlar` ve `/destek` sayfalari AI crawler'lara bos icerik sunuyor
3. Canonical URL hicbir sayfada yok
4. Sitemap'te sadece 6 URL ve bazi sayfalar eksik (/hakkimizda, /destek, /kvkk)
5. `/gizlilik` (sitemap) vs `/gizlilik-politikasi` (footer link) -- URL uyusmazligi

---

### Schema & Structured Data (0/100)

**Tespit Edilen Schema:** SIFIR (5 sayfada hicbir formatta schema yok)

| Eksik Schema | Oncelik | GEO Etkisi |
|---|---|---|
| Organization + sameAs | Kritik | Entity tanimlama icin zorunlu |
| WebSite + SearchAction | Yuksek | Sitelinks search box, site arama |
| Service | Yuksek | P2P kargo hizmetinin semantik tanimi |
| FAQPage | Orta | SSS icerigi icin yapisal veri |
| BreadcrumbList | Orta | Navigasyon hiyerarsisi |
| ContactPoint | Orta | Iletisim bilgileri yapisi |
| Offer (ilan detay) | Orta | Bireysel ilanlarin yapisal verisi |
| speakable | Dusuk | AI asistan okunabilirlik |

**Onerilen JSON-LD Sablonlari (en kritik 3):**

**Organization (site geneli layout'a eklenecek):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PaketJet",
  "url": "https://paketjet.com",
  "logo": "https://paketjet.com/assets/og-default.png",
  "description": "Turkiye'nin P2P kargo pazaryeri",
  "foundingDate": "[KURULUŞ YILI]",
  "email": "destek@paketjet.com",
  "telephone": "[GERCEK TELEFON]",
  "areaServed": { "@type": "Country", "name": "Turkey" },
  "sameAs": [
    "[LINKEDIN URL]",
    "[YOUTUBE URL]",
    "[TWITTER URL]",
    "[INSTAGRAM URL]"
  ]
}
```

**WebSite + SearchAction (anasayfa):**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "PaketJet",
  "url": "https://paketjet.com",
  "inLanguage": "tr",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://paketjet.com/ilanlar?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Service (anasayfa):**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "PaketJet P2P Kargo Hizmeti",
  "description": "Sehirler arasi tasima kapasitesini dijital olarak erisilebilir hale getiren P2P kargo pazaryeri",
  "provider": { "@type": "Organization", "name": "PaketJet" },
  "serviceType": "P2P Kargo Pazaryeri",
  "areaServed": { "@type": "Country", "name": "Turkey" }
}
```

---

### Platform Optimization (18/100)

| Platform | Skor | Durum |
|---|---|---|
| Google AI Overviews | 15/100 | Kritik -- Soru-cevap icerigi yok, FAQ yok, tablo yok, schema yok |
| ChatGPT Web Search | 12/100 | Kritik -- Entity tanimlama sifir, yazar atfi yok, dis kaynak yok |
| Perplexity AI | 14/100 | Kritik -- Topluluk dogrulamasi sifir, orijinal veri yok, tazelik sinyali yok |
| Google Gemini | 18/100 | Kritik -- Google ekosisteminde sifir varlik, Knowledge Graph'ta yok |
| Bing Copilot | 22/100 | Kritik -- IndexNow yok, LinkedIn yok, yapisal veri yok |

**Platformlar Arasi Ortak Sorunlar:**
1. Entity tanimlama sifir (hicbir AI PaketJet'i taniyor entity olarak tanimlamiyor)
2. Alintilanabilir icerik son derece yetersiz
3. Harici dogrulama kaynagi yok
4. Schema markup tamamen eksik
5. Icerik hacmi cok dusuk (6 sayfa, ~900 kelime)

---

## Quick Wins (Bu Hafta Uygulanabilir)

1. **Title tag bug fix** -- Next.js metadata konfigurasyonundaki template degiskeni sorununu cozun. Her sayfada benzersiz, aciklayici title olusturun. (Etki: Yuksek, Efor: Dusuk)

2. **llms.txt olusturun** -- Yukardaki sablonla `/llms.txt` dosyasi ekleyin. (Etki: Orta, Efor: Cok Dusuk)

3. **Canonical URL ekleyin** -- Her sayfaya `<link rel="canonical">` ekleyin. (Etki: Orta, Efor: Dusuk)

4. **robots.txt'e AI crawler kurallari ekleyin** -- GPTBot, ClaudeBot, PerplexityBot icin acik `Allow: /` ekleyin. (Etki: Dusuk-Orta, Efor: Cok Dusuk)

5. **OG tag'lari tamamlayin** -- `og:image`, `og:url`, `og:type` eksiklerini giderin. (Etki: Dusuk, Efor: Dusuk)

---

## 30-Day Action Plan

### Week 1: Teknik Temeller
- [ ] Title tag template bug'ini fix edin
- [ ] Tum sayfalara canonical URL ekleyin
- [ ] Organization + WebSite JSON-LD schema ekleyin
- [ ] llms.txt olusturun
- [ ] robots.txt'e AI crawler kurallari ekleyin
- [ ] OG tag eksiklerini tamamlayin
- [ ] Sitemap'i genisletin (eksik sayfalari ekleyin)

### Week 2: Icerik & Yasal Uyumluluk
- [ ] KVKK sayfasini tam yasal uyumluluk ile yeniden yazin
- [ ] Gizlilik Politikasi ve Kullanim Kosullarini kapsamli doldurun
- [ ] Hakkimizda sayfasini genisletin (500+ kelime, ekip, hikaye, istatistikler)
- [ ] Iletisim sayfasina gercek telefon ve adres ekleyin
- [ ] SSS icerigini SSR ile render edin + FAQPage schema ekleyin
- [ ] /ilanlar sayfasini SSR ile gercek veri sunacak sekilde guncelleyin

### Week 3: Platform Varligi & Marka
- [ ] LinkedIn sirket sayfasi olusturun ve doldurun
- [ ] YouTube kanali acin, 1-2 tanitim videosu yukleyin
- [ ] Instagram ve Twitter/X profilleri olusturun
- [ ] Google Business Profile olusturun
- [ ] Sikayetvar'da marka sayfasi talep edin
- [ ] Organization schema'ya sameAs linkleri ekleyin
- [ ] Service + BreadcrumbList schema ekleyin

### Week 4: Icerik Pazarlama & Derinlik
- [ ] "P2P Kargo Nedir?" blog yazisi (1.500+ kelime)
- [ ] "PaketJet Nasil Kullanilir?" kapsamli rehber (1.000+ kelime)
- [ ] Sehir bazli rota sayfalari olusturmaya baslayin (Istanbul-Ankara, Istanbul-Izmir)
- [ ] Tasima Kurallari sayfasini genisletin (sigorta, sorumluluk, paketleme)
- [ ] Anasayfadaki istatistiklere kaynak/aciklama ekleyin
- [ ] IndexNow protokolu entegrasyonu
- [ ] Turk startup dizinlerine (Webrazzi, Startups.watch) kayit

---

## Platform Bazli Aksiyonlar

### Google AI Overviews Icin
- FAQPage schema ile SSS sayfasi (en az 15-20 soru)
- HowTo schema ile "Nasil Calisir" sayfasi
- Soru bazli H2 basliklari ile blog icerikleri

### ChatGPT Icin
- Organization schema + sameAs linkleri
- Wikipedia/Vikipedi stub makalesi (kaynaklarla)
- robots.txt'te OAI-SearchBot, ChatGPT-User, GPTBot icin acik izin

### Perplexity Icin
- Reddit ve Eksi Sozluk'ta organik tartismalar
- Orijinal veri yayinlama ("2026 P2P Kargo Fiyat Endeksi")
- Tum sayfalara yayinlanma/guncelleme tarihleri

### Google Gemini Icin
- YouTube kanali ve video icerikleri
- Google Business Profile
- Topical cluster yapisal icerik mimarisi

### Bing Copilot Icin
- IndexNow protokolu
- LinkedIn sirket sayfasi
- Bing Webmaster Tools dogrulamasi

---

## Appendix: Analyzed Pages

| URL | Title | Status | GEO Issues |
|---|---|---|---|
| https://paketjet.com | {{title}} \| PaketJet | 200 | Bozuk title, schema yok, canonical yok, icerik yetersiz |
| https://paketjet.com/ilanlar | {{title}} \| PaketJet | 200 | Icerik SSR degil (bos skeleton), schema yok, title bozuk |
| https://paketjet.com/hakkimizda | {{title}} \| PaketJet | 200 | 35 kelime, ekip yok, schema yok, title bozuk |
| https://paketjet.com/iletisim | {{title}} \| PaketJet | 200 | Placeholder telefon, adres yok, schema yok |
| https://paketjet.com/destek | {{title}} \| PaketJet | 200 | FAQ SSR degil, schema yok, title bozuk |
| https://paketjet.com/gizlilik-politikasi | - | 200 | ~35 kelime stub, yasal uyumsuz |
| https://paketjet.com/kullanim-kosullari | - | 200 | ~25 kelime stub, yasal uyumsuz |

### Technical Infrastructure

| Metric | Value |
|---|---|
| Framework | Next.js (App Router, RSC, ISR) |
| Server | Nginx |
| Protocol | HTTP/2 |
| TTFB | ~163ms |
| SSL | Valid, HSTS preload |
| Cache | ISR (s-maxage=60, SWR) |
| Sitemap URLs | 6 |
| robots.txt | Mevcut, AI bloklama yok |
| llms.txt | Yok (404) |
| Schema Blocks | 0 |
