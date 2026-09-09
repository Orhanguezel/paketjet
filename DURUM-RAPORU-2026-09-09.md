> **9 Eylül 2026 14:55 UTC — Hesabım kontrastı canlı:** karşılama alanı, sekme, kart ve ikincil yazılar belirginleştirildi. Açık/koyu tema ve mobil tarayıcı kontrolleri geçti. [Test ve yayın raporu](HESABIM-KONTRAST.md).

> **9 Eylül 2026 14:12 UTC — Yasal sayfa görünümü canlı:** dört yasal sayfa ve hesap içi taşıma kuralları ortak düzene alındı. Başlık/listeler, bölüm menüsü, mobil/koyu tema ve yazdırma düzeltildi. 34 frontend testi ve dört canlı adresin tarayıcı kontrolleri geçti; metinler değişmedi. [Envanter, içerik bulgusu ve kanıtlar](YASAL-SAYFALAR-GORUNUM.md). Önceki açık dış bağımlılıkların durumu değişmedi.

> **9 Eylül 2026 13:35 UTC — Adımlı ilan formu canlı:** rota/tarih, araç/detaylar, iletişim ve son kontrol tamamlandı. Geri dönüşlerde veri korunur; son kontrolden düzenlenebilir. 30 frontend testi, gerçek API ile oluşturma/düzenleme ve canlı kontroller geçti. [Tasarım ve test raporu](ILAN-VER-ADIMLI-AKIS.md). Önceki açık dış bağımlılıkların durumu değişmedi.

> **9 Eylül 2026 13:15 UTC — Profil güncellemesi canlı:** geniş iki sütunlu düzen, kalıcı fotoğraf yükleme/değiştirme/kaldırma, profil kayıt düzeltmesi ve şifre sonrası oturum yenileme tamamlandı. 97 backend ve 26 frontend testi; gerçek tarayıcı akışı ve canlı kontroller geçti. [Detay ve test kapsamı](PROFIL-IYILESTIRME.md). Bu ek teslim önceki açık dış bağımlılıkların durumunu değiştirmez.

# PaketJet detaylı durum raporu — 9 Eylül 2026

> **9 Eylül Hesabım ikinci düzeni:** `e17ce09`, 12:26:21 UTC yayında. Koyu yan menü ve büyük sayaç kartları kaldırıldı; ana site üst menüsü, kişisel karşılama ve yatay hesap sekmeleri kullanılıyor. 26 test, oturumlu yerel mobil/tablet/masaüstü akışları ve canlı sağlık/giriş kontrolleri başarılı. [Güncel hesap tasarımı](HESABIM-SITE-DUZENI.md).

> **9 Eylül giriş ve Hesabım yenilemesi:** `fb7c06c`, 12:07:31 UTC yayında. Rota animasyonlu giriş, alan içi şifre düğmesi, kompakt hesap özeti ve tarih/durum içeren ilan satırları eklendi. 26 frontend testi, oturumlu yerel akışlar ve canlı girişin 1440/768/390 px kontrolleri başarılı. [Tasarım ve doğrulama](GIRIS-VE-HESABIM.md).

> **9 Eylül il alternatifleri:** `0a2f704`, 11:26:09 UTC yayında. Tam adreste sonuç yoksa aynı ildeki ilanlar açıklamalı alternatif olarak gösteriliyor; tarih, araç ve rota yönü korunuyor. Canlı Şirince aramasında 3 İzmir alternatifi doğrulandı. [Kapsam](ADRES-VE-HARITA.md), [test ve yayın kanıtı](output/nearby-search/verification.json).

> **9 Eylül adres ve harita güncellemesi:** `d0e2838`, 10:24:29 UTC yayında. Tüm mevcut adres girişleri ortak köy/mahalle/açık adres önerileri ve haritaya taşındı; koordinatlar ilanla kaydediliyor, serbest giriş ve eski şehir ilanları destekleniyor. 93 backend + 16 frontend testi, üç üretim derlemesi ve canlı mobil/masaüstü kontrolleri başarılı. [Kapsam ve doğrulama](ADRES-VE-HARITA.md).

> **Son görünüm tercihi:** `ce672b2`, 09:29:09 UTC yayında. Örnek işareti yalnızca ilan başlığında bırakıldı; açıklamadaki tekrarlar ve detay uyarı kutusu kaldırıldı. Normal fiyat/iletişim alanı geri getirildi. [Güncel doğrulama](output/sample-copy/verification.json).

> **9 Eylül örnek ilan eklemesi:** `4da2454` sürümü 09:15:44 UTC yayında. 30 açıkça etiketlenmiş örnek ilan eklendi; satın alma kapalı, seed tekrar çalıştırılabilir ve sonraki düzenlemeleri korur. Finansal kayıtlar değişmedi. [Örnek ilan çeklisti ve kullanım](ORNEK-ILANLAR.md), [canlı API doğrulaması](output/sample-listings/verification.json).

> **9 Eylül tasarım ikinci tur:** Kullanıcının fazla beyaz/sade bulduğu görünüm lavanta–açık mavi yüzeyler, güçlü lacivert başlıklar, hareketli rota ve mevcut marka videosuyla yenilendi. Güncel görsel kararlar ve testler [tasarım ikinci tur kaydında](output/design-v2/DESIGN.md). Son uygulama kodu `6115399`; canlı yayın kanıtı `output/design-v2/release.json`. Önceki beyaz ağırlıklı ekranlar ilk turun tarihsel kanıtıdır.

