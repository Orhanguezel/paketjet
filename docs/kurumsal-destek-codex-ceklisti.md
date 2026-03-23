# PaketJet — Kurumsal & Destek: Codex + Antigravity Gorev Ceklisti

---

## PARALEL IS TABLOSU

```
Zaman  │ Codex Sandbox 1         │ Codex Sandbox 2         │ Codex Sandbox 3
───────┼─────────────────────────┼─────────────────────────┼─────────────────────
Fraz 1 │ KD-1 customPages        │ KD-2 support            │ KD-3 Seed SQL
       │ backend modulu          │ backend modulu          │ + contact frontend
───────┼─────────────────────────┼─────────────────────────┼─────────────────────
Fraz 2 │ KD-4 customPages        │ KD-5 support            │ KD-6 iletisim
       │ frontend (public+admin) │ frontend (public+admin) │ + footer + nav
───────┼─────────────────────────┼─────────────────────────┼─────────────────────
Fraz 3 │ Antigravity             │                         │
       │ dogrulama               │                         │
```

---

## Codex Ceklisti

- [x] KD-1: customPages backend modulu
- [x] KD-2: support backend modulu
- [x] KD-3: Seed SQL dosyalari + contact frontend sayfasi
- [x] KD-4: customPages frontend (public + admin)
- [x] KD-5: support frontend (public + admin)
- [x] KD-6: iletisim sayfasi + footer + admin nav

---

## FRAZ 1: Backend Modulleri (PARALEL)

### Codex Prompt 1 — KD-1: customPages Backend

```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md, CLAUDE.md ve docs/kurumsal-destek-plan.md oku.
Referans modul: bereketfide/backend/src/modules/customPages/ dizinini oku.

Gorev KD-1: customPages Backend Modulu

PaketJet standartlarina gore backend/src/modules/customPages/ olustur.
Bereketfide'deki customPages modulunu referans al ama PaketJet kurallarina uyarla.

Dosyalar:

1. schema.ts — Drizzle tablo tanimlari:
   - custom_pages: id, module_key, is_published, display_order,
     featured_image, storage_asset_id, created_at, updated_at
   - custom_pages_i18n: page_id (FK), locale, title, slug (unique per locale),
     content (LONGTEXT), summary, meta_title, meta_description
   - Insert/Select type export'lari

2. validation.ts — Zod semalari:
   - listQuerySchema: locale, module_key, is_published, search, limit, offset
   - createSchema: module_key, locale, title, slug, content, summary, meta_*, is_published
   - updateSchema: createSchema'nin partial hali + locale zorunlu
   - reorderSchema: items array [{id, display_order}]
   - bySlugParamsSchema: slug string

3. repository.ts — repo* prefix fonksiyonlar:
   - repoListCustomPages(params) — i18n JOIN, locale coalesce, filtreler
   - repoGetCustomPageById(id, locale) — tek sayfa
   - repoGetCustomPageBySlug(slug, locale) — slug ile getir
   - repoCreateCustomPage(data) — parent + i18n INSERT
   - repoUpdateCustomPage(data) — parent + i18n UPDATE
   - repoDeleteCustomPage(id) — parent DELETE (cascade)
   - repoReorderCustomPages(items) — bulk display_order UPDATE

4. controller.ts — Public handler'lar:
   - listPages: GET /custom-pages (module_key, locale filtre)
   - getPage: GET /custom-pages/:id
   - getPageBySlug: GET /custom-pages/by-slug/:slug
   - Her handler'da try/catch + handleRouteError

5. admin.controller.ts — Admin handler'lar:
   - adminListPages, adminGetPage, adminCreatePage,
     adminUpdatePage, adminDeletePage, adminReorderPages
   - Her handler'da try/catch + handleRouteError

6. router.ts — Public route kayitlari:
   const B = '/custom-pages';
   app.get(B, listPages);
   app.get(`${B}/by-slug/:slug`, getPageBySlug);
   app.get(`${B}/:id`, getPage);

7. admin.routes.ts — Admin route kayitlari:
   const B = '/custom-pages';
   app.get(B, adminListPages);
   app.get(`${B}/:id`, adminGetPage);
   app.post(B, adminCreatePage);
   app.patch(`${B}/:id`, adminUpdatePage);
   app.delete(`${B}/:id`, adminDeletePage);
   app.post(`${B}/reorder`, adminReorderPages);

8. index.ts — Barrel export (explicit, no export *)

9. routes.ts'e register et:
   - import { registerCustomPages, registerCustomPagesAdmin }
   - PUBLIC_ROUTE_REGISTRARS'a registerCustomPages ekle
   - ADMIN_ROUTE_REGISTRARS'a registerCustomPagesAdmin ekle

Branch: feat/custom-pages-backend
Testleri calistir: bun test
Build kontrol: bun run build
Bitince PR ac.

YAPMA: Frontend kodu yazma, mevcut modulleri degistirme,
CLAUDE.md/AGENTS.md degistirme, seed data ekleme (ayri gorev).
Locale default 'tr' olmali, hardcoded 'de' veya 'en' YASAK.
```

