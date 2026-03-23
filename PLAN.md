# PaketJet — Gelistirme Plani & Checkpoint'ler

> **Proje Ozeti:** P2P kargo pazaryeri. Tasiyicilar guzergah/kapasite ilani acar, musteriler kargo alani satin alir.
> **Tarih:** 2026-03-20
> **Durum:** CP-1 ~ CP-30 tamamlandi. Tum checkpoint'ler kapatildi.

---

## Checkpoint Haritasi

```
CP-1  [x]  Backend: ilanlar modulu
CP-2  [x]  Backend: bookings modulu
CP-3  [x]  Backend: mevcut modul duzeltmeleri
CP-4  [x]  Backend: admin panel routes
CP-5  [x]  Frontend: auth sayfalari
CP-6  [x]  Frontend: ilan akisi (liste, detay, yeni ilan)
CP-7  [x]  Frontend: kullanici dashboard
CP-8  [x]  Frontend: state & API katmani
CP-9  [x]  DB seed & portfolio
CP-10 [x]  Booking akisi & wallet deposit
CP-11 [x]  Tasiyici gelen talepler paneli
CP-12 [x]  API baglantisi & UX duzeltmeleri
CP-13 [x]  Join & auth UX duzeltmeleri
CP-14 [x]  Arama akisi URL entegrasyonu
CP-15 [x]  Auth-aware header + HeroSearch router push
CP-16 [x]  Bildirim sistemi frontend
CP-17 [x]  Ilan yonetimi gelistirmeleri
CP-18 [x]  Odeme & teslimat akisi
CP-19 [x]  Sifre sifirlama
CP-20 [x]  Admin panel temizligi & PaketJet uyumu
CP-21 [x]  Backend: Telegram modulu PaketJet uyarlamasi
CP-22 [x]  Backend: Mail servisi PaketJet uyarlamasi + email trigger'lari
CP-23 [x]  Backend: Subscription (Plan) modulu
CP-24 [x]  Frontend: SEO entegrasyonu (metadata, robots, sitemap, admin SEO)
CP-25 [x]  Frontend: Admin panel eksik sayfalari (7 yeni sayfa + shared components)
CP-26 [x]  Frontend: Subscription/Plan sayfalari (fiyat, tasiyici plan, admin plan CRUD)
CP-27 [x]  Production hazirligi (Dockerfile, docker-compose, nginx, guvenlik, migration)
CP-28 [x]  Test yazimi (38 test, 5 dosya, Bun test runner)
CP-29 [x]  Harita entegrasyonu (Google Maps, guzergah gorsellestirme)
CP-30 [x]  Performans (next.config, loading.tsx, scroll-to-top)
```

---

## CP-1 — Backend: `ilanlar/` Modulu `[x]` TAMAMLANDI

- [x] `ilanlar/schema.ts` — ilanlar + ilan_photos tablolari
- [x] `ilanlar/validation.ts` — createIlan, updateIlan, searchIlans Zod semalari
- [x] `ilanlar/repository.ts` — CRUD + kapasite dusme fonksiyonu
- [x] `ilanlar/controller.ts` + `ilanlar/router.ts` — public liste/detay, auth CRUD
- [x] `ilanlar/admin.routes.ts` — admin liste/durum/silme
- [x] `app.ts` entegrasyonu

---

## CP-2 — Backend: `bookings/` Modulu `[x]` TAMAMLANDI

- [x] `bookings/schema.ts` — bookings tablosu
- [x] `bookings/repository.ts` + `bookings/controller.ts` + `bookings/router.ts`
- [x] Kapasite kontrolu + `repoDeductCapacity` + `repoRestoreCapacity`
- [x] Notification tetikleyicileri (olusturma, onay, teslim, iptal)
- [x] Admin routes

---

## CP-3 — Backend: Mevcut Modul Duzeltmeleri `[x]` TAMAMLANDI

- [x] `orders/` — validation `property_id -> ilan_id`, controller gercek ilanlar lookup
- [x] `seller/` — `getAuthUserId` + `handleRouteError` standardi
- [x] `subscription/` — `repoCountActiveListings` gercek ilanlar sorgusu
- [x] `wallet/service.ts` — `deductForBooking`, `creditCarrier`, `refundToCustomer`
- [x] `notifications/` — booking event trigger'lari bookings/controller icinde
- [x] `dashboard/` — admin stats gercek, yeni `dashboard/router.ts`

---

## CP-4 — Backend: Admin Panel Routes `[x]` TAMAMLANDI

- [x] `/admin/ilanlar` — filtreli liste, durum degistirme, silme
- [x] `/admin/bookings` — liste, detay, admin durum degistirme
- [x] `/admin/carriers` — ilan veren kullanicilar + ilan_count + booking_count
- [x] `/admin/dashboard/stats/revenue` — aylik gelir + top 10 tasiyici
- [x] `/admin/dashboard/stats/activity` — son 30 gun gunluk aktivite
- [x] Frontend admin panel + sidebar layout
- [x] `modules/admin/admin.service.ts` — tum admin API cagrilari

---

## CP-5 ~ CP-15 — Frontend Temel Ozellikler `[x]` TAMAMLANDI

