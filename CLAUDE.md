# CLAUDE.md — PaketJet

## Proje Özeti

PaketJet, P2P kargo pazaryeridir. Taşıyıcılar güzergah/kapasite ilanı açar, müşteriler kargo alanı satın alır (BlaBlaCar modeli, kargo için).

## Workspace Haritası

```
paketjet/
├── backend/          Fastify v5, Bun, MySQL 8 + Drizzle ORM, TypeScript strict
├── frontend/         Next.js 15 App Router, React 19, Tailwind CSS v4, DM Sans
├── doku/             Tasarım dokümanları, plan, token referansları
│   ├── PLAN.md       Ana geliştirme planı (checkpointler)
│   ├── design-system.md  Renk/tipografi/spacing referansı
│   └── tokens.css    CSS custom property referansı
└── sozlesme/         İş/teslimat dokümanları
```

## Teknoloji Stack

### Backend
- **Runtime:** Bun
- **Framework:** Fastify v5
- **DB:** MySQL 8 + Drizzle ORM
- **Auth:** JWT (cookie: `access_token`) + argon2/bcrypt
- **Validation:** Zod
- **Modül pattern:** `router.ts`, `admin.routes.ts`, `controller.ts`, `schema.ts`, `validation.ts`, `service.ts`, `repository.ts`

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS v4, DM Sans font
- **Dark mode:** `data-theme="dark"` attribute (next-themes)
- **Tailwind v4:** `@theme` direktifi `globals.css` içinde — `tailwind.config.ts` yok
- **State:** Zustand
- **Validation:** Zod
- **Modül pattern:** `{feature}.schema.ts`, `{feature}.service.ts`, `{feature}.type.ts`, `{feature}.store.ts`

## Backend Kodlama Standartları

### Modül Dosya Yapısı
```
modules/{modul}/
  schema.ts            — Drizzle tablo tanımları + TypeScript tipler
  validation.ts        — Zod şemaları (input validation)
  repository.ts        — TÜM DB sorguları (read + write), repo* prefix
  controller.ts        — Public route handler'lar (auth gereken + açık)
  admin.controller.ts  — Admin route handler'lar
  service.ts           — İş mantığı (opsiyonel, karmaşık iş akışlarında)
  router.ts            — Public route tanımları (SADECE route kayıtları)
  admin.routes.ts      — Admin route tanımları (SADECE route kayıtları)
```

### Dosya Sorumlulukları

| Dosya | İçerik | Yasak |
|-------|--------|-------|
| `router.ts` | Route tanımları, path + handler eşleştirmesi | İş mantığı, DB sorgusu, validation |
| `admin.routes.ts` | Admin route tanımları | İş mantığı, DB sorgusu, validation |
| `controller.ts` | Public handler fonksiyonları, input parse, repo/service çağrısı | DB sorgusu (SELECT/INSERT/UPDATE/DELETE) |
| `admin.controller.ts` | Admin handler fonksiyonları | DB sorgusu |
| `repository.ts` | Drizzle/SQL sorguları (read + write), `repo*` prefix | İş mantığı, HTTP response |
| `service.ts` | Çoklu repo çağrısı, transaction yönetimi, harici servis | DB sorgusu, HTTP response |
| `schema.ts` | Drizzle tablo tanımları, `Insert`/`Select` type export | İş mantığı |
| `validation.ts` | Zod şemaları, inferred type export | İş mantığı |

### Üst Düzey Dosya Yapısı (backend/src/)
```
src/
  app.ts             — Plugin kayıtları (CORS, JWT, cookie, static, multipart) + orchestrator
  app.helpers.ts     — app.ts yardımcıları (parseCorsOrigins, pickUploadsRoot, pickUploadsPrefix)
  routes.ts          — TÜM modül import'ları + registerAllRoutes (public + admin)
  index.ts           — Sunucu başlatma (createApp + listen)
  core/
    env.ts           — Environment değişkenleri (tek kaynak)
    error.ts         — Global 404 + error handler
    i18n.ts          — Locale normalize + runtime default
  common/
    middleware/       — Auth guard (requireAuth), rol guard (requireAdmin, requireCarrierOrAdmin)
    events/bus.ts     — In-process event bus (audit SSE için)
  plugins/           — Fastify plugin'leri (authPlugin, mysql)
  db/                — Drizzle client + seed SQL dosyaları
  modules/           — İş modülleri (ilanlar, bookings, auth, wallet, ...)
    _shared/         — Ortak helper/type/util barrel
```

