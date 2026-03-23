# PaketJet — Orkestra Sefi Rehberi

**Sen orkestra sefisin.** Kod yazmiyorsun, yonetiyorsun.
Her araca dogru isi, dogru sirada, dogru prompt ile veriyorsun.

---

## Codex Ceklisti

- [x] PD-2: Docker production build + health check
- [x] PD-3: Database migration dogrulama
- [x] KT-1: Swagger / OpenAPI dokumantasyonu
- [x] KT-3: Structured logging (Pino)
- [x] KT-2: Frontend component testleri
- [x] IG-1: Sentry error tracking
- [x] IG-3: Frontend error boundaries
- [x] KT-4: Redis cache uygulamasi

---

## Altin Kurallar

1. **Ayni anda ayni dosyaya iki arac dokundurma**
2. **Sira: Claude Code → Codex → Antigravity → Copilot**
3. **Codex'e paralel is ver ama farkli branch'lerde**
4. **Her PR'dan sonra Antigravity ile dogrula**
5. **Claude Code'a sadece tasarim/plan sorusu sor, kod yazdirma**

---

## Prompt Sablon Formati

Her prompt'ta su bilgileri ver:

```
1. Proje dizini (cd /home/orhan/Documents/Projeler/paketjet)
2. Hangi dosyayi okusin (AGENTS.md, CLAUDE.md, docs/remaining-work-plan.md)
3. Gorev ID'si (PD-2, KT-1 vb.)
4. Branch adi
5. Ne yapmasi gerektigi (net, belirsizlik yok)
6. Ne YAPMAMASI gerektigi
7. Bittikten sonra ne yapmasi gerektigi (test, PR)
```

---

## FRAZ 1: Production Deployment Hazirlik

### Adim 1.1 — PD-1: Environment Secrets (SEN YAPIYORSUN)

Bu isi hicbir araca verme. Gercek API key'leri, sifreler senin isit.

```
Yapilacaklar:
1. Iyzico dashboard'undan production API key al
2. SMTP provider (Gmail/Mailgun/Sendgrid) credentials al
3. Google Cloud Console'dan Maps API key al (billing aktif)
4. Guclu JWT_SECRET uret:
   openssl rand -base64 64
5. Domain al/ayarla, Let's Encrypt SSL kur
6. backend/.env dosyasini guncelle:
   - IYZICO_API_KEY=gercek_key
   - IYZICO_SECRET_KEY=gercek_secret
   - SMTP_HOST=smtp.gmail.com
   - SMTP_USER=xxx
   - SMTP_PASS=xxx
   - GOOGLE_MAPS_API_KEY=gercek_key
   - JWT_SECRET=openssl_ciktisi
   - CORS_ORIGIN=https://paketjet.com
```

### Adim 1.2 — PD-2 + PD-3: Docker & DB (CODEX'E VER — PARALEL)

Bu iki is birbirinden bagimsiz, Codex'e ayni anda ver:

**Codex Prompt 1 (Docker Health Check):**
```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md ve CLAUDE.md dosyalarini oku.

Gorev PD-2: Docker Production Build + Health Check

1. backend/src/modules/ altina yeni bir modül olustur: health/
   - health/controller.ts: GET /api/health endpoint'i
     - DB baglantisi kontrol (basit SELECT 1 sorgusu)
     - Redis baglantisi kontrol (PING)
     - Response: { status: "ok", db: "ok", redis: "ok", uptime: process.uptime() }
   - health/router.ts: route tanimla
   - routes.ts'e register et

2. docker-compose.yml'da healthcheck ekle:
   backend:
     healthcheck:
       test: ["CMD", "curl", "-f", "http://localhost:8083/api/health"]
       interval: 30s
       timeout: 10s
       retries: 3

3. Build test:
   docker compose build --no-cache
   docker compose up -d
   docker compose ps (tum servisler healthy mi?)

Branch: chore/docker-health-check
Testleri calistir: bun test
Build kontrol: bun run build
Bitince PR ac.

YAPMA: CLAUDE.md degistirme, nginx config degistirme, .env'e secret ekleme.
```

