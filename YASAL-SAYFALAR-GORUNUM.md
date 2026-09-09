# Yasal sayfalar — görünüm ve envanter

9 Eylül 2026.

## Tamamlananlar
- [x] Kullanım koşulları, gizlilik politikası, KVKK ve taşıma kuralları ortak okunabilir görünüme alındı.
- [x] Hesabım > Taşıma kuralları aynı bileşene geçirildi.
- [x] Çalışmayan `prose` sınıflarına bağımlılık kaldırıldı; başlık, paragraf, liste, tablo, bağlantı ve alıntı stilleri tanımlandı.
- [x] Solda ortak yasal sayfa menüsü, uzun belgelerde mevcut başlıklardan üretilen bölüm bağlantıları.
- [x] Kaydırma sırasında etkin bölüm, klavye odağı, yukarı dönüş ve iletişim bağlantıları.
- [x] Mobilde menü ve belge tek sütunda, liste işaretleri ve satır aralıkları okunabilir.
- [x] Koyu tema ve yazdırırken menü/footer temizliği.
- [x] JSON içine alınmış HTML içerikleri ve dışa aktarılmış h1 başlıkları desteklenir; sayfada tek ana h1 bulunur.
- [x] Belgedeki sözcükler korunur; içerik başlığının yalnız HTML düzeyi değiştirilir.
- [x] Güncelleme tarihi tüm sayfalarda aynı Türkiye saat dilimiyle gösterilir; veritabanındaki gerçek tarih kullanılır.
- [x] Sekme başlığındaki yinelenen PaketJet giderildi; dört sayfanın canonical bağlantısı tutarlı.

## İçerik envanteri
Canlı `/api/custom-pages?locale=tr&limit=100`, kaynak route'ları ve sitemap kontrol edildi. Yayınlanan yasal slug'lar yalnız `kullanim-kosullari`, `gizlilik-politikasi`, `kvkk`, `tasima-kurallari`. Ayrıca hesap içi `/panel/tasima-kurallari` var. Hakkımızda yasal içerik kategorisinde değil.

**İçerik bulgusu:** Kullanım koşulları, gizlilik ve KVKK aynı 11.211 karakterlik birleşik kullanıcı sözleşmesi/KVKK metnini gösteriyor. Bu görünüm işi sırasında hukuki hükümler ayrıştırılmadı veya yeniden yazılmadı. Taşıma kuralları JSON sarmalayıcısında 417 karakterlik ayrı içerik taşıyor. Veritabanı içeriklerine, işletme beyanlarına veya hukuki hükümlere müdahale edilmedi. Bu rapor hukuki yeterlilik incelemesi değil, mevcut sayfa ve görünüm envanteridir.

## Doğrulama
- Frontend 34/34 test geçti; dört yeni test belge metni/liste semantiği, tek h1, bölüm bağlantısı hedefleri, tarihler ve kısa belge davranışını kapsar.
- Testte bulunan bağlantı hedefi kaybı: menü güncellenirken ham HTML yeniden çiziliyor, üretilen heading ID'leri kayboluyordu. Belge bileşeni memo ile ayrılarak giderildi.
- Frontend production build başarılı.
- Browser plugin bulunmadığı için Playwright gerçek Chrome kullanıldı.
- Dört sayfa 1440, 768, 390 px: HTTP 200, anlamlı içerik, tek başlık, tek PaketJet sekme markası, canonical, sayfa menüsü, bölüm hedeflerine gerçek tıklama ve klavye odağı, yatay taşma yok.
- Tarayıcıdaki belge metni kaynak API içeriğiyle normalize edilerek birebir karşılaştırıldı; metin eksilmesi yok.
- Koyu tema, print CSS ve yerel gerçek oturumla hesap içi taşıma kuralları doğrulandı. Uygulama JS hatası yok.
- `view_image` ile masaüstü/mobil/taşıma kuralları ekranları incelendi. Mevcut tasarım içinde hedefli düzenleme olduğundan yeni raster konsept gerekmedi.

Kanıtlar: `output/legal-design/`.

## Canlı yayın

9 Eylül 2026 14:12:13 UTC: `dcf569aed5eda8393c3ec57b434324e53a812309` yayımlandı. Üç sunucu build başarılı; üç PM2 süreci doğru yeni sürüm dizininde online. Dört canlı sayfa 1440/768/390 px gerçek Chrome kontrolünden geçti; bölüm bağlantıları, metin eşitliği, canonical, tek ana başlık, koyu tema ve yazdırma davranışı doğrulandı. JS hatası yok. Hesap içi görünüm yerel gerçek oturumla test edildi.

Canlı veritabanındaki tüm custom_pages/custom_pages_i18n kayıtları salt okunur sorguyla da kontrol edildi: dört yasal kayıt, hepsi yayında; gizli/taslak başka yasal kayıt yok. Yayın öncesi/sonrası içerik SHA-256 değerleri ve kullanıcı/ilan/bakiye toplamları aynı. Hukuki metinlerde değişiklik yapılmadığı doğrulandı.
