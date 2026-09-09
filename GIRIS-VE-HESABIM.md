# Giriş ve Hesabım tasarım yenilemesi — 9 Eylül 2026

Giriş, ortalanmış iki bölümlü panel ve sitenin mevcut rota animasyonuyla yenilendi. Hesabım, lavanta yüzeyler, kompakt hesap özeti, tarih/durum içeren ilan satırları ve doğrudan işlem bağlantılarıyla düzenlendi.

## Tamamlananlar

- [x] Girişte okunaklı etiketler, form içinde şifre göster/gizle düğmesi, Caps Lock uyarısı, hata mesajları ve yükleme durumu.
- [x] Mevcut parola yöneticisi/autocomplete, Google giriş koşulu, güvenli dönüş adresi ve oturum akışı korunur.
- [x] Eski telefon arka planı yerine mevcut marka rota animasyonu kullanılır; duraklatma ve azaltılmış hareket desteği korunur. Giriş artık `auth_login_image` ayarını okumaz; ayarın verisi silinmedi.
- [x] Hesabım kartları gerçek API verilerini gösterir. Veri alınamadığında sahte sıfır gösterilmez; hata ve yeniden deneme sunulur.
- [x] Son ilan satırlarında rota, başlık, kalkış tarihi ve yayın durumu. Geçmiş aktif/incelemedeki ilanlar süresi dolmuş olarak gösterilir.
- [x] İlan keşfi, ilan verme, profil ve destek bağlantıları. Logo, hesap baş harfi, mobil menü ve koyu tema.
- [x] 26 frontend testi; üretim derlemesi ve TypeScript kontrolü başarılı.
- [x] İzole test hesabıyla gerçek başarısız/başarılı giriş, hesap verileri, mobil menü, koyu tema ve çıkış. 1440/768/390 px boyutlarında taşma ve sayfa hatası yok.

## Görsel doğrulama

[Konsept](output/account-design/concept.png), [giriş](output/account-design/login-desktop.png), [Hesabım](output/account-design/account-desktop.png), [mobil koyu tema](output/account-design/account-mobile-dark.png).

Konsept ve son Chromium ekranları `view_image` ile karşılaştırıldı. Mevcut Playwright Chromium kurulumu kullanıldı; Browser/IAB aracı bu ortamda yok.

| Kontrol | Uygulanan karar |
| --- | --- |
| Yerleşim | Girişte iki dengeli bölüm; hesapta üç özet ve asimetrik son işlemler panelleri |
| Tipografi | Mevcut DM Sans, belirgin başlıklar ve okunaklı alan etiketleri |
| Renk/yüzey | Mevcut lavanta, lacivert, beyaz ve mor tasarım tokenları; koyu tema |
| Marka/görsel | Konseptin ürettiği alternatif logo yerine gerçek PaketJet logosu; yeni düz çizim yerine mevcut animasyonlu Türkiye rotası |
| İçerik | Konseptteki örnek metrik/tarih yerine oturum sahibinin gerçek verisi; form alanlarında erişilebilir görünür etiketler |
| Boşluk/duyarlılık | Boş kartlar kısaltıldı; tablette kartlar sıkışmadan alt alta, telefonda dekoratif panel gizli |

Görsel referansın ana düzeni ve hiyerarşisi uygulandı; yukarıdaki marka/veri/erişilebilirlik uyarlamaları bilinçlidir. Ekranlardaki hesap bilgileri yalnız izole test verisidir. Canlı kullanıcı hesabına girilmedi veya test ilanı eklenmedi.

## Canlı yayın

`fb7c06c` sürümü 9 Eylül 2026 12:07:31 UTC tarihinde yayınlandı. Üç uygulama sunucuda yeniden derlendi ve yeni sürümde online. Canlı giriş ekranı 1440/768/390 px, şifre göster/gizle, logo, taşma ve sayfa hatası kontrollerinden geçti. Özel Hesabım akışları gerçek API ve izole test hesabıyla yerelde doğrulandı; canlı müşteri hesabına girilmedi.

Konsept ve [canlı giriş görünümü](output/account-design/login-live.png) tekrar görsel olarak karşılaştırıldı; bilinen marka/veri uyarlamaları yukarıda kayıtlı. Yayın öncesi/sonrası veri sayıları ve cüzdan toplamı aynı. Önceki Şirince → İzmir alternatif araması canlı API'de yeniden doğrulandı. [Yayın ve test kanıtı](output/account-design/verification.json).