---

### Codex Prompt 2 — KD-2: support Backend

```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md, CLAUDE.md ve docs/kurumsal-destek-plan.md oku.
Referans: bereketfide/backend/src/modules/contact/ dizinini oku (yapi icin).

Gorev KD-2: support Backend Modulu

PaketJet standartlarina gore backend/src/modules/support/ olustur.
Iki alt alan var: SSS (FAQ) + Destek Talepleri (Tickets).

Dosyalar:

1. schema.ts — Drizzle tablo tanimlari:
   - support_faqs: id, category, display_order, is_published, created_at, updated_at
   - support_faqs_i18n: faq_id (FK cascade), locale, question, answer
     PK: (faq_id, locale)
   - support_tickets: id, user_id (nullable), name, email, subject, message,
     category (genel|kargo|odeme|hesap|teknik),
     status (open|in_progress|resolved|closed),
     priority (low|normal|high|urgent),
     admin_note, ip, user_agent, created_at, updated_at
     Indexler: status, category, created_at

2. validation.ts — Zod semalari:
   - faqListQuerySchema: locale, category, is_published, limit, offset
   - faqCreateSchema: locale, question, answer, category, is_published
   - faqUpdateSchema: faqCreateSchema partial + locale zorunlu
   - faqReorderSchema: items [{id, display_order}]
   - ticketCreateSchema: name, email, subject, message, category
   - ticketListQuerySchema: status, category, priority, search, limit, offset
   - ticketUpdateSchema: status, priority, admin_note (hepsi opsiyonel)

3. repository.ts — repo* prefix:
   FAQ:
   - repoListFaqs(params) — i18n JOIN, locale coalesce, category filtre
   - repoGetFaqById(id, locale)
   - repoCreateFaq(data) — parent + i18n
   - repoUpdateFaq(data) — parent + i18n
   - repoDeleteFaq(id)
   - repoReorderFaqs(items)
   Ticket:
   - repoListTickets(params) — filtreli liste
   - repoGetTicketById(id)
   - repoCreateTicket(data) — ip, user_agent dahil
   - repoUpdateTicket(id, data) — status, priority, admin_note
   - repoDeleteTicket(id)
   - repoListMyTickets(userId, params) — kullanicinin kendi talepleri

4. controller.ts — Public handler'lar:
   - listFaqs: GET /support/faqs
   - createTicket: POST /support/tickets (honeypot: website alani, bossa ok)
   - myTickets: GET /support/tickets/my (requireAuth)
   Her handler'da try/catch + handleRouteError

5. admin.controller.ts — Admin handler'lar:
   FAQ: adminListFaqs, adminCreateFaq, adminUpdateFaq, adminDeleteFaq, adminReorderFaqs
   Ticket: adminListTickets, adminGetTicket, adminUpdateTicket, adminDeleteTicket

6. router.ts:
   const B = '/support';
   app.get(`${B}/faqs`, listFaqs);                    // public
   app.post(`${B}/tickets`, createTicket);             // public
   // myTickets icin requireAuth hook:
   app.get(`${B}/tickets/my`, { onRequest: [requireAuth] }, myTickets);

7. admin.routes.ts:
   const B = '/support';
   // FAQ
   app.get(`${B}/faqs`, adminListFaqs);
   app.post(`${B}/faqs`, adminCreateFaq);
   app.patch(`${B}/faqs/:id`, adminUpdateFaq);
   app.delete(`${B}/faqs/:id`, adminDeleteFaq);
   app.post(`${B}/faqs/reorder`, adminReorderFaqs);
   // Tickets
   app.get(`${B}/tickets`, adminListTickets);
   app.get(`${B}/tickets/:id`, adminGetTicket);
   app.patch(`${B}/tickets/:id`, adminUpdateTicket);
   app.delete(`${B}/tickets/:id`, adminDeleteTicket);

8. index.ts — Barrel export

9. routes.ts'e register et:
   - registerSupport → PUBLIC
   - registerSupportAdmin → ADMIN

Branch: feat/support-backend
Testleri calistir: bun test
Build kontrol: bun run build
Bitince PR ac.

YAPMA: Frontend kodu yazma, mevcut modulleri degistirme,
contact modulune dokunma, email/telegram bildirim ekleme (sonra).
Locale default 'tr', honeypot: website alani.
```

