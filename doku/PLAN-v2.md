# PaketJet Gelistirme Plani v2

> Tarih: 2026-03-20
> Onceki: CP-1 ~ CP-20 tamamlandi (temel backend + frontend + admin panel)

## Durum Efsanesi
- `[ ]` Yapilacak
- `[~]` Devam ediyor
- `[x]` Tamamlandi

---

## CP-21 — Backend: Telegram Modulu PaketJet Uyarlamasi `[x]` TAMAMLANDI

Mevcut durum: Ensotek/eski proje event tipleri var. Yapi saglamama ama icerik uyumsuz.
Telegram webhook public route eksik (routes.ts'de kayitli degil).

- [ ] **21A** `telegram/validation.ts` — Event tiplerini PaketJet'e cevir:
  - `new_catalog_request` -> `new_booking`
  - `new_offer_request` -> `booking_confirmed`
  - `new_contact` -> `new_contact` (ayni kalabilir)
  - `new_ticket` -> `new_ilan`
  - `ticket_replied` -> `booking_delivered`
  - Yeni: `booking_cancelled`, `new_user`, `wallet_deposit`
- [ ] **21B** `telegram/settings.ts` — Event listesini ve template key'lerini guncelle
- [ ] **21C** `telegram/telegram.notifier.ts` — Ensotek yorumlarini temizle
- [ ] **21D** `telegram/TEMPLATE_KEYS.md` — PaketJet event template dokumantasyonu guncelle
- [ ] **21E** `routes.ts` — `registerTelegram` public route'u ekle (webhook icin)
- [ ] **21F** Booking/auth controller'lardan telegram bildirim tetikle:
  - `bookings/controller.ts` -> yeni booking: `telegramNotify('new_booking', ...)`
  - `auth/controller.ts` -> yeni uye: `telegramNotify('new_user', ...)`

---

## CP-22 — Backend: Mail Servisi PaketJet Uyarlamasi `[x]` TAMAMLANDI

Mevcut durum: Mail calisiyor (SMTP/nodemailer), ama:
- "Dijital Market" hardcoded 8 yerde
- emailTemplates DB tablosu var ama mail servisi kullanmiyor (hardcoded HTML)
- Booking lifecycle'da mail gonderilmiyor

- [ ] **22A** `mail/service.ts` — "Dijital Market" -> "PaketJet" (5 yer)
- [ ] **22B** `auth/controller.ts` + `auth/admin.controller.ts` — site_name "PaketJet" (3 yer)
- [ ] **22C** `mail/service.ts` — Mevcut hardcoded template'leri PaketJet'e uyarla:
  - `sendWelcomeMail` -> PaketJet karsilama
  - `sendPasswordChangedMail` -> PaketJet sifre degisikligi
  - `sendOrderCreatedMail` -> `sendBookingCreatedMail` (yeniden yaz)
  - `sendDepositSuccessMail` -> PaketJet cuzdan yukleme
  - `sendTicketRepliedMail` -> sil (ticket yok) veya `sendBookingStatusMail`
- [ ] **22D** Yeni mail fonksiyonlari ekle:
  - `sendBookingConfirmedMail(customer)` — rezervasyon onaylandi
  - `sendBookingDeliveredMail(customer)` — kargo teslim edildi
  - `sendBookingCancelledMail(customer)` — iptal + iade bilgisi
  - `sendCarrierPaymentMail(carrier)` — odeme aktarildi
- [ ] **22E** `bookings/controller.ts` — Her status degisikliginde mail tetikle:
  - createBooking -> `sendBookingCreatedMail`
  - confirmBooking -> `sendBookingConfirmedMail`
  - delivered -> `sendBookingDeliveredMail` + `sendCarrierPaymentMail`
  - cancel -> `sendBookingCancelledMail`
- [ ] **22F** `mail/validation.ts` — orderCreatedMailSchema -> bookingMailSchema

---

## CP-23 — Backend: Subscription (Plan) Modulu Yeniden Olusturma `[x]` TAMAMLANDI

- [x] **23A** Plan tipleri: free (1 ilan), starter (5), pro (20), business (sinirsiz)
- [x] **23B** `subscription/schema.ts` — plans + user_subscriptions Drizzle tablolari
- [x] **23C** `subscription/validation.ts` — createPlan, updatePlan, purchasePlan Zod semalari
- [x] **23D** `subscription/repository.ts` — CRUD + aktif plan + aylik ilan sayaci + admin liste
- [x] **23E** `subscription/controller.ts` — listPlans, getPlan, getMySubscription, purchasePlan, cancelSubscription
- [x] **23F** `subscription/router.ts` — Public + auth route'lar
- [x] **23G** `subscription/admin.controller.ts` + `admin.routes.ts` — Admin plan CRUD + abonelik listesi
- [x] **23H** `ilanlar/controller.ts` — createIlan icinde plan limiti kontrolu (plan_required + ilan_limit_reached)
- [x] **23I** `subscription/service.ts` — deductForPlan (cuzdandan plan bedeli dusme)
- [x] **23J** `113_subscription_schema.sql` — DDL + 4 varsayilan plan seed
- [x] **23K** `routes.ts` — public + admin register

---

## CP-24 — Frontend: SEO Entegrasyonu `[x]` TAMAMLANDI

Mevcut durum: Sadece layout.tsx'de statik metadata. Backend SEO API'si hazir ama kullanilmiyor.

- [x] **24A** `lib/seo.ts` — SEO helper fonksiyonlari (fetchPageSeo, buildMetadata, interpolate)
- [x] **24B** `config/api-endpoints.ts` — `siteSettings.seo`, `siteSettings.seoPage` eklendi
- [x] **24C** Her sayfaya `generateMetadata` eklendi (server page'ler direkt, client page'ler layout.tsx ile)
- [x] **24D** `app/robots.ts` — Dinamik robots.txt (panel/admin/api disallow)
- [x] **24E** `app/sitemap.ts` — Dinamik sitemap (statik + aktif ilanlar)
- [x] **24F** Admin SEO yonetim sayfasi (`/admin/seo`) — sayfa bazli title/desc/keywords/noindex duzenleme
- [x] **24G** `layout.tsx` — metadataBase + title template + openGraph defaults

---

## CP-25 — Frontend: Admin Panel Eksik Sayfalari `[x]` TAMAMLANDI

Shared components: `components/admin/` (AdminPageHeader, AdminPagination, AdminEmptyState, AdminListSkeleton, AdminStatusFilter, useAdminList) + barrel.

- [x] **25A** `/admin/iletisim` — Mesaj listesi + detay paneli + okundu/sil
- [x] **25B** `/admin/cuzdan` — Cuzdan listesi + islem gecmisi + bakiye ayarlama
- [x] **25C** `/admin/email-sablonlari` — Sablon listesi + HTML editor + onizleme
- [x] **25F** `/admin/audit` — Istek loglari (tablo) + auth olaylari (liste)
- [x] **25G** `/admin/telegram` — Gelen mesajlar + otomatik yanit + test gonder
- [x] **25H** `/admin/raporlar` — KPI kartlari + sehir bazli dagilim tablosu
- [x] **25I** `/admin/depolama` — Dosya grid + onizleme + sil
- [x] Sidebar nav guncellendi (15 link)

---

## CP-26 — Frontend: Subscription/Plan Sayfasi `[x]` TAMAMLANDI

- [x] **26A** `modules/subscription/subscription.type.ts` + `subscription.service.ts` — tipler + API calls
- [x] **26B** `/fiyat` — Backend'den plan listesi ceken dinamik pricing sayfasi (fallback statik kartlar)
- [x] **26C** `/panel/tasiyici/plan` — Aktif plan, kullanim bilgisi, plan satin al, iptal, gecmis
- [x] **26D** `/admin/planlar` — Admin plan CRUD (isim, slug, fiyat, limit, ozellikler, aktif/pasif)
- [x] **26E** `api-endpoints.ts` + `routes.ts` + nav linkleri guncellendi

---

## CP-27 — Production Hazirligi `[x]` TAMAMLANDI

- [x] **27A** `backend/.env.example` — tum zorunlu env degiskenleri dokumante
- [x] **27B** `backend/Dockerfile` — Bun multi-stage build, non-root user, healthcheck, uploads volume
- [x] **27C** `frontend/Dockerfile` — Next.js standalone build, non-root user
- [x] **27D** `docker-compose.yml` — mysql + redis + backend + frontend + nginx
- [x] **27E** `nginx/nginx.conf` — HTTPS reverse proxy, security headers, HSTS, rate-limit, gzip
- [x] **27F** Backend guvenlik: cookie sameSite lax, CORS production default false, JWT secret startup check
- [x] **27G** Frontend `next build` + `tsc --noEmit` — sifir hata
- [x] **27H** `scripts/migrate.sh` — --no-drop schema migration, --seed ilk kurulum

---

## CP-28 — Test Yazimi

- [ ] **28A** Backend unit test altyapisi — Bun test runner veya vitest setup
- [ ] **28B** Kritik akis testleri:
  - Auth: register, login, password reset
  - Booking: create -> confirm -> in_transit -> delivered (wallet akisi dahil)
  - Wallet: deposit, deduct, refund, credit
  - Ilan: CRUD + kapasite kontrolu
- [ ] **28C** API integration test — supertest/light-my-request ile endpoint testleri
- [ ] **28D** Frontend component testleri (opsiyonel) — vitest + testing-library

---

## Onerilen Siralama

| Sira | Checkpoint | Neden |
|------|-----------|-------|
| 1 | CP-22 | Kolay, hizli — "Dijital Market" temizligi + booking mail'leri |
| 2 | CP-21 | Kolay — Telegram event'lerini PaketJet'e cevir |
| 3 | CP-24 | Orta — SEO entegrasyonu, arama motorlari icin kritik |
| 4 | CP-23 | Buyuk — Subscription modulu sifirdan, gelir modeli |
| 5 | CP-25 | Buyuk — Admin panel eksikleri (parcali yapilabiilr) |
| 6 | CP-26 | Orta — Plan sayfasi (CP-23'e bagimli) |
| 7 | CP-27 | Orta — Production hazirligi |
| 8 | CP-28 | Opsiyonel — Test altyapisi |
