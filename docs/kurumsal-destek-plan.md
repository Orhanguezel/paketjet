# PaketJet — Kurumsal & Destek Sayfalari Mimari Plan

Tarih: 2026-03-21
Hazirlayan: Claude Code (mimari)
Uygulayici: Codex (backend + frontend)
Dogrulayici: Antigravity (gorsel + fonksiyonel)

---

## 1. Kapsam

Uc yeni alan ekleniyor:

| Alan | Modul | Aciklama |
|------|-------|----------|
| Kurumsal Sayfalar | `customPages` | Hakkimizda, Gizlilik, KVKK, Kullanim Kosullari vb. |
| Destek | `support` | SSS (FAQ) + Destek talep formu |
| Iletisim Sayfasi | `contact` (mevcut) | Public iletisim formu (frontend eksik) |

---

## 2. Veritabani Semalari

### 2.1 customPages (YENi)

Bereketfide'deki two-table i18n modeli, PaketJet'e sadeleştirilmis hali:

```sql
-- custom_pages (dil-bagimsiz)
CREATE TABLE IF NOT EXISTS custom_pages (
  id            VARCHAR(36) PRIMARY KEY,
  module_key    VARCHAR(100) NOT NULL DEFAULT 'kurumsal',
  is_published  TINYINT NOT NULL DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  featured_image VARCHAR(500) DEFAULT NULL,
  storage_asset_id VARCHAR(36) DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- custom_pages_i18n (dil-spesifik)
CREATE TABLE IF NOT EXISTS custom_pages_i18n (
  page_id       VARCHAR(36) NOT NULL,
  locale        VARCHAR(10) NOT NULL DEFAULT 'tr',
  title         VARCHAR(500) NOT NULL,
  slug          VARCHAR(500) NOT NULL,
  content       LONGTEXT DEFAULT NULL,
  summary       TEXT DEFAULT NULL,
  meta_title    VARCHAR(255) DEFAULT NULL,
  meta_description VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (page_id, locale),
  UNIQUE KEY ux_cp_i18n_locale_slug (locale, slug),
  FOREIGN KEY (page_id) REFERENCES custom_pages(id) ON DELETE CASCADE
);
```

**module_key degerleri:** `kurumsal`, `yasal`, `yardim`

### 2.2 support (YENi)

Iki tablo: SSS + Destek talepleri

```sql
-- support_faqs (SSS)
CREATE TABLE IF NOT EXISTS support_faqs (
  id            VARCHAR(36) PRIMARY KEY,
  category      VARCHAR(100) NOT NULL DEFAULT 'genel',
  display_order INT NOT NULL DEFAULT 0,
  is_published  TINYINT NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_faqs_i18n (
  faq_id        VARCHAR(36) NOT NULL,
  locale        VARCHAR(10) NOT NULL DEFAULT 'tr',
  question      VARCHAR(500) NOT NULL,
  answer        TEXT NOT NULL,
  PRIMARY KEY (faq_id, locale),
  FOREIGN KEY (faq_id) REFERENCES support_faqs(id) ON DELETE CASCADE
);

-- support_tickets (Destek talepleri)
CREATE TABLE IF NOT EXISTS support_tickets (
  id            VARCHAR(36) PRIMARY KEY,
  user_id       VARCHAR(36) DEFAULT NULL,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  subject       VARCHAR(255) NOT NULL,
  message       TEXT NOT NULL,
  category      VARCHAR(100) NOT NULL DEFAULT 'genel',
  status        VARCHAR(20) NOT NULL DEFAULT 'open',
  priority      VARCHAR(20) NOT NULL DEFAULT 'normal',
  admin_note    TEXT DEFAULT NULL,
  ip            VARCHAR(64) DEFAULT NULL,
  user_agent    VARCHAR(500) DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_st_status (status),
  INDEX idx_st_category (category),
  INDEX idx_st_created (created_at)
);
```

**support_tickets.status:** `open`, `in_progress`, `resolved`, `closed`
**support_tickets.priority:** `low`, `normal`, `high`, `urgent`
**support_tickets.category:** `genel`, `kargo`, `odeme`, `hesap`, `teknik`

### 2.3 contact (MEVCUT — degisiklik yok)

Backend modulu zaten var. Sadece frontend public sayfa ekleniyor.

---

## 3. API Endpoint Haritasi

