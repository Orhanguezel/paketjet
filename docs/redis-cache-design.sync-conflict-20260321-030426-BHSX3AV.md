# PaketJet — Redis Cache Stratejisi

## 1. Genel Mimari

```
Client → Fastify Route → Cache Middleware → Controller → Repository → MySQL
                ↑                                              │
                └──────────── Redis (hit) ◄────────────────────┘
                                                         (miss → set)
```

- **Cache Layer:** `@fastify/redis` plugin (ioredis altinda)
- **Key Prefix:** `pj:` (namespace collision onleme)
- **Serialization:** `JSON.stringify` / `JSON.parse`
- **Default TTL:** Endpoint bazinda, asagida tanimli

---

## 2. Cache Edilecek Endpoint'ler

### Tier 1 — Agresif Cache (nadiren degisir)

| Endpoint | Key Pattern | TTL | Aciklama |
|----------|-------------|-----|----------|
| `GET /site_settings` | `pj:ss:list:{locale}:{prefix}` | 6 saat | Admin config, cok yavas degisir |
| `GET /site_settings/:key` | `pj:ss:{key}:{locale}` | 6 saat | Tekil ayar |
| `GET /site_settings/seo` | `pj:ss:seo:{locale}` | 6 saat | SEO metadata |
| `GET /site_settings/seo/:pageKey` | `pj:ss:seo:{pageKey}:{locale}` | 6 saat | Sayfa bazli SEO |
| `GET /site_settings/homepage` | `pj:ss:homepage:{locale}` | 6 saat | Anasayfa config |
| `GET /site_settings/app-locales` | `pj:ss:locales` | 6 saat | Dil listesi |
| `GET /site_settings/default-locale` | `pj:ss:default-locale` | 6 saat | Varsayilan dil |

### Tier 2 — Orta Cache (dakikalar)

| Endpoint | Key Pattern | TTL | Aciklama |
|----------|-------------|-----|----------|
| `GET /ilanlar` | `pj:ilans:{hash(query)}` | 3 dk | Public liste, filtre+sayfalama |
| `GET /ilanlar/:id` | `pj:ilan:{id}` | 5 dk | Public detay |
| `GET /admin/dashboard/summary` | `pj:admin:summary` | 15 dk | Global istatistik |
| `GET /admin/dashboard/stats/revenue` | `pj:admin:revenue` | 1 saat | Aylik gelir raporu |
| `GET /admin/dashboard/stats/activity` | `pj:admin:activity` | 1 saat | Gunluk aktivite |
| `GET /admin/categories/list` | `pj:cats:{locale}:{module_key}` | 1 saat | Kategori listesi |

### Tier 3 — Kisa Cache (kullaniciya ozel)

| Endpoint | Key Pattern | TTL | Aciklama |
|----------|-------------|-----|----------|
| `GET /ilanlar/my` | `pj:my-ilans:{userId}` | 1 dk | Tasiyici kendi ilanlari |
| `GET /dashboard/carrier` | `pj:dash:carrier:{userId}` | 2 dk | Tasiyici dashboard |
| `GET /dashboard/customer` | `pj:dash:customer:{userId}` | 2 dk | Musteri dashboard |
| `GET /wallet` | `pj:wallet:{userId}` | 30 sn | Bakiye bilgisi |
| `GET /wallet/transactions` | `pj:wallet:tx:{userId}:{page}` | 5 dk | Islem gecmisi |

### Cache Edilmeyecekler

| Endpoint | Sebep |
|----------|-------|
| `GET /bookings` | Cok sik degisir (status: pending→confirmed→in_transit→delivered) |
| `GET /bookings/:id` | Immediate consistency gerekli (takip sayfasi) |
| `POST/PATCH/DELETE *` | Write islemleri cache'lenmez |
| `GET /notifications` | Kullaniciya ozel + real-time beklenti |
| `GET /audit/*` | SSE stream, cache uyumsuz |

---

## 3. Key Tasarimi

### Pattern
```
pj:{scope}:{identifier}:{params}
```

### Ornekler
```
pj:ss:list:tr:paketjet           → site_settings listesi (tr, paketjet prefix)
pj:ilan:abc-123-def              → ilan detay
pj:ilans:a1b2c3d4                → ilan listesi (query hash)
pj:my-ilans:user-uuid            → kullanicinin ilanlari
pj:dash:carrier:user-uuid        → tasiyici dashboard
pj:wallet:user-uuid              → cuzdan bakiye
pj:wallet:tx:user-uuid:1         → cuzdan islemleri sayfa 1
pj:admin:summary                 → admin dashboard ozet
pj:admin:revenue                 → admin gelir istatistigi
pj:cats:tr:ilanlar               → kategori listesi
```

### Query Hash Fonksiyonu
```typescript
import { createHash } from 'crypto';

function hashQuery(params: Record<string, unknown>): string {
  const sorted = JSON.stringify(params, Object.keys(params).sort());
  return createHash('md5').update(sorted).digest('hex').slice(0, 8);
}
```

---

## 4. Cache Helper API

```typescript
// src/common/cache.ts

export interface CacheOptions {
  ttl: number;       // saniye cinsinden
  key: string;       // Redis key
}

/** Cache'den oku, yoksa fn calistir ve cache'e yaz */
export async function cached<T>(
  redis: FastifyRedis,
  opts: CacheOptions,
  fn: () => Promise<T>,
): Promise<T> {
  const raw = await redis.get(opts.key);
  if (raw !== null) {
    return JSON.parse(raw) as T;
  }
  const result = await fn();
  await redis.set(opts.key, JSON.stringify(result), 'EX', opts.ttl);
  return result;
}

/** Tek key sil */
export async function invalidate(redis: FastifyRedis, key: string): Promise<void> {
  await redis.del(key);
}

/** Pattern ile toplu sil (SCAN tabanli, KEYS kullanma) */
export async function invalidatePattern(redis: FastifyRedis, pattern: string): Promise<void> {
  let cursor = '0';
  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = next;
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== '0');
}
```

