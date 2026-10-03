# Shopier Entegrasyonu — Tasarım ve Bağlama Planı

**Tarih:** 2026-10-03 · **Karar:** Kart ödemesi için tek sağlayıcı Shopier. iyzico ve PayTR iptal
(hesapları hiç kurulamadı, canlıda zaten `PAYMENT_PROVIDER=disabled`). Havale/EFT akışı ayrı kalır.

## Durum

| Parça | Durum |
|---|---|
| `backend/src/modules/purchases/shopier.ts` — form imzası, dönüş doğrulama, REST teyidi | ✅ yazıldı |
| `backend/src/test/shopier.test.ts` — 6 test | ✅ geçiyor |
| `env.ts` + `.env.example` — `SHOPIER_API_KEY/SECRET/WEBSITE_INDEX/PAT` | ✅ |
| Ödeme başlatma / dönüş route'ları / frontend yönlendirme | ⏳ havale işi commit'lenince (aynı dosyalar) |
| iyzico + PayTR kodunun silinmesi | ⏳ aynı turda |
| Shopier mağazası + API anahtarları + PAT | ⛔ hesap sahibinde — **shopier.com**, Shopify DEĞİL |

## Güvenlik kararı (değiştirilemez)

Shopier dönüş imzası yalnız `random_nr + platform_order_id` üzerinedir. `status` ve `payment_id`
**imzalı değildir** ve dönüş kullanıcının tarayıcısından gelir. Kullanıcı başarısız bir ödemenin
dönüşünü `status=success` yaparak tekrar gönderebilir.

Bu yüzden:
1. `verifyShopierCallback` yalnız "bu sipariş no bize ait" der; ödeme kanıtı değildir.
2. Ödeme **yalnız** `verifyShopierPayment(payment_id, {amount, email})` → Shopier REST API
   `GET /v1/orders/{id}` ile `paymentStatus=paid`, `currency=TRY`, tutar kuruşu kuruşuna eşit ise tamamlanır.
3. `payment_sessions.provider_payment_id` unique index'i aynı Shopier siparişinin iki kez
   kullanılmasını engeller (`('shopier', payment_id)`).
4. PAT yoksa / API hata verirse / sipariş bulunamazsa → oturum `review` durumuna düşer, hak/iletişim
   AÇILMAZ; admin Shopier panelinden kontrol edip mevcut inceleme ekranından onaylar.
5. `shopierConfigured()` üç değişkenin üçünü de ister; PAT'siz Shopier açılmaz.

**Doğrulanması gereken varsayım:** `api_pay4` ile alınan ödemenin dönüşteki `payment_id`'sinin
REST API'deki sipariş `id`'si olduğu. İlk gerçek küçük ödemede kontrol edilecek. Değilse teyit
`GET /v1/orders?customerEmail=...&dateStart=...` ile tutar+zaman eşleşmesine çevrilir.

## Bağlama adımları

### Backend
1. `payment-policy.ts` — `PaymentProvider = 'shopier'`; `configured = shopierConfigured()`;
   sandbox kavramı yok (Shopier test modu sunmuyor), `enabled = PAYMENT_PROVIDER==='shopier' && configured`.
2. `validation.ts` — `provider: z.enum(['shopier']).optional()` (iki şema).
3. `payment.controller.ts` — iyzico/PayTR dallarını sil, yerine:
   ```ts
   const checkout = buildShopierCheckout({ orderId: ref, amount, productName, buyer: {...},
     callbackUrl: `${env.PUBLIC_URL}/api/payments/shopier/callback` });
   await repoSavePaymentToken(ref, checkout.fields.random_nr + ref); // oturumu pending'e alır
   return reply.send({ provider: 'shopier', redirect: checkout, conversationId: ref, amount });
   ```
   productName: kredi → `${credits} İlan Alma Hakkı`, ilan → `İlan iletişim erişimi`.