### 3.1 customPages

| Method | Path | Auth | Aciklama |
|--------|------|------|----------|
| GET | `/api/custom-pages` | Public | Sayfa listesi (module_key, locale filtre) |
| GET | `/api/custom-pages/:id` | Public | Sayfa detay (id) |
| GET | `/api/custom-pages/by-slug/:slug` | Public | Sayfa detay (slug) |
| GET | `/api/admin/custom-pages` | Admin | Admin liste (tum sayfalar, draft dahil) |
| GET | `/api/admin/custom-pages/:id` | Admin | Admin detay |
| POST | `/api/admin/custom-pages` | Admin | Sayfa olustur |
| PATCH | `/api/admin/custom-pages/:id` | Admin | Sayfa guncelle |
| DELETE | `/api/admin/custom-pages/:id` | Admin | Sayfa sil |
| POST | `/api/admin/custom-pages/reorder` | Admin | Siralama guncelle |

### 3.2 support

| Method | Path | Auth | Aciklama |
|--------|------|------|----------|
| GET | `/api/support/faqs` | Public | SSS listesi (category, locale filtre) |
| POST | `/api/support/tickets` | Public | Destek talebi olustur |
| GET | `/api/support/tickets/my` | Auth | Kendi taleplerim |
| GET | `/api/admin/support/faqs` | Admin | SSS admin listesi |
| POST | `/api/admin/support/faqs` | Admin | SSS olustur |
| PATCH | `/api/admin/support/faqs/:id` | Admin | SSS guncelle |
| DELETE | `/api/admin/support/faqs/:id` | Admin | SSS sil |
| POST | `/api/admin/support/faqs/reorder` | Admin | SSS siralama |
| GET | `/api/admin/support/tickets` | Admin | Tum talepler (filtreli) |
| GET | `/api/admin/support/tickets/:id` | Admin | Talep detay |
| PATCH | `/api/admin/support/tickets/:id` | Admin | Talep guncelle (status, note) |
| DELETE | `/api/admin/support/tickets/:id` | Admin | Talep sil |

### 3.3 contact (MEVCUT)

Endpoint'ler zaten mevcut. Frontend sayfasi ekleniyor.

---

## 4. Frontend Sayfa Haritasi

