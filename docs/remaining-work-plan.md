# PaketJet — Kalan Isler Plani

**Tarih:** 2026-03-21
**Hazirlayan:** Claude Code (Mimar)
**Proje Durumu:** %95 tamamlanmis, production-ready

---

## Ozet

PaketJet'in 30 checkpoint'i kapatilmis, core feature'lar %100 tamam. Asagidaki isler production kalitesini artirmak ve eksik altyapi parcalarini tamamlamak icindir.

---

## Oncelik 1: Production Deployment Hazirlik

> Bu isler canli yayina almadan ONCE tamamlanmali.

### PD-1: Environment & Secrets Finalize
**Arac:** Claude Code (Mimar karar) → Manuel (Orhan)
- [ ] Gercek Iyzico production key'leri `.env`'e
- [ ] Gercek SMTP credentials (Nodemailer)
- [ ] Gercek Google Maps API key (billing aktif)
- [ ] JWT_SECRET production icin guclu (min 64 karakter)
- [ ] Domain + SSL sertifikasi (Let's Encrypt)
- [ ] `CORS_ORIGIN` production domain'e cevir

### PD-2: Docker Production Build Test
**Arac:** Codex
```
Gorev: docker compose up -d ile production build'i calistir.
Backend, frontend, admin_panel, nginx, mysql, redis hepsinin
saglikli basladigini dogrula. Health check endpoint'i ekle.
Branch: chore/docker-health-check
```
- [ ] Backend health check endpoint: `GET /api/health`
- [ ] Docker compose health check tanimla
- [ ] `docker compose up -d` basarili build
- [ ] Nginx SSL + reverse proxy calisir

### PD-3: Database Migration Sirasi Dogrulama
**Arac:** Codex
```
Gorev: Temiz bir MySQL instance'inda tum seed SQL dosyalarini
sirali calistir. Hata varsa duzelt.
Branch: fix/db-migration-order
```
- [ ] 23 SQL dosyasi sirayla calisir, hata yok
- [ ] Seed data tutarli (FK'lar gecerli)

---

## Oncelik 2: Kod Kalitesi & Test

> Production sonrasi ilk sprint'te tamamlanmali.

### KT-1: Swagger / OpenAPI Dokumantasyonu
**Arac:** Codex (feature-builder skill)
```
Gorev: Fastify @fastify/swagger + @fastify/swagger-ui entegre et.
Tum public + admin endpoint'lere Zod'dan otomatik schema uret.
/api/docs adresinde Swagger UI erisileblir olsun.
Branch: feat/swagger-docs
```
- [ ] `@fastify/swagger` + `@fastify/swagger-ui` kur
- [ ] `app.ts`'de swagger plugin register
- [ ] Tum route'lara schema tanimlari (Zod → JSON Schema)
- [ ] `GET /api/docs` calisir
- [ ] Admin route'lar auth korunmali (Swagger UI'da "Authorize" butonu)

### KT-2: Frontend Component Testleri
**Arac:** Codex (test-generator skill)
```
Gorev: Kritik frontend bilesenler icin Vitest + React Testing Library
testleri yaz. Oncelik: auth, booking, wallet akislari.
Branch: test/frontend-components
```
- [ ] `modules/auth/` — login form submit, store update, redirect
- [ ] `modules/booking/` — booking card render, status display
- [ ] `modules/wallet/` — deposit form, transaction list
- [ ] `modules/ilan/` — IlanCard render, ilan-ver wizard steps
- [ ] `components/Header.tsx` — auth-aware render (logged in vs. out)
- [ ] Vitest config (`vitest.config.ts`) + test scripts

### KT-3: Structured Logging (Pino)
**Arac:** Codex
```
Gorev: Fastify'nin built-in Pino logger'ini aktive et.
Request/response log'lari + error log'lari yapilandirilmis formatta.
Branch: feat/structured-logging
```
- [ ] `app.ts`'de Pino logger konfigurasyonu
- [ ] Log level: production'da `info`, development'ta `debug`
- [ ] Request ID her log satirinda
- [ ] Error handler'larda structured error log
- [ ] Sensitive data maskeleme (password, token)

### KT-4: Redis Cache Stratejisi
**Arac:** Claude Code (tasarim) → Codex (uygulama)
```
Claude Code: Redis cache stratejisini tasarla.
Hangi endpoint'ler cache'lenmeli, TTL ne olmali, invalidation kurallari ne?

Codex: Tasarima gore uygula.
Branch: feat/redis-cache
```
Cache adaylari:
- [ ] `GET /api/ilanlar` — liste (TTL: 60s, invalidation: create/update/delete)
- [ ] `GET /api/ilanlar/:id` — detay (TTL: 120s)
- [ ] `GET /api/dashboard/*` — admin stats (TTL: 300s)
- [ ] `GET /api/categories` — kategoriler (TTL: 3600s)
- [ ] Redis client setup (`ioredis` veya `@fastify/redis`)

---

## Oncelik 3: Izleme & Gozlemlenebilirlik

> Production'dan sonra 2. sprint'te tamamlanmali.

### IG-1: Error Tracking (Sentry)
**Arac:** Codex
```
Gorev: Backend + Frontend'e Sentry entegre et.
Unhandled error'lar otomatik raporlansin.
Branch: feat/sentry-integration
```
- [ ] `@sentry/node` backend entegrasyonu (Fastify plugin)
- [ ] `@sentry/nextjs` frontend entegrasyonu
- [ ] Source maps upload (CI/CD'de)
- [ ] Environment ayri (development vs. production)
- [ ] User context (auth user id) ekleme

### IG-2: Uptime Monitoring
**Arac:** Manuel (Orhan) + Claude Code (rehberlik)
- [ ] Uptime Kuma veya benzeri self-hosted monitoring
- [ ] Health check endpoint'leri izle (backend, frontend, MySQL)
- [ ] Telegram/email alert kurulumu

### IG-3: Frontend Error Boundaries
**Arac:** Codex
```
Gorev: Next.js error.tsx dosyalari ile global error boundary ekle.
Kritik sayfalar: panel, admin, ilanlar.
Branch: feat/error-boundaries
```
- [ ] `app/error.tsx` — global error boundary
- [ ] `app/panel/error.tsx` — panel error boundary
- [ ] `app/admin/error.tsx` — admin error boundary
- [ ] `app/not-found.tsx` — ozel 404 sayfasi
- [ ] Kullanici dostu hata mesajlari (Turkce)

---

## Oncelik 4: Ozellik Gelistirmeler (Nice-to-have)

> Roadmap'e gore planlenir. Acil degil.

### OG-1: Gercek Odeme Gateway'i (Iyzico Production)
- [ ] Iyzico sandbox → production gecisi
- [ ] 3D Secure entegrasyonu
- [ ] Odeme sonuc sayfasi (`/odeme/basarili`, `/odeme/basarisiz`)
- [ ] Webhook handler (odeme durumu guncelleme)

### OG-2: WebSocket Bildirimler
- [ ] Fastify WebSocket plugin
- [ ] Gercek zamanli bildirim (polling yerine)
- [ ] Booking status degisikliklerinde anlik bildirim

### OG-3: SMS Bildirimler
- [ ] Twilio veya Netgsm entegrasyonu
- [ ] Booking onay/iptal SMS
- [ ] OTP ile telefon dogrulama

### OG-4: Push Notifications
- [ ] Service worker (next-pwa)
- [ ] Web push subscription
- [ ] Booking event'lerinde push

### OG-5: Mobil Uygulama (Flutter)
- [ ] QuickEcommerce Flutter deneyimini baz al
- [ ] Auth, ilan listele, booking, wallet
- [ ] Google Maps entegrasyonu
- [ ] Push notifications

---

## Orkestrasyon Is Akisi

Her gorev icin hangi arac ne yapar:

```
┌─────────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐
│ Claude Code │ ──→ │  Codex   │ ──→ │ Antigravity  │ ──→ │ Copilot  │
│  (Tasarla)  │     │ (Kodla)  │     │  (Dogrula)   │     │ (Cilala) │
└─────────────┘     └──────────┘     └──────────────┘     └──────────┘
     │                   │                  │
     │  Plan dokumani    │  PR + testler    │  Screenshot +
     │  yazilir          │  yazilir         │  Lighthouse skoru
     │  (docs/*.md)      │  (branch)        │  raporlanir
```

### Ornek: KT-1 (Swagger) Is Akisi

1. **Claude Code:** "Swagger entegrasyonunu tasarla — hangi plugin, hangi konfigursyon, route'lara schema nasil eklenir?"
2. **Codex:** "feat/swagger-docs branch'inde swagger entegrasyonunu implement et. AGENTS.md kurallarini takip et."
3. **Antigravity:** "/api/docs sayfasini browser'da ac, tum endpoint'lerin gorundugunuu dogrula, screenshot al."
4. **Copilot:** PR review sirasinda import/type duzeltmeleri.

---

## Zaman Tahmini (Kaba)

| Oncelik | Is | Tahmini Efor |
|---------|-----|-------------|
| PD-1 | Environment secrets | Manuel, 1 saat |
| PD-2 | Docker health check | Codex, 30 dk |
| PD-3 | DB migration dogrulama | Codex, 30 dk |
| KT-1 | Swagger/OpenAPI | Codex, 2-3 saat |
| KT-2 | Frontend testler | Codex, 3-4 saat |
| KT-3 | Structured logging | Codex, 1 saat |
| KT-4 | Redis cache | Claude + Codex, 2-3 saat |
| IG-1 | Sentry | Codex, 1-2 saat |
| IG-2 | Uptime monitoring | Manuel, 1 saat |
| IG-3 | Error boundaries | Codex, 1 saat |

**Toplam:** ~15-20 saat (Codex paralel calisirsa 1-2 gun)

---

**Bu plan Claude Code (Mimar) tarafindan hazirlanmistir.**
**Son guncelleme:** 2026-03-21
