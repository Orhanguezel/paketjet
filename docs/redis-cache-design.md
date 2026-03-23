# PaketJet Redis Cache Design

Tarih: 2026-03-21
Hazirlayan: Codex

## Kapsam

Bu plan mevcut endpoint davranisini degistirmeden Redis ile read-through cache ekler.

Cache'lenecek endpoint'ler:

- `GET /api/ilanlar`
- `GET /api/ilanlar/:id`
- `GET /api/dashboard/carrier`
- `GET /api/dashboard/customer`

Cache disi birakilanlar:

- `GET /api/bookings`:
  Kullaniciya ozel ve durum degisimi yogun. Stale veri riski yuksek.
- `GET /api/categories`:
  Backend'de su an public categories route yok. Yeni endpoint eklenmeyecek.

## TTL

- `ilanlar list`: 60 saniye
- `ilan detail`: 120 saniye
- `dashboard/*`: 300 saniye

## Key Pattern

- `cache:ilanlar:list:{normalized-query}`
- `cache:ilanlar:detail:{ilanId}`
- `cache:dashboard:carrier:{userId}`
- `cache:dashboard:customer:{userId}`

## Invalidation Kurallari

### Ilanlar

Su event'lerde `ilan` detail ve tum `ilan` list cache'leri temizlenir:

- ilan create
- ilan update
- ilan status update
- ilan delete
- booking sirasinda kapasite dusme
- booking iptalinde kapasite geri yukleme

Ek olarak ilgili tasiyicinin dashboard cache'i temizlenir.

### Dashboard

Su event'lerde ilgili kullanicilarin dashboard cache'i temizlenir:

- booking create
- booking status update
- booking payment status update
- wallet debit / credit / refund
- manual deposit
- iyzico callback ile basarili deposit
- ilan create / update / delete / status update

## Uygulama Modeli

- Read path:
  Controller cache'ten okumayi dener, hit varsa direkt response doner.
- Write path:
  Repository/service katmaninda prefix bazli invalidation yapilir.
- Failure mode:
  Redis hata verirse request akisi DB ile devam eder. Cache best-effort calisir.
