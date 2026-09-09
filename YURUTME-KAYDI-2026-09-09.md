# PaketJet yenileme yürütme kaydı

> **Güncel kapanış:**138/145 tamamlandı;7 dış/tarihli bağımlılık açık. Son canlı kod `e9317bb`,9 Eylül03:00:50 UTC. Aşağıdaki zaman çizelgesinin eski yayın adayı notları tarihsel ara durumlardır.

Kullanıcının son talimatı, 145 maddelik çeklistin uygulama, test ve yayın aşamalarını onay beklemeden yürütmektir. Çeklistteki önceki plan-only notu önceki talebe aittir. Bu kayıt yapılmış işi ve dış bağımlılıkları ayırır; açık görevler kanıtsız kapatılmaz.

## Başlangıç

- Çalışma dalı: codex/renewal-20260909; başlangıç HEAD 6e0f436, canlı 740302f.
- Başlangıç kirli diff /tmp/paketjet-renewal-20260909/initial.patch altında; korunan metadata ve kullanıcı değişiklikleri yayın kapsamına karıştırılmayacak.
- Backend/frontend/admin bağımlılıkları frozen lockfile ile kuruldu.
- İzole MySQL8: paketjet-renewal-test, 127.0.0.1:33067, paketjet_test_renewal. Backend .env.test.local ignore edilmiş ve 0600 izinli. 52 başlangıç SQL + additive053 başarıyla uygulandı.
- Canlı yedek /var/backups/paketjet/renewal-20260909/database.sql.gz ve source-config.tar.gz; gzip kontrolü geçti. Upload ve kaynak/konfigürasyon geri yükleme testleri daha sonra tamamlandı; aşağıdaki son kapı esas alınır.

## Kararlar

- Tek tahsilat sağlayıcısı PAYMENT_PROVIDER ile açık seçilir. Canlı PayTR anahtarları yok; Iyzico test modunda. Gerçek tahsilat açılmayacak; UI kullanılabilirlik sorgusu ile açıklama gösterir. Mevcut hak harcama akışı bağımsız çalışır. Gerçek sağlayıcı aktivasyonu dış yapılandırma bağımlılığıdır.
- İlan hareket anı DB UTC, API ISO8601, gösterim Europe/Istanbul. Geçmiş aktif ilanlar varsayılan listeden dışlanır ve satın alınamaz.
- Kart başlangıcı ilan satırını kilitleyip 15dakika rezervasyon oluşturur. Geç tahsilat/teslim edilememe refund_pending; nakit kendiliğinden hak olmaz.
- Eski TL ve booking callback'leri kaldırılmaz; doğrulanmış sağlayıcı makbuzları inceleme kuyruğuna alınır. Eski modelden yeni tahsilat/rezervasyon başlatılamaz. Eski bakiye toplamı otomatik dönüştürülmez.
- Kamu DTO açık alan listeli, kullanıcı kimliği/iletişimi yok. Kişisel erişim durumu ayrı auth+no-store API'den alınır.
- İlan düzenleme tekrar moderasyona düşer; satılmış ilan tekrar satışa açılamaz. Silme arşivleme davranışındadır.

## Doğrulama

İlk backend takım sonucu: 72 test,64 geçti8 başarısız. Eski model beklentileri ve kontrat hataları takipte.
Yeni MySQL yarış/erişim takımı: 9 test9 geçti0 başarısız. İlk çalışmada bulunan user_credits ilk satır gap-lock deadlock'u düzeltildi; tekrar çalıştırmada geçti.
Kanıtlar output/verification/2026-09-09/ altında. Bu ilk ölçümdür; sonraki kapılarda build ve E2E tamamlandı. Canlı yayın durumu son bölümde tutulur.

## Tasarım seçimi