---

### Codex Prompt 3 — KD-3: Seed SQL + Contact Frontend

```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md, CLAUDE.md ve docs/kurumsal-destek-plan.md oku.

Gorev KD-3: Seed SQL Dosyalari + Iletisim Public Sayfasi

KISIM A — Seed SQL (KD-1 ve KD-2 merge edildikten sonra seed calistirilir):

1. backend/src/db/seed/sql/115_custom_pages_schema.sql
   - CREATE TABLE IF NOT EXISTS custom_pages (plan'daki sema)
   - CREATE TABLE IF NOT EXISTS custom_pages_i18n (plan'daki sema)

2. backend/src/db/seed/sql/116_support_schema.sql
   - CREATE TABLE IF NOT EXISTS support_faqs
   - CREATE TABLE IF NOT EXISTS support_faqs_i18n
   - CREATE TABLE IF NOT EXISTS support_tickets

3. backend/src/db/seed/sql/117_custom_pages_seed.sql
   - 4 ornek kurumsal sayfa (INSERT ON DUPLICATE KEY UPDATE):
     a) Hakkimizda (slug: hakkimizda, module_key: kurumsal)
        HTML content: PaketJet hakkinda kisa tanitim paragraf
     b) Gizlilik Politikasi (slug: gizlilik-politikasi, module_key: yasal)
     c) KVKK Aydinlatma Metni (slug: kvkk, module_key: yasal)
     d) Kullanim Kosullari (slug: kullanim-kosullari, module_key: yasal)
   - Tum sayfalarda is_published = 1, locale = 'tr'
   - Content JSON formatinda: {"html":"<p>...</p>"}

4. backend/src/db/seed/sql/118_support_faqs_seed.sql
   - 6 ornek SSS (INSERT ON DUPLICATE KEY UPDATE):
     a) PaketJet nedir? (category: genel)
     b) Nasil kargo gonderebilirim? (category: kargo)
     c) Tasiyici nasil olurum? (category: genel)
     d) Odeme nasil yapilir? (category: odeme)
     e) Kargo takibi nasil yapilir? (category: kargo)
     f) Hesabimi nasil silerim? (category: hesap)

KISIM B — Iletisim Public Sayfasi:

5. frontend/src/modules/contact/contact.type.ts
   - ContactFormData tipi: name, email, phone, subject, message

6. frontend/src/modules/contact/contact.service.ts
   - createContact(data: ContactFormData): POST /api/contacts

7. frontend/src/app/iletisim/page.tsx
   - Responsive form: name, email, phone, subject, message
   - Zod validation (client-side)
   - Submit → contact.service.createContact
   - Basari mesaji: "Mesajiniz iletildi, en kisa surede donecegiz."
   - Hata mesaji gosterimi
   - PaketJet token siniflari: bg-surface, text-foreground, bg-brand vb.

8. frontend/src/config/routes.ts'e ekle:
   iletisim: "/iletisim"

9. frontend/src/config/api-endpoints.ts'e ekle:
   contacts: { create: "/contacts" }

Branch: feat/seed-and-contact-page
Build kontrol: bun run build (frontend)
Bitince PR ac.

YAPMA: Backend modulleri degistirme, admin sayfalari olusturma,
mevcut contact backend'ine dokunma.
```