**Codex Prompt 2 (DB Migration):**
```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md ve CLAUDE.md dosyalarini oku.

Gorev PD-3: Database Migration Dogrulama

1. backend/src/db/seed/sql/ altindaki tum SQL dosyalarini oku
2. Dosya isimlerini sirala (001_, 002_, ... 023_)
3. Her SQL dosyasini sirayla incele:
   - CREATE TABLE'lar dogru sirada mi? (FK hedefi daha once olusturulmus mu?)
   - Seed INSERT'lar FK constraint'leri ihlal ediyor mu?
   - Duplicate key riski var mi?
4. Sorun varsa duzelt
5. db:seed script'ini kontrol et — tum dosyalari dogru sirada mi calistiriyor?

Branch: fix/db-migration-order
Bitince PR ac.

YAPMA: Tablo yapisi degistirme, yeni tablo ekleme, veri silme.
```

---

## FRAZ 2: Kod Kalitesi & Test

> PD-2 ve PD-3 PR'lari merge edildikten sonra basla.

### Adim 2.1 — KT-1 + KT-3: Swagger + Logging (CODEX'E VER — PARALEL)

Ikisi farkli branch, farkli dosyalar — paralel calisabilir.

**Codex Prompt 3 (Swagger):**
```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md, CLAUDE.md ve docs/remaining-work-plan.md oku.

Gorev KT-1: Swagger / OpenAPI Dokumantasyonu

1. Bagimlilik kur:
   cd backend && bun add @fastify/swagger @fastify/swagger-ui

2. backend/src/app.ts'e swagger plugin register et:
   - Sadece plugin kaydi yap (app.ts kuralina uy, is mantigi yok)
   - Route prefix: /api/docs
   - OpenAPI 3.0 spec
   - Baslik: "PaketJet API"
   - Auth: Bearer token (JWT) securityScheme

3. Mevcut 22 modulun route dosyalarinda schema tanimla:
   - Zod schemalar zaten validation.ts'de var
   - zod-to-json-schema ile Zod → JSON Schema donusumu yap
   - Her route'a request body, query params ve response schema ekle
   - Oncelik: ilanlar, bookings, wallet, auth (en cok kullanilan 4 modul)

4. Test et:
   - bun run dev ile baslat
   - http://localhost:8078/api/docs adresinde Swagger UI acilmali
   - En az 20 endpoint gorunmeli
   - "Authorize" butonu ile JWT token girildiginde admin endpoint'ler calisir

Branch: feat/swagger-docs
Testleri calistir: bun test
Build kontrol: bun run build
Bitince PR ac.

YAPMA: Mevcut route handler'lari degistirme, yeni endpoint ekleme,
controller/repository mantigi degistirme.
```

**Codex Prompt 4 (Structured Logging):**
```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md ve CLAUDE.md oku.

Gorev KT-3: Structured Logging (Pino)

Fastify zaten Pino kullanir. Yapilandirma eksik.

1. backend/src/index.ts veya app.ts'de logger konfigurasyonu:
   const app = Fastify({
     logger: {
       level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
       transport: process.env.NODE_ENV !== 'production'
         ? { target: 'pino-pretty', options: { colorize: true } }
         : undefined,
       serializers: {
         req(req) {
           return { method: req.method, url: req.url, id: req.id };
         },
         res(res) {
           return { statusCode: res.statusCode };
         },
       },
       redact: ['req.headers.authorization', 'req.body.password',
                 'req.body.current_password', 'req.body.new_password'],
     },
   });

2. bun add pino-pretty -D (dev dependency)

3. Mevcut handleRouteError fonksiyonunda structured error log ekle:
   request.log.error({ err, code }, 'Route error');

4. Test: bun run dev ile baslat, birkac request at,
   log ciktisinin yapilandirilmis oldugunu dogrula.

Branch: feat/structured-logging
Build kontrol: bun run build
Bitince PR ac.

YAPMA: handleRouteError fonksiyonunun davranisini degistirme,
mevcut hata yakalama mantigi ayni kalmali.
```

### Adim 2.2 — KT-2: Frontend Testler (CODEX'E VER)

> Swagger ve logging PR'lari beklemeden baslatilabilir (farkli dizin).