- [x] Auth sayfalari (giris, uye-ol, sifremi-unuttum, sifre-sifirla)
- [x] Ilan akisi (liste, detay, yeni ilan wizard)
- [x] Kullanici dashboard (musteri, tasiyici, cuzdan, profil)
- [x] State & API katmani (api-client, Zustand, UI components barrel)
- [x] DB seed & portfolio
- [x] Booking akisi & wallet deposit
- [x] Tasiyici gelen talepler paneli
- [x] API baglantisi & UX duzeltmeleri
- [x] Join & auth UX duzeltmeleri
- [x] Arama akisi URL entegrasyonu
- [x] Auth-aware header + HeroSearch router push

---

## CP-16 — Bildirim Sistemi Frontend `[x]` TAMAMLANDI

- [x] `modules/notification/` — type, service, store (60 sn polling)
- [x] Header bell ikonu + unread badge
- [x] `/panel/bildirimler` — bildirim listesi, tekil + toplu okundu

---

## CP-17 — Ilan Yonetimi Gelistirmeleri `[x]` TAMAMLANDI

- [x] `/panel/tasiyici/ilanlar/[id]/duzenle` — ilan duzenleme sayfasi
- [x] Tasiyici panelinde "Duzenle" linki

---

## CP-18 — Odeme & Teslimat Akisi `[x]` TAMAMLANDI

- [x] `createBooking` — `deductForBooking` entegrasyonu
- [x] `delivered` — `creditCarrier` cagrisi
- [x] `cancelBooking` — `refundToCustomer` iade
- [x] Tasiyici: "Yola Cikti" + "Teslim Edildi" butonlari
- [x] Musteri: kargo takip step indicator

---

## CP-19 — Sifre Sifirlama `[x]` TAMAMLANDI

- [x] `/sifremi-unuttum` + `/sifre-sifirla` sayfalari
- [x] `auth.service.ts` — forgotPassword, resetPassword

---

## CP-20 — Admin Panel Temizligi `[x]` TAMAMLANDI

- [x] `db_admin/` silindi, gereksiz modul kayitlari kaldirildi
- [x] Turkce rol etiketleri, sayfalama, rezervasyon dagilimi duzeltmeleri

---

## CP-21 — Backend: Telegram Modulu PaketJet Uyarlamasi `[x]` TAMAMLANDI

- [x] Event tipleri PaketJet'e cevirildi (new_booking, booking_confirmed, vb.)
- [x] Template key'leri guncellendi
- [x] `routes.ts` — `registerTelegram` public route eklendi
- [x] Booking/auth controller'lardan telegram bildirim tetikleme

---

## CP-22 — Backend: Mail Servisi PaketJet Uyarlamasi `[x]` TAMAMLANDI

- [x] "Dijital Market" -> "PaketJet" tum hardcoded yerler
- [x] Mail fonksiyonlari: sendBookingCreatedMail, sendBookingConfirmedMail, sendBookingDeliveredMail, sendBookingCancelledMail, sendCarrierPaymentMail
- [x] Booking controller'dan her status degisikliginde mail tetikleme
- [x] Auth controller'dan kayit + sifre degisikligi maili

---

## CP-23 — Backend: Subscription (Plan) Modulu `[x]` TAMAMLANDI

- [x] Plan tipleri: free (1 ilan), starter (5), pro (20), business (sinirsiz)
- [x] `subscription/schema.ts` — plans + user_subscriptions Drizzle tablolari
- [x] `subscription/repository.ts` — CRUD + aktif plan + aylik ilan sayaci
- [x] `subscription/controller.ts` — listPlans, purchasePlan, cancelSubscription
- [x] `subscription/admin.controller.ts` — Admin plan CRUD
- [x] `ilanlar/controller.ts` — createIlan icinde plan limiti kontrolu
- [x] `113_subscription_schema.sql` — DDL + 4 varsayilan plan seed

---

## CP-24 — Frontend: SEO Entegrasyonu `[x]` TAMAMLANDI

- [x] `lib/seo.ts` — fetchPageSeo, buildMetadata, getPageMetadata helper'lari
- [x] Her sayfaya `generateMetadata` (server page'ler direkt, client page'ler layout.tsx ile)
- [x] `app/robots.ts` — panel/admin/api disallow
- [x] `app/sitemap.ts` — statik + aktif ilanlar
- [x] `/admin/seo` — sayfa bazli SEO yonetim sayfasi
- [x] `layout.tsx` — metadataBase + title template + openGraph defaults

---

## CP-25 — Frontend: Admin Panel Eksik Sayfalari `[x]` TAMAMLANDI (2026-03-20)

### Shared Components (`components/admin/` + barrel)
- [x] `AdminPageHeader` — baslik + subtitle + children slot
- [x] `AdminPagination` — sayfalama
- [x] `AdminEmptyState` — bos durum mesaji
- [x] `AdminListSkeleton` — yukleme iskeleti
- [x] `AdminStatusFilter` — durum filtre butonlari
- [x] `useAdminList` — ortak liste hook'u
- [x] `index.ts` — barrel export