4. Yeni `shopier.controller.ts` — `POST /payments/shopier/callback` (kredi ve ilan için TEK adres;
   Shopier panelinde tek dönüş URL'si var, ayrımı `session.kind` yapar):
   - `verifyShopierCallback` null → 400.
   - `repoPaymentByRef(orderId)`; yoksa veya `provider!=='shopier'` → 400.
   - `status!=='success'` → `fail(ref, kind)`.
   - aksi halde `verifyShopierPayment(paymentId, {amount: session.amount, email: user.email})`:
     ok → `complete(ref, kind, {provider:'shopier', amount, currency:'TRY', paymentId: check.orderId})`;
     değilse → `repoMarkPayment(ref, 'review', 'shopier_' + reason)`.
   - Her durumda `302 → ${FRONTEND_URL}/panel/ilan-alma-hakki/odeme-sonuc?ref=...`.
   - `complete/fail` yardımcıları `callback.controller.ts`'ten bu dosyaya taşınır.
5. `router.ts` — iyzico/PayTR callback route'larını sil, Shopier callback'i ekle. Dönüş
   `application/x-www-form-urlencoded` POST'tur; `@fastify/formbody` kayıtlı mı kontrol et.
6. Sil: `wallet/iyzico.ts`, `wallet/paytr.ts`, `wallet/helpers/iyzico.ts`, `callback.controller.ts`
   (taşındıktan sonra), `env.ts` IYZICO_*/PAYTR_*, `.env*.example` satırları, `iyzipay` paketi.
   `bookings/payment.*` ve `wallet/router.ts` eski model; kullanıyorlarsa onlar da `payments_unavailable`.
7. Bakım işi (`renewal-maintenance.ts`) zaman aşımına uğrayan `pending` Shopier oturumlarını
   zaten `review`'a taşıyor — kullanıcı ödeme sonrası sekmeyi kapatırsa ödeme kaybolmaz, incelemeye düşer.

### Frontend
1. `payments.type.ts` — `PaymentAvailability.provider: 'shopier' | null`;
   yanıt tipi `{provider:'shopier'; redirect:{action; method:'POST'; fields: Record<string,string>}; conversationId; amount}`.
2. Yeni `lib/submit-form.ts` — gizli `<form>` oluşturup `fields`'i input olarak ekler, `submit()`.
   Shopier **iframe içinde açılmaz** (3D Secure ve mobil banka uygulaması yönlendirmeleri için tam sayfa).
3. `ilan-alma-hakki/page.tsx` + `ilanlar/[id]/RevealAside.tsx` — `provider==='shopier'` ise
   `PaymentModal` yerine `submitForm(redirect)`. iyzico/PayTR `iframeUrl/checkoutFormContent` dalları silinir.
4. `PaymentModal.tsx` başka kullanan yoksa silinir. `purchases.service.ts` provider parametresi `'shopier'`.
5. Ödeme sonuç sayfası değişmez; `review` durumunda "Ödemen alındı, kontrol ediliyor" metni gösterilmeli.

### Admin
Mevcut ödeme inceleme ekranı `review` oturumlarını listeler; `error_code` `shopier_*` için okunur etiket ekle
(`shopier_unpaid` → "Shopier'de ödenmemiş görünüyor", `shopier_api_error` → "Shopier'e ulaşılamadı" ...).

## Hesap sahibinin yapacakları (shopier.com)

1. **shopier.com**'da satıcı hesabı açıp mağaza onayını almak (kimlik, IBAN, vergi bilgisi).
2. Satılan şeyin dijital hizmet (ilan iletişim erişimi, kullanım hakkı) olduğunu Shopier'e bildirip kabul ettiklerini ve komisyon oranını yazılı teyit etmek.
3. Panel → **Entegrasyonlar → Modül Yönetimi → Modül Ayarları**: API kullanıcı (key) + API şifre (secret) al;
   geri dönüş adresine `https://paketjet.com/api/payments/shopier/callback` yaz. Kaçıncı site olduğu = `SHOPIER_WEBSITE_INDEX`.
4. **developer.shopier.com** → Kişisel erişim anahtarı (PAT) oluştur, sipariş okuma yetkisiyle.
5. Dört değeri WhatsApp'tan değil, sunucuya doğrudan veya şifreli kanaldan ilet.

## Canlıya alma
1. Değişkenler `/var/www/paketjet-current/backend/.env`'e + `PAYMENT_PROVIDER=shopier`.
2. Release akışı (`prepare-release.sh` → `publish-release.sh`). **Not:** `publish-release.sh` PM2 env'ine
   `PAYMENT_PROVIDER: 'disabled'` yazıyor — Shopier açılırken bu sabit betikte `shopier` yapılmalı.
3. En küçük paketle tek gerçek ödeme (onaylı para hareketi) → `payment_id` ↔ REST `id` varsayımını doğrula → iade.
