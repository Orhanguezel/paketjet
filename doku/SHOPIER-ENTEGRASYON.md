# Shopier Entegrasyonu

**Karar (2026-10-03):** Kart ödemesi için tek sağlayıcı Shopier. iyzico ve PayTR kaldırıldı (hiç kurulamadı).
Havale/EFT akışı ayrı devam eder; Shopier açıksa kartla ödeme önceliklidir.

## Neden bu yöntem

Yeni Shopier panelinde eski "Modül Yönetimi" (API kullanıcı/şifre, `api_pay4` formu) **yok**. Elimizdeki tek
araç Shopier REST API (`api.shopier.com/v1`) ve kişisel erişim anahtarı (PAT). REST API'de "ödeme başlat"
ucu yok; bu yüzden her ödeme için Shopier'de **tek kullanımlık, vitrinde görünmeyen dijital ürün** açılır.

Not: PAT ile `GET /products` 403 döner, ama `POST /products` ve `DELETE /products/{id}` çalışır (2026-10-03 denendi).

## Akış

1. Kullanıcı ödeme başlatır → `payment_sessions` kaydı (`provider='shopier'`, 30 dk geçerli).
2. `POST /v1/products` — `customListing:true`, `type:digital`, `stockQuantity:1`, fiyat = tutar.
   Ürün kimliği `payment_sessions.provider_checkout_id`'ye yazılır (068), durum `pending`.
3. Ön yüz Shopier ürün sayfasını **yeni sekmede** açar (pencere tıklama anında açılır, mobil engellemesin);
   bu sekme `/panel/ilan-alma-hakki/odeme-sonuc?ref=…` sayfasına geçip durumu izler.
4. Ödeme sonrası Shopier `order.created` webhook'u gönderir → `POST /api/payments/shopier/webhook`.
5. Webhook imzası (`Shopier-Signature` = ham gövdenin `SHOPIER_WEBHOOK_TOKEN` ile HMAC-SHA256'sı) doğrulanır,
   ama **gövdeye güvenilmez**: sipariş `GET /v1/orders/{id}` ile okunur.
6. `checkShopierOrder`: `paymentStatus=paid`, `currency=TRY`, tek kalem, ürün kimliği eşleşir, adet 1,
   kalem toplamı ve sipariş toplamı kuruşu kuruşuna tutar. Tutarsa hak/iletişim açılır, ürün silinir.
   Tutmazsa oturum `review` (`shopier_amount`, `shopier_product`, …) → admin "Ödeme incelemeleri".
7. Webhook kaçarsa: sonuç sayfası 30 sn'de bir `POST /api/payments/:ref/shopier/check` çağırır →
   `GET /v1/orders?productId=…` ile aynı doğrulama. Kullanıcı "Ödememi kontrol et" ile de tetikler.
8. Süre dolan oturum bakım işinde `review`'a alınır ve Shopier ürünü silinir (geç ödeme alınmaz).

Tekrar güvenliği: tamamlama idempotent; `(provider, provider_payment_id)` unique — aynı Shopier siparişi iki
ödemede kullanılamaz; `(provider, provider_checkout_id)` unique.

## Ortam değişkenleri (backend)

| Değişken | Değer |
|---|---|
| `PAYMENT_PROVIDER` | `shopier` (yayın betiği PM2 env'ine yazar — aşağıya bak) |
| `SHOPIER_PAT` | Shopier → Hesap Yönetimi → Kişisel Erişim Anahtarı |
| `SHOPIER_WEBHOOK_TOKEN` | `POST /v1/webhooks {event:"order.created", url}` yanıtındaki `token` |
| `SHOPIER_PRODUCT_IMAGE_URL` | Ödeme ürününe konan herkese açık jpg/png |

Üçü de dolu değilse kartla ödeme kapalıdır (fail-closed).

## Canlıya alma

1. Kod yayını (`prepare-release.sh` → `publish-release.sh`); 068 migration listesinde.
2. Webhook aboneliği: `POST /v1/webhooks` → token `.env`'e.
3. `SHOPIER_PRODUCT_IMAGE_URL` `.env`'e.
4. `/var/backups/paketjet/renewal-20260909/publish-release.sh` içinde PM2 env'i `PAYMENT_PROVIDER:'disabled'`
   sabit — açmak için `'shopier'` yapılıp süreçler yeniden başlatılır.
5. En küçük paketle tek gerçek ödeme → webhook ve hak açılması doğrulanır → Shopier panelinden iade.

## Mağaza ayarları (API ile yapıldı)

Başlık, slogan, bildiri, sipariş onay mesajı, e-posta, telefon dolduruldu; **sepet kapalı** (her sipariş tek
ürün olmalı, eşleştirme buna dayanıyor). Panelden değiştirirken sepeti açmayın.

## İade

- **Admin:** Ödeme incelemeleri → kayıt detayı → "Shopier'den iade et" (yalnız tam tutar, not zorunlu).
  `POST /api/admin/payment-operations/:ref/refund` → `POST /v1/refunds {orderId, amount, note}`; oturum `refund_pending`.
- **Shopier panelinden yapılan iade** de aynı yoldan işlenir (`refund.requested` / `refund.updated` webhook'u).
- Karar her zaman `GET /v1/refunds/{id}` okumasıyla verilir:
  - `succeeded` + tutar = ödeme tutarı → hak paketi: kullanılmamış haklar düşülür (`credit_ledger.reason='payment_refund'`);
    ilan iletişimi: `ilan_purchases.status='refunded'` → iletişim erişimi kapanır. Oturum `refunded`.
    Haklar iadeden önce harcanmışsa bakiye eksiye düşmez; `error_code='refund_credits_already_used'`.
  - `failed` → `review` (`shopier_refund_failed`); kısmi iade → `review` (`shopier_partial_refund`). Otomatik geri alma yok.
  - `pending` → bekler; admin "İade durumunu yenile" ile `POST …/refund/sync`.
- İade edilen ilan tekrar satışa açılmaz (`ilan_purchases` ilan başına tek satır); gerekirse admin elle yönetir.
- Her webhook aboneliğinin ayrı token'ı var: `SHOPIER_WEBHOOK_TOKEN` virgülle ayrılmış liste
  (`order.created`, `refund.requested`, `refund.updated`).