### Uygulama Katmanı Kuralları
1. **`app.ts` SADECE plugin kayıtları yapar.** Route import'ı yok, iş mantığı yok. ~100 satırı geçmez.
2. **`routes.ts` TÜM route kayıtlarını içerir.** Yeni modül eklenince SADECE buraya eklenir. Public route'lar `registerPublicRoutes()`, admin route'lar `registerAdminRoutes()` içinde.
3. **`app.helpers.ts`** — app.ts'in kullandığı yardımcı fonksiyonlar (CORS parse, uploads config).
4. **Admin route'lar `routes.ts`'de guard alır.** `requireAuth` + `requireAdmin` hook'ları `routes.ts` içinde `/admin` prefix plugin'ine eklenir. Bireysel `admin.routes.ts` dosyalarında guard TEKRARLANMAZ.

### Kesin Kurallar

1. **Router SADECE route tanımlar.** Handler fonksiyonu router dosyasında OLMAZ. Router dosyası 30 satırı geçmez. Base path `const B = '/xxx';` ile tanımlanır, tüm route'lar `B` üzerinden yazılır.
2. **Controller'da DB sorgusu yok.** Tüm INSERT/SELECT/UPDATE/DELETE `repository.ts`'de.
3. **Repository'de HTTP yok.** `req`/`reply` objeleri repository'ye geçmez.
4. **Repository fonksiyonları `repo` prefix ile başlar.** Örn: `repoGetIlanById`, `repoCreateIlan`, `repoDeleteGallery`.
5. **Dosya boyutu limiti:** Hiçbir dosya 200 satırı geçmez. Geçerse bölünür:
   - Controller → `controller.ts` + `admin.controller.ts`
   - Repository → `repository.ts` + `admin.repository.ts` veya fonksiyon gruplaması
6. **Kod tekrarı yok.** Ortak helper/type/util `_shared/` içinde tanımlanır.
7. **`_shared/index.ts` barrel.** Yeni `_shared/` dosyası eklenince barrel'a eklenir.
8. **`_shared/http.ts` zorunlu import.** Her controller:
   - `getAuthUserId(req)` — JWT'den user id
   - `handleRouteError(reply, req, err, code)` — ZodError + unauthorized + 500
   - `sendNotFound / sendForbidden / sendUnauthorized` — standart hata yanıtları
   - `parsePage(query)` — pagination parse (page, limit, offset)
9. **try/catch her handler'da.** Naked throw yasak, her hata `handleRouteError` ile yakalanır.
10. **UUID:** `import { randomUUID } from "crypto"` ile oluştur.
11. **Decimal:** DB'ye `String(number)` olarak yaz, okurken `parseFloat()`.
12. **Locale fallback:** Default locale `'tr'`. Hardcoded `'de'` veya `'en'` fallback YASAK.

### Örnek Router (router.ts)
```typescript
import type { FastifyInstance } from 'fastify';
import { listGalleries, getGalleryBySlug } from './controller';

export async function registerGallery(app: FastifyInstance) {
  const B = '/galleries';
  app.get(B, listGalleries);
  app.get(`${B}/:slug`, getGalleryBySlug);
}
```

### Örnek Admin Routes (admin.routes.ts)
```typescript
import type { FastifyInstance } from 'fastify';
import { adminListGalleries, adminGetGallery, adminCreateGallery, adminUpdateGallery, adminDeleteGallery } from './admin.controller';

export async function registerGalleryAdmin(app: FastifyInstance) {
  const B = '/galleries';
  app.get(B, adminListGalleries);
  app.get(`${B}/:id`, adminGetGallery);
  app.post(B, adminCreateGallery);
  app.put(`${B}/:id`, adminUpdateGallery);
  app.delete(`${B}/:id`, adminDeleteGallery);
}
```