**Codex Prompt 5 (Frontend Tests):**
```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md oku. Frontend dizini: frontend/

Gorev KT-2: Frontend Component Testleri

1. Test altyapisi kur:
   cd frontend
   bun add -D vitest @testing-library/react @testing-library/jest-dom
   bun add -D @vitejs/plugin-react jsdom

2. vitest.config.ts olustur:
   - environment: 'jsdom'
   - setupFiles: './src/test/setup.ts'
   - include: ['src/**/*.test.{ts,tsx}']

3. src/test/setup.ts olustur:
   - import '@testing-library/jest-dom'

4. package.json'a script ekle:
   "test": "vitest run"
   "test:watch": "vitest"

5. Su testleri yaz:

   a) src/modules/auth/__tests__/auth.store.test.ts
      - login sonrasi user ve token set edilir
      - logout sonrasi state temizlenir
      - persist'ten geri yuklenir

   b) src/modules/ilan/__tests__/IlanCard.test.tsx
      - Ilan bilgileri dogru renderlanir (sehir, fiyat, kapasite)
      - "Detay" linki dogru URL'ye isaret eder

   c) src/modules/wallet/__tests__/wallet.test.tsx
      - Bakiye dogru gosterilir
      - Transaction listesi renderlanir

   d) src/modules/booking/__tests__/booking.test.tsx
      - Booking card status badge'i dogru renkte
      - Farkli statusler icin dogru butonlar gorunur

   e) src/components/__tests__/Header.test.tsx
      - Auth olmadan: "Giris Yap" + "Uye Ol" gorunur
      - Auth ile: "Panel" + "Cikis" gorunur

6. Tum testler gecmeli: bun run test

Branch: test/frontend-components
Bitince PR ac.

YAPMA: Mevcut component kodunu degistirme, sadece test dosyalari ekle.
API call'lari mock'la (vi.mock).
```

### Adim 2.3 — KT-4: Redis Cache (ONCE CLAUDE CODE, SONRA CODEX)

**Adim 2.3a — Claude Code'a sor (bana sor):**
```
Claude, PaketJet backend'i icin Redis cache stratejisi tasarla.

Mevcut endpoint'ler:
- GET /api/ilanlar (liste, filtrelenebilir)
- GET /api/ilanlar/:id (detay)
- GET /api/categories (sabit liste)
- GET /api/dashboard/* (admin stats)
- GET /api/bookings (kullaniciya ozel)

Sorular:
1. Hangileri cache'lenmeli, hangileri cache'lenmemeli?
2. TTL ne olmali?
3. Invalidation kurallari ne? (hangi event'te hangi cache temizlenir?)
4. Kullaniciya ozel veriler nasil cache'lenir?
5. Redis key pattern'i ne olmali?

Ciktiyi docs/redis-cache-design.md olarak yaz.
```

**Adim 2.3b — Codex'e ver (Claude Code'un plan dosyasindan sonra):**
```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md, CLAUDE.md ve docs/redis-cache-design.md oku.

Gorev KT-4: Redis Cache Uygulamasi

docs/redis-cache-design.md planina gore implement et.

1. bun add @fastify/redis (veya ioredis — plana gore)
2. Redis plugin'i app.ts'e register et
3. Cache middleware veya helper olustur
4. Planda belirtilen endpoint'lere cache ekle
5. Invalidation logic'i repository katmaninda

Branch: feat/redis-cache
Testleri calistir: bun test
Build kontrol: bun run build
Bitince PR ac.

YAPMA: docs/redis-cache-design.md'deki plandan sapma,
endpoint davranisini degistirme, yeni endpoint ekleme.
```

---

## FRAZ 3: Izleme & Gozlemlenebilirlik

> Fraz 2 PR'lari merge edildikten sonra basla.

### Adim 3.1 — IG-1 + IG-3: Sentry + Error Boundaries (CODEX'E VER — PARALEL)

**Codex Prompt 6 (Sentry):**
```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md oku.

Gorev IG-1: Sentry Error Tracking

1. Backend:
   cd backend && bun add @sentry/node
   - src/plugins/ altina sentry.ts plugin olustur
   - app.ts'de register et (diger plugin'ler gibi)
   - DSN: process.env.SENTRY_DSN (henuz bos olabilir, .env.example'a ekle)
   - Environment: process.env.NODE_ENV
   - Error handler'da Sentry.captureException ekle
   - Auth middleware'de user context: Sentry.setUser({ id })

2. Frontend:
   cd frontend && bun add @sentry/nextjs
   - sentry.client.config.ts + sentry.server.config.ts olustur
   - next.config.ts'e withSentryConfig wrapper ekle
   - DSN: process.env.NEXT_PUBLIC_SENTRY_DSN
   - Source maps: productionBrowserSourceMaps: false (sonra acilir)

3. .env.example dosyalarina SENTRY_DSN placeholder ekle

Branch: feat/sentry-integration
Build kontrol: bun run build (backend + frontend)
Bitince PR ac.

YAPMA: Gercek DSN ekleme (.env'e), mevcut error handling
mantigi degistirme (sadece Sentry.capture ekle).
```