## Yenileme sonrası güncel durum — 9 Eylül 2026

**Uygulanabilir yenileme işleri tamamlandı; 145 maddeden138'i kapalı,7'si dış kanıt veya gelecek tarih bağımlılığı nedeniyle açık.** Bu oran ticari hazırlık ya da satış başarısı yüzdesi değildir. Aşağıdaki eski inceleme, yenileme öncesi başlangıç fotoğrafıdır; güncel uygulamanın kusur listesi olarak okunmamalıdır.

Ana uygulama düzeltmeleri `d058642`, son admin giriş düzeltmesi `e9317bb5cb810092b5a3083e172a218c1605293b`. Dal `codex/renewal-20260909`; kod commit/push ve canlı sürüm eşleşmesi `output/verification/2026-09-09/release-final.json` kaydında. Aktif süreçler sürüm dizininde PM2 ile çalışır; Docker/Nginx değiştirilmedi.

| Alan | Gerçek son durum | Kanıt |
| --- | --- | --- |
| Tasarım | Ana sayfa, liste/detay, ilan formu, kullanıcı paneli, giriş/kayıt, iletişim ve admin ekranlarında ortak temiz tasarım; orijinal logo korundu | Tasarım karşılaştırma belgesi,132 koşullu görsel matris, canlı390/1440 ekranları |
| Gizlilik/oturum | Kamu ilan DTO'sunda kimlik/iletişim sızıntısı kaldırıldı; rol/aktif hesap/oturum sürümü kontrolü, güvenli cookie ve dönüş adresleri | Backend87 test, auth-session-test, admin safe-next testi, live-http |
| Ödeme/hak | Atomik hak tüketimi, tekrar callback ve yarış koruması, sağlayıcı/tutar/para birimi doğrulaması, süre/inceleme kuyruğu | buyer-e2e, backend testleri, error-matrix; gerçek kart checkout'u açık bağımlılık |
| Eski model | Eski rezervasyon/cüzdan yazımları kapalı, kullanılmayan web parçaları kaldırıldı; tarihsel okuma ve gerekli callback'ler korundu | Model karar kaydı, import analizi, üç build |
| Veri |16 geçmiş ilan expired; kamu listesi0 aktif ilan. Kontrollü test ilanı removed, test hesabı inactive | live-inventory-after, live-test-cleanup |
| Finans |11 cüzdan toplam3.425 TL korundu;1 tekil +4 paket pending ödeme toplam775 TL gelir sayılmadı | Canlı toplulaştırılmış DB envanteri |
| Test |87 backend +13 frontend +1 admin =101 test geçti; üç üretim build'i geçti | validation-summary, release-final |
| Canlı doğrulama |14 HTTP kontrolü,14 sitemap URL'si; mobil/masaüstü tur; kayıt→özel ilan→düzenleme→panel→arşiv→çıkış | live-http, live-browser, live-admin-login-final |
| Performans | Aynı mobil laboratuvarda ortanca LCP5,612→0,728 sn; CLS0,19056→0,00211; otomatik video4→0 | performance-before/after; saha INP ölçülmedi |
| İşletim | DB/source/upload yedek ve izole geri yükleme;053–062 yükseltme; cron/logrotate/disk kontrolü;24 saat/7 gün kontrolü zamanlandı | Restore logları, scheduler-proof, runbook |

Tamamlanmış testler bütün gerçek sağlayıcıların üretimde çalıştığı anlamına gelmez. Web lint14 uyarı, admin lint407 uyarı içeriyor; hata sayısı0. Adminin bazı eski büyük dosyaları ve bu uyarılar teknik bakım borcu olarak sürüyor. Harici alarm teslimi ve saha performans verisi henüz kanıtlanmış değil.

### Açık kalan7 madde

| Madde | Engel / korunan durum | Tamamlanması için gereken |
| --- | --- | --- |
| F02-13 | Yerel ödeme/hak matrisi geçti; gerçek kart sağlayıcısı eksik. Canlı PAYMENT_PROVIDER=disabled | Gerçek sağlayıcı ortamı ile kabul/ret/3DS/iptal/timeout mutabakatı |
| F03-06 |5 eski pending ödeme makbuzsuz; inceleme kuyruğunda | Sağlayıcı hareket/makbuz kanıtıyla kayıt bazında sonuçlandırma |
| F03-07 |3.425 TL eski bakiyenin hareket kaynağı yok; otomatik dönüşüm yapılmadı | Muhasebe/sağlayıcı hareket kaydıyla sahiplik ve toplam mutabakatı |
| F13-04 | Gerçek SMTP kimliği ve DKIM selector yok; teslim kanıtı yok | Gönderici DNS/SMTP yapılandırması ve yetkili alıcıya teslim testi |
| F13-05 | Maps anahtarı boş; kota/billing/domain konsol kanıtı ve gerçek ödeme anahtarları yok | İlgili servis konsol/ortam yapılandırması |
| F13-06 | Yerel health/syslog var; harici alarm alıcısı/DSN yok | Kontrollü hata/ödeme alarmının gerçek kanala teslimi |
| F14-05 | Kontroller sunucuda planlandı; henüz tarihi gelmedi |10 Eylül02:43 UTC ve16 Eylül02:43 UTC çıktılarının değerlendirilmesi |

