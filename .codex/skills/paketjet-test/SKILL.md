---
name: paketjet-test
description: >
  PaketJet projesine ozel test yazma skill'i.
  Backend: Vitest + Fastify inject. Frontend: Vitest + React Testing Library.
  Mevcut 8 backend test dosyasini referans alir.
---

# PaketJet Test Generator Skill

## Mevcut Test Altyapisi

### Backend (8 test dosyasi mevcut)
```
backend/src/test/
├── auth.test.ts           — register, login, password reset
├── booking.test.ts        — create, confirm, deliver, refund
├── wallet.test.ts         — deposit, deduct, credit, transactions
├── ilan.test.ts           — CRUD, kapasite
├── carriers.test.ts       — carrier endpoints
├── carriers-admin.test.ts — admin carrier endpoints
├── category.test.ts       — kategori CRUD
└── api.test.ts            — health, genel API
```

Calistirma:
```bash
cd backend && bun test src/test/
bun test:auth
bun test:booking
```

### Frontend (HENUZ YOK — olusturulacak)

Gerekli paketler:
```bash
cd frontend
bun add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

## Backend Test Pattern

Mevcut testlerdeki pattern'i takip et:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../app';
import type { FastifyInstance } from 'fastify';

describe('GET /api/ilanlar', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('liste doner', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/ilanlar' });
    expect(res.statusCode).toBe(200);
  });

  it('auth olmadan protected route 401', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/ilanlar' });
    expect(res.statusCode).toBe(401);
  });
});
```

## Frontend Test Pattern

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// API mock
vi.mock('@/lib/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

// Zustand store mock
vi.mock('@/modules/auth/auth.store', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: '1', email: 'test@test.com', role: 'customer' },
    token: 'fake-token',
    isAuthenticated: true,
  })),
}));
```

### Zustand Store Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useAuthStore } from '../auth.store';

describe('AuthStore', () => {
  beforeEach(() => {
    act(() => useAuthStore.getState().logout());
  });

  it('login sonrasi user ve token set edilir', () => {
    act(() => {
      useAuthStore.getState().setAuth({
        user: { id: '1', email: 'test@test.com' },
        token: 'abc',
      });
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
```

## Oncelik Sirasi (Frontend Testler)

1. `modules/auth/` — login, register, store
2. `modules/ilan/` — IlanCard render, service mock
3. `modules/booking/` — booking card, status display
4. `modules/wallet/` — deposit form, transaction list
5. `components/Header.tsx` — auth-aware render

## Kurallar

- Test dosyasi: `*.test.ts` veya `*.test.tsx`
- Test dosyasi test ettigi dosyanin yaninda veya `__tests__/` altinda
- API call'lari MOCK'la (`vi.mock`)
- Zustand store'lari MOCK'la
- Her test beforeEach'te state temizle
- Coverage hedefi: yeni kod icin %80+