### Örnek Controller Handler
```typescript
import { handleRouteError, parsePage } from "@/modules/_shared/http";
import { repoListGalleries } from "./repository";

export async function listGalleries(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string>;
    const { page, limit, offset } = parsePage(q);
    const result = await repoListGalleries({ locale: q.locale, limit, offset });
    reply.header('x-total-count', result.total);
    return reply.send(result.items);
  } catch (e) {
    return handleRouteError(reply, req, e, "list_galleries");
  }
}
```

### Örnek Repository
```typescript
import { db } from '@/db/client';
import { eq, sql } from 'drizzle-orm';
import { galleries } from './schema';

export async function repoListGalleries(params: { locale?: string; limit: number; offset: number }) {
  // SELECT sorgusu
}

export async function repoCreateGallery(data: NewGallery) {
  // INSERT sorgusu — controller'da değil, burada
}

export async function repoDeleteGallery(id: string) {
  // DELETE sorgusu
}
```

## Çalışma Kuralları

- Renk sınıfları token tabanlı kullanılır: `bg-brand`, `text-foreground`, `bg-surface` — direkt hex/hsl kullanma.
- Dark mode testi `data-theme="dark"` ile yapılır, class ile değil.
- Yeni backend modülü eklenince `routes.ts`'e register edilir (app.ts'e değil).
- Yeni frontend sayfası eklenince `config/routes.ts`'e route sabiti eklenir.
- API endpoint eklenince `config/api-endpoints.ts`'e eklenir.
- Portfolio metadata değişince `project.portfolio.json` güncellenir.

---

## Geliştirme Planı & Checkpoint Takibi

> Detaylı görev listesi: `doku/PLAN.md`

### Durum Efsanesi
- `[ ]` Yapılacak
- `[~]` Devam ediyor
- `[x]` Tamamlandı

---

### Tamamlanan İşler

#### Backend Temizliği (2026-03-12)
- [x] 30 fazla modül silindi (productspark kalıntıları)
- [x] 6 kırık bağımlılık düzeltildi:
  - `orders/controller.ts` — properties import kaldırıldı, ilan lookup stublandı
  - `orders/schema.ts` — property_id FK stublandı (TODO: CP-1 sonrası)
  - `subscription/repository.ts` — properties import kaldırıldı, listing count stub
  - `subscription/service.ts` — categories import kaldırıldı, category check stub
  - `seller/controller.ts` — properties import kaldırıldı, scope validation stub
  - `_shared/aiChain.ts` — silindi (yalnızca silinen ai_chat modülü kullanıyordu)
- [x] `backend/package.json` adı `paketjet-backend` yapıldı
- [x] `backend/src/app.ts` temizlendi — 16 aktif modül, 0 kırık import

#### Backend Geliştirme (2026-03-12)
- [x] `_shared/http.ts` oluşturuldu — `getAuthUserId`, `handleRouteError`, `parsePage`, `sendNotFound/Forbidden/Unauthorized` barrel'a eklendi
- [x] `modules/ilanlar/` modülü tamamlandı (schema, validation, repository, controller, router, admin.routes)
- [x] `modules/bookings/` modülü tamamlandı (schema, validation, repository, controller, router, admin.routes)
- [x] T-3 kapatıldı: `subscription/repository.ts` → `repoCountActiveListings` gerçek ilanlar sorgusu
- [x] `app.ts` güncellendi: ilanlar + bookings (public + admin) register edildi
- [x] Backend kodlama standartları CLAUDE.md'ye yazıldı

#### Frontend Geliştirme (2026-03-12)
- [x] `zustand@5` kuruldu
- [x] `lib/api-client.ts` — fetch wrapper (credentials, 401, generic types)
- [x] `config/api-endpoints.ts` — path tabanlı yeniden yazıldı, yeni endpoint'ler eklendi
- [x] `modules/ilan/ilan.type.ts` — backend schema ile uyumlu yeni tip sistemi
- [x] `modules/ilan/ilan.service.ts` — gerçek API çağrıları + mock data
- [x] `modules/auth/auth.type.ts` + `auth.schema.ts` + `auth.service.ts` + `auth.store.ts`
- [x] `app/giris/page.tsx` — login sayfası (Zod validate, server error, loading state)
- [x] `app/uye-ol/page.tsx` — kayıt sayfası (rol seçimi, form validation)
- [x] `IlanCard.tsx` — yeni Ilan tipine güncellendi (kg müsait, fiyat/kg, araç tipi)