### 4.1 Public Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Hakkimizda | `/hakkimizda` | customPages slug: `hakkimizda` |
| Gizlilik | `/gizlilik-politikasi` | customPages slug: `gizlilik-politikasi` |
| KVKK | `/kvkk` | customPages slug: `kvkk` |
| Kullanim Kosullari | `/kullanim-kosullari` | customPages slug: `kullanim-kosullari` |
| Destek | `/destek` | SSS + destek talep formu |
| Iletisim | `/iletisim` | Contact form (mevcut backend'e POST) |

### 4.2 Admin Sayfalar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Sayfalar | `/admin/sayfalar` | customPages CRUD listesi |
| Sayfa Duzenle | `/admin/sayfalar/[id]` | Detay/duzenleme formu |
| Sayfa Olustur | `/admin/sayfalar/yeni` | Yeni sayfa formu |
| Destek Talepleri | `/admin/destek` | Support tickets listesi |
| Destek Detay | `/admin/destek/[id]` | Ticket detay + admin note |
| SSS Yonetimi | `/admin/destek/sss` | FAQ CRUD listesi |

### 4.3 Admin Nav Guncellemesi

```typescript
// layout.tsx NAV dizisine eklenecek:
{ href: "/admin/sayfalar", label: "Sayfalar", icon: "📄" },
{ href: "/admin/destek",   label: "Destek",   icon: "🎧" },
```

### 4.4 Footer Guncellemesi

Anasayfa footer'ina kurumsal linkler eklenir:
- Hakkimizda, Gizlilik, KVKK, Kullanim Kosullari, Iletisim, Destek

---

## 5. Backend Dosya Haritasi

### 5.1 customPages modulu

```
backend/src/modules/customPages/
  schema.ts              — custom_pages + custom_pages_i18n Drizzle tablolari
  validation.ts          — Zod semalari (list, create, update, reorder)
  repository.ts          — CRUD + i18n coalesce sorgulari
  controller.ts          — Public: list, getById, getBySlug
  admin.controller.ts    — Admin: list, get, create, update, delete, reorder
  router.ts              — Public route tanimlari
  admin.routes.ts        — Admin route tanimlari
  index.ts               — Barrel export
```

### 5.2 support modulu

```
backend/src/modules/support/
  schema.ts              — support_faqs + support_faqs_i18n + support_tickets
  validation.ts          — Zod semalari
  repository.ts          — FAQ CRUD + ticket CRUD
  controller.ts          — Public: listFaqs, createTicket, myTickets
  admin.controller.ts    — Admin: FAQ CRUD + ticket yonetimi
  router.ts              — Public routes
  admin.routes.ts        — Admin routes
  index.ts               — Barrel export
```

### 5.3 routes.ts guncellemesi

```typescript
// Yeni importlar
import { registerCustomPages, registerCustomPagesAdmin } from '@/modules/customPages';
import { registerSupport, registerSupportAdmin } from '@/modules/support';

// PUBLIC_ROUTE_REGISTRARS'a ekle
registerCustomPages,
registerSupport,

// ADMIN_ROUTE_REGISTRARS'a ekle
registerCustomPagesAdmin,
registerSupportAdmin,
```

### 5.4 Seed SQL dosyalari

```
backend/src/db/seed/sql/
  115_custom_pages_schema.sql      — CREATE TABLE custom_pages + i18n
  116_support_schema.sql           — CREATE TABLE support_faqs + i18n + tickets
  117_custom_pages_seed.sql        — Ornek kurumsal sayfalar (hakkimizda, gizlilik, kvkk, kosullar)
  118_support_faqs_seed.sql        — Ornek SSS (5-10 soru/cevap)
```

---

## 6. Frontend Dosya Haritasi

### 6.1 Public sayfalar

```
frontend/src/app/
  hakkimizda/page.tsx              — Static slug render
  gizlilik-politikasi/page.tsx     — Static slug render
  kvkk/page.tsx                    — Static slug render
  kullanim-kosullari/page.tsx      — Static slug render
  destek/page.tsx                  — FAQ accordion + ticket form
  iletisim/page.tsx                — Contact form
```

### 6.2 Modul dosyalari

```
frontend/src/modules/
  customPage/
    customPage.type.ts             — CustomPage, CustomPageList tipleri
    customPage.service.ts          — API calls (getBySlug, list)
  support/
    support.type.ts                — FAQ, Ticket tipleri
    support.service.ts             — API calls (listFaqs, createTicket, myTickets)
  contact/
    contact.type.ts                — ContactForm tipi (zaten kismi mevcut)
    contact.service.ts             — API call (createContact)
```

### 6.3 Admin sayfalar

```
frontend/src/app/admin/
  sayfalar/
    page.tsx                       — customPages listesi
    yeni/page.tsx                  — Yeni sayfa olustur formu
    [id]/page.tsx                  — Sayfa duzenleme formu
  destek/
    page.tsx                       — Ticket listesi
    [id]/page.tsx                  — Ticket detay + admin note
    sss/page.tsx                   — FAQ CRUD listesi
```

### 6.4 Admin service

```typescript
// frontend/src/modules/admin/admin.service.ts'e eklenecekler:

// Custom Pages
adminListCustomPages(params)
adminGetCustomPage(id)
adminCreateCustomPage(data)
adminUpdateCustomPage(id, data)
adminDeleteCustomPage(id)
adminReorderCustomPages(items)

// Support FAQs
adminListFaqs(params)
adminCreateFaq(data)
adminUpdateFaq(id, data)
adminDeleteFaq(id)
adminReorderFaqs(items)

// Support Tickets
adminListTickets(params)
adminGetTicket(id)
adminUpdateTicket(id, data)
adminDeleteTicket(id)
```

---

## 7. Kodlama Standartlari Hatirlatmasi

PaketJet CLAUDE.md kurallari BUTUN modullere uygulanir:

1. Router < 30 satir, sadece route tanimi
2. Controller'da DB sorgusu YOK
3. Repository fonksiyonlari `repo*` prefix
4. `handleRouteError` her handler'da
5. `getAuthUserId(req)` auth handler'larda
6. Dosya < 200 satir
7. Locale default: `'tr'`
8. UUID: `randomUUID()`
9. Decimal: DB'ye `String(number)`, okurken `parseFloat()`
10. Admin route'larda guard TEKRARLANMAZ (routes.ts'de zaten var)
