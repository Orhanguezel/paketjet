# Ortak adres ve harita girişi

Şehir listesi zorunluluğu kaldırıldı. İl/ilçe, mahalle, köy ve açık adres önerileri aynı bileşenden gelir; sonuç bulunamadığında elle yazılan adres de kaydedilebilir.

## Kapsam

- Ana sayfa kalkış/varış araması; konumlarla birlikte çalışan yön değiştirme düğmesi.
- İlan listeleme filtreleri.
- İlan oluşturma ve düzenleme: rota adresleri ve özel iletişim adresi.
- İlan detay haritası: kayıtlı koordinatlar; eski kayıtlarda şehir merkezi.
- Yönetim paneli ilan filtresi ve site iletişim adresi düzenleyicisi. İletişim adresi seçimi şehir/enlem/boylamı birlikte doldurur.
- Geliştirme önizlemesi.

Profil ekranında fiziksel adres alanı bulunmadığı için yeni bir profil alanı eklenmedi. Özel iletişim adresi public ilan DTO'suna eklenmez.

## Ortak yapı

`shared/locations` iki Next.js uygulamasına yerel paket olarak bağlanır; React peer dependency kullanır. Harita, kullanıcı açmadan yüklenmez. Arama 450 ms gecikmeli, iptal edilebilir ve eski yanıtları yok sayar; klavye, mobil, hata ve boş sonuç durumları desteklenir. Haritalar OpenStreetMap embed ile gösterilir; Google anahtarı gerektirmez.

`GET /api/locations/search?q=...` (3–400 karakter) Photon önerilerini sadeleştirir. İstemci başına 30 istek/dakika, süreç başına 60 dış istek/dakika, eşzamanlı aynı sorguları birleştirme ve 2.000 girişle sınırlı 1 saatlik bellek önbelleği vardır. Adresler başka bir tabloya arama geçmişi olarak yazılmaz.

Varsayılan servis `https://photon.komoot.io`. `PHOTON_URL` ile Photon uyumlu özel servis atanabilir. [Photon kullanım koşulları](https://github.com/komoot/photon/blob/master/README.md#demo-server) makul kullanım sınırı ve servis garantisi bulunmadığını belirtir; yoğun kullanım için özel servis gerekir. Sağlayıcı yanıt vermezse otomatik öneri durur, elle adres yazma çalışır. OpenStreetMap atfı önerilerde ve haritada gösterilir.

## Veriler ve geçiş

`066_listing_locations.sql`, `ilanlar.from_location` ve `to_location` nullable JSON alanlarını ekler. Etiket, il/ilçe, sağlayıcı kimliği ve koordinatlar birlikte saklanır. Eski `from_city`, `to_city` alanları korunur. İl/ilçe sabit liste doğrulaması kaldırıldı; uzunluk, tarih, koordinat aralığı ve koordinat çifti doğrulamaları sürer. Yalnız şehir alanı değişen eski istemcilerde eski konum bilgisi temizlenir.

Arama, şehir/ilçe ve tam adres etiketini kapsar. `İzmir, Türkiye` gibi öneriler eski yalnız şehir içeren ilanları da bulur. Özel iletişim adresinin düzenlemede kaybolması düzeltildi. Formlara erişebilmek için üretim giriş yönlendirmesinde iç localhost adresi yerine uygulamanın dış origin'i kullanılır.

## Doğrulama

- 93 backend testi: köy/serbest adres oluşturma, düzenleme, konum temizleme, eski şehir kayıtlarını arama, public iletişim gizliliği, geçersiz koordinatlar.
- 16 frontend testi: klavye seçimi, talep üzerine harita, sağlayıcı hatasında elle giriş, eski yanıtın yeni sorguyu bozmaması dahil.
- Yerel Chromium: 1440/390 px, gerçek Şirince önerisi ve harita işareti, kalkış-varış değişimi, arama URL'si, oturumlu ilan oluşturma ve düzenlemede konumun geri gelmesi.
- Yerel yönetim paneli: iletişim adresinde öneri/harita ve otomatik şehir-koordinat doldurma; ilan filtresi. Test sırasında site ayarları kaydedilmedi.

Canlı yayın sonrası doğrulama bu kayda eklenecektir.