Canlı kontrollü test bir hesap ve bir kamuya kapalı ilan oluşturdu; ilan arşivlendi, hesap pasifleştirildi, oturumlar iptal edildi. Satın alma veya ledger hareketi oluşmadı. Son toplam24 kullanıcı/22 aktif hesap; bu kayıt sayısı doğrulanmış gerçek müşteri sayısı değildir. Aktif ilan bulunmadığından site dürüst boş durum gösterir; örnek ilan veya sahte istatistik üretilmez.

Kaynaklar: [Ana çeklist](CEKLIST-IYILESTIRME-VE-TASARIM.md), [İşletim ve geri dönüş](ISLETIM-VE-YAYIN-2026-09-09.md), [Tasarım karşılaştırması](TASARIM-KARSILASTIRMA-2026-09-09.md), [Test ve canlı kanıtlar](output/verification/2026-09-09/).

---

## Yenileme öncesi tarihsel inceleme

İnceleme zamanı: 9 Eylül 2026, Europe/Berlin; sunucu ölçümleri 8 Eylül 23:23–23:28 UTC civarı. Yerel kaynak kod, mevcut iş listeleri, SSH üzerinden çalışan servisler, anonim HTTP GET istekleri ve MySQL toplulaştırılmış sorguları incelendi.

## 1. Yönetici değerlendirmesi

**PaketJet çalışan bir uygulama, ancak güncel arzı ve tamamlanmış satış kanıtı bulunan, ticari işletime hazır bir pazaryeri olarak değerlendirilemez.** Backend, müşteri sitesi ve ayrı admin paneli canlı. İletişim erişimi satışı için temel kod mevcut; eski rezervasyon/cüzdan modeli de uygulamada duruyor. Başlıca engeller güncelliğini yitirmiş ilanlar, ödeme tamamlama davranışı, gizlilik açığı, canlıya aktarılmamış düzeltmeler ve başarısız frontend tip kontrolü.

- Canlıda 23 kullanıcı var; 18'inin e-posta alan adı `test.com`. Kalan 5 kayıt için gerçek müşteri doğrulaması yapılmadı.
- 14 aktif ilanın tamamının hareket tarihi geçmiş; 2 onay bekleyen ilanın da tarihi geçmiş.
- İletişim satın alma, rezervasyon ve kontör hareketi tablolarında kayıt yok.
- 1 tekil ilan ödemesi ve 4 kontör paketi ödemesi uzun süredir `pending`. Bu kayıtlar tahsilat veya gelir kanıtı değildir.
- Canlı Git HEAD `740302f`; yerel HEAD `6e0f436`. Arada güvenlik yapılandırması ve 404 davranışı için iki commit var.
- Kullanıcıya açık API, iletişim alanlarını çıkarsa da 14/14 aktif ilanda taşıyıcı adını yayımlıyor.

Hazırlık yüzdesi verilmedi: dosya sayısı ve işaretlenmiş görevler, ödeme akışının veya ticari faaliyetin çalıştığını kanıtlamaz.

## 2. Gerçek iş modeli ve kapsam

`YAPILACAKLAR.md` §0'a göre taşıyıcı ücretsiz ilan açar; gönderici taşıyıcının iletişim bilgilerine erişim satın alır. Taşıma ücreti taraflar arasındadır. Platformun çekirdek ürünü iletişim erişimi ve önceden alınabilen ilan haklarıdır.

Canlı paket API'si:

| Paket | Hak | Fiyat |
| --- | ---: | ---: |
| starter | 1 | 50 TL |
| growth | 5 | 225 TL |
| pro | 10 | 400 TL |

Bu fiyatlar `GET /api/ilan-alma-hakki/paketler` yanıtından alındı. Kod fiyatları site ayarlarından okuyor; tekil ödeme kayıt örneği 50 TL.

Belgelerdeki çelişkiler:

- README uygulama kaynak kodunun bulunmadığını söylüyor; üç uygulamanın kaynakları mevcut.
- AGENTS.md eski P2P rezervasyon modelini ve 22 modülü anlatıyor; güncel kaynakta `_shared` dahil 29 modül klasörü var.
- `YAPILACAKLAR.md` §0 rolleri doğru tanımlarken sonraki bazı maddelerde satın alan için tekrar “taşıyıcı” deniyor.
- Canlı `llms.txt`, göndericinin ilan açtığını ve taşıyıcının satın aldığını söylüyor; kesin modelin tersi.

## 3. Kaynak kod envanteri

Sayım yalnız `src/` altındaki `.ts` ve `.tsx` dosyalarını kapsar; bağımlılıklar, derleme çıktıları, SQL ve diğer varlıklar dahil değildir.

| Alan | Teknoloji | Kaynak dosyası | Satır | Sayfa | Test dosyası | 200 satırı aşan dosya |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| backend | Fastify 5, TypeScript, MySQL, Drizzle | 346 | 24.324 | — | 13 | 16 |
| frontend | Next.js, React, Tailwind, Zustand | 189 | 13.278 | 53 | 5 | 12 |
| admin_panel | Next.js, Redux/RTK Query, Radix/Shadcn | 396 | 44.823 | 35 | 0 | 59 |

Toplam 931 TS/TSX dosyası ve 82.425 satır bulunuyor. Sayfa sayısı erişilebilir veya test edilmiş ekran sayısı anlamına gelmez.

