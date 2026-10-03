# Geçici havale ve test akışı

Kart sağlayıcısı kapalıyken hak paketi ve ilan iletişimi için havale talebi oluşturulabilir. Talep `pending`, kullanıcının bildirimi `review`, yönetici kararı `completed` veya `failed` durumuna geçer. Bildirim tek başına hak ya da iletişim açmaz. İlan rezervasyonu 48 saat sürer; bu süre veya ilan geçerliliği dolarsa onay denemesi `refund_pending` incelemesine düşer.

## Test modu

Backend ortamında `BANK_TRANSFER_TEST_MODE=true` ve `BANK_TRANSFER_TEST_EMAILS` virgülle ayrılmış demo hesap adresleri olarak tanımlanır. Yalnız listedeki hesaplar `bank_test` sağlayıcısını görür. Ekranda IBAN gösterilmez ve gerçek para gönderilmemesi söylenir. Yönetici test onayı, demo hakkını veya ilan iletişimini açar. `bank_test` işlemleri tahsilat toplamına eklenmez. Test dışı hesaplar için kart kapalıysa ödeme kapalı kalır.

## Gerçek havale

Yönetim panelindeki `bank_details` ayarında geçerli TR IBAN, alıcı adı ve banka adı tamamlanır. Ardından `BANK_TRANSFER_ENABLED=true` ayarlanır. IBAN doğrulaması başarısızsa akış kapalı kalır. Havale açıklamasına `PaketJet <işlem referansı>` yazılır. Yönetici, banka hareketinde tutarı ve işlem kimliğini doğrulayıp referansı girerek onaylar. Gerçek havale tutarları ancak bu onaydan sonra gelire dahil edilir. Aynı banka işlem kimliği ikinci talepte kullanılamaz.

## Kontrol sırası

1. Kullanıcı talep oluşturur; durum ekranında tutar ve referansı görür.
2. Test modunda para göndermeden test bildirimi yapar; gerçek modda önce havale yapar.
3. Yönetici `/admin/payments` kuyruğunda bildirimi inceler, onaylar veya gerekçeyle reddeder.
4. Kullanıcı durum ekranını yeniler; tamamlanan paket hesabına eklenir veya tamamlanan ilan iletişimi açılır.

Canlı ortamda gerçek IBAN ve banka bilgileri tamamlanana kadar `BANK_TRANSFER_ENABLED` kapalı tutulur. `PAYMENT_PROVIDER=disabled` kart sağlayıcısını kapalı tutar.
