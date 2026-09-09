# Hesabım kontrast düzenlemesi — 9 Eylül 2026

- Mevcut düzen korundu; karşılama alanının mor tonu ve sınırı belirginleştirildi.
- Aktif sekmeye hafif mor zemin eklendi; özet ve ilan kartları zeminden ayrıştırıldı.
- İkincil metin, tarih, inceleme durumu ve rota çizgisi daha okunur hale getirildi.
- Koyu temada dekoratif görselin sert kenarları maskeyle yumuşatıldı.
- Değişiklik yalnız hesap alanının CSS'iyle sınırlı; veri ve iş akışı değişmedi.

Doğrulama: production build; gerçek Chrome ile 1440 ve 390 px, açık/koyu tema, profil sekmesine geçiş ve JS hata kontrolü. Karttaki ikincil metin/surface renkleri canvas üzerinden ölçüldü: açık 7,25:1, koyu 8,15:1. Bunlar ölçülen öğeye aittir, tüm site için erişilebilirlik uygunluğu iddiası değildir. İlk koyu tema ölçümü renk geçişi sürerken alındığından test, geçiş bittikten sonra ölçüm yapacak şekilde düzeltildi. Yeni birim testi gerektirmeyen stil değişikliği.

Yayın: `8323cf8892e43b441342da184ee7d5f3fc74c36f`, 9 Eylül 2026 14:55:11 UTC. Üç servis yeni sürümde online; sağlık kontrolleri geçti. Canlı CSS, oturumsuz profil yönlendirmesi ve giriş ekranı tarayıcıyla doğrulandı. Oturumlu hesap görsel testi yerel gerçek API ile yapıldı. Yayın öncesi/sonrası kayıt ve finansal toplamlar aynı; migration/seed/bakım işlemi çalıştırılmadı. Kanıtlar: `output/member-contrast/`.
