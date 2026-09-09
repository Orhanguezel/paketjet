# 30 örnek ilan — 9 Eylül 2026

- [x] İstanbul, Ankara, İzmir ve diğer illerde 30 farklı güzergâh/açıklama.
- [x] Her başlık `ÖRNEK İLAN —`, her açıklama `ÖRNEK İLANDIR.` ile başlar.
- [x] Liste kartı ve detayında açık örnek etiketi; gerçek hizmet/ödeme sunulmaz.
- [x] Kredi satın alma, kart oturumu ve kart teslim callback koruması.
- [x] Tekrar çalıştırma çoğaltmaz; düzenlenen başlıkları ve tarihleri korur.
- [x] Pasif, giriş yapılamayan örnek hesap; gerçek kişi iletişimi içermez.
- [x] Örnek detayları noindex; sitemap dışında.
- [x] 90 backend, 13 frontend testi; backend/frontend build; lint 0 hata (16 mevcut uyarı).
- [x] Canlı aktarım: `4da2454`, 09:15:44 UTC; 30 aktif örnek ilan.
- [x] Masaüstü 1440 px ve mobil 390 px: ana sayfa 4, liste 20+10, detay uyarısı, satın alma düğmesi yok, yatay taşma yok.
- [x] Finansal tablo sayıları ve bakiyeler önce/sonra aynı; yalnızca 30 ilan ve 1 pasif örnek hesap eklendi.

## Kaynaklar ve çalıştırma

`backend/src/db/seed/sql/063_sample_listing_flag.sql`: `is_sample` alanı; varsayılan 0.
`backend/src/db/seed/sql/064_sample_listings.sql`: 30 örnek, sabit UUID ve slug.

Yeni veritabanında normal seed her ikisini sırayla çalıştırır. Mevcut üretimde **tam seed çalıştırılmaz**. Önce 063 migration ve satın alma korumaları olan uygulama yayınlanır; sonra backend dizininde:

```sh
bun scripts/seed-sample-listings.ts --production       # yalnızca plan/sayı
bun scripts/seed-sample-listings.ts --production --apply
```

Script yalnızca 064 dosyasını transaction içinde uygular. Ödeme, kredi veya cüzdan tablolarını değiştirmez. 064 dosyası üretim migration runner kapsamına bilerek alınmamıştır: eski uygulama çalışırken satın alınabilir örnek ilan oluşmasını engeller.

## Daha sonra düzenleme

Örnek hesap UUID: `e09a0000-0000-4000-8000-000000000000`.
İlan UUID sonları `000000000001`–`000000000030`; tamamı aynı önekle başlar.
Başlık/açıklama admin üzerinden düzenlenebilir; seed mevcut kayıtları değiştirmez.
Tarih ilk ekleme anından 4–33 gün sonrası, varış bir gün sonrasıdır. Tarihi geçenler mevcut bakım süreciyle kapanır; tekrar seed tarihi ileri taşımaz.

Gerçek ilana dönüştürmeden önce gerçek ilan sahibi, iletişim, tarih ve gerekli beyanlar tamamlanmalı; ancak bundan sonra kontrollü şekilde `is_sample=0` yapılmalıdır. Yalnızca başlıktaki etiketi silmek örnek statüsünü kaldırmaz.

## Doğrulama kanıtları

`output/sample-listings/` altında API, canlı sağlık, yerel test, yayın ve önce/sonra anonim tablo toplamları bulunur. Görüntüler `output/playwright/sample-listings/` altında.

## Ayrı takip notu

Tarayıcı konsolunda bu sürümden önce de bulunan `/ilan-ver` ön yükleme yönlendirmesi gözlendi: anonim kullanıcı `https://localhost:3070/giris?next=%2Filan-ver` adresine yönlendiriliyor. Kaynak `frontend/src/middleware.ts`, `new URL(login, req.url)`; ters proxy arkasındaki iç adres dış yönlendirmeye taşınıyor. Örnek ilan liste/detay kontrollerini etkilemedi. Bu ekleme kapsamında değiştirilmedi; ayrı düzeltme ve gerçek ilan-ver giriş akışı testi gerektiriyor.
