# PaketJet — Geliştirme Planı & Checkpoint'ler

> **Proje Özeti:** P2P kargo pazaryeri. Taşıyıcılar güzergah/kapasite ilanı açar, müşteriler kargo alanı satın alır.
> **Tarih:** 2026-03-12
> **Durum:** CP-1 → CP-28 tamamlandı. Tüm checkpoint'ler kapatıldı.

---

## Checkpoint Haritası

```
CP-1  [x]  Backend: ilanlar modülü
CP-2  [x]  Backend: bookings modülü
CP-3  [x]  Backend: mevcut modül düzeltmeleri
CP-4  [x]  Backend: admin panel routes
CP-5  [x]  Frontend: auth sayfaları
CP-6  [x]  Frontend: ilan akışı (liste, detay, yeni ilan)
CP-7  [x]  Frontend: kullanıcı dashboard
CP-8  [x]  Frontend: state & API katmanı
CP-9  [x]  DB seed & portfolio
CP-10 [x]  Booking akışı & wallet deposit
CP-11 [x]  Taşıyıcı gelen talepler paneli
CP-12 [x]  API bağlantısı & UX düzeltmeleri
CP-13 [x]  Join & auth UX düzeltmeleri
CP-14 [x]  Arama akışı URL entegrasyonu
CP-15 [x]  Auth-aware header + HeroSearch router push
CP-16 [x]  Bildirim sistemi frontend
CP-17 [x]  İlan yönetimi geliştirmeleri
CP-18 [x]  Ödeme & teslimat akışı
CP-19 [x]  Şifre sıfırlama
CP-20 [x]  Admin panel temizliği & PaketJet uyumu
CP-21 [x]  Admin panel geliştirmeleri
CP-22 [x]  Taşıyıcı değerlendirme sistemi
CP-23 [x]  Tema sistemi düzeltmeleri (regresyon + dark mode bug)
CP-24 [x]  Gerçek ödeme entegrasyonu (İyzico)
CP-25 [x]  Email bildirimleri (tüm trigger'lar entegre, sendDepositSuccessMail eklendi)
CP-26 [x]  Harita entegrasyonu (Google Maps, güzergah görselleştirme)
CP-27 [x]  SEO (metadata, sitemap, robots, generateMetadata ilan detay)
CP-28 [x]  Performans (next.config, loading.tsx, scroll-to-top, lazy load)
```

---

## CP-1 — Backend: `ilanlar/` Modülü `[x]` TAMAMLANDI

Taşıyıcıların güzergah/kapasite ilanı açtığı temel modül.

- [x] `ilanlar/schema.ts` — ilanlar + ilan_photos tabloları
- [x] `ilanlar/validation.ts` — createIlan, updateIlan, searchIlans Zod şemaları
- [x] `ilanlar/repository.ts` — CRUD + kapasite düşme fonksiyonu
- [x] `ilanlar/controller.ts` + `ilanlar/router.ts` — public liste/detay, auth CRUD
- [x] `ilanlar/admin.routes.ts` — admin liste/durum/silme
- [x] `app.ts` entegrasyonu

---

## CP-2 — Backend: `bookings/` Modülü `[x]` TAMAMLANDI

*Bağımlılık: CP-1*

- [x] `bookings/schema.ts` — bookings tablosu
- [x] `bookings/repository.ts` + `bookings/controller.ts` + `bookings/router.ts`
- [x] Kapasite kontrolü + `repoDeductCapacity` + `repoRestoreCapacity`
- [x] Notification tetikleyicileri (oluşturma, onay, teslim, iptal)
- [x] Admin routes

---

## CP-3 — Backend: Mevcut Modül Düzeltmeleri `[x]` TAMAMLANDI

*Bağımlılık: CP-1*

- [x] **3A** `orders/` — validation `property_id → ilan_id`, controller gerçek ilanlar lookup
- [x] **3B** `seller/` — `getUserId` kaldırıldı, `getAuthUserId` + `handleRouteError` kullanıyor
- [x] **3C** `subscription/` — `repoCountActiveListings` gerçek ilanlar sorgusu
- [x] **3D** `wallet/service.ts` — `deductForBooking`, `creditCarrier`, `refundToCustomer`
- [x] **3E** `notifications/` — booking event trigger'ları bookings/controller içinde
- [x] **3F** `dashboard/` — admin stats gerçek, yeni `dashboard/router.ts` (carrier + customer)