Backend modülleri: auth, ilanlar, purchases, bookings, booking-messages, wallet, subscription, carrier-agreements, disputes, ratings, profiles, carriers, dashboard, reports, notifications, contact, support, mail, telegram, storage, siteSettings, categories, customPages, emailTemplates, theme, userRoles, audit, health ve `_shared`.

### İşlevlerin durumu

| İşlev | Kanıtlanan durum | Açık nokta |
| --- | --- | --- |
| İlan listeleme | Canlı API ve web sayfası 200 | Tüm aktif ilanlar geçmiş tarihli |
| İlan verme / moderasyon | Kod ve 2 bekleyen DB kaydı mevcut | Yeni kayıt oluşturularak uçtan uca denenmedi |
| Üyelik / oturum | Auth modülü ve onay validasyonu mevcut | Canlı kayıt/giriş akışı denenmedi |
| İletişim satın alma | Transaction, hak düşme, snapshot, tek alıcı kısıtı mevcut | Tamamlanmış canlı işlem yok |
| Kontör paketleri | Paket API'si çalışıyor; ödeme başlatma/tamamlama kodu var | 4 eski bekleyen kayıt; hak hareketi yok |
| Ayrı admin | `panel.paketjet.com` giriş sayfası çalışıyor | Mail/bildirim adresleri 404 |
| İçerik / SEO | Custom pages, sitemap, robots, llms mevcut | Soft-404 ve yanlış model anlatımı |
| Destek / mail / Telegram | Modüller mevcut | Gerçek teslimat veya mesajlaşma doğrulanmadı |
| İzleme | Health, audit ve Sentry bağımlılıkları mevcut | Alarm teslimatı doğrulanmadı |

## 4. Canlı altyapı ve sürüm durumu

SSH kısayolu `vps-paketjet`; hostname `srv1590682`. Çalışma dizini `/var/www/paketjet`.

| Servis | Yönetim | Durum | Nginx hedefi |
| --- | --- | --- | --- |
| paketjet-backend | PM2 / Node | online | 127.0.0.1:8070 |
| paketjet-frontend | PM2 / npm | online | 127.0.0.1:3070 |
| paketjet-admin | PM2 / npm | online | 127.0.0.1:3071 |
| Nginx | systemd | active | HTTPS ters proxy |
| MySQL | systemd | active | Uygulama veritabanı |

- Gerçek dağıtım Docker değil; sunucuda Docker komutu bulunmuyor.
- Web domaini `paketjet.com`, admin domaini **`panel.paketjet.com`**.
- PM2 uygulamaları root kullanıcısıyla çalışıyor.
- Sunucu yaklaşık 146 gündür açık; anlık load 0.00; kök disk 96 GB, yaklaşık 7 GB kullanım (%8). Bu anlık ölçüm kapasite testi değildir.
- Health: `status=ok`, `db=ok`, `redis=disabled`. Redis kapalı olması mevcut health mantığında hata sayılmıyor.
- Frontend kurulu Next sürümü 15.5.12, admin 15.1.12; sürüm güvenlik açığı/veritabanı taraması yapılmadı.
- Frontend ve admin build kimlik dosyaları 31 Mayıs tarihli. Git HEAD/build zamanı çalışan her dosyanın hash eşitliğini tek başına ispatlamaz; 404 düzeltmesinin eksikliği ayrıca HTTP ile doğrulandı.

### Canlıya geçmemiş yerel commitler

| Commit | Değişiklik | Mevcut durum |
| --- | --- | --- |
| `9d62355` | Secret fallback'lerini fail-closed yapma | Sunucu Git HEAD'inde yok; canlı secret değerleri incelenmedi |
| `6e0f436` | Eksik sayfalarda 404 düzeltmesi | Sunucuda yok; üç örnek hâlâ HTTP 200 |

Yerel çalışma alanı başlangıçta kirliydi: `.gitignore`, README, iki tsbuildinfo, `project.portfolio.json` değişmiş; iki çeklist ve eski denetim raporu takipsizdi. Bunlara dokunulmadı. Uzak Git deposunun güncel push durumu ayrıca sorgulanmadı.

### Log ve işletim gözlemleri

Backend stderr dosyası boş; bu, tüm uygulama loglarının hatasız olduğu anlamına gelmez. Frontend ve admin stderr kayıtlarında farklı tarihlerde `Failed to find Server Action` hataları var. Örnek action adları `x`, `0`, `1`, `action`; bot/probe veya sürüm uyumsuzluğu olasılığı var, erişim loglarıyla ilişkilendirilmeden neden kesinleştirilemez.

Root crontab çıktısında iş görünmedi; listelenen sistem timer'larında PaketJet'e özel DB yedek görevi tespit edilmedi. Harici yedek, başka kullanıcı cron'u veya sağlayıcı snapshot'ı araştırılmadı; “yedek yok” sonucu çıkarılmamalı. Certbot timer'ı mevcut, ancak yenileme tatbikatı yapılmadı.

## 5. Canlı HTTP doğrulaması

Anonim GET istekleriyle ölçüldü. Süreler tek örnek tam yanıt süreleridir; p95, yük testi veya Core Web Vitals değildir.

