# Copilot Instructions — PaketJet

## Proje

PaketJet: P2P kargo pazaryeri. Tasiyicilar ilan acar, musteriler kargo alani satin alir.

## Stack

- Backend: Fastify v5, Bun, MySQL 8, Drizzle ORM, Zod, JWT
- Frontend: Next.js 15, React 19, Tailwind CSS v4, Zustand, Zod
- Admin: Next.js 15, Redux Toolkit, RTK Query, Radix UI, Shadcn

## Genel Kurallar

- TypeScript strict — `any` yasak
- `import type` ayri satirda
- Ingilizce degisken/fonksiyon isimleri
- Console.log birakma
- Unused import temizle

## Backend Kurallar

- Router'da handler fonksiyonu OLMAZ (controller'a referans ver)
- Controller'da SQL sorgusu OLMAZ (repository cagir)
- Repository fonksiyonlari `repo` prefix: `repoGetIlanById`
- Her handler'da try/catch + `handleRouteError`
- `_shared/http.ts`'den import: `getAuthUserId`, `parsePage`, `sendNotFound`
- Max 200 satir/dosya

## Frontend Kurallar

- Server Components varsayilan
- `'use client'` sadece interaktif bilesenler icin
- Token class'lari: `bg-brand`, `text-foreground`, `bg-surface`
- Direkt hex renk YASAK
- Dark mode: `data-theme` attribute
- `next/image` ile gorsel, `next/font` ile font
- Form: React Hook Form + Zod
- State: Zustand (persist icin `zustand/middleware`)

## Admin Panel Kurallar

- Redux Toolkit + RTK Query
- Import: `@/integrations/shared` (types), `@/integrations/hooks` (RTK hooks)
- Radix UI + Shadcn bilesenler
- Biome linter

## Dosya Isimlendirme

- Route dosyalari: `router.ts`, `admin.routes.ts`
- Repository: `repository.ts` (repo* prefix fonksiyonlar)
- Validation: `validation.ts` (Zod semalari)
- Frontend module: `{feature}.type.ts`, `{feature}.service.ts`, `{feature}.schema.ts`

## Commit

```
<tip>(<kapsam>): <kisa aciklama>
```

tip: feat, fix, refactor, test, docs, chore
kapsam: backend, frontend, admin, docker, db