---

## FRAZ 2: Frontend (PARALEL — Fraz 1 merge edildikten sonra)

### Codex Prompt 4 — KD-4: customPages Frontend

```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md, CLAUDE.md ve docs/kurumsal-destek-plan.md oku.

Gorev KD-4: customPages Frontend (Public + Admin)

KISIM A — Module dosyalari:

1. frontend/src/modules/customPage/customPage.type.ts
   - CustomPage: id, module_key, is_published, display_order,
     featured_image, title, slug, content, summary,
     meta_title, meta_description, locale, created_at
   - CustomPageListResponse: CustomPage[]

2. frontend/src/modules/customPage/customPage.service.ts
   - getCustomPageBySlug(slug, locale?): GET /api/custom-pages/by-slug/:slug
   - listCustomPages(params): GET /api/custom-pages

3. frontend/src/config/api-endpoints.ts'e ekle:
   customPages: {
     list: "/custom-pages",
     bySlug: (slug: string) => `/custom-pages/by-slug/${slug}`,
     byId: (id: string) => `/custom-pages/${id}`,
   }

KISIM B — Public sayfalar:

4. frontend/src/app/hakkimizda/page.tsx
   - Server component (async)
   - getCustomPageBySlug('hakkimizda') ile veri cek
   - Content'i dangerouslySetInnerHTML ile renderla (HTML)
   - SEO: metadata export (title, description from API)
   - 404 yoksa notFound()

5. frontend/src/app/gizlilik-politikasi/page.tsx — ayni yapi, slug: gizlilik-politikasi
6. frontend/src/app/kvkk/page.tsx — ayni yapi, slug: kvkk
7. frontend/src/app/kullanim-kosullari/page.tsx — ayni yapi, slug: kullanim-kosullari

   NOT: 4 sayfa ayni pattern. Ortak bir component olustur:
   frontend/src/components/StaticPage.tsx
   - Props: slug, fallbackTitle
   - getCustomPageBySlug + HTML render + metadata

KISIM C — Admin sayfalar:

8. frontend/src/modules/admin/admin.service.ts'e ekle:
   - adminListCustomPages(params): GET /api/admin/custom-pages
   - adminGetCustomPage(id): GET /api/admin/custom-pages/:id
   - adminCreateCustomPage(data): POST /api/admin/custom-pages
   - adminUpdateCustomPage(id, data): PATCH /api/admin/custom-pages/:id
   - adminDeleteCustomPage(id): DELETE /api/admin/custom-pages/:id
   - adminReorderCustomPages(items): POST /api/admin/custom-pages/reorder

9. frontend/src/app/admin/sayfalar/page.tsx
   - Sayfa listesi tablosu (baslik, slug, module_key, durum, tarih)
   - Filtreler: module_key dropdown (kurumsal/yasal/yardim)
   - "Yeni Sayfa" butonu → /admin/sayfalar/yeni
   - Sil butonu (confirm dialog)
   - Yayin/taslak toggle

10. frontend/src/app/admin/sayfalar/yeni/page.tsx
    - Form: module_key, title, slug (auto-generate from title), content (textarea),
      summary, meta_title, meta_description, is_published toggle
    - Submit → adminCreateCustomPage
    - Basarida /admin/sayfalar'a yonlendir

11. frontend/src/app/admin/sayfalar/[id]/page.tsx
    - Mevcut veriyi pre-fill
    - Ayni form yeni ile, adminUpdateCustomPage kullan
    - Basarida /admin/sayfalar'a yonlendir

Branch: feat/custom-pages-frontend
Build kontrol: bun run build
Bitince PR ac.

YAPMA: Backend modulleri degistirme, support sayfalarini olusturma,
admin layout.tsx'deki NAV'i degistirme (ayri gorev).
Token siniflari kullan (bg-surface, text-foreground, bg-brand, border-border-soft).
```

