---
name: paketjet-pr
description: >
  PaketJet projesine ozel PR olusturma skill'i.
  Commit mesaji, branch adlandirma ve PR formati standartlari.
---

# PaketJet PR Creator Skill

## Branch Adlandirma

```
feat/swagger-docs           — Yeni ozellik
fix/booking-race-condition  — Bug fix
test/frontend-components    — Test ekleme
refactor/wallet-service     — Refactoring
chore/docker-health-check   — Bakim/altyapi
```

## Commit Mesaji

```
<tip>(<kapsam>): <kisa aciklama>

Ornekler:
feat(backend): add Swagger/OpenAPI documentation
fix(frontend): resolve booking status update race condition
test(frontend): add auth and booking component tests
refactor(backend): extract cache middleware from controller
chore(docker): add health check endpoint and container checks
```

Kapsam: `backend`, `frontend`, `admin`, `docker`, `nginx`, `db`

## PR Acmadan Once

```bash
# Backend degistiyse:
cd backend && bun run build && bun test

# Frontend degistiyse:
cd frontend && bun run build

# Admin degistiyse:
cd admin_panel && bun run build
```

**HEPSI basariliysa** PR ac. Biri basarisizsa ONCE DUZELT.

## PR Formati

```bash
gh pr create --title "<tip>(<kapsam>): <baslik>" --body "$(cat <<'EOF'
## Ozet
- <ne yapildi 1>
- <ne yapildi 2>

## Degisiklik Turu
- [ ] Yeni ozellik (feat)
- [ ] Bug duzeltme (fix)
- [ ] Test
- [ ] Refactoring
- [ ] Altyapi/bakim

## Test Edilen
- [ ] `bun test` gecti (backend)
- [ ] `bun run build` basarili (frontend)
- [ ] Manuel test yapildi
- [ ] Mevcut testler kirilmadi

## Etkilenen Moduller
- backend/src/modules/xxx
- frontend/src/modules/xxx

## Kontrol
- [ ] TypeScript strict uyumlu
- [ ] Console.log kalmadi
- [ ] 200 satir limiti asilmadi
- [ ] Yeni route routes.ts'e eklendi (app.ts'e degil)
EOF
)"
```

## Yapilmayacaklar

- `main` branch'e direkt push
- `--force` push
- `--no-verify` ile hook atlama
- WIP (is bitmeden) PR acma
- Bos commit