| Adres | HTTP | Süre | Değerlendirme |
| --- | ---: | ---: | --- |
| `/` | 200 | 0,14 sn | Erişilebilir |
| `/giris` | 200 | 0,16 sn | Hızlı giriş bölümü görünür |
| `/ilanlar` | 200 | 0,25 sn | Erişilebilir |
| `/api/health` | 200 | 0,16 sn | DB iyi, Redis kapalı |
| `/api/ilanlar?limit=3` | 200 | 0,09 sn | JSON liste dönüyor |
| `/api/ilan-alma-hakki/paketler` | 200 | 0,13 sn | Paketler mevcut |
| `/api/ilan-alma-hakki` | 401 | 0,08 sn | Anonim erişim engelleniyor |
| `/api/admin/dashboard/summary` | 401 | — | Anonim admin erişimi engelleniyor |
| `/blog/uydurma-999` | 200 | 0,12 sn | Hatalı: olmayan içerik için 200 |
| `/rota/uydurma-999` | 200 | 0,10 sn | Hatalı: olmayan içerik için 200 |
| `/ilanlar/99999999` | 200 | 0,50 sn | Hatalı: olmayan içerik için 200 |
| `/sitemap.xml` | 200 | 0,09 sn | Yayında; tüm URL'ler taranmadı |
| `/robots.txt` | 200 | 0,10 sn | Panel/admin/API disallow mevcut |
| `/llms.txt` | 200 | 0,09 sn | Roller ters anlatılıyor |
| `panel.paketjet.com/` | 200 son yanıt | 0,83 sn | `/auth/login` adresine yönleniyor |
| `panel.paketjet.com/admin/mail` | 404 | 0,34 sn | Ekran yok |
| `panel.paketjet.com/admin/notifications` | 404 | 0,15 sn | Ekran yok |

İlk keşifte `/api/admin/dashboard` 404 döndü; gerçek kayıtlı rota `/api/admin/dashboard/summary` ile tekrar kontrol edilip 401 alındı. İlk adres yetkilendirme testi olarak kullanılmadı.

## 6. Üretim verisi ve ticari faaliyet

Kişisel değerler, parola, token veya secret rapora alınmadı. Sorgular toplulaştırılmıştır; zamanlar DB'nin döndürdüğü biçimde kaydedilmiştir.

| Gösterge | Sonuç | Yorum |
| --- | ---: | --- |
| Kullanıcı | 23 | 18 kayıt `test.com` alan adında |
| Aktif ilan | 14 | 14'ünün de hareket tarihi geçmiş |
| Onay bekleyen ilan | 2 | 2'sinin de hareket tarihi geçmiş |
| İletişim satın alma (`ilan_purchases`) | 0 | Tamamlanmış satış kanıtı yok |
| Tekil ödeme | 1 pending / 50 TL | 8 Temmuz 2026'dan beri bekliyor |
| Paket ödemesi | 4 pending / toplam 725 TL | 31 Mayıs 2026'dan beri bekliyor |
| Kullanıcı kontörü (`user_credits`) | 0 satır | Tanımlı hak bakiyesi kaydı yok |
| Hak hareketi (`credit_ledger`) | 0 | Hak alım/kullanım kaydı yok |
| Rezervasyon | 0 | Eski modelde de işlem kaydı yok |
| Eski cüzdan | 11 satır / toplam 3.425 TL | Yeni kontörden ayrı; gelir/tahsilat sayılamaz |

Aktif ilanların hareket tarihleri 1–10 Haziran 2026 aralığında. Bekleyen ilanların tarihleri 26 Ağustos ve 2 Eylül. `buildIlanListWhere` varsayılan olarak yalnız `status=active` süzüyor; otomatik olarak geçmiş hareket tarihini dışlamıyor. Bu nedenle kullanıcının gördüğü arz ile kullanılabilir arz farklı.

“23 kullanıcı” gerçek müşteri sayısı, “3.425 TL bakiye” gelir, “775 TL bekleyen ödeme” tahsilat olarak sunulmamalı. Sağlayıcı mutabakatı ve test/gerçek veri sınıflaması gerekli.

## 7. Öncelikli teknik bulgular

### P0 — İletişim gizliliğinde ad alanı açık

**Canlı doğrulandı:** `/api/ilanlar?limit=100` yanıtındaki 14 ilanın tamamında dolu `carrier_name` var. `contact_name`, `contact_phone`, `contact_email`, `contact_address` anahtarları yok.

**Kök neden:** `ilanlar/repository.ts` kullanıcı tablosundan `users.full_name` alıyor. `helpers/repository.ts` bunu `carrier_name` olarak ekliyor; `stripIlanContact` yalnız dört `contact_*` alanını çıkarıyor. Bu bir whitelist değil, alan çıkarma listesidir. Dolayısıyla “isim satın almadan gizli” şartı karşılanmıyor.

**Kabul ölçütü:** Public liste/detay yanıtı açık alan listesiyle kurulmalı; ad ve diğer özel alanlar çıkarılmalı; iletişim sadece yetkili satın alanın reveal yanıtında bulunmalı. Public API regresyon testi gerekli.

### P0 — Üretimde hızlı giriş ve seed varsayılanları

**Kod + kısmi canlı doğrulama:** `frontend/src/app/giris/giris-client.tsx:227` varsayılan hesap bilgilerini `quickLogin` çağrısına gömüyor; ortam koruması yok. Canlı giriş HTML'inde Hızlı giriş bölümü mevcut. Hesabın bu parola ile giriş yapabildiği denenmedi.

`backend/src/db/seed/index.ts` bilinir varsayılan parolalar içeriyor; işlenmiş SQL'i `/tmp/seed_debug.sql` dosyasına yazıyor. Bu SQL, ilgili seed çalıştırıldığında hash veya ödeme ayarı içerebilir; sunucudaki dosya içeriği okunmadı.