#### Frontend Kurulum (2026-03-12)
- [x] Design system oluşturuldu (`doku/design-system.md`, `doku/tokens.css`)
- [x] Tailwind v4 `@theme` token sistemi — `globals.css`
- [x] Dark mode: `data-theme` attribute, `@custom-variant dark`
- [x] `layout.tsx` — DM Sans font, ThemeProvider
- [x] `providers/theme-provider.tsx` — next-themes wrapper
- [x] `config/routes.ts` — tüm route sabitleri
- [x] `config/api-endpoints.ts` — tüm backend endpoint sabitleri
- [x] `lib/utils.ts` — `cn()`, `maskName()`, `formatDate()`, `formatKg()`
- [x] `modules/ilan/ilan.schema.ts` — Zod şemaları
- [x] Bileşenler token sınıflarına geçirildi: `Header`, `IlanCard`, `HeroSearch`

---

### CP-1 — Backend: `ilanlar/` Modülü `[x]` TAMAMLANDI

Taşıyıcıların güzergah/kapasite ilanı açtığı temel modül.

- [ ] `ilanlar/schema.ts` — ilanlar + ilan_photos tabloları
- [ ] `ilanlar/validation.ts` — createIlan, updateIlan, searchIlans Zod şemaları
- [ ] `ilanlar/repository.ts` — CRUD + kapasite düşme fonksiyonu
- [ ] `ilanlar/controller.ts` + `ilanlar/router.ts` — public liste/detay, auth CRUD
- [ ] `ilanlar/admin.routes.ts` — admin liste/durum/silme
- [ ] `app.ts` entegrasyonu

**Bitirilince:** T-1, T-2, T-3, T-4, T-5 teknik borçları kapatılacak.

---

### CP-2 — Backend: `bookings/` Modülü `[x]` TAMAMLANDI

*Bağımlılık: CP-1*

- [x] `bookings/schema.ts` — bookings tablosu
- [x] `bookings/repository.ts` + `bookings/controller.ts` + `bookings/router.ts`
- [x] Kapasite kontrolü + `repoDeductCapacity` + `repoRestoreCapacity`
- [x] Notification tetikleyicileri (oluşturma, onay, teslim, iptal)
- [x] Admin routes

---

### CP-3 — Backend: Mevcut Modül Düzeltmeleri `[x]` TAMAMLANDI

*Bağımlılık: CP-1*

- [x] **3A** `orders/` — validation `property_id → ilan_id`, controller gerçek ilanlar lookup
- [x] **3B** `seller/` — `getUserId` kaldırıldı, `getAuthUserId` + `handleRouteError` kullanıyor
- [x] **3C** `subscription/` — T-3 kapatıldı (önceki oturumda)
- [x] **3D** `wallet/service.ts` — `deductForBooking`, `creditCarrier`, `refundToCustomer`
- [x] **3E** `notifications/` — booking event trigger'ları bookings/controller içinde
- [x] **3F** `dashboard/` — admin stats gerçek, yeni `dashboard/router.ts` (carrier + customer)

---

### CP-4 — Backend: Admin Panel Routes `[x]` TAMAMLANDI

*Bağımlılık: CP-1, CP-2*

- [x] `/admin/ilanlar` — filtreli liste (status/user_id/şehir), durum değiştirme, silme
- [x] `/admin/bookings` — liste (status/customer/carrier filtre), detay, admin durum değiştirme
- [x] `/admin/carriers` — ilan veren kullanıcılar + ilan_count + booking_count
- [x] `/admin/dashboard/stats/revenue` — aylık gelir (son 12 ay) + top 10 taşıyıcı
- [x] `/admin/dashboard/stats/activity` — son 30 gün günlük aktivite (user/ilan/booking)
- [x] Frontend admin panel: `/admin` özet, `/admin/ilanlar`, `/admin/bookings`, `/admin/carriers`, `/admin/users`
- [x] Admin layout: sidebar nav
- [x] `modules/admin/admin.service.ts` — tüm admin API çağrıları
- [x] middleware.ts güncellendi: `/admin/*` korumalı