**Codex Prompt 7 (Error Boundaries):**
```
Proje: /home/orhan/Documents/Projeler/paketjet
Once AGENTS.md oku. Frontend dizini: frontend/

Gorev IG-3: Frontend Error Boundaries

1. frontend/src/app/error.tsx — global error boundary:
   - "Bir hata olustu" mesaji (Turkce)
   - "Tekrar Dene" butonu (reset fonksiyonu)
   - Hata detayi sadece development'ta goster

2. frontend/src/app/panel/error.tsx — panel error boundary:
   - "Panel yuklenirken bir sorun olustu"
   - "Ana Sayfaya Don" + "Tekrar Dene" butonlari

3. frontend/src/app/not-found.tsx — ozel 404:
   - "Aradiginiz sayfa bulunamadi"
   - "Ana Sayfa" linki
   - PaketJet markasiyla uyumlu tasarim (token class'lari kullan)

4. frontend/src/app/loading.tsx — global loading:
   - Skeleton veya spinner
   - Token class'lari kullan (bg-surface, text-muted)

Branch: feat/error-boundaries
Build kontrol: bun run build
Bitince PR ac.

YAPMA: Mevcut sayfa layout'larini degistirme,
yeni route ekleme, API degistirme.
```

### Adim 3.2 — IG-2: Uptime Monitoring (SEN YAPIYORSUN)

```
Yapilacaklar:
1. VPS'e Uptime Kuma kur:
   docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data louislam/uptime-kuma

2. http://vps-ip:3001 adresinde Uptime Kuma'yi ac

3. Monitor ekle:
   - PaketJet Backend Health: https://api.paketjet.com/api/health
   - PaketJet Frontend: https://paketjet.com
   - PaketJet Admin: https://admin.paketjet.com
   - MySQL: TCP port 3306

4. Notification kanallarini ayarla:
   - Telegram bot (mevcut bot token'i kullan)
   - Email (SMTP)

5. Alert kurallari: 3 basarisiz check sonrasi bildirim
```

---

## FRAZ 4: Dogrulama (ANTIGRAVITY)

> Her fraz tamamlandiktan sonra Antigravity ile dogrula.

**Antigravity Prompt — Fraz 1 sonrasi:**
```
PaketJet dogrulama gorevi.

1. http://localhost:8078/api/health adresine git
   - { status: "ok", db: "ok" } donmeli
   - Screenshot al

2. http://localhost:3000 adresine git
   - Anasayfa yukleniyor mu?
   - Responsive kontrol: mobil (375px), tablet (768px), desktop (1280px)
   - Screenshot al

3. Login akisi test et:
   - /giris sayfasina git
   - Email + password gir
   - Basarili giristen sonra /panel/musteri'ye yonlendirme

4. Lighthouse calistir (anasayfa):
   - Performance, Accessibility, Best Practices, SEO skorlari
```

**Antigravity Prompt — Fraz 2 sonrasi:**
```
PaketJet dogrulama gorevi.

1. http://localhost:8078/api/docs adresine git
   - Swagger UI aciliyor mu?
   - En az 20 endpoint gorunuyor mu?
   - "Authorize" butonu var mi?
   - Screenshot al

2. /ilanlar sayfasina git
   - Ilan listesi yukleniyor mu?
   - Filtreler calisiyor mu?
   - Ilan detay sayfasina gecis calisiyor mu?

3. /panel/tasiyici sayfasina git (tasiyici hesabiyla)
   - "Gelen Talepler" ve "Ilanlarim" tab'lari
   - Booking onay/red islemleri

4. Lighthouse calistir:
   - Anasayfa, /ilanlar, /panel/musteri
   - Hedef: Performance 80+, Accessibility 90+
```

---

## PARALEL IS TABLOSU

Bu tablo hangi islerin ayni anda calisabilecegini gosterir:

```
Zaman  │ Codex Sandbox 1    │ Codex Sandbox 2    │ Codex Sandbox 3
───────┼────────────────────┼────────────────────┼──────────────────
Fraz 1 │ PD-2 Docker        │ PD-3 DB Migration  │ (bos)
       │ Health Check       │ Dogrulama          │
───────┼────────────────────┼────────────────────┼──────────────────
Fraz 2 │ KT-1 Swagger       │ KT-3 Logging       │ KT-2 Frontend
       │                    │                    │ Tests
───────┼────────────────────┼────────────────────┼──────────────────
Fraz 3 │ IG-1 Sentry        │ IG-3 Error         │ (bos)
       │                    │ Boundaries         │
───────┼────────────────────┼────────────────────┼──────────────────

KT-4 (Redis) sirayla: Claude Code tasarla → Codex uygula
```

