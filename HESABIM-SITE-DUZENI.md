# Hesabım — Ana siteyle ortak düzen

Kullanıcı önceki yönetim paneli görünümünü uygun bulmadığı için panelin yerleşimi değiştirildi. Koyu yan menü ve büyük istatistik kartları kaldırıldı. Giriş ekranı korunur.

- [x] Ana sitenin gerçek `Header` bileşeni: aynı logo, menü, tema, hesap, ilan verme ve çıkış davranışı.
- [x] Kullanıcının adından gelen karşılama; profil bağlantısı ve mevcut rota görseli.
- [x] Yatay hesap sekmeleri; mobilde yatay kaydırma; profil/ilanlar/alt düzenleme sayfalarında aktif sekme.
- [x] Kartlar yerine küçük sayısal özet; gerçek API verisi, hata/yeniden deneme ve boş durumlar.
- [x] İlan satırları, yayın durumu ve tarihler; yeni güzergâh paylaşma çağrısı; iletişim erişimleri.
- [x] Ortak düzen profil, ilanlar, haklar, bildirimler ve diğer mevcut panel alt sayfalarını kapsar.
- [x] 26 frontend testi ve üretim derlemesi başarılı.
- [x] İzole hesapla gerçek giriş; 1440/768/390 px, profil ve ilanlar sekmeleri, ana site üst menüsü, koyu tema, çıkış. Yatay belge taşması ve sayfa hatası yok. Canlı müşteri hesabına girilmedi.

## Görsel kontrol

[Konsept](output/member-design/concept.png), [masaüstü](output/member-design/desktop.png), [mobil](output/member-design/mobile.png), [koyu tema](output/member-design/mobile-dark.png), [tarayıcı kanıtı](output/member-design/browser.json).

Konsept ile son uygulama ekranları `view_image` üzerinden değerlendirildi. Browser/IAB bulunmadığından mevcut Playwright Chromium kullanıldı.

| Alan | Karar ve doğrulama |
| --- | --- |
| Yerleşim | Ortak üst menü, karşılama, yatay sekmeler; yan menü yok |
| Bilgi yoğunluğu | Üç büyük kart yerine tek küçük özet; içerikte ilanlar ve iletişim erişimleri |
| Tipografi | DM Sans; belirgin bölüm başlıkları, küçük meta bilgiler |
| Marka ve renk | Ana sitenin gerçek logosu ve tokenları; lavanta karşılama, açık yüzeyler, mor bağlantılar |
| Veri ve metin | Konseptteki örnek kullanıcı/sayı yerine oturum verisi; mevcut durum etiketleri korunur |
| Mobil | Sekmeler kendi alanında kaydırılır; özet üç kompakt sütun, içerik tek sütun |

Bilinçli uyarlamalar: konseptin uydurduğu logo/alt manzara yerine gerçek marka ve mevcut Türkiye rota görseli kullanıldı; alt alanda sade destek bağlantıları var. Giriş tasarımı ve parola davranışı değiştirilmedi.