---

### CP-5 — Frontend: Auth Sayfaları `[x]` TAMAMLANDI

- [x] `/giris` — login formu, hata state, Zustand store bağlantısı
- [x] `/uye-ol` — kayıt formu, rol seçimi (taşıyıcı/müşteri)
- [x] `modules/auth/auth.service.ts` + `auth.store.ts` + `auth.schema.ts` + `auth.type.ts`
- [x] `middleware.ts` — `/panel/*` + `/ilan-ver` korumalı, auth → `/panel/musteri` yönlendir
- [ ] `/sifremi-unuttum` + `/sifre-sifirla` (opsiyonel)

---

### CP-6 — Frontend: İlan Akışı `[x]` TAMAMLANDI

- [x] `/ilanlar` — gerçek API (fallback mock), filtreler çalışır, pagination, loading skeleton
- [x] `/ilanlar/[id]` — detay sayfası, kapasite göstergesi, fiyat hesaplama, rezervasyon formu
- [x] `modules/ilan/ilan.service.ts` — API calls + mock
- [x] `IlanCard` — detay sayfasına link
- [x] `/ilan-ver` — 4 adımlı wizard (güzergah → kapasite/tarih → iletişim → önizleme)

---

### CP-7 — Frontend: Kullanıcı Dashboard `[x]` TAMAMLANDI

*Bağımlılık: CP-5, CP-6*

- [x] `/panel/layout.tsx` — sidebar nav, mobile bottom nav, logout
- [x] `/panel/musteri` — müşteri dashboard (istatistik + rezervasyon listesi)
- [x] `/panel/tasiyici` — taşıyıcı dashboard (istatistik + ilan listesi, aktif/durdur/sil)
- [x] `/panel/cuzdan` — bakiye kartı, deposit formu, işlem geçmişi
- [x] `/panel/profil` — isim/telefon güncelleme formu
- [x] `modules/booking/booking.type.ts` + `booking.service.ts`
- [x] `modules/wallet/wallet.type.ts` + `wallet.service.ts`
- [x] `modules/dashboard/dashboard.service.ts`

---

### CP-8 — Frontend: State & API Katmanı `[x]` TAMAMLANDI

*CP-5 ile paralel başlanabilir*

- [x] `lib/api-client.ts` — fetch wrapper (credentials, 401, generic types)
- [x] Zustand store: auth (persist)
- [x] Ortak UI bileşenleri: `Button`, `Input`, `Badge`, `Skeleton`/`SkeletonCard` — `components/ui/index.ts` barrel

---

## Teknik Borç

| ID | Açıklama | Dosya | Durum |
|----|----------|-------|-------|
| T-1 | orderItems.property_id → ilan_id FK | `orders/schema.ts` | ✅ Kapatıldı |
| T-2 | Ilan lookup stub | `orders/controller.ts` | ✅ Kapatıldı |
| T-3 | repoCountActiveListings stub | `subscription/repository.ts` | ✅ Kapatıldı |
| T-4 | Category check stub | `subscription/service.ts` | Açık — subscription modülü PaketJet'te kullanılmıyor |
| T-5 | Scope validation stub | `seller/controller.ts` | Açık — seller modülü PaketJet'te kullanılmıyor |
| T-6 | DB: `app@localhost` erişim hatası | `.env` | ✅ Kapatıldı — şifre güncellendi, x_ilan DB oluşturuldu |
| T-7 | MOCK_ILANLAR → gerçek API | `ilan.service.ts` | ✅ Kapatıldı (fallback olarak kaldı) |
| T-8 | İlan filtreler static | `app/ilanlar/page.tsx` | ✅ Kapatıldı |

---

## CP-9 — DB Seed & Portfolio `[x]` TAMAMLANDI (2026-03-12)

