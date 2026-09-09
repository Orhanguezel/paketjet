# PaketJet — Tanitio tenant kurulumu ve eksikler

9 Eylül 2026, canlı doğrulama: 16:03 UTC.

**PaketJet tenantı canlı Tanitio’da açıldı.** Anahtar `paketjet`, site `https://paketjet.com`, yönetici Orhan Guzel (`orhanguzell@gmail.com`), üyelik `tenant_admin`. Panelde tenant seçicisinden **PaketJet** seçilebilir: https://panel.tanitio.com.

## Tamamlanan kurulum

- [x] Önce mevcut tenant/domain ve aktif yönetici hesabı kontrol edildi; mükerrer tenant yoktu.
- [x] Marka adı, gerçek logo, siteden türetilmiş mor renk, sektör, hedef kitle, Türkçe marka açıklaması, iletişim e-postaları, Türkiye pazarı ve İstanbul saat dilimi kaydedildi.
- [x] Diğer iç projelerin mevcut modeliyle sıfır ücretli manuel `grandfather` aboneliği; `marketing`, `seo-geo`, `ads-analytics`, `ai-memory` modülleri açıldı. Dış sağlayıcı satın alımı yapılmadı.
- [x] Web sitesi, sosyal kanal hazırlığı ve GA4/GSC/GTM kurulum ekranları kapsamı tanımlandı. Kapsamın açık olması OAuth bağlantısı anlamına gelmez.
- [x] Dört içerik başlığı (%35 ürün anlatımı, %25 güzergâh, %25 gönderici rehberi, %15 güven), üç seri adı, görsel dil ve yayın önerisi kaydedildi.
- [x] Altı doğrulanmış ürün/sınır bilgisi AI hafızasına kaydedildi. Ücret ayrımı, garanti sunulmaması ve örnek ilanların başarı kanıtı olarak kullanılamaması açıklandı.
- [x] Bir marka hashtag grubu ve sekiz açık kurulum işi oluşturuldu. İşler stratejinin “sonraki adımlar” alanında ve `onboarding/checklist` belgesinde; ayrı görev tablosuna yazılmadı.
- [x] İçerik otomatik senkronizasyonu kapalı; gönderi veya zamanlanmış sosyal yayın oluşturulmadı. Haftalık üç içerik yalnız strateji önerisidir.

## Canlı doğrulama

| Kontrol | Sonuç |
|---|---|
| İlk uygulama | 28 satır eklendi; yalnız PaketJet kapsamı |
| Aynı komutun tekrar çalıştırılması | 0 yeni satır; mükerrer kayıt yok |
| Tenant listesi ve detay API | HTTP 200; yönetici üyeliğiyle PaketJet erişimi |
| Scope API | HTTP 200; kayıtlı kapsam doğru okunuyor |
| Strateji API | HTTP 200; revision 1, içerik payları toplamı %100, 8 sonraki adım |
| Bağlantı durumu API | HTTP 200; web tanımlı, GA4/GSC/GTM bağlantıları eksik olarak doğru gösteriliyor |
| Logo, paylaşım görseli, llms.txt, sitemap.xml | Dördü de HTTP 200, uygun içerik türleri |

Üyelik testi kısa ömürlü, superadmin yetkisi olmayan yönetici tokenıyla gerçek public API üzerinden yapıldı; token kaydedilmedi. Tarayıcıyla görsel panel turu yapılmadı. Bağlantı API’si kapsam dışındaki Ads/Meta satırlarını da eksik olarak listeliyor; bunlar bu kurulumda reklam başlatılması gerektiği anlamına gelmez.

Kayıt sayıları: 1 tenant, 1 yönetici üyeliği, 1 abonelik, 4 modül, 14 ayar, 6 AI bilgisi, 1 hashtag grubu. Google kimlikleri ve içerik kaynağı URL’si boş; başka tenantın anahtarı kopyalanmadı.

Kanıtlar: [kurulum](output/tanitio/2026-09-09/onboarding.json), [tekrar testi](output/tanitio/2026-09-09/idempotency.json), [canlı API kontrolü](output/tanitio/2026-09-09/live-verification.json).

## PaketJet’e getirilen açık işler

| ID | Yapılacak iş | Kabul ölçütü / bağımlılık |
|---|---|---|
| PJ-T01 | Tanitio içerik kaynağı adaptörü | Mevcut Tanitio sözleşmesine uygun salt okunur, tenant anahtarlı API; yalnız yayımlanmış rehberler; kişisel veri, iletişim bilgisi, örnek ilan dışarı çıkmaz. Sayfalama, kanonik URL, görsel ve güncelleme zamanı doğrulanır. Canlı aktarım başarılı olduktan sonra kaynağı Tanitio’ya bağla. |
| PJ-T02 | Google bağlantıları | Gerçek GA4 mülk/akış, GTM konteyneri ve GSC mülk sahipliği; yetkili hesapla OAuth veya servis hesabı erişimi; gerçek rapor sorgusu başarılı. Kimlikler henüz mevcut değil. |
| PJ-T03 | Resmî sosyal hesaplar | Profil sahipliğini doğrula, Instagram/Facebook OAuth bağlantılarını yap ve izinleri oku. Doğrulanmamış handle eklenmez. |
| PJ-T04 | Dönüşüm ölçümü | PJ-T02 sonrasında arama, ilan oluşturma ve iletişim erişimi olayları; onay yönetimi, tek olay, PII içermeyen payload ve DebugView kontrolü. Ödeme aktif değilken gelir uydurulmaz. |
| PJ-T05 | www alan adı | Önceki SEO taramasındaki NXDOMAIN giderilir; HTTPS ve tek kanonik adrese 301/308 doğrulanır. |
| PJ-T06 | İşletmeci / hukuk metinleri | İşletmeci unvanı/adresi doğrulanır; aynı içerik dönen KVKK, gizlilik ve kullanım metinleri uygun biçimde ayrılır. Hukuki uygunluk değerlendirmesi bu kurulumda yapılmadı. |
| PJ-T07 | Sosyal bağlantıları siteye ekleme | PJ-T03 sonrasında gerçek footer URL’leri ve Organization sameAs eşleşmesi. |
| PJ-T08 | İlk ölçüm raporu | Bağlantılardan sonra tarihli GSC/GA4 referans verisi ve dönüşüm denemesi; veri oluşmadan trafik/başarı iddiası yok. |

PJ-T01, PJ-T04 ve PJ-T07 site geliştirme işleri; PJ-T02/PJ-T03 hesap yetkisi; PJ-T05 DNS; PJ-T06 doğrulanmış işletmeci bilgisi; PJ-T08 veri birikimi gerektirir. Bunlar yapılmış gösterilmedi; bu talepte tenant kurulumu tamamlandı ve sonraki PaketJet işleri çekliste taşındı.

## Tekrar çalıştırma

Tanitio deposu: `backend/scripts/onboard-paketjet.mjs`. Önce dry-run, sonra `--apply`. Sunucuda backend dizininde `.env` yüklenerek çalıştırılır. Script UUID kullanır, tenant/domain çatışmasını ve aktif yöneticiyi kontrol eder; transaction ve kilitleme ile yalnız eksik kayıtları ekler, mevcut ayarları ezmez. Şema değişikliği, uygulama deploy’u, PM2 restart veya geniş seed çalıştırılmadı.

Kaynak: PaketJet ürün sayfaları ve bu oturumun SEO/GEO denetimi (`SEO-GEO-DURUM-VE-CEKLIST.md`). Strateji önerileri ölçülmüş pazarlama sonuçları değildir.