output/imagegen/*-final.png: ana sayfa, liste, detay, panel, form, admin ve mobil referanslar. Kullanıcının otonom yürütme talimatıyla seçildi.
Ana sayfa tam referans; diğer ekranlar aynı token sistemindeki yüzey referanslarıdır. Kaynak logo korunur. Görsel üretimin uydurduğu örnek kişisel/ticari içerik üretime taşınmaz: veri DB'den gelir. Başlık üstü etiket, sahte metrik, otomatik video, turuncu CTA yok. Erişilebilir gerçek UI kontrolleri kullanılır.
Ana sayfa header/footer referansı tüm kamu sayfalarında ortaktır; ayrı örneklerin farklı footer sloganı uygulanmaz. Detayda anonim giriş ve auth satın alma durumları ayrı gösterilir; resimdeki aynı anda iki CTA uygulanmaz.

## Sağlayıcı doğrulama kaynakları

- https://docs.iyzico.com/en/payment-methods/checkoutform/cf-implementation/cf-retrieve.md
- https://dev.paytr.com/iframe-api/iframe-api-2-adim

Iyzico callback token ile bulunur; conversationId tek başına bağlayıcı değildir. Basket/tutar/para birimi/makbuz eşlenir. PayTR HMAC sabit zamanlı karşılaştırılır, eksik anahtar reddedilir; taksit kapalı tutularak kuruş tutarı eşlenir.

## Ara doğrulama — 9 Eylül 2026

İşaretli F00/F01/F02/F03 kod maddeleri yerel ve izole DB kanıtıdır; canlı yayını ifade etmez. Başlangıç farkı özel /tmp alanında saklı; canlı yedekten paketjet_test_restore veritabanına geri yükleme geçti (23 kullanıcı, 16 ilan, 11 eski cüzdan, toplam 3425 TL). Kaynaklar output/verification/2026-09-09/restore-test.txt ve backend-tests-final.log.

- Backend: 84 test, 252 assertion, 0 hata; 18 test dosyası. Gerçek MySQL işlem yarışı, erişim sınırları, bir kullanımlık şifre sıfırlama, yetki sürümüyle oturum iptali, avatar dosyası gerçek HTTP sunumu, ödeme tekrarı ve hak düzeltmesi kapsanıyor.
- Admin: Biome 390 dosya, hata yok (admin-lint-final.log). Mevcut uyarılar ayrı takip edilir. Üç uygulamanın son build ve tarayıcı kapıları sürüyor.
- Güvenlik düzeltme skill'inin zorunlu tek bağımsız bypass incelemesi tamamlandı. Dondurulmuş aday SHA256 e9b147a6022a2456735f06e1c5471e7ea2382ad4770c06a9c50dec1b0d749375. Bulunan cookie/Bearer kimlik uyuşmazlığı ve çok uzantılı HTML yükleme yolu kapatıldı; yeni regresyonlar tüm takımda geçti. İkinci bir inceleme döngüsü başlatılmadı.
- Şifre sıfırlama API'sinden token dönmesi kaldırıldı; opak tek kullanımlık token hash ile saklanır, şifre değişikliği eski oturumları geçersiz kılar. Public site_settings artık açık izin listesi dışında hiçbir anahtar sunmaz.
- 053–055 yükseltmeleri izole testte uygulandı; üretim migration ve veri düzeltmesi henüz yapılmadı.
- Görsel referanslar output/imagegen/*-final.png, seçilen ortak tokenlar frontend/admin CSS içinde. Nihai görsel eşlik ve akış turu henüz kapanmadı.

## İkinci ara kapı

- 86 backend testi / 264 kontrol / 0 hata: backend-tests-final.log. Yeni içerik sürümü ve fiyat sınırları da geçti.
- e2e-results.json: gerçek tarayıcı ile satıcı giriş, return URL, yeni ilan ve moderasyon mesajı geçti. buyer-e2e.json: yönetici onayı200, mobil hak kullanımı, 5→4 bakiye, iletişim geçmişine dönüş/yenileme ve anonim401 geçti.
- Admin tip kontrolü ve 391 dosya Biome hata vermedi; son eklenen ilan geçmişi sonrası kontrol tekrarlanacak.
- restored-maintenance.log: canlı yedeğinin izole kopyasında16 ilan expired,5 ödeme review,0 güncel ilan. Gerçek DB henüz değişmedi. TL arşivi korunuyor.
- Kullanım modeli kapatılan endpoint'lerde410; callback'ler doğrulama+inceleme için korunuyor. Eski frontend admin sayfaları yeni destek/SSS/sayfa/finans yönetimine yönleniyor.
- 132 satırlık ilk görsel matris çalıştı; tablet tablo taşması ve zoom hak hareketi düzeltildi. Tema geçişi beklenmeden çekilen görüntüler yeniden alınıyor. Bu nedenle görsel maddeler henüz topluca kapatılmadı.
- İşaretlenen teknik maddeler bu yerel/test kanıtlarına dayanır; son commit ve canlı kanıt F14'te ayrıca kaydedilecektir.

## Yayın adayı kapısı — 9 Eylül

- Backend86 test264 kontrol; ayrıca yeni refresh/logout testi1 test7 kontrol: toplam87 test/271 kontrol geçti. Frontend13 test/6 dosya geçti. Üç üretim build'i, frontend lint ve admin Biome hata vermedi; mevcut düşük öncelikli uyarılar hata olarak gizlenmedi.
- Next her iki uygulamada15.5.24, bağımlılık kilitlerinde npm advisory bulk taraması üç uygulamada0 bulgu. Paket yöneticisi Bun1.3.10; eski Bun1.2 ağ/kurulum takılması yerel IPv4 registry geçidi ve güncel Bun ile giderildi. Geçit adresi kilit dosyalarına yazılmadı.
- İki gerçek E2E tekrar geçti; alıcı hak bakiyesi4→3, tek debit, kalıcı iletişim ve anonim401. Ayrı20dosyalık backend kapsamı auth/session/privacy/payment/content içerir.
- 88 kaynak sayfasının HTTP fixture kontrolü geçti; yanlış olmayan slug ilk dev derleme yarışından sonra yeniden200. Bu88 benzersiz URL değildir. CSV her satır için koruma/yönlendirme sonucu içerir.
- Görsel matris132 kontrol; haklar zoom taşması kartların gerçek genişliğine göre kolon seçimiyle düzeltildi ve final-browser.json ile tekrar doğrulandı. Yeni kayıt/iletişim ekranları, admin tema/ayar/depolama/satış ekranları ayrıca gezildi.
- Mobil şehir klavyesi, dialog focus/Escape/odak dönüşü, mobil menü Escape ve bakiye API500 durumunda hata gösterimi geçti.
- Üretim yedeğinden DB, uploads ve kaynak/konfigürasyon geri yüklendi. Eski bakiyeler3425 TL korunuyor. Ledger boş; kaynak kanıtı yok. Bilinir varsayılan parola denetimi23 hesabın0'ında eşleşti; sırlar ve gerçek kullanıcı oturumları rastgele değiştirilmedi. Public settings'teki hassas alanlar canlı DB'de boş/placeholder; yeni API açık izin listeli.
- Yeni063 değil, **053–062** arası additive migration paketi hazırlanmıştır; kaynak checksum günlüğü vardır. Gerçek kart sağlayıcısı, SMTP teslimi, Maps konsolu ve harici alarm teslimi dış bağımlılıktır.

Bu bölüm yayın öncesi kapıdır. Commit/PM2/canlı veri ve yayın sonrası ölçüm bir sonraki bölümde kaydedilecektir.

## Son yayın, test ve mutabakat

- `d058642` ana yenileme canlıya alındı; PM2 reload eski cwd'yi koruduğu için ilk HTTP kapısı hatayı yakaladı. Üç PaketJet süreci yeni ecosystem ile yeniden oluşturularak02:42:51 UTC'de doğrulandı. Yayın betiği kalıcı olarak bu yönteme düzeltildi.
- Admin girişi sadeleştirildi, işlevsiz30 gün seçeneği kaldırıldı, parola görünürlüğü/hydration ve güvenli dönüş adresi tamamlandı. Yerel gerçek admin girişi satın alma yönetimine döndü; tarayıcı hatası0.
- `e9317bb` commit/push; frozen install ve üç sunucu production build başarılı. Taze DB/source/upload yedeği doğrulandı,053–062 journal idempotent geçti. Son yayın03:00:50 UTC; PM2 üç doğru sürüm cwd, online, restart0.
-101 otomatik test başarılı:87 backend,13 frontend,1 admin. Web/admin tip kontrolü ve üç build başarılı. Lint hata0; web14/admin407 uyarı kalan bakım borcu. İzole restore DB'sine062 son migration da uygulandı; sıfır DB seed062'ye kadar geçti.
- Son canlı HTTP14 kontrol/sitemap14 URL geçti; üç404 ve özel API yetkisi doğrulandı. Kamu ayarlarında private anahtar yok; boş Maps browser anahtarı bilinçli public yapılandırma olarak ayrıldı.
- Canlı kontrollü signup→özel pending ilan→düzenleme→panel→arşiv→logout geçti. Test hesabı inactive, ilan removed;0 satın alma/ledger. Son24 kullanıcı/22 aktif,16 expired +1 removed ilan,0 aktif ilan;11 cüzdan/3.425 TL ve5 pending ödeme korundu.
- Mobil laboratuvar üç koşu ortanca LCP5,612→0,728sn, CLS0,19056→0,00211; otomatik video4→0. Bu saha INP verisi değildir.
- Gerçek cron03:00 UTC otomatik health/bakım çalışması kanıtlandı. Günlük/haftalık yedek, logrotate, disk eşiği kurulu.10 Eylül02:43 UTC /16 Eylül02:43 UTC takipleri zamanlandı, sonuçları henüz yok.
- Kalan7 madde ve somut bağımlılıkları güncel durum raporu ile ana çeklistte. Ödeme disabled; eksik sağlayıcı/mail/Maps/alarm yapılandırması sahte başarıyla gizlenmedi.
- Başlangıç kullanıcı değişiklikleri `.gitignore`, iki tsbuildinfo ve `project.portfolio.json` korundu, commit kapsamına alınmadı. Tarihsel untracked listeler silinmedi. Sunucudaki geçici denetim betikleri özel işletim arşivine taşındı. Canlı worktree'deki uploads symlink'i kalıcı medya arşividir.