**Kabul ölçütü:** Üretim hızlı girişinin kaldırılması/yalıtılması; etkilenen hesapların incelenmesi; seed parolalarının zorunlu dış yapılandırmadan alınması; hassas SQL debug yazımının kaldırılması.

### P0 — Dosya yükleme yetkilendirmesi eksik

**Kaynak kodda doğrulandı:** `storage/router.ts:13-15` upload/sign uçlarını `requireAuth` olmadan kaydediyor. Upload handler'ında da kimlik zorunluluğu yok; `user_id` null olabiliyor. Global auth eklentisi yalnız `config.auth=true` için devreye giriyor.

`sign-put` şu anda 501 döndüren stub; tüm sign uçlarını çalışan upload kabiliyeti gibi değerlendirmek yanlış olur. Gerçek anonim dosya yükleme denenmedi; SSRF veya gerçekleşmiş istismar iddiası yok.

**Kabul ölçütü:** Upload için kimlik/rol ve sahiplik kontrolü, dosya türü/boyut sınırları; anonim istek için 401/403 regresyonu.

### P0 — Başarılı tahsilat ile ilan teslimi ayrışabilir

**Kaynak kodda doğrulandı:** `purchases/payment.repository.ts` ödeme başlatırken ilanı ödeme süresince rezerve etmiyor. Callback sırasında ilan satılmışsa ödemeyi `failed` işaretleyip `unavailable` döndürüyor. Sağlayıcıda başarılı olmuş tahsilat için bu dalda telafi/iade işi bulunmuyor.

Ek olarak `payment.controller.ts` içindeki iki Iyzico callback'i repository sonucu başarısız olsa da `status=success` adresine yönlenebiliyor. Böylece kullanıcıya erişim sağlanmadan başarılı sonuç gösterilebilir. Üretimde gerçekleşmiş zarar gösteren kayıt bulunmadı.

**Kabul ölçütü:** Tahsilat/teslim durumlarının ayrılması; satılmış ilan için mutabakat ve telafi süreci; başarısız tamamlamada doğru sonuç ekranı; iki alıcı yarış testi ve callback tekrar testi. Bu teknik bulgu hukuki iade yükümlülüğü değerlendirmesi değildir.

### P1 — İki model ve iki bakiye sistemi birlikte çalışıyor

`backend/src/routes.ts` bookings, booking-payments, wallet, subscription, carrier-agreements, booking-messages ve disputes kayıtlarını hâlâ yapıyor. `wallet/controller.ts` eski TL yükleme/işlem akışlarını taşıyor. Yeni model `user_credits` ve `credit_ledger` kullanıyor. Frontend'in kendi `/admin/*` bölümü de ayrı admin uygulamasıyla birlikte mevcut.

**Kabul ölçütü:** Gerçek veriyi önce sınıflandırıp eski akışları kontrollü kapatmak; bakiye/arşiv kararını açıkça belgelemek; tek admin yüzeyi ve yeni modele uygun raporlar. Mevcut cüzdan satırları doğrudan silinmemeli veya gelir kabul edilmemeli.

### P1 — Dağıtım ve doğrulama zinciri eksik

İki yerel commit canlıda yok. Frontend tip kontrolü başarısız. `.github/workflows` altında CI dosyası bulunmadı; harici CI araştırılmadı. Yerel üç uygulamada da `node_modules` yok.

**Kabul ölçütü:** Kilit dosyasıyla izole bağımlılık kurulumu, tip/test/build kapıları, sürüm kaydı ve geri dönüş planı; ardından yetkili deploy ve gerçek HTTP kontrolü.

### P1 — CSP varsayımı canlıda karşılanmıyor

Canlı ana sayfa ve admin giriş yanıtında Content-Security-Policy başlığı yok. Her iki canlı `.next/server/middleware-manifest.json` içindeki `middleware` haritası boş. Kaynakta `frontend/src/proxy.ts` bulunması, ilgili kodun mevcut build'de çalıştığı anlamına gelmiyor.

Admin token'ı `admin_panel/src/integrations/shared/auth-storage.ts` üzerinden localStorage'a yazılıyor. Bu depolama tercihi ve CSP eksikliği birlikte ele alınmalı; tek başına gerçekleşmiş XSS kanıtı değildir. Test edilen backend admin rotasının 401 döndürmesi, API auth'un ayrıca işlediğini gösteriyor.

### P1 — Eski ilanların aktif kalması ve içerik tutarsızlığı

İlan geçerlilik süresi/default tarih süzmesi ve bekleyen ilan operasyonu tanımlanmalı. Soft-404 düzeltilmeli. `llms.txt`, pazarlama metinleri ve iş listelerindeki roller §0 ile aynı hale getirilmeli. “81 ilde aktif ağ” iddiası bu veri örneğiyle doğrulanamıyor.

### P2 — Bakım maliyeti ve veri kurulumunun tekrarlanabilirliği

- 5 backend router'ı 30 satır sınırını aşıyor: auth 68, wallet 51, ilanlar 43, notifications 44, bookings 55.
- `wallet/controller.ts` içinde doğrudan DB sorguları var; repository sınırı ihlal ediliyor.
- En büyük dosyalar: audit repository 642, wallet controller 454, admin site-settings 1.850, admin audit client 1.011 satır.
- 52 seed SQL dosyası var; `042` prefix'i iki dosyada. 7 SQL dosyası ALTER TABLE içeriyor. Bu bulgular tek başına şema hatası kanıtı değildir; temiz kurulum ve mevcut DB yükseltmesi ayrı doğrulanmalı.
- Seed varsayılan akışında DROP/CREATE bulunuyor; production koruması `NODE_ENV` ve `ALLOW_DROP` üzerinden. İnceleme sırasında seed çalıştırılmadı.

