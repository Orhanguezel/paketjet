---
name: paketjet-feature
description: >
  PaketJet projesine ozel ozellik gelistirme skill'i.
  Fastify v5 backend + Next.js 15 frontend modul pattern'ini uygular.
  22 modullu mevcut yapiya uyumlu calisir.
---

# PaketJet Feature Builder Skill

## Ne Zaman Kullanilir

- Yeni backend endpoint implement ederken
- Yeni frontend sayfa/bilesen olusturururken
- Mevcut modullere ozellik eklerken

## Gelistirme Oncesi

1. `AGENTS.md` oku — genel kurallar
2. `CLAUDE.md` oku — modul pattern, kodlama standartlari
3. `docs/remaining-work-plan.md` oku — gorev detaylari
4. Ilgili mevcut modul kodunu oku — pattern'i anla

## Backend Yeni Endpoint Ekleme

### Mevcut Module Endpoint Ekleme

```bash
# 1. validation.ts'e Zod schema ekle
# 2. repository.ts'e repo* fonksiyonu ekle
# 3. controller.ts'e handler ekle
# 4. router.ts'e route ekle
# 5. Test yaz
```

### Yeni Modul Olusturma

```bash
# 1. modules/{yeni_modul}/ dizini olustur
# 2. schema.ts — Drizzle tablo tanimlari
# 3. validation.ts — Zod semalari
# 4. repository.ts — DB sorgulari
# 5. controller.ts — Handler'lar
# 6. router.ts — Route tanimlari
# 7. (admin varsa) admin.controller.ts + admin.routes.ts
# 8. routes.ts'e register et (app.ts'e DEGIL)
# 9. Test yaz
# 10. DB migration SQL olustur (backend/src/db/seed/sql/)
```

### Kati Kurallar (Ihlal Edilemez)

| Kural | Detay |
|-------|-------|
| Router max 30 satir | Sadece route tanimlari, handler yok |
| Controller'da SQL yok | Tum sorgular repository'de |
| Repository'de HTTP yok | req/reply gecmez |
| repo* prefix | `repoGetIlanById`, `repoCreateBooking` |
| Max 200 satir/dosya | Gecerse bol: controller + admin.controller |
| try/catch zorunlu | `handleRouteError` ile |
| `_shared/http.ts` import | `getAuthUserId`, `handleRouteError`, `parsePage` |

## Frontend Yeni Sayfa Ekleme

```bash
# 1. modules/{feature}/ dizini olustur
#    - {feature}.type.ts
#    - {feature}.schema.ts
#    - {feature}.service.ts
#    - {feature}.store.ts (gerekirse)
# 2. app/{route}/page.tsx olustur
# 3. config/routes.ts'e route sabiti ekle
# 4. config/api-endpoints.ts'e endpoint ekle
# 5. Token class'lari kullan (bg-brand, text-foreground)
# 6. Server Component varsayilan, 'use client' sadece gerektiginde
# 7. next/image + next/font zorunlu
```

## Build & Test Kontrol

Her degisiklik sonrasi:

```bash
# Backend
cd backend && bun run build && bun test

# Frontend
cd frontend && bun run build

# Admin Panel (degistiyse)
cd admin_panel && bun run build
```

Build basarisizsa commit YAPMA, once duzelt.

## Yapilmayacaklar

- `CLAUDE.md` degistirme
- `project.portfolio.json` degistirme
- `app.ts`'e modul register etme (routes.ts'e ekle)
- `.env`'e gercek secret ekleme
- Mevcut modul yapisini degistirme (sadece ekleme)
- Docker/Nginx konfigurasyonu degistirme