**Maksimum verimlilik:** Codex 3 sandbox'ta paralel calisiyor.
**Sen (Orkestra Sefi):** Arkadasin bos kalmasini bekleme. PR acilinca hemen review et, merge et, sonraki fraz'i baslat.

---

## CEKLIS: Orkestra Sefi Olarak Kontrol Noktalarim

### Her Codex gorevinden ONCE:
- [ ] Dogru branch adini verdim mi?
- [ ] AGENTS.md'yi okumasi gerektigini belirttim mi?
- [ ] Gorev sinirlarini cizdim mi (YAPMA listesi)?
- [ ] Bagimsiz mi yoksa onceki PR'a mi bagli?

### Her PR acildiktan SONRA:
- [ ] PR diff'ine baktim mi?
- [ ] Build basarili mi? (GitHub Actions veya lokal)
- [ ] Testler geciyor mu?
- [ ] Mevcut kodu bozmus mu? (regression)
- [ ] Antigravity ile gorsel dogrulama gerekli mi?
- [ ] Merge edebilir miyim?

### Her fraz tamamlandiktan SONRA:
- [ ] Tum PR'lar merge edildi mi?
- [ ] Antigravity dogrulamasi yapildi mi?
- [ ] remaining-work-plan.md guncellendi mi?
- [ ] Sonraki fraz'a gecebilir miyim?

---

## Son Kapanis Listesi

### Codex Tarafi Tamamlananlar
- [x] PD-2: Docker production build + health check
- [x] PD-3: Database migration dogrulama
- [x] KT-1: Swagger / OpenAPI dokumantasyonu
- [x] KT-2: Frontend component testleri
- [x] KT-3: Structured logging (Pino)
- [x] KT-4: Redis cache uygulamasi
- [x] IG-1: Sentry error tracking
- [x] IG-3: Frontend error boundaries

### Simdi Siradaki Operator Adimlari
- [ ] PD-1: Production secret ve gercek `.env` degerlerini gir
  Referans: `docs/pd-1-env-checklist.md`
- [ ] IG-2: Uptime Kuma kur ve monitorleri ekle
  Referans: `docs/uptime-kuma-checklist.md`
- [ ] Fraz 1 dogrulamasi: Antigravity ile health + login + responsive kontrol
- [ ] Fraz 2 dogrulamasi: Antigravity ile Swagger + ilanlar + panel akislarini kontrol et
  Referans: `docs/antigravity-runbook.md`
- [ ] Tum ilgili PR/diff/build/test kontrollerini tamamla
- [ ] remaining-work-plan.md dosyasini son durumla guncelle
- [ ] Uygunsa merge islemlerini bitir ve bir sonraki faz kararini ver

### Onerilen Uygulama Sirasi
- [ ] 1. PD-1
- [ ] 2. IG-2
- [ ] 3. Antigravity dogrulamalari
- [ ] 4. PR / merge / dokuman kapanisi

---

## SSS (Sikca Sorulan Sorular)

**S: Codex bir gorevde takilirsa ne yapayim?**
C: Codex'i durdur. Claude Code'a "su gorevde Codex takildi, hata su: [hata mesaji]. Cozum oner." de. Claude Code duzeltme prompt'u versin, sonra Codex'e tekrar ver.

**S: Iki PR cakisiyor, merge conflict var. Ne yapayim?**
C: Once bagimsiz olan PR'i merge et. Sonra diger branch'i `git rebase main` ile guncelle. Conflict cozumu icin Claude Code'a danisabilirsin.

**S: Antigravity bir bug buldu. Kime vereyim?**
C: Bug'in tipine bak:
- Backend bug → Codex'e fix prompt'u ver (fix/ branch)
- UI/CSS bug → Kucukse Copilot ile kendin duzelt, buyukse Codex'e ver
- Mimari sorun → Claude Code'a danir

**S: Bir gorevi Codex yerine Claude Code'a yaptirabilir miyim?**
C: Evet ama verimli degil. Claude Code tek dosya/fonksiyon duzenlemelerinde iyi, toplu is icin Codex daha hizli. Claude Code'u tasarim + kucuk fix icin, Codex'i buyuk implementation icin kullan.

**S: Copilot ne zaman devreye girer?**
C: IDE'de her zaman aktif. PR review yaparken, kucuk typo fix'lerinde, import duzenlemelerinde otomatik calisir. Ayrıca prompt verme.
