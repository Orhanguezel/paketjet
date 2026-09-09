# Profil düzeni ve fotoğraf akışı — 9 Eylül 2026

## Tamamlananlar
- [x] Profil sayfası mevcut hesap alanının genişliğini kullanır. Kişisel bilgiler ve şifre bölümü masaüstünde yan yana, dar ekranda alt alta yerleşir.
- [x] Ad ve telefon yan yana; e-posta ayrı ve salt okunur. Mevcut site başlığı, hesap sekmeleri ve tema korunur.
- [x] Fotoğraf için görünür yükleme/değiştirme/kaldırma düğmeleri, işlem ve hata durumları eklendi. Fotoğraf ayrı kaydet düğmesine gerek duymadan kaydedilir.
- [x] PNG, JPEG, WebP ve GIF; 5 MB sınırı istemci ve sunucuda uygulanır. Sunucu dosyanın gerçek imzasını da doğrular.
- [x] Yüklenen dosyanın tarayıcıda açıldığı doğrulanmadan profil bağlantısı değiştirilmez. Başarısız işlemde eski fotoğraf korunur.
- [x] Profil API'sinin düz JSON gövdesini yok sayması düzeltildi; eski `profile` sarmalayıcısı da desteklenir.
- [x] Ad/telefon profil ve kullanıcı kayıtlarına aynı transaction içinde yazılır. Telefon limiti kullanıcı tablosunun 50 karakterlik alanıyla uyumludur.
- [x] Oturum okuması fotoğrafı döndürür; yenileme ve tekrar girişten sonra profil ve karşılama alanında görünür.
- [x] Şifre değişiminde sunucunun kapattığı oturum istemcide de temizlenir ve yeni şifreyle giriş ekranına yönlenir.

## Doğrulama
- Backend genel testleri: 96/96 geçti; eklenen olumsuz yükleme testiyle fotoğraf paketi 3/3 geçti (toplam 97 farklı test).
- Frontend: 26/26 test geçti. Backend ve frontend production build geçti.
- İzole MySQL ve gerçek yerel dosya sağlayıcısıyla Chrome testi: yükleme, aynı dosyayı yeniden yükleme, yenileme, tekrar giriş, fotoğraf kaldırma, ad/telefon kalıcılığı, geçersiz/büyük dosyada eski fotoğrafın korunması, şifre uyuşmazlığı, yanlış mevcut şifre, başarılı şifre değişimi ve tekrar giriş.
- 1440, 768 ve 390 px; yatay taşma yok. Koyu tema kontrol edildi. Avatar URL'leri veya kayıt endpointleri tarayıcı testinde taklit edilmedi.
- Canlıda kullanıcı hesabı oluşturulmaz veya mevcut kullanıcının fotoğrafı/şifresi test amacıyla değiştirilmez. Canlı kontrol dağıtım, sağlık, CSS ve oturum yönlendirmesini kapsar.

Kanıt: `output/profile-design/browser.json`, masaüstü/mobil/koyu tema görüntüleri.