## 8. Kalite kontrolleri ve sınırlar

Yerelde bağımlılıklar kurulu olmadığından tip kontrolleri **sunucudaki kaynak ve kurulu bağımlılıklar üzerinde**, `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` ile çalıştırıldı. Her süreç 60 saniyelik timeout ile sınırlandı; timeout oluşmadı. Bunlar yerel HEAD build doğrulaması değildir.

| Kontrol | Sonuç |
| --- | --- |
| Canlı checkout backend tsc | Geçti, exit 0 |
| Canlı checkout frontend tsc | Başarısız, exit 2, 9 tanı |
| Canlı checkout admin tsc | Geçti, exit 0 |
| Anonim HTTP | Yukarıdaki rota tablosu |
| DB | Salt okunur sayım/durum/tarih sorguları |
| Yerel production build | Çalıştırılmadı |
| Backend entegrasyon testleri | Çalıştırılmadı; test altyapısı gerçek DB'ye kullanıcı/rol yazıyor |
| Frontend Vitest / admin lint | Çalıştırılmadı |
| Tarayıcıyla görsel/mobil/uçtan uca test | Yapılmadı |
| Gerçek ödeme, mail ve Telegram teslimatı | Yapılmadı |

Frontend tsc tanıları: `booking.test.tsx` içinde CarrierDashboard mock'unda eksik kazanç alanları ve yönlendirme sayfasını JSX olarak render etme; `wallet.test.tsx` içinde eksik `total_withdrawn`, artık geçersiz transaction türleri, eksik ödeme provider alanı ve yönlendirme sayfasını render etme. Toplam booking'de 3, wallet'ta 6 tanı.

Mevcut 13 backend test dosyası arasında ayrı purchases testi yok; frontend'in 5 test dosyası auth, ilan kartı, Header ve eski booking/wallet alanlarına odaklanıyor. Test dosyası sayısı kapsam yüzdesi değildir. Ana gelir akışı için eşzamanlılık, bakiye yeterliliği, callback tekrarı, teslim başarısızlığı ve yetkisiz reveal testleri gerekli.

Bu rapor kapsamlı bir penetrasyon testi, bağımlılık/CVE taraması, hukuki uygunluk incelemesi veya ödeme sağlayıcı mutabakatı değildir. SMTP/DNS, Maps billing, harici analitik ve yedekten geri yükleme ayrıca doğrulanmalı.

## 9. Önceki rapor ve çeklistlerin güncelliği

| Önceki ifade | Güncel kanıt |
| --- | --- |
| “Bu checkout'ta kaynak kod yok” | Yanlış; üç uygulama mevcut |
| “Admin deploy'da yok” | Yanlış; PM2 online ve panel domaini erişilebilir |
| “proxy.ts çalışıyor, CSP uygulanıyor” | Canlı yanıtta CSP yok; middleware manifestleri boş |
| “İletişim maskeleme tam” | Telefon/e-posta/adres çıkarılıyor; carrier_name açık |
| “Frontend typecheck bozuk” | Yeniden doğrulandı; 9 tanı |
| “404 düzeltmesi deploy edilmedi” | Sunucu Git ve HTTP ile yeniden doğrulandı |

Checkbox envanteri: `YAPILACAKLAR.md` 72 işaretli / 7 açık; `CEKLIST-CODEX.md` 0 işaretli / 39 açık; `CEKLIST-OPUS.md` 1 işaretli / 24 açık. Bunlar farklı kapsam ve tarihlerdeki işaretlerdir; toplanarak tamamlanma yüzdesi üretilemez. Yeni inceleme eski rapora yazılmadı; bu tarihli dosya güncel kanıt olarak ayrı tutuldu.

## 10. Önerilen çalışma sırası ve kabul ölçütleri

| Sıra | Paket | Tamamlanma kanıtı |
| --- | --- | --- |
| 1 | Gizlilik, hızlı giriş, upload sınırları | Public yanıtta ad/iletişim yok; üretim demo erişimi yok; anonim upload 401/403 |
| 2 | Ödeme tamamlama ve mutabakat | Yarış/tekrar callback testleri; başarısız teslimde doğru durum; 5 eski pending kayıt açıklanmış |
| 3 | İlan ve test verisi operasyonu | Geçmiş ilanlar uygun statüde; gerçek/test kullanıcı ve bakiyeler ayrılmış; güncel arz ölçümü |
| 4 | Frontend test/typecheck ve build | Üç uygulama için izole, tekrarlanabilir başarılı kalite kapıları |
| 5 | Kontrollü dağıtım | Yayındaki commit/build kaydı; üç eksik URL 404; ana sayfa/API/admin kontrolü |
| 6 | Eski modelin sadeleştirilmesi | Tek bakiye dili, tek admin yönü, kullanım dışı route/ekranların kontrollü kapanışı |
| 7 | İşletim hazırlığı | Yedekten dönüş kanıtı, alarm teslimatı, ödeme/mail yapılandırma doğrulaması |
| 8 | Doküman ve SEO tutarlılığı | Model, canlı domain/port, görev durumları ve kamu metinleri aynı gerçeği anlatıyor |

