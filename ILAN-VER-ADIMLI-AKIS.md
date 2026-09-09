# İlan verme — adımlı akış

9 Eylül 2026. `/ilan-ver` ve aynı formu kullanan ilan düzenleme ekranı.

## Tamamlananlar
- [x] Dört adım: Rota ve tarih, Araç ve detaylar, İletişim, Son kontrol.
- [x] Her adımda sadece gerekli alanlar görünür; geri dönüşte girilen değerler korunur.
- [x] Gelecek adımlara doğrulamasız atlanamaz. Son kontrolden ilgili bölümü düzenlemeye dönülebilir.
- [x] Masaüstünde iki sütunlu adres/tarih alanları ve sağda canlı rota/tarih/araç özeti.
- [x] Mobilde taşmayan form, hizalı adım göstergesi, dokunmaya uygun düğmeler.
- [x] Araç tipi görsel radyo seçenekleri; başlık ve açıklama isteğe bağlı.
- [x] Profil iletişim bilgileri önceden doldurulur ve ilana özel değiştirilebilir. Özel iletişim açıklaması korunur.
- [x] Ortak adres otomatik tamamlama, köy/açık adres yazma ve seçilen konumu haritada görüntüleme korunur.
- [x] Boş rota, geçmiş hareket, hareketten önce varış, geçersiz telefon/e-posta kontrolleri.
- [x] Son adımda tüm adımlar yeniden doğrulanır. Çift gönderim engellenir; API hatasında bilgiler korunur.
- [x] Başarı ekranı inceleme/onay sürecini açıklar. Kaydetme yayın onayını atlamaz.
- [x] Düzenlemede kaldırılan varış tarihi ve e-posta API'ye null gönderilerek gerçekten temizlenir.
- [x] Yüklenemeyen veya kapalı ilan için boş düzenleme formu açılmaz.
- [x] Adım değişince başlığa klavye odağı taşınır; azaltılmış hareket tercihi desteklenir.

## Test kapsamı
Frontend 30/30 test geçti: önceki 26 test ve dört yeni wizard testi. Yeni testler tarih/iletişim doğrulaması, adımlar arası değer korunması, yalnız son kontrolde gönderim, çift gönderim kilidi, API hatasında yeniden deneme ve düzenleme yükleme hatasını kapsar. Production build geçti.

Playwright gerçek Chrome, izole MySQL ve gerçek API ile: Adatepe/Ayvacık köyü önerisini seçme, koordinatlı harita, serbest Urla adresi, hatalı tarih ve telefon, geri/ileri, son kontrol üzerinden düzeltme, 1505/768/390 px, koyu tema, gerçek POST ile `pending_approval` kaydı ve koordinat/UTC+3 saat doğrulaması. Ardından aynı ilanda gerçek PUT ile varış tarihi ve e-posta kaldırıldı. Yalnız bir oluşturma isteği üretildi. Tarayıcı uygulama hatası yok. Üretimde test ilanı oluşturulmadı.

## Görsel karşılaştırma
Konsept: `output/ilan-wizard/concept.png` (1505×1045). Yerleşik Browser/IAB bulunmadığı için Playwright Chrome kullanıldı; konsept ve gerçek ekranlar `view_image` ile incelendi.

| Nokta | Uygulama ve karar |
| --- | --- |
| Hiyerarşi | Ana başlık, dört adım, tek ana form ve sağ özet korundu. |
| Tipografi | Mevcut DM Sans; belirgin başlık, okunur 16 px giriş alanları. |
| Renk | Mevcut açık soğuk zemin, beyaz yüzey, mor eylem ve koyu tema tokenları. |
| Yerleşim | Site genelindeki 1216 px içerik genişliği korundu; mobilde alanlar tek sütun. |
| Kontroller | İleri/geri, seçili araçlar, doğrulama ve son kontrol gerçek bileşenler. |
| Hareket | Kısa adım geçişi; reduced-motion durumunda kapalı. |
| Mobil düzeltme | İki satırlık adım etiketinin numarayı yukarı kaydırması düzeltildi. |

Bilinçli konsept farkları: mevcut onaylı site logosu, üst menüsü ve footer'ı korundu. Yeni bir haritadan nokta seçici eklemek yerine mevcut adres seçimine bağlı “Haritada göster” kullanıldı. Yer tutucular köy/açık adres kullanımını anlatır. Sağ özet araç seçimini de gösterir. Konseptteki kopya ve adım sırası denetlendi; işlevsel açıklamalar sonraki adımlarda aynı tasarım diliyle tamamlandı. Konsept yönü bu uyarlamalarla doğrulandı; açık görsel hata kalmadı.