---

### Codex Prompt 5 — KD-5: support Frontend

```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md, CLAUDE.md ve docs/kurumsal-destek-plan.md oku.

Gorev KD-5: support Frontend (Public + Admin)

KISIM A — Module dosyalari:

1. frontend/src/modules/support/support.type.ts
   - FAQ: id, category, question, answer, display_order, is_published
   - SupportTicket: id, name, email, subject, message, category, status,
     priority, admin_note, created_at
   - TicketCreateData: name, email, subject, message, category

2. frontend/src/modules/support/support.service.ts
   - listFaqs(category?): GET /api/support/faqs
   - createTicket(data): POST /api/support/tickets
   - getMyTickets(): GET /api/support/tickets/my

3. frontend/src/config/api-endpoints.ts'e ekle:
   support: {
     faqs: "/support/faqs",
     tickets: { create: "/support/tickets", my: "/support/tickets/my" },
   }

KISIM B — Public destek sayfasi:

4. frontend/src/app/destek/page.tsx
   - Iki bolum: SSS (ust) + Destek Talebi Formu (alt)
   - SSS: Accordion component (category gruplu)
     - listFaqs() ile veri cek
     - Her soru tiklaninca cevap acilir
   - Form: name, email, subject, category (dropdown), message
     - Zod validation
     - Submit → createTicket
     - Basari mesaji: "Talebiniz alinmistir. Size en kisa surede donecegiz."

KISIM C — Admin sayfalar:

5. frontend/src/modules/admin/admin.service.ts'e ekle:
   - adminListTickets(params): GET /api/admin/support/tickets
   - adminGetTicket(id): GET /api/admin/support/tickets/:id
   - adminUpdateTicket(id, data): PATCH /api/admin/support/tickets/:id
   - adminDeleteTicket(id): DELETE /api/admin/support/tickets/:id
   - adminListFaqs(params): GET /api/admin/support/faqs
   - adminCreateFaq(data): POST /api/admin/support/faqs
   - adminUpdateFaq(id, data): PATCH /api/admin/support/faqs/:id
   - adminDeleteFaq(id): DELETE /api/admin/support/faqs/:id

6. frontend/src/app/admin/destek/page.tsx
   - Destek talepleri listesi (split-panel: list + detail)
   - Filtreler: status dropdown, category dropdown, search
   - Talep sec → sag panelde detay + admin note alani
   - Status degistir (open/in_progress/resolved/closed)
   - Priority degistir dropdown
   - Admin note kaydet (PATCH)
   - Sil butonu (confirm)

7. frontend/src/app/admin/destek/[id]/page.tsx
   - Tam detay sayfasi (mobil icin ayri)
   - Ticket bilgileri + admin note + status/priority degistirme

8. frontend/src/app/admin/destek/sss/page.tsx
   - FAQ CRUD listesi
   - Inline edit veya modal: question, answer, category, is_published
   - Sil butonu
   - "Yeni SSS Ekle" butonu
   - Drag-to-reorder (opsiyonel, basit display_order input da olur)

Branch: feat/support-frontend
Build kontrol: bun run build
Bitince PR ac.

YAPMA: Backend modulleri degistirme, customPages sayfalarini degistirme,
admin layout.tsx degistirme. Token siniflari kullan.
```

---

### Codex Prompt 6 — KD-6: Nav + Footer + Iletisim

