# PaketJet işletim ve yayın kaydı

Bu sürüm kullanıcı talimatıyla yetkili yenilemedir. Çalışma dizini `/var/www/paketjet`; SSH `vps-paketjet`. Kamu sitesi paketjet.com, yönetim paneli panel.paketjet.com. Backend 8070, web 3070, admin 3071. PM2 süreçleri Node/Next çalıştırır; MySQL ve Nginx sistem servisleridir. Docker/Nginx dosyaları değiştirilmez.

## Yedek ve yükseltme

- 9 Eylül yedeği: `/var/backups/paketjet/renewal-20260909/`, dizin0700/dosyalar0600. database.sql.gz, source-config.tar.gz, uploads.tar.gz. Dosya bütünlüğü gzip ile kontrol edildi.
- Canlı SQL yedeği yerel, izole `paketjet_test_restore` DB'ye geri yüklendi. 053–062 yükseltmeleri bu kopyada çalıştırıldı. Sonuçlar `output/verification/2026-09-09/restored-*.log` altında.
- Yeni migration çalıştırıcısı `backend/scripts/renewal-migrate.ts`; yalnız 053–062 aralığını ve DROP/TRUNCATE içermeyen dosyaları kabul eder. Varsayılan plan, `--apply` yazım, test dışı DB için ayrıca `--production` gerekir. Üretimde seed çalıştırılmaz.
- 053 ödeme seansları ve eski ödeme inceleme kuyruğu; 054 ödeme olayları/hak düzeltme kimliği; 055 auth_version; 056 değişmez içerik sürümleri; 057 kamu ürün metinleri; 058 ilan durum geçmişi;059 admin marka,060 placeholder iletişim,061 destek modeli,062 logo/iletişim tutarlılığı. Eski kullanıcı onayları ve TL bakiyesi korunur.
- Yeni uygulama önce build edilir; DB yedeği yenilenir, migration uygulanır, backend sonra iki Next süreci yeniden başlatılır. Paket sağlayıcısı açıkça `PAYMENT_PROVIDER=disabled` kalır; eksik gerçek anahtarla tahsilat açılmaz.

## Geri dönüş

Yayın öncesi PM2 süreç adı, çalışma dizini ve commit özel işletim kaydına alınır. Yeni sürümde ödeme/gizlilik hatası olursa tahsilat kapalı tutulur; eski güvensiz auth/storage kaynaklarına körlemesine dönülmez. Yeni veri yazılmış DB üzerine eski SQL yedeği doğrudan yüklenmez. Önce arıza anı yedeklenir, ödeme ve hak hareketleri karşılaştırılır. Additive tablolar yerinde kalabilir; 057 metinleri 056 snapshot'larından geri alınabilir. Kaynak geri dönüşü yayın öncesi kaynak arşivi veya kaydedilmiş commit ile ayrı dizinde build edilip doğrulanır.

## Zamanlanmış işler ve saklama

`renewal-maintenance.ts --apply` geçmiş active/pending_approval/paused ilanları expired yapar, ödeme zaman aşımını review kuyruğuna taşır. Tahsilat/iadeye karar vermez. Satılmış ilan, iletişim snapshot'ı ve cüzdan etkilenmez. Public sorgu, bu iş çalışmasa da geçmiş ilanı satın almaya kapatır. Sunucu cron'u UTC çalıştırılır; UI Europe/Istanbul gösterir.

`renewal-monitor.mjs` HTTP durumunu ve health JSON gövdesini birlikte kontrol eder, hatada exit1 döner. Çıktılar `/var/log/paketjet-renewal/` altında tutulur. 24 saat ve 7 gün kontrolleri yayın anına göre sunucuda zamanlanır; tarih gelmeden sonuç tamamlanmış sayılmaz. Harici alarm kanalı ve test teslimi ayrıca doğrulanmalıdır.

Yedek hedefi günlük DB, haftalık upload/source; 14 günlük günlük ve 8 haftalık haftalık saklama. Otomatik silme mevcut eski yedeklere uygulanmaz; yalnız yeni görev tarafından üretilen dosyalar kapsamındadır. Disk %85 eşiği alarm sebebidir. Logrotate günlük,14 sıkıştırılmış kopya, root0600 hedefidir.

## Dış yapılandırma sınırları

PayTR anahtarları eksik; Iyzico test modunda. Beş eski ödeme sağlayıcı makbuzu olmadan tamamlandı/iptal/gelir yapılamaz. Yeni inceleme ekranı referans ve notlarla takip eder. SMTP env tanımlı değil; DB ayarı ve yetkili test alıcısı olmadan mail teslimi kanıtlanamaz. DKIM selector ve Maps billing/kota konsol erişimi tahmin edilmez. Bu bağımlılıklar teknik fallback ile gizlenmez.

## Root PM2 azaltma planı

Ayrı `paketjet` servis hesabı; kod okunabilir, yalnız uploads/log dizinleri yazılabilir; env0600. 8070/3070/3071 ayrıcalıksız portlar olduğundan root gerekmez. Önce yeni hesapla farklı portta build/health, sonra kısa süreç devri ve aynı upstream portlarına dönüş. Geri dönüş eski PM2 dump'ı ve dizin izin envanteriyle yapılır. Bu mimari geçiş mevcut yayına karıştırılmaz; Nginx/Docker düzenlenmez.

## Güvenlik bağımlılık kapısı

Next.js25 Ağustos2026 güvenlik duyurusu nedeniyle iki arayüz15.5.24'e yükseltildi: https://nextjs.org/blog/august-2026-security-release . Sharp0.35.4 ve ilgili transitive düzeltmeler kilitlendi; üç Bun kilidinin advisory taraması0 bulgu. Bun1.3.10, Node22/24 hedefidir. Fastify static10 değişen header API'si gerçek HTTP avatar regresyonuyla doğrulandı.