### Sayfalar
- [x] `/admin/iletisim` — Mesaj listesi + detay paneli + okundu/sil
- [x] `/admin/cuzdan` — Cuzdan listesi + islem gecmisi + bakiye ayarlama
- [x] `/admin/email-sablonlari` — Sablon listesi + HTML editor + onizleme
- [x] `/admin/telegram` — Gelen mesajlar + otomatik yanit + test gonder
- [x] `/admin/audit` — Istek loglari (tablo) + auth olaylari (liste)
- [x] `/admin/raporlar` — KPI kartlari + sehir bazli dagilim tablosu
- [x] `/admin/depolama` — Dosya grid + onizleme + sil
- [x] Sidebar nav guncellendi (15 link)

---

## CP-26 — Frontend: Subscription/Plan Sayfalari `[x]` TAMAMLANDI

- [x] `modules/subscription/subscription.type.ts` + `subscription.service.ts`
- [x] `/fiyat` — Backend'den plan listesi ceken dinamik pricing sayfasi
- [x] `/panel/tasiyici/plan` — Aktif plan, kullanim bilgisi, satin al, iptal, gecmis
- [x] `/admin/planlar` — Admin plan CRUD
- [x] `api-endpoints.ts` + `routes.ts` + nav linkleri guncellendi

---

## CP-27 — Production Hazirligi `[x]` TAMAMLANDI (2026-03-20)

- [x] `backend/.env.example` — tum zorunlu env degiskenleri dokumante
- [x] `backend/Dockerfile` — Bun multi-stage build, non-root user, healthcheck, uploads volume
- [x] `frontend/Dockerfile` — Next.js standalone build, non-root user
- [x] `docker-compose.yml` — mysql + redis + backend + frontend + nginx
- [x] `nginx/nginx.conf` — HTTPS reverse proxy, security headers, HSTS, rate-limit, gzip
- [x] Backend guvenlik: cookie sameSite lax, CORS production default false, JWT secret startup check
- [x] Frontend `next build` + `tsc --noEmit` — sifir hata
- [x] `scripts/migrate.sh` — --no-drop schema migration, --seed ilk kurulum, --only tekil dosya

---

## CP-28 — Test Yazimi `[ ]`

- [ ] Backend unit test altyapisi — Bun test runner veya vitest setup
- [ ] Kritik akis testleri:
  - Auth: register, login, password reset
  - Booking: create -> confirm -> in_transit -> delivered (wallet akisi dahil)
  - Wallet: deposit, deduct, refund, credit
  - Ilan: CRUD + kapasite kontrolu
- [ ] API integration test — supertest/light-my-request ile endpoint testleri
- [ ] Frontend component testleri (opsiyonel) — vitest + testing-library

---

## CP-29 — Harita Entegrasyonu `[x]` TAMAMLANDI

- [x] `frontend/src/lib/city-coords.ts` — Turkiye 81 il merkezi koordinat lookup (+ ASCII alternatifleri)
- [x] `@react-google-maps/api` kuruldu (Google Maps API key mevcut)
- [x] `components/RouteMap.tsx` — Google Maps bileseni (Polyline + Marker + fitBounds, dynamic import)
- [x] `app/ilanlar/[id]/page.tsx` — Ilan detayinda guzergah haritasi
- [x] `_shared/http.ts` — `reply.sent` guard eklendi (double-reply bug fix)

---

## CP-30 — Performans `[x]` TAMAMLANDI

- [x] `next.config.ts` — `compress: true`, `poweredByHeader: false`, `images.remotePatterns`
- [x] Panel sayfalari — 5 loading.tsx skeleton (musteri, tasiyici, cuzdan, bildirimler, profil)
- [x] Admin sayfalari — root loading.tsx skeleton (tum alt sayfalar icin)
- [x] `app/ilanlar/page.tsx` — filtre/sayfa degisikliginde scroll to top (smooth)
- [x] RouteMap `dynamic()` import ile lazy load (CP-29'da yapildi)
- ~~IlanCard `<img>` → `<Image>` gecisi~~ — IlanCard'da img yok (LetterAvatar kullaniyor)

---

## Teknik Borc

| ID | Aciklama | Durum |
|----|----------|-------|
| T-1 | orderItems.property_id -> ilan_id FK | Kapatildi |
| T-2 | Ilan lookup stub | Kapatildi |
| T-3 | repoCountActiveListings stub | Kapatildi |
| T-4 | Category check stub (subscription) | Acik — PaketJet'te kullanilmiyor |
| T-5 | Scope validation stub (seller) | Acik — PaketJet'te kullanilmiyor |
| T-6 | DB erisim hatasi | Kapatildi |
| T-7 | MOCK_ILANLAR -> gercek API | Kapatildi |
| T-8 | Ilan filtreler static | Kapatildi |

---

## Onerilen Siralama (Kalan)

| Sira | Checkpoint | Neden |
|------|-----------|-------|
| 1 | CP-28 | Test altyapisi — production oncesi kritik |
| 2 | CP-29 | Harita — kullanici deneyimi icin onemli |
| 3 | CP-30 | Performans — Core Web Vitals, SEO etkisi |
