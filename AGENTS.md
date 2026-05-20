# AGENTS.md — PaketJet (Codex Talimatlari)

## Canli Erisim Notu

Canli server `vps-paketjet` SSH kisa yolundadir. Key ile sifresiz erisim: `ssh vps-paketjet`.

## Proje Ozeti

PaketJet, P2P kargo pazaryeridir. Tasiyicilar guzergah/kapasite ilani acar, musteriler kargo alani satin alir (BlaBlaCar modeli, kargo icin).

## Workspace Haritasi

```
paketjet/
├── backend/        Fastify v5, Bun, MySQL 8 + Drizzle ORM    Port: 8078 (local) / 8083 (Docker)
├── frontend/       Next.js 15, React 19, Tailwind CSS v4      Port: 3000
├── admin_panel/    Next.js 15, Redux + RTK Query, Shadcn UI   Port: 3030
├── doku/           Tasarim dokumanlari, plan
├── nginx/          SSL reverse proxy
└── docker-compose.yml
```

## Komutlar

```bash
# Backend
cd backend && bun install && bun run dev          # localhost:8078
cd backend && bun test src/test/                   # Backend testler
cd backend && bun run db:seed                      # DB seed

# Frontend
cd frontend && bun install && bun run dev          # localhost:3000

# Admin Panel
cd admin_panel && bun install && bun run dev       # localhost:3030

# Docker (production)
docker compose up -d
```

## Backend Modul Pattern (Kati Kural)

```
modules/{modul}/
  schema.ts            — Drizzle tablo tanimlari
  validation.ts        — Zod semalari (input validation)
  repository.ts        — TUM DB sorgulari, repo* prefix
  controller.ts        — Public route handler'lar
  admin.controller.ts  — Admin route handler'lar
  service.ts           — Is mantigi (opsiyonel)
  router.ts            — Public route tanimlari (SADECE route kayitlari)
  admin.routes.ts      — Admin route tanimlari
```

**Kurallar:**
1. Router SADECE route tanimlar, 30 satiri gecmez
2. Controller'da DB sorgusu yok — repository'de
3. Repository'de HTTP yok — req/reply gecmez
4. Repository fonksiyonlari `repo` prefix ile baslar
5. Dosya boyutu limiti: 200 satir
6. Ortak helper/type/util `_shared/` icinde
7. Her handler'da try/catch + `handleRouteError`

## Frontend Modul Pattern

```
modules/{feature}/
  {feature}.schema.ts    — Zod validation
  {feature}.service.ts   — API calls
  {feature}.type.ts      — TypeScript types
  {feature}.store.ts     — Zustand store (gerekirse)
```

**Kurallar:**
- Tailwind v4 token siniflar: `bg-brand`, `text-foreground` — direkt hex yasak
- Dark mode: `data-theme="dark"` attribute, class degil
- Yeni sayfa → `config/routes.ts`'e sabit ekle
- Yeni endpoint → `config/api-endpoints.ts`'e ekle

## Admin Panel Kurallari

- Redux Toolkit + RTK Query kullanir
- Radix UI + Shadcn UI bilesenler
- Import'lar `@/integrations/shared` ve `@/integrations/hooks` barrel'larindan
- Biome linter (ESLint degil)

## Mevcut 22 Backend Modul

auth, ilanlar, bookings, wallet, subscription, notifications, profiles, mail, ratings, dashboard, audit, contact, telegram, storage, siteSettings, categories, theme, emailTemplates, carriers, reports, userRoles, _shared

## Test Standartlari

```bash
bun test src/test/              # Tum testler
bun test:auth                   # Auth testleri
bun test:booking                # Booking testleri
```

Mevcut 8 backend test dosyasi var. Frontend testleri henuz yok — test-generator skill'i ile yazilacak.

## Commit Mesaji

```
feat(backend): kisa aciklama
fix(frontend): kisa aciklama
test(backend): kisa aciklama
```

## Yapilmayacaklar

- `CLAUDE.md` degistirme (sadece Claude Code yapar)
- `project.portfolio.json` degistirme
- Docker/Nginx konfigurasyonu degistirme (mimari karar gerektirir)
- Mevcut modul yapisini bozma (yeni dosya eklenebilir, mevcut yapi degismez)
