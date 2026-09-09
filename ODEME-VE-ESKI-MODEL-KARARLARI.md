# Ödeme ve eski model geçiş kararları

## Ödeme durumları

| Durum | Kaynak ve anlam | Kullanıcı / yönetim davranışı |
| --- | --- | --- |
| initializing | Sunucu tutarı doğrulayıp seansı ve süreli ilan rezervasyonunu açtı | Hazırlanıyor; ikinci alıcının tahsilatı başlatılmaz |
| pending | Sağlayıcı form/token kabulü kaydedildi | Sonuç sorgulanır; modal kapanması iptal kanıtı değildir |
| review | Başlangıç sonucu belirsiz, callback gecikmiş veya eski kayıt makbuz bekliyor | Bekliyor açıklaması ve admin inceleme notu; gelir/hak yazılmaz |
| completed | Doğrulanmış makbuz ve erişim/hak teslimi aynı transaction ile tamamlandı | Tekil alımda ilanın iletişimi, pakette haklar ekranı |
| failed | Doğrulanmış ret/başarısızlık | Sahte başarı yok; yeniden deneme kullanıcıya açık |
| refund_pending | Tahsilat kanıtlı, süre/ilan durumu nedeniyle teslim yapılamadı | İade/telafi iş kuyruğu; nakit kendiliğinden hak olmaz |

Provider, sipariş/seans, basket, tutar kuruş hassasiyeti, TRY ve sağlayıcı işlem kimliği eşlenir. Bildirim tekrarı tek purchase/ledger etkisi üretir. Rezervasyon 15 dakikadır. Eski ödeme referansı kaybolmaz; API yalnız sahibine özel/no-store durum döndürür. Admin notu durum veya bakiye değişikliği değildir. İade tamamlandı kararı için sağlayıcı makbuzu gerekir.

Canlı sağlayıcı kararı: PayTR sırları yok, Iyzico test modunda. `PAYMENT_PROVIDER=disabled`; kartla tahsilat kapalı, mevcut hak kullanımı açık. Gerçek kartla ret/3DS/iptal testleri gerçek sağlayıcı yapılandırmasına bağlıdır. Yerel testler tutar/basket/imza, tekrar callback, yarış, geç tahsilat, yetersiz hak ve sahiplik durumlarını izole DB'de doğrular.

## Kullanım ve emeklilik haritası

| Alan | Korunan kullanım | Yeni işlem kararı |
| --- | --- | --- |
| bookings / booking-messages | Yetkili geçmiş ve admin arşiv, ortak geçmiş şemaları | Yeni rezervasyon/onay/durum/mesaj yazımı410 |
| wallet | 11 eski cüzdan ve toplam3425 TL arşiv, eski callback mutabakatı | Deposit/withdraw/manual TL değişimi410; TL → hak dönüşümü yok |
| ratings | Geçmiş gösterim/rapor bağımlılığı | Yeni puanlama410; public kartta sahte puan/kimlik yok |
| subscription / carrier-agreements | Tarihsel şema ve yönlendirme uyumluluğu | Yeni model menülerinden çıkarıldı; yeni tahsilat girişleri yok |
| frontend /admin | Eski URL uyumluluğu | Token taşımadan panel.paketjet.com karşılığına yönlenir |
| mail eski booking/wallet şablonları | Tarihsel şablon/işlem kanıtı | Yeni gönderim için pasif; parola/giriş şablonları korunur |
| purchases / user_credits | Yaşayan tek iletişim satışı/hak modeli | Atomik debit, ledger, iletişim snapshot'ı ve denetimli admin hak düzeltmesi |

Kullanılmayan24 frontend dosyası import grafiğiyle kaldırıldı (`unused-frontend-files.json`). Eski modüller ortak geçmiş sorgularına bağlı olduğu için klasör olarak topluca silinmedi. Backend ve frontend modül dosyaları200, backend router dosyaları30 satır sınırında. Admin site ayarı renderer'ları4 küçük modüle ayrıldı; mevcut RTK/barrel düzeni korunur.

## Tarihsel finans kanıtı

9 Eylül salt okunur canlı envanteri: 23 kullanıcı,16 geçmiş ilan,0 iletişim satın alımı; 1 ilan ödemesi50 TL ve4 paket ödemesi725 TL pending. Bunlar775 TL tahsilat veya gelir kanıtı değildir. Cüzdan hareket tablosu boş olduğundan3425 TL'nin kaynağı mevcut DB'den doğrulanamıyor. Tutar korunur, muhasebe/hak dönüşümü yapılmaz. Makbuz/kayıt bulunmadan bu iki mutabakat maddesi tamamlandı sayılmaz.