---

## CP-4 — Backend: Admin Panel Routes `[x]` TAMAMLANDI

*Bağımlılık: CP-1, CP-2*

- [x] `/admin/ilanlar` — filtreli liste (status/user_id/şehir), durum değiştirme, silme
- [x] `/admin/bookings` — liste (status/customer/carrier filtre), detay, admin durum değiştirme
- [x] `/admin/carriers` — ilan veren kullanıcılar + ilan_count + booking_count
- [x] `/admin/dashboard/stats/revenue` — aylık gelir (son 12 ay) + top 10 taşıyıcı
- [x] `/admin/dashboard/stats/activity` — son 30 gün günlük aktivite (user/ilan/booking)
- [x] Frontend admin panel: `/admin` özet, `/admin/ilanlar`, `/admin/bookings`, `/admin/carriers`, `/admin/users`
- [x] Admin layout: sidebar nav
- [x] `modules/admin/admin.service.ts` — tüm admin API çağrıları
- [x] `middleware.ts` güncellendi: `/admin/*` korumalı

---

## CP-5 — Frontend: Auth Sayfaları `[x]` TAMAMLANDI

- [x] `/giris` — login formu, hata state, Zustand store bağlantısı; `?next=` redirect desteği
- [x] `/uye-ol` — kayıt formu, rol seçimi (taşıyıcı/müşteri)
- [x] `modules/auth/auth.service.ts` + `auth.store.ts` + `auth.schema.ts` + `auth.type.ts`
- [x] `middleware.ts` — `/panel/*` + `/ilan-ver` korumalı, auth → `/panel/musteri` yönlendir
- [x] `/sifremi-unuttum` + `/sifre-sifirla` (CP-19'da tamamlandı)

---

## CP-6 — Frontend: İlan Akışı `[x]` TAMAMLANDI

- [x] `/ilanlar` — gerçek API (fallback boş dizi), URL-sync filtreler, pagination, loading skeleton
- [x] `/ilanlar/[id]` — detay sayfası, kapasite göstergesi, fiyat hesaplama, rezervasyon formu
- [x] `modules/ilan/ilan.service.ts` — API calls + mock
- [x] `IlanCard` — detay sayfasına link
- [x] `/ilan-ver` — 4 adımlı wizard (güzergah → kapasite/tarih → iletişim → önizleme)

---

## CP-7 — Frontend: Kullanıcı Dashboard `[x]` TAMAMLANDI

*Bağımlılık: CP-5, CP-6*

- [x] `/panel/layout.tsx` — sidebar nav, mobile bottom nav, logout
- [x] `/panel/musteri` — müşteri dashboard (istatistik + rezervasyon listesi, iptal butonu)
- [x] `/panel/tasiyici` — taşıyıcı dashboard (gelen talepler tab + ilanlarım tab, onayla/reddet/iptal)
- [x] `/panel/cuzdan` — bakiye kartı, deposit formu, işlem geçmişi
- [x] `/panel/profil` — isim/telefon güncelleme formu (gerçek `PUT /profiles/me` API)
- [x] `modules/booking/booking.type.ts` + `booking.service.ts`
- [x] `modules/wallet/wallet.type.ts` + `wallet.service.ts`
- [x] `modules/dashboard/dashboard.service.ts`

---

## CP-8 — Frontend: State & API Katmanı `[x]` TAMAMLANDI

*CP-5 ile paralel başlanabilir*

- [x] `lib/api-client.ts` — fetch wrapper (credentials, 401, generic types)
- [x] `frontend/.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:8078`
- [x] Zustand store: auth (persist)
- [x] Ortak UI bileşenleri: `Button`, `Input`, `Badge`, `Skeleton`/`SkeletonCard` — `components/ui/index.ts` barrel

---

## CP-9 — DB Seed & Portfolio `[x]` TAMAMLANDI (2026-03-12)

- [x] `104_ilanlar_schema.sql` — ilanlar + ilan_photos tabloları
- [x] `105_bookings_schema.sql` — bookings tablosu, tüm FK'lar
- [x] `106_ilanlar_seed.sql` — 4 örnek ilan + wallet seed
- [x] `project.portfolio.json` — P2P cargo marketplace olarak güncellendi
- [x] T-6 kapatıldı: `app@localhost` şifresi güncellendi, `x_ilan` DB oluşturuldu
- [x] `seller/controller.ts:191` bozuk try/catch düzeltildi

---

## CP-10 — Booking Akışı & Wallet Deposit `[x]` TAMAMLANDI (2026-03-12)

- [x] `wallet/controller.ts` — `depositWallet` handler: bakiye arttır + transaction kaydet
- [x] `wallet/router.ts` — `POST /wallet/deposit` route (requireAuth)
- [x] `app/ilanlar/[id]/page.tsx` — "Rezerve Et" gerçek booking akışına bağlandı:
  - `useAuthStore` auth kontrol → giriş yoksa `/giris?next=/ilanlar/:id`
  - `createBooking()` API çağrısı; `insufficient_balance` / `capacity` hata mesajları
  - Başarıda `/panel/musteri` yönlendirme

---

## CP-11 — Taşıyıcı Gelen Talepler Paneli `[x]` TAMAMLANDI (2026-03-12)

- [x] `booking.type.ts` — `notes` → `customer_notes` + `carrier_notes` eklendi
- [x] `booking.service.ts` — `getCarrierBookings(status?, page?)` eklendi; `getMyBookings` `role=customer` olarak düzeltildi
- [x] `panel/tasiyici/page.tsx` — tam yeniden yazıldı:
  - "Gelen Talepler" / "İlanlarım" tab sistemi, bekleyen talep badge
  - Pending → Onayla / Reddet; Confirmed → İptal
  - `confirmBooking()` / `cancelBooking()` API entegrasyonu

---

## CP-12 — API Bağlantısı & UX Düzeltmeleri `[x]` TAMAMLANDI (2026-03-12)

- [x] `frontend/.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:8078` (kritik hata düzeltmesi)
- [x] `app/page.tsx` — async server component, gerçek API'den ilanlar (`revalidate: 60`)
- [x] `app/panel/musteri/page.tsx` — pending/confirmed booking'lere İptal butonu, optimistic update
- [x] `app/ilanlar/page.tsx` — başlık "Taşıma İlanları"

---

## CP-13 — Join & Auth UX Düzeltmeleri `[x]` TAMAMLANDI (2026-03-12)

- [x] `bookings/repository.ts` — `repoListBookings` + `repoGetBookingById` `ilanlar` + `users` join: `from_city`, `to_city`, `customer_name`, `carrier_name` döndürüyor
- [x] `components/Header.tsx` — auth-aware (Panel + Çıkış / Giriş Yap + Üye Ol)
- [x] `app/giris/page.tsx` — `?next=` param desteği, `Suspense` wrap

---

## CP-14 — Arama Akışı URL Entegrasyonu `[x]` TAMAMLANDI (2026-03-12)

- [x] `components/HeroSearch.tsx` — "Ara" `router.push(/ilanlar?from=...&to=...&date=...)`; tarih state eklendi
- [x] `app/ilanlar/page.tsx` — `useSearchParams` ile URL param okur; filtre submit `router.replace` ile URL günceller; `Suspense` wrap

---

## CP-15 — Auth-Aware Header + HeroSearch Router Push `[x]` TAMAMLANDI (2026-03-12)

- [x] `components/Header.tsx` — `"use client"` + `useAuthStore`; giriş yapılmışsa "Panel" + "Çıkış", yapılmamışsa "Giriş Yap" + "Üye Ol"; logout `apiLogout` + Zustand `logout`
- [x] `components/HeroSearch.tsx` — "Ara" `<button onClick={handleSearch}>`; `router.push` ile URL param geçirme

---

## Teknik Borç

| ID | Açıklama | Dosya | Durum |
|----|----------|-------|-------|
| T-1 | orderItems.property_id → ilan_id FK | `orders/schema.ts` | ✅ Kapatıldı |
| T-2 | Ilan lookup stub | `orders/controller.ts` | ✅ Kapatıldı |
| T-3 | repoCountActiveListings stub | `subscription/repository.ts` | ✅ Kapatıldı |
| T-4 | Category check stub | `subscription/service.ts` | Açık — PaketJet'te kullanılmıyor |
| T-5 | Scope validation stub | `seller/controller.ts` | Açık — PaketJet'te kullanılmıyor |
| T-6 | DB: `app@localhost` erişim hatası | `.env` | ✅ Kapatıldı |
| T-7 | MOCK_ILANLAR → gerçek API | `ilan.service.ts` | ✅ Kapatıldı |
| T-8 | İlan filtreler static | `app/ilanlar/page.tsx` | ✅ Kapatıldı |

---

## Sıradaki Adımlar (CP-16+)

Tamamlanan altyapı üzerine eklenebilecek özellikler:

### CP-16 — Bildirim Sistemi Frontend `[x]` TAMAMLANDI
- [x] `modules/notification/` — `notification.type.ts`, `notification.service.ts`, `notification.store.ts`
- [x] Header'da bell ikonu + unread count badge (60 sn polling)
- [x] `/panel/bildirimler` sayfası — bildirim listesi, tekil + toplu okundu işaretleme
- [x] Panel sidebar + mobil nav'da unread badge
- [x] `config/routes.ts` — `panel.bildirimler` eklendi

### CP-17 — İlan Yönetimi Geliştirmeleri `[x]` TAMAMLANDI
- [x] `/panel/tasiyici/ilanlar/[id]/duzenle` — pre-fill ilan düzenleme sayfası; tüm alanlar düzenlenebilir; kayıt sonrası panele yönlendir
- [x] `panel/tasiyici/page.tsx` — "İlanlarım" tabına "Düzenle" linki eklendi
- [x] İlan durum değiştirme (Durdur / Aktif Et) zaten çalışıyordu, bağlantı doğrulandı

### CP-18 — Ödeme & Teslimat Akışı `[x]` TAMAMLANDI
- [x] `bookings/controller.ts` — `createBooking`'e `deductForBooking` entegre edildi
- [x] `bookings/controller.ts` — `delivered` durumunda `creditCarrier` çağrısı
- [x] `bookings/controller.ts` — `cancelBooking`'e ödeme iadesi (`refundToCustomer`) eklendi
- [x] `booking.service.ts` — `updateBookingStatus` fonksiyonu eklendi
- [x] `panel/tasiyici` — "Yola Çıktı" (`in_transit`) + "Teslim Edildi" (`delivered`) butonları
- [x] `panel/musteri` — kargo takip step indicator (Onaylandı → Yolda → Teslim)

### CP-19 — Şifre Sıfırlama `[x]` TAMAMLANDI
- [x] `api-endpoints.ts` — path düzeltmeleri (`/api/auth/password-reset/request|confirm`)
- [x] `auth.service.ts` — `forgotPassword` dönüş tipi güncellendi
- [x] `app/sifremi-unuttum/page.tsx` — email formu + başarıda token gösterimi
- [x] `app/sifre-sifirla/page.tsx` — token + yeni şifre + confirm; başarıda login yönlendirme

### CP-20 — Admin Panel Temizliği `[x]` TAMAMLANDI
- [x] `backend/modules/db_admin/` silindi (güvenlik riski)
- [x] `app.ts` — `registerOrders`, `registerSeller`, `registerSubscription`, `registerSubscriptionAdmin` kaldırıldı
- [x] `api-endpoints.ts` — `subscription` key silindi
- [x] `admin.service.ts` — `adminSetUserActive` `apiPatch` → `apiPost` (backend ile uyum); `in_transit` tip eklendi
- [x] `admin/users/page.tsx` — Türkçe rol etiketleri (seller→Taşıyıcı, user→Müşteri), sayfalama eklendi
- [x] `admin/page.tsx` — rezervasyon dağılımı Türkçe etiketler + Yolda satırı eklendi

### CP-21 — Admin Panel Geliştirmeleri `[x]` TAMAMLANDI

**Yeni Sayfa:**
- [x] `/admin/gelir` — aylık gelir bar grafiği (son 12 ay) + top 10 taşıyıcı listesi
- [x] `admin/layout.tsx` — sidebar'a "Gelir 💰" linki eklendi

**Mevcut Sayfa İyileştirmeleri:**
- [x] `admin/bookings/page.tsx` — durum filtresi (chip butonlar), `from_city → to_city` güzergah gösterimi, boş state mesajı
- [x] `admin/ilanlar/page.tsx` — `from_city` şehir arama filtresi + temizle butonu
- [x] `admin/carriers/page.tsx` — aktif/pasif toggle butonu (`adminSetUserActive` ile)

### CP-23 — Tema Sistemi Düzeltmeleri `[x]` TAMAMLANDI (2026-03-13)

*Kaynak: THEMA.md contract analizi (2026-03-13)*

**Kritik Hatalar:**
- [x] **T-23A** `globals.css` — `[data-theme="dark"]` bloğuna `--color-navy*` Tailwind token override'ları eklendi
- [x] **T-23B** `components/Header.tsx` — `"use client"` + `useAuthStore` + `useNotificationStore` + ThemeToggle + bell ikonu geri getirildi
- [x] **T-23C** `app/page.tsx` — async server component + `listIlans()` gerçek API (`revalidate: 60`); boş state mesajı eklendi
- [x] **T-23D** `components/HeroSearch.tsx` — `router.push` + URL param; tarih state'e bağlandı; `Link` → `button`

**Dokümantasyon Düzeltmesi:**
- [ ] `design-system.md` — token adları güncelleme *(düşük öncelikli dokümantasyon borcu)*

---

### CP-22 — Taşıyıcı Değerlendirme Sistemi `[x]` TAMAMLANDI

**Backend:**
- [x] `modules/ratings/schema.ts` — ratings tablosu (`booking_id` unique, 1 booking = 1 değerlendirme)
- [x] `modules/ratings/validation.ts` — `createRatingSchema` (score 1-5, comment optional)
- [x] `modules/ratings/repository.ts` — `repoCreateRating`, `repoGetRatingByBooking`, `repoGetCarrierRatings`, `repoGetCarrierAvgRating`
- [x] `modules/ratings/controller.ts` — `createRating` (auth + delivered check), `getBookingRating`, `getCarrierRatings` (public)
- [x] `modules/ratings/router.ts` — `POST /ratings`, `GET /ratings/booking/:id`, `GET /ratings/carrier/:id`
- [x] `app.ts` — `registerRatings` eklendi
- [x] `107_ratings_schema.sql` — DB migration

**Frontend:**
- [x] `api-endpoints.ts` — `ratings` key eklendi (create, byBooking, byCarrier)
- [x] `modules/rating/rating.type.ts` + `rating.service.ts`
- [x] `panel/musteri/page.tsx` — teslim edilmiş booking'lerde "★ Taşıyıcıyı Değerlendir" butonu; inline yıldız seçici (1-5) + yorum alanı; gönderildikten sonra "✓ Değerlendirdiniz" mesajı; sayfa açılışında mevcut değerlendirme durumu kontrol edilir

---

## CP-24 — Gerçek Ödeme Entegrasyonu (İyzico) `[x]` TAMAMLANDI (2026-03-20)

**Mevcut Durum:**
`POST /wallet/deposit` sadece `amount` alıyor ve bakiyeyi doğrudan artırıyor — sahte deposit.
Frontend `/panel/cuzdan` bu endpoint'i direkt çağırıyor.

**Hedef:** Kullanıcı gerçek kredi kartıyla TL yükleme yapabilsin. Ödeme İyzico üzerinden doğrulansın, ancak o zaman bakiyeye eklensin.

**İyzico Seçim Gerekçesi:** Türkiye'de yerli banka kartları + kredi kartları + BKM Express desteği. Stripe'a kıyasla KDV/BSMV için yerel entegrasyonu hazır.

### Backend

- [x] `modules/wallet/iyzico.ts` — İyzico client wrapper: `createCheckoutForm` + `retrieveCheckoutForm`
- [x] `.env` — `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL` tanımlı
- [x] `modules/wallet/controller.ts` — `initiateDeposit` + `iyzicoCallback` handler'ları
- [x] `modules/wallet/router.ts` — `POST /wallet/deposit/initiate` + `POST /wallet/deposit/callback`
- [x] `walletTransactions.payment_status` — `pending | completed | failed`

### Frontend

- [x] `modules/wallet/wallet.service.ts` — `initiateDeposit(amount)` API çağrısı
- [x] `config/api-endpoints.ts` — `wallet.depositInitiate` + `wallet.depositCallback` path'leri
- [x] `app/panel/cuzdan/page.tsx` — İyzico checkout form modal
- [x] `app/panel/cuzdan/odeme-sonuc/page.tsx` — Ödeme sonuç sayfası

---

## CP-25 — Email Bildirimleri `[x]` TAMAMLANDI

Tüm mail fonksiyonları `mail/service.ts`'te tanımlı, trigger'lar `bookings/notify.ts` + controller'larda entegre.

### Mail Fonksiyonları (tümü tanımlı)

- [x] `sendWelcomeMail` — kayıt sonrası (`auth/controller.ts`)
- [x] `sendPasswordChangedMail` — şifre değişikliği/sıfırlama (`auth/controller.ts`)
- [x] `sendBookingCreatedMail` — booking oluşturulduğunda (`bookings/notify.ts`)
- [x] `sendBookingConfirmedMail` — taşıyıcı onayladığında (`bookings/notify.ts`)
- [x] `sendBookingInTransitMail` — yola çıktığında (`bookings/notify.ts`)
- [x] `sendBookingDeliveredMail` — teslim edildiğinde (`bookings/notify.ts`)
- [x] `sendBookingCancelledMail` — iptal edildiğinde (`bookings/notify.ts`)
- [x] `sendCarrierPaymentMail` — taşıyıcıya ödeme aktarıldığında (`bookings/notify.ts`)
- [x] `sendDepositSuccessMail` — bakiye yükleme onayı (`wallet/controller.ts` — iyzicoCallback + depositWallet)

### SMS (İkinci Faz — Opsiyonel)

- [ ] Netgsm API entegrasyonu — henüz yapılmadı

---

## CP-26 — Harita Entegrasyonu `[x]` TAMAMLANDI

**Teknoloji:** Google Maps API (`@react-google-maps/api`) — mevcut API key kullanıldı.

- [x] `lib/city-coords.ts` — 81 il merkezi koordinat + ASCII alternatifleri
- [x] `components/RouteMap.tsx` — Google Maps bileşeni (Polyline + Marker + fitBounds, dynamic import)
- [x] `app/ilanlar/[id]/page.tsx` — İlan detayında güzergah haritası

---

## CP-27 — SEO `[x]` TAMAMLANDI

- [x] `app/layout.tsx` — `metadataBase`, title template, OG config, keywords
- [x] `app/sitemap.ts` — statik + dinamik ilanlar sitemap (1 saat revalidate)
- [x] `app/robots.ts` — allow `/`, disallow `/panel/`, `/admin/`, `/api/`
- [x] `app/ilanlar/[id]/page.tsx` — `generateMetadata` ile dinamik title/description/OG (server component + client split)

### Yapılmadı (Opsiyonel)

- [ ] `public/og.png` — statik fallback OG görseli
- [ ] `app/ilanlar/[id]/opengraph-image.tsx` — dinamik OG image (ImageResponse)
- [ ] JSON-LD structured data

---

## CP-28 — Performans `[x]` TAMAMLANDI

- [x] `next.config.ts` — `compress: true`, `poweredByHeader: false`, `images.remotePatterns`
- [x] Panel loading.tsx — 5 skeleton (musteri, tasiyici, cuzdan, bildirimler, profil)
- [x] Admin loading.tsx — root skeleton (tüm alt sayfalar için)
- [x] `app/ilanlar/page.tsx` — filtre/sayfa değişikliğinde scroll to top
- [x] `RouteMap` — `dynamic()` ile lazy load (CP-26)
- ~~IlanCard `<img>` → `<Image>`~~ — IlanCard'da img yok (LetterAvatar)