Yeni özellik geliştirmeden önce ilk beş paketin tamamlanması, mevcut işlevlerin kullanılabilirliğini ve güvenilirliğini artırır. Bu incelemede uygulama kodu, canlı veri ve dağıtım yapılandırması değiştirilmedi; yalnız bu rapor oluşturuldu.


## 11. Tasarım ve akış incelemesi eki — aynı gün

Kullanıcının tasarım yenilemesi ve tam düzeltme çeklisti talebi üzerine inceleme canlı tarayıcıyla genişletildi. Playwright Chromium ile anonim olarak ana sayfa, ilan listesi/detayı, kullanıcı girişi ve ayrı admin girişi görüntülendi. Masaüstü 1440×1000, mobil 390×844 kullanıldı. Önceki §8'deki “tarayıcı testi yapılmadı” ifadesi ilk rapor aşamasını anlatır; bu ekte belirtilen ekranlar sonradan görsel incelendi. Form/giriş/ödeme gönderilmedi; özel kullanıcı/admin iç ekranları görsel olarak doğrulanmadı.

### Yeni P0 bulgusu: ayrı admin'de de hızlı test girişi

`panel.paketjet.com/auth/login` ekranında “Hızlı giriş (test)” / “Admin” düğmesi görünür. `admin_panel/src/app/(main)/auth/_components/login-form.tsx` içinde bu düğme sabit e-posta/parola doldurup submit çağırıyor; blokta production guard yok. Kimlik bilgileri rapora aktarılmadı ve giriş denenmedi. Önceki hızlı giriş bulgusu yalnız müşteri frontend'ini kapsıyordu; düzeltme artık **iki ayrı giriş uygulamasını** kapsamalı. Çeklist F01-03/04/05.

### Yeni ödeme UI bulgusu

`frontend/src/app/panel/ilan-alma-hakki/odeme-sonuc/page.tsx`, `status` ve `amount` query parametrelerini okuyup backend ödeme kaydı sorgulamadan başarı ekranı gösteriyor. Bu gözlem para/hak yaratılabildiğini değil, kullanıcıya yanlış başarı bilgisi sunulabildiğini gösterir. Sahiplik kontrollü işlem durum sorgusu ve tekil/paket sonuç ayrımı F02-08/09'da tanımlandı.

### Yeni görsel/UX bulguları

- İlk ziyarette ana içerik video splash arkasında; kodda Geç kontrolü 3 saniye sonra açılıyor.
- Mobil header düğmeleri iki satır; desktop nav mobilde gizleniyor ve ayrı menü yok.
- Mobil ana sayfada rota/tarih alanları ilk görünümde kapalı; kullanıcı sekmeye dokunmadan arama yapamıyor.
- Mobil ilan kartında geniş turuncu CTA rota ve tarih metnini daraltıyor. Ölçülen document scrollWidth 390 px; yatay sayfa taşması iddiası yok.
- Ana sayfa 1.200+ taşıyıcı, 48.000+ taşıma ve %98 memnuniyet iddiaları yayımlıyor; kaynakta sabit. Bunların geçerli ölçüm kaynağı incelenen DB/kodda doğrulanmadı.
- Kart avatarındaki yeşil nokta gerçek çevrimiçi durumuna bağlanmamış.
- İlan listesinde React #418 konsol hatası görüldü; ilk snapshot'ta 01:29 olan saat sonraki ekran görüntüsünde 03:29. Zaman dilimi kaynaklı SSR/client uyuşmazlığı aday nedendir; ayrıntılı hata ile kesinleştirilmeli.
- Detayda fiyat/erişim alanı mobil ilk görünümün altında. Harita ilk masaüstü görüntüsünde yüklenme aşamasında, sonraki mobil görüntüde çalışıyor; bozuk harita sonucu çıkarılmadı.
- Liste API hatası kodda boş sonuca indirgeniyor; beyan metni yükleme hatası süresiz “yükleniyor” durumunda kalabiliyor.
- Public/panel mor-turuncu ve ayrı admin somon renkli tasarım arasında görsel kopukluk; farklı logo sunumları ve emoji/PNG/SVG ikon karışımı var.

### Yeni teslimler

- [Ana iyileştirme ve tasarım çeklisti](CEKLIST-IYILESTIRME-VE-TASARIM.md): 15 faz, 145 açık uygulama görevi; bağımlılık ve kabul ölçütleri.
- [Tasarım yönergesi](TASARIM-YONERGESI-2026-09-09.md): hedef görünüm, bilgi mimarisi, ekran düzeni, durumlar, responsive ve erişilebilirlik standardı.
- [Sayfa envanteri](SAYFA-ENVANTERI-2026-09-09.csv): 53 frontend + 35 admin kaynak sayfası; her biri için faz, işlem ve inceleme düzeyi. Bunlar 88 benzersiz URL değildir; route group'larından gelen yinelenen `/admin` ayrıca araştırılacak.
- [Tarayıcı kanıt kaydı](output/playwright/paketjet-2026-09-09/browser-observations.json): 8 ekran görüntüsü, ölçüm ve inceleme sınırları.

Tüm uygulama checkbox'ları açık bırakıldı. Tasarım konsepti ve kod değişikliği bu aşamada yapılmadı; kullanıcıya sunulan yeni teslim uygulanabilir plan paketidir.
