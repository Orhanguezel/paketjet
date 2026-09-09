# PaketJet tasarım ikinci tur — 9 Eylül 2026

Kullanıcı yönü: İlk yenileme fazla beyaz ve işlevsiz hissettiriyor. Güven veren, ferah, sade ama şık bir görünüm; önceki animasyonlar geliştirilerek kullanılmalı.

Yüzey: kamu sitesi ana sayfa (header, arama/rota sahnesi, güncel ilan/boş durum, nasıl çalışır/video, taşıyıcı çağrısı, footer), ortak liste/kart yüzeyleri. Hesap ve ödeme davranışı korunur.

Tasarım sistemi: DM Sans; 64/52/36px başlık ritmi,16–18px gövde,14px kontrol etiketleri; koyu lacivert metin, lavanta/açık mavi bölüm yüzeyleri, mor ana işlem; arama için24px köşe ve yumuşak gölge, diğer alanlarda açık düzen. Mobil form tek kolon, ekranı kapatan giriş katmanı yok.

Yerleşim referansları: concept-home.png ve concept-continuation.png, yerleşik ImageGen ile üretildi. Konseptte modelin uydurduğu logo ve ek sloganlar uygulanmaz: orijinal PaketJet logosu ve gerçek mevcut animasyonlar korunur. Rota sahnesi görsel anlatımdır; canlı takip/ilan yoğunluğu iddiası değildir. Konsept harita çizimi bağımsız üretilen sade asset + gerçek SVG rota animasyonuyla uygulanır. Video posteri gerçek eski videodan çıkarılır; konseptteki hayali film/gösterge süresi kullanılmaz.

İzinli ilk ekran metni: Gönderine uygun taşıyıcıyı bul. / Güzergâhları keşfet, iletişim bilgilerine eriş ve taşıyıcıyla doğrudan görüş. / Nereden / Nereye / Tarih / İlan Ara / Doğrudan iletişim / Ücretsiz taşıyıcı ilanı / Taşıma detayları taraflar arasında. Kullanıcıya gerekli hareketi durdur/başlat kontrolü ve Güzergâhları keşfet açıklaması eklenir.

Hareket: rota akışı ve küçük düğüm nabzı, kontrollü kısa giriş geçişi, hover/focus; görünüm dışı veya gizli sekmede durur. prefers-reduced-motion ve kullanıcının duraklatma tercihi uygulanır. Marka videosu sayfa altındadır, görünmeden yüklenmez; sessiz, playsInline, kontrol edilebilir. Hatalı videoda poster/alternatif açıklama kalır.

Kullanılan gerçek animasyon: /uploads/media/hero/arkaplan.mp4 (mevcut, yaklaşık1,08MB). Eski full-screen SplashLoader kullanılmaz; kullanıcının arama yapmasını bekletmez.

## Karşılaştırma ve test kaydı

- İlk ekran: bölünmüş başlık/rota sahnesi, altında geniş beyaz arama yüzeyi ve üç açıklayıcı ilke; iki konsept view_image ile incelendi, uygulama1440/390px görüntüleriyle karşılaştırıldı.
- Tipografi: güçlü lacivert başlık, açık ikincil metin, okunaklı form etiketleri. Mobil başlık44px, kontroller16px; küçük rota etiketleri23 SVG birimine büyütüldü.
- Renk/yüzey: beyaz ağırlık azaltıldı; lavanta açılış, buz mavisi ilan bölümü, koyu lacivert davet/footer. Koyu temada harita arka planının beyaz kutu etkisi ve tarih metni düzeltildi.
- Logo/video: konseptin uydurduğu logo ve mor paket filmi yerine orijinal logo ve mevcut arkaplan.mp4 kullanıldı. Poster gerçek videonun2. saniyesi. Harita bağımsız ImageGen asset'i, rota/düğüm/taşıt hareketleri mevcut SVG bileşeninin geliştirilmiş sürümü.
- Bölüm ritmi: video/üç adım anlatısı, tek güçlü taşıyıcı çağrısı, dört kolonlu footer; mobil iki kolonlu bağlantılar. CTA okuna yanlış uygulanan geniş SVG stili fark edildi ve düzeltildi.
- Metin farkı: konseptin fazladan el yazısı sloganları, eyebrow ve hayali video süresi uygulanmadı. Gerçek arama gereksinimi için şehir değiştirme kontrolü eklendi; açık ücret açıklaması korundu. Ana başlık ve arama metni değişmedi.
- 360/390/768/1024/1440px × açık/koyu tema,200% zoom, menü Escape, kaynak/resim yüklenmesi, şehir seçme/değiştirme ve sonuç URL'si kontrol edildi.
- Video ilk ekranda yüklenmiyor; görünümde oynuyor, ekran dışında duruyor. Rota/video duraklatma ve tekrar başlatma çalışıyor. Azaltılmış hareket tercihinde video otomatik indirilmedi, rota animasyonu kapalı; kullanıcı isterse videoyu elle başlatabiliyor.
- Yerleşik tarayıcı aracı bulunmadığından Playwright Chromium kullanıldı.13 frontend testi ve34 tarayıcı kontrolü geçti. Üretim build başarılı; lint0 hata. Kanıtverification.json ve validation.json.

Bu turda bilinçli marka/video/metin farkları dışında konseptin yerleşim, renk ve hareket yönü uygulandı. Görsel sadakat, işlev testinden ayrıca kontrol edildi. Kullanıcının görsel beğenisi için tasarımın gerçek canlı sürümü esas alınır.