- [x] `104_ilanlar_schema.sql` — ilanlar + ilan_photos tabloları (CREATE IF NOT EXISTS)
- [x] `105_bookings_schema.sql` — bookings tablosu, tüm FK'lar
- [x] `106_ilanlar_seed.sql` — 4 örnek ilan (SELLER kullanıcısından) + wallet seed
- [x] `project.portfolio.json` — P2P cargo marketplace olarak güncellendi, tüm feature'lar ve stack eklendi
- [x] T-6 kapatıldı: `app@localhost` şifresi güncellendi, `x_ilan` DB oluşturuldu, yetki verildi
- [x] `seller/controller.ts:191` bozuk try/catch düzeltildi (parse hatası backend'i başlatmıyordu)

---

## CP-10 — Booking Akışı & Wallet Deposit `[x]` TAMAMLANDI (2026-03-12)

- [x] `wallet/controller.ts` — `depositWallet` handler eklendi (`POST /wallet/deposit`): bakiye arttır + transaction kaydet
- [x] `wallet/router.ts` — `POST /wallet/deposit` route'u eklendi (requireAuth)
- [x] `wallet/controller.ts` — `getMyWallet` + `listMyTransactions` `getAuthUserId` + `handleRouteError` standardına alındı
- [x] `app/ilanlar/[id]/page.tsx` — "Rezerve Et" gerçek booking akışına bağlandı:
  - `useAuthStore` ile auth durumu kontrol
  - Giriş yapılmamışsa `/giris?next=/ilanlar/:id` yönlendirme
  - `createBooking()` API çağrısı (kg, notlar)
  - `insufficient_balance` / `capacity` hata mesajları
  - Başarıda `/panel/musteri` yönlendirme
  - "Not" alanı eklendi (opsiyonel)

---

## CP-11 — Taşıyıcı Gelen Talepler Paneli `[x]` TAMAMLANDI (2026-03-12)

- [x] `booking.type.ts` — `notes` → `customer_notes` + `carrier_notes` alanı eklendi
- [x] `booking.service.ts` — `getCarrierBookings(status?, page?)` eklendi (`role=carrier` query param), `getMyBookings` de `role=customer` olarak düzeltildi
- [x] `ilanlar/[id]/page.tsx` — `notes` → `customer_notes` field düzeltmesi
- [x] `panel/tasiyici/page.tsx` — tam yeniden yazıldı:
  - "Gelen Talepler" / "İlanlarım" tab sistemi
  - Bekleyen talep sayısı badge olarak gösteriliyor
  - Her talep: güzergah, kg, fiyat, müşteri adı, tarih, müşteri notu
  - Pending → Onayla / Reddet butonları
  - Confirmed → İptal butonu
  - `confirmBooking()` / `cancelBooking()` API entegrasyonu

---

## CP-12 — API Bağlantısı & UX Düzeltmeleri `[x]` TAMAMLANDI (2026-03-12)

- [x] `frontend/.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:8078` (kritik: default 4000'di)
- [x] `app/page.tsx` — async server component, gerçek API'den ilanlar çekiyor (`revalidate: 60`), hata durumunda boş dizi fallback
- [x] `app/panel/musteri/page.tsx` — pending/confirmed booking'lere İptal butonu eklendi, optimistic state update
- [x] `app/ilanlar/page.tsx` — başlık "İlan Sayfası" → "Taşıma İlanları"

---

## CP-13 — Join & Auth UX Düzeltmeleri `[x]` TAMAMLANDI (2026-03-12)

- [x] `bookings/repository.ts` — `repoListBookings` + `repoGetBookingById` artık `ilanlar` + `users` join yapıyor: `from_city`, `to_city`, `customer_name`, `carrier_name` (carrier için subquery) döndürüyor
- [x] `components/Header.tsx` — `"use client"` oldu, `useAuthStore` ile auth durumunu izliyor:
  - Giriş yapılmamış → "Giriş Yap" + "Üye Ol"
  - Giriş yapılmış → "Panel" + "Çıkış" butonu
  - Nav linkleri "İlanlar" + "Kargo Gönder" olarak güncellendi
- [x] `app/giris/page.tsx` — `useSearchParams` ile `?next=` parametresi desteklendi; başarılı girişten sonra `next` path'e (default: `/panel/musteri`) yönlendiriyor; `Suspense` ile wrap edildi

---

## CP-14 — Arama Akışı URL Entegrasyonu `[x]` TAMAMLANDI (2026-03-12)

- [x] `components/HeroSearch.tsx` — "Ara" butonu `<form onSubmit>` ile `router.push(/ilanlar?from=...&to=...&date=...)` yapar; tarih inputu state'e bağlandı
- [x] `app/ilanlar/page.tsx` — `useSearchParams` ile URL param okur, initial state URL'den gelir; filtre submit'te `router.replace` ile URL güncellenir; `MOCK_ILANLAR` kaldırıldı (error durumunda boş dizi); `Suspense` wrap eklendi

---

## CP-15 — Auth-Aware Header + HeroSearch Router Push `[x]` TAMAMLANDI (2026-03-12)

- [x] `components/Header.tsx` — `"use client"` + `useAuthStore` ile auth-aware: giriş yapmış kullanıcıya "Panel" + "Çıkış" butonu, giriş yapmayana "Giriş Yap" + "Üye Ol" gösterir; Çıkış handler'ı `apiLogout` + Zustand `logout` çağırır
- [x] `components/HeroSearch.tsx` — "Ara" butonu `<Link>` yerine `<button onClick={handleSearch}>`; `router.push(/ilanlar?from=...&to=...&date=...)` ile URL param geçirir; tarih state'i (`tarih`) eklendi

---

## CP-16 — Bildirim Sistemi Frontend `[x]` TAMAMLANDI (2026-03-12)

- [x] `modules/notification/notification.type.ts` — `Notification`, `NotificationListResponse`, `UnreadCountResponse` tipleri
- [x] `modules/notification/notification.service.ts` — `getNotifications`, `getUnreadCount`, `markRead`, `markAllRead` API çağrıları
- [x] `modules/notification/notification.store.ts` — Zustand store: `unreadCount`, `fetchUnreadCount`, 60 sn interval polling, `decrement`, `reset`
- [x] `components/Header.tsx` — bell ikonu + unread count badge; `useEffect` ile 60 sn interval yenileme; logout'ta `reset()`
- [x] `app/panel/bildirimler/page.tsx` — bildirim listesi, okunmamış mavi vurgulu, tekil "Okundu" + "Tümünü okundu işaretle"
- [x] `app/panel/layout.tsx` — "Bildirimler" nav eklendi; sidebar + mobil nav'da unread badge
- [x] `config/routes.ts` — `panel.bildirimler: "/panel/bildirimler"` eklendi

---

## CP-17 — İlan Yönetimi Geliştirmeleri `[x]` TAMAMLANDI (2026-03-12)

- [x] `app/panel/tasiyici/ilanlar/[id]/duzenle/page.tsx` — ilan düzenleme sayfası: mevcut veri pre-fill, tüm alanlar düzenlenebilir (güzergah / kapasite & tarih / iletişim & detay), `updateIlan(id, form)` ile PUT, kayıt sonrası `/panel/tasiyici` yönlendirme
- [x] `app/panel/tasiyici/page.tsx` — "İlanlarım" tabına "Düzenle" linki eklendi (`/panel/tasiyici/ilanlar/:id/duzenle`)

---

## CP-18 — Ödeme & Teslimat Akışı `[x]` TAMAMLANDI (2026-03-12)

### Backend
- [x] `bookings/controller.ts` — `createBooking`: `deductForBooking` entegre edildi; ödeme durumu `paid` olarak işaretleniyor
- [x] `bookings/controller.ts` — `updateBookingStatus` delivered: `creditCarrier` çağrısı eklendi; taşıyıcıya ödeme aktarımı gerçekleşiyor
- [x] `bookings/controller.ts` — `cancelBooking`: ödeme yapılmışsa (`payment_status === "paid"`) `refundToCustomer` + durum `refunded`

### Frontend
- [x] `modules/booking/booking.service.ts` — `updateBookingStatus(id, status, carrier_notes?)` eklendi
- [x] `app/panel/tasiyici/page.tsx` — Onaylanmış booking'e "Yola Çıktı" (→ `in_transit`) + "İptal"; yolda olana "Teslim Edildi" (→ `delivered`, confirm dialog)
- [x] `app/panel/musteri/page.tsx` — `confirmed`/`in_transit`/`delivered` için kargo takip step indicator (Onaylandı → Yolda → Teslim); teslim edilen kartlar yeşil border

---

## CP-19 — Şifre Sıfırlama `[x]` TAMAMLANDI (2026-03-12)

- [x] `config/api-endpoints.ts` — `forgotPassword` + `resetPassword` path'leri backend gerçek route'larına düzeltildi (`/api/auth/password-reset/request` + `/api/auth/password-reset/confirm`)
- [x] `modules/auth/auth.service.ts` — `forgotPassword` dönüş tipi `{ success, token? }` olarak güncellendi
- [x] `app/sifremi-unuttum/page.tsx` — email formu; başarıda backend'den dönen token gösterimi + doğrudan şifre sıfırlama sayfasına link
- [x] `app/sifre-sifirla/page.tsx` — token (URL param'dan pre-fill) + yeni şifre + şifre tekrar; başarıda 2.5 sn sonra giriş sayfasına yönlendirme; `Suspense` wrap

---

## CP-20 — Admin Panel Temizliği & PaketJet Uyumu `[x]` TAMAMLANDI (2026-03-12)

### Silinen / Kaldırılan
- [x] `backend/src/modules/db_admin/` — tüm dizin silindi (güvenlik riski, PaketJet dışı)
- [x] `backend/src/app.ts` — `registerOrders`, `registerSeller`, `registerSubscription` kaldırıldı (stub modüller, PaketJet'te kullanılmıyor)
- [x] `backend/src/app.ts` — `registerSubscriptionAdmin` kaldırıldı (SaaS plan yönetimi, PaketJet'e uygun değil)
- [x] `frontend/src/config/api-endpoints.ts` — `subscription` key silindi (hiçbir sayfa kullanmıyor)

### Admin Panel Düzeltmeleri
- [x] `modules/admin/admin.service.ts` — `adminSetUserActive` → `apiPatch` yerine `apiPost` (backend `POST /admin/users/:id/active`)
- [x] `modules/admin/admin.service.ts` — `AdminSummary.booking_stats` tipine `in_transit` eklendi
- [x] `app/admin/users/page.tsx` — rol etiketleri Türkçeleştirildi: `seller` → Taşıyıcı, `user` → Müşteri, `admin` → Admin, `moderator` → Moderatör; hard limit 50 → sayfalama (limit: 20) eklendi
- [x] `app/admin/page.tsx` — rezervasyon dağılımı İngilizce key'ler yerine Türkçe etiketler; `in_transit → Yolda` satırı eklendi

---

## 4 Aracli Orkestrasyon

Bu projede 4 arac orkestra halinde calisir:

| Arac | Rol | Dosya |
|------|-----|-------|
| **Claude Code** | Mimar / Stratejist | Bu dosya (`CLAUDE.md`) + `.claude/agents/` |
| **Codex** | Insaat Ekibi | `AGENTS.md` + `.codex/skills/` |
| **Antigravity** | Dogrulayici / UI Test | `docs/antigravity-kb.md` |
| **Copilot** | Refleks / Autocomplete | `.github/copilot-instructions.md` |

### Cakisma Onleme
1. Ayni dosya uzerinde ayni anda iki arac calistirma
2. Is akisi: Claude Code tasarla → Codex implement et → Antigravity dogrula → Copilot cilala
3. Codex cloud sandbox'ta calisirken Antigravity ayni branch'e dokunmaz
4. `project.portfolio.json` sadece Claude Code degistirir

### Referans Dokumanlar
- `AGENTS.md` — Codex workspace talimatlari
- `.codex/skills/` — Codex projeye ozel skill'leri
- `.github/copilot-instructions.md` — Copilot kurallari
- `docs/antigravity-kb.md` — Antigravity dogrulama rehberi
- `docs/remaining-work-plan.md` — Kalan isler plani
- `docs/orkestra-sefi-rehberi.md` — Orkestra sefi icin hazir promptlar