---

## 5. Invalidation Kurallari

### Event → Temizlenecek Cache Key'leri

| Event | Temizlenecek Key'ler |
|-------|---------------------|
| **Ilan olusturuldu** | `pj:ilans:*`, `pj:my-ilans:{userId}`, `pj:dash:carrier:{userId}`, `pj:admin:summary` |
| **Ilan guncellendi** | `pj:ilan:{id}`, `pj:ilans:*`, `pj:my-ilans:{userId}` |
| **Ilan silindi/durduruldu** | `pj:ilan:{id}`, `pj:ilans:*`, `pj:my-ilans:{userId}`, `pj:admin:summary` |
| **Booking olusturuldu** | `pj:ilan:{ilanId}`, `pj:ilans:*`, `pj:dash:carrier:{carrierId}`, `pj:dash:customer:{customerId}`, `pj:wallet:{customerId}`, `pj:wallet:tx:{customerId}:*`, `pj:admin:summary` |
| **Booking status degisti** | `pj:dash:carrier:{carrierId}`, `pj:dash:customer:{customerId}` |
| **Booking delivered** | Yukaridakiler + `pj:wallet:{carrierId}`, `pj:wallet:tx:{carrierId}:*`, `pj:admin:revenue` |
| **Booking iptal (refund)** | `pj:ilan:{ilanId}`, `pj:ilans:*`, `pj:wallet:{customerId}`, `pj:wallet:tx:{customerId}:*`, `pj:dash:*:{customerId}`, `pj:dash:*:{carrierId}` |
| **Wallet deposit** | `pj:wallet:{userId}`, `pj:wallet:tx:{userId}:*` |
| **Site setting guncellendi** | `pj:ss:*` (tum site settings) |
| **Kategori CRUD** | `pj:cats:*` (tum kategoriler) |
| **Admin user/carrier islem** | `pj:admin:summary` |

### Invalidation Yeri

Invalidation cagrilari **controller** veya **service** katmaninda yapilir (write isleminden hemen sonra).
Repository katmani Redis'i bilmez.

```typescript
// Ornek: bookings/controller.ts — createBooking handler icerisinde
await repoCreateBooking(data);

// Cache invalidation
await invalidatePattern(redis, 'pj:ilans:*');
await invalidate(redis, `pj:ilan:${data.ilan_id}`);
await invalidate(redis, `pj:dash:carrier:${carrierId}`);
await invalidate(redis, `pj:dash:customer:${customerId}`);
await invalidate(redis, `pj:wallet:${customerId}`);
await invalidatePattern(redis, `pj:wallet:tx:${customerId}:*`);
```

---

## 6. Redis Plugin Kaydi

```typescript
// src/app.ts icinde
import fastifyRedis from '@fastify/redis';

app.register(fastifyRedis, {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});
```

### Env Degiskenleri (.env.example)
```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## 7. Graceful Degradation

Redis baglantisi koparsa uygulama calismaya devam etmeli:

```typescript
export async function cached<T>(
  redis: FastifyRedis | null,
  opts: CacheOptions,
  fn: () => Promise<T>,
): Promise<T> {
  // Redis yoksa veya baglanti hatasi varsa direkt DB'ye git
  if (!redis) return fn();

  try {
    const raw = await redis.get(opts.key);
    if (raw !== null) return JSON.parse(raw) as T;
  } catch {
    // Redis read hatasi — DB'ye fallback
  }

  const result = await fn();

  try {
    await redis.set(opts.key, JSON.stringify(result), 'EX', opts.ttl);
  } catch {
    // Redis write hatasi — sessizce devam
  }

  return result;
}
```

---

## 8. Controller Kullanim Ornegi

```typescript
// modules/ilanlar/controller.ts
import { cached } from '@/common/cache';

export async function listIlans(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string>;
    const params = listIlansSchema.parse(q);
    const key = `pj:ilans:${hashQuery(params)}`;

    const result = await cached(req.server.redis, { key, ttl: 180 }, () =>
      repoListIlans(params),
    );

    reply.header('x-total-count', result.total);
    return reply.send(result.items);
  } catch (e) {
    return handleRouteError(reply, req, e, 'list_ilans');
  }
}
```

---

## 9. Oncelik Sirasi (Implementasyon)

1. **`@fastify/redis` plugin + `common/cache.ts` helper** — temel altyapi
2. **Site Settings** (Tier 1) — en yuksek kazanc/risk orani, cok nadiren degisir
3. **Ilan listesi + detay** (Tier 2) — en yuksek trafik
4. **Admin dashboard stats** (Tier 2) — agir sorgular, dusuk RPS
5. **Kategori listesi** (Tier 2) — nadiren degisir
6. **User dashboard + wallet** (Tier 3) — per-user, dikkatli invalidation gerekli

---

## 10. Metrikler & Izleme

Cache performansini olcmek icin:
- `req.log.info({ cacheHit: true, key }, 'cache_hit')` — hit loglama
- `req.log.info({ cacheHit: false, key }, 'cache_miss')` — miss loglama
- Hit rate hedefi: Site Settings %99+, Ilanlar %70+, Dashboard %80+