```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md ve CLAUDE.md oku.

Gorev KD-6: Admin Nav Guncellemesi + Footer + Route Config

1. frontend/src/app/admin/layout.tsx — NAV dizisine ekle:
   { href: "/admin/sayfalar", label: "Sayfalar", icon: "📄" },
   { href: "/admin/destek",   label: "Destek",   icon: "🎧" },
   Konum: "Iletisim" satirindan hemen sonra

2. frontend/src/config/routes.ts'e ekle:
   hakkimizda: "/hakkimizda",
   gizlilik: "/gizlilik-politikasi",
   kvkk: "/kvkk",
   kosullar: "/kullanim-kosullari",
   destek: "/destek",
   iletisim: "/iletisim",
   admin: {
     ...mevcut,
     sayfalar: "/admin/sayfalar",
     destek: "/admin/destek",
     destekSss: "/admin/destek/sss",
   }

3. Frontend footer component olustur veya guncelle:
   frontend/src/components/Footer.tsx
   - 3 kolon layout:
     a) PaketJet — kisa tanitim
     b) Kurumsal: Hakkimizda, Gizlilik, KVKK, Kullanim Kosullari
     c) Destek: SSS, Iletisim, Destek Talebi
   - Token siniflari: bg-surface, text-muted, border-border-soft
   - Her link Next.js <Link>

4. Footer'i layout.tsx'e ekle (public sayfalarda gorunmeli):
   frontend/src/app/layout.tsx icinde <Footer /> ekle
   (admin layout'ta OLMAMALI — sadece public)

Branch: feat/nav-footer-routes
Build kontrol: bun run build
Bitince PR ac.

YAPMA: Backend degistirme, sayfa iceriklerini degistirme,
admin layout disindaki nav yapilarina dokunma.
```

---

## FRAZ 3: Dogrulama (ANTIGRAVITY)

### Antigravity Prompt — Kurumsal & Destek Dogrulama

```
PaketJet kurumsal ve destek sayfalari dogrulama gorevi.

1. Public sayfalar:
   - http://localhost:3000/hakkimizda → icerik gorunuyor mu?
   - http://localhost:3000/gizlilik-politikasi → icerik gorunuyor mu?
   - http://localhost:3000/kvkk → icerik gorunuyor mu?
   - http://localhost:3000/kullanim-kosullari → icerik gorunuyor mu?
   - http://localhost:3000/iletisim → form gorunuyor mu? Submit calisiyor mu?
   - http://localhost:3000/destek → SSS accordion + form gorunuyor mu?
   - Her sayfa screenshot al

2. Footer:
   - Anasayfada footer gorunuyor mu?
   - Footer linkleri dogru sayfalara gidiyor mu?
   - Responsive: mobil (375px), tablet (768px), desktop (1280px)
   - Screenshot al

3. Admin panel:
   - /admin sidebar'da "Sayfalar" ve "Destek" linkleri var mi?
   - /admin/sayfalar → sayfa listesi gorunuyor mu?
   - Yeni sayfa olustur → basarili mi?
   - /admin/destek → ticket listesi gorunuyor mu?
   - /admin/destek/sss → SSS listesi, ekleme, silme calisiyor mu?
   - Screenshot al

4. API dogrulama:
   - GET http://localhost:8078/api/custom-pages?module_key=kurumsal → 200
   - GET http://localhost:8078/api/custom-pages/by-slug/hakkimizda → 200 + icerik
   - GET http://localhost:8078/api/support/faqs → 200 + SSS listesi
   - POST http://localhost:8078/api/support/tickets (test data) → 201

5. Lighthouse:
   - /hakkimizda: Performance 80+, Accessibility 90+
   - /destek: Performance 80+, Accessibility 90+
```

---

## BAGIMLILK TABLOSU

```
KD-1 (customPages backend) ──┐
KD-2 (support backend) ──────┼──→ Fraz 1 merge
KD-3 (seed + contact page) ──┘         │
                                        ▼
KD-4 (customPages frontend) ──┐
KD-5 (support frontend) ──────┼──→ Fraz 2 merge
KD-6 (nav + footer) ──────────┘         │
                                        ▼
                              Antigravity dogrulama
```

**Kritik:** KD-4, KD-5 ve KD-6 Fraz 1 merge edilmeden BASLATILMAMALI
(backend API'leri mevcut olmali).
