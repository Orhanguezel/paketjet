# PaketJet — Teknik düzeltme ve tasarım yenileme ana çeklisti

> **9 Eylül tasarım ikinci tur:** Kullanıcının fazla beyaz/sade bulduğu görünüm lavanta–açık mavi yüzeyler, güçlü lacivert başlıklar, hareketli rota ve mevcut marka videosuyla yenilendi. Güncel görsel kararlar ve testler [tasarım ikinci tur kaydında](output/design-v2/DESIGN.md). Son uygulama kodu `6115399`; canlı yayın kanıtı `output/design-v2/release.json`. Önceki beyaz ağırlıklı ekranlar ilk turun tarihsel kanıtıdır.

**Tarih:** 9 Eylül 2026. **Durum:** Otonom uygulama ve yayın tamamlandı; dış bağımlılıklar gerekçeleriyle açık. **Kapsam:** 15 faz, 145 görev, 88 kaynak sayfası.

Kaynaklar: [güncel durum raporu](DURUM-RAPORU-2026-09-09.md), [tasarım yönergesi](TASARIM-YONERGESI-2026-09-09.md), [88 sayfalık kaynak envanteri](SAYFA-ENVANTERI-2026-09-09.csv), [son canlı tarayıcı kanıtları](output/verification/2026-09-09/live-browser.json).

Bu dosya teknik iyileştirme ve tasarım yenilemesinin güncel yürütme listesidir. `YAPILACAKLAR.md` §0 kesin iş modeli referansıdır. Temmuz tarihli Codex/Opus çeklistleri tarihsel ayrıntıdır; güncel kanıtla çelişen komut, domain, silme veya dağıtım önerileri doğrudan uygulanmaz.

> **Kapanış:**138/145 tamamlandı;7 dış/tarihli bağımlılık açık. Son çalışan kod `e9317bb`, yayın03:00:50 UTC. Ayrıntı ve kanıtlar §4 ile güncel durum raporunda.

## 0. Hedef, sınır ve çalışma şekli

Hedef: temiz ve tutarlı bir kullanıcı deneyimi; güncel ilanlar; güvenilir iletişim satışı; tek ve anlaşılır yönetim yüzeyi; doğrulanabilir dağıtım. Logo ve marka ailesi korunur. Yeni framework, platform üzerinden kargo takibi, taşıma ücreti tahsilatı, payout, abonelik veya mobil uygulama bu yenilemenin parçası değildir.

Son kullanıcı talimatı tüm çeklisti uygulama, test etme ve yayınlamayı onay beklemeden yürütmektir. Önceki plan kapsamı bu talimatla genişletildi. Gerçek sonuçlar [yürütme kaydında](YURUTME-KAYDI-2026-09-09.md) tutulur; dış sağlayıcı kanıtı ve gelecek tarihli izleme sonucu uydurulmaz.

AGENTS.md sınırları: `CLAUDE.md` ve `project.portfolio.json` değiştirilmez; Docker/Nginx değişikliği mimari karar olmadan yapılmaz; mevcut modül düzeni korunur. Gerçek canlı model PM2 + `panel.paketjet.com` olduğundan “admin için yeni Docker servisi/domaini aç” görevi yoktur.

Her görev `[ ]` açık kalır; kanıt olmadan `[x]` yapılmaz. Tamamlanınca satır altına `Tarih | commit | test/ekran/API kanıtı | yerel/test/canlı | kalan not` yazılır. Atlanan görev silinmez; gerekçesi ve bağımlılığı kaydedilir. İşaretli madde sadece kod yazılmış anlamına gelmez. Görsel görevlerde tarayıcı ekranı, işlevlerde senaryo sonucu, deploy görevlerinde canlı kanıt gerekir.

P0: gizlilik/erişim/ödeme bütünlüğü. P1: çekirdek akış, gerçek veri, build ve mobil kullanılabilirlik. P2: bakım ve ikincil düzenlemeler. Her fazın alanı sorumluluk belirtir; belirli bir model/ajan ataması veya otomatik delegasyon gerektirmez.

## 1. Faz sırası ve bağımlılıklar

| Faz | Öncelik / alan | Bağımlılık | Çıkış ölçütü |
| --- | --- | --- | --- |
| F00 Hazırlık | P1 / uygulama ve işletim | Yok | İzole test, kapsam ve kanıt düzeni |
| F01 Güvenlik | P0 / backend + auth | F00 | Gizli veri ve demo erişim yolları kapanır |
| F02 Ödeme | P0 / backend + frontend | F00, F01'in auth işleri | Tahsilat/teslim tutarlı ve testli |
| F03 Veri/ilan ömrü | P1 / backend + operasyon | F00; parasal değişiklik F02 | Güncel arz ve açıklanmış eski kayıtlar |
| F04 Eski model | P1 / tüm uygulamalar | F02, F03 | İşlev kaybetmeden eski akışların kapanması |
| F05 Tasarım sistemi | P1 / tasarım + frontend | F00; konsept mevcut veriyle hazırlanabilir | Görsel referanslar ve ortak bileşenler |
| F06 Genel site | P1 / frontend | F05; veri entegrasyonu F03 | Temiz, doğru içerikli ana sayfa/menü |
| F07 Liste/detay | P1 / frontend + backend | F01–03, F05 | Mobil arama → detay → erişim akışı |
| F08 Auth/formlar | P1 / auth + frontend | F01, F05 | Girişten işe dönüş ve doğru formlar |
| F09 Kullanıcı paneli | P1 / frontend | F02–05, F08 | Haklar ve kişisel işlemler tutarlı |
| F10 Admin | P1 / admin + backend | F02–05 | Yönetim işlevleri korunmuş tek yüzey |
| F11 İçerik/SEO | P1–P2 / içerik + frontend | F06–10 ile eşgüdüm | Doğru model, URL ve kamu içeriği |
| F12 Kalite | P1 / tüm uygulamalar | Her fazda çalışır; kapanış F01–11 | Test/build/görsel kapıları geçer |
| F13 İşletim | P1 / operasyon | F01–04 | Geri dönüş, yedek, izleme hazır |
| F14 Yayın | P1 / yayın sorumlusu | F12, F13 | Yetkili yayın ve canlı doğrulama |

Önerilen ilk uygulama paketi: F00 + F01 + F02 tasarımı + F03 envanteri. Tasarım konsept çalışması bu hazırlık sırasında yürütülebilir; ödeme/gizlilik engelleri çözülmeden yeni arayüz üretime çıkmaz. Basit acil düzeltme, tüm yeniden tasarımın bitmesini beklemek zorunda değildir; aynı test/yayın kapılarını geçerek ayrı yayınlanabilir.

## F00 — Başlangıç ve karar kayıtları

Kaynak: rapor §4/8/9, yerel Git, canlı PM2. Sorumluluk: uygulama/işletim.

- [x] F00-01 Mevcut kirli çalışma ağacını ve canlı HEAD/build/PM2 durumunu yeniden kaydet; başkasının değişikliğini karıştırmayan çalışma alanı oluştur. Kabul: başlangıç diff'i ve kapsam listesi kayıtlı.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, restore-test.txt, başlangıç özel diff | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F00-02 Her uygulamanın kilit dosyasıyla bağımlılıklarını izole kur; tip, lint, test ve build komutlarını doğrula. Kabul: kullanılabilir komutlar ve başlangıç hataları dosyalanmış.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, restore-test.txt, başlangıç özel diff | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F00-03 Üretimden ayrılmış test DB/ödeme sandbox/medya alanı kur; test başlangıcında üretim hedefini reddet. Kabul: entegrasyon testleri canlı kullanıcı veya ödeme oluşturamaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, restore-test.txt, başlangıç özel diff | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F00-04 Public, ilan sahibi, satın alan, başka kullanıcı ve admin için kontrollü test kimlikleri/verileri hazırla. Kabul: gerçek kişisel veri ve koda gömülü parola yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, restore-test.txt, başlangıç özel diff | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F00-05 Karar kaydı aç: etkin ödeme sağlayıcısı, eski bakiyelerin niteliği, tek admin geçişi, ilan süresi ve yarım ödeme telafisi. Kabul: açık kararlar görev bağımlılıklarına bağlanmış; belirsiz konuda sessiz veri dönüşümü yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, restore-test.txt, başlangıç özel diff | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F00-06 Sayfa envanterini build route çıktısı ve gerçek sidebar/linklerle eşleştir; dinamik yollar için örnek fixture belirle. Kabul: 88 kaynak kaydının her biri korunacak/taşınacak/yönlenecek/kalkacak olarak sonuçlandırılmış.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, restore-test.txt, başlangıç özel diff | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F01 — Erişim, gizlilik ve yapılandırma güvenliği

Kaynaklar: `ilanlar/{repository.ts,helpers/repository.ts}`, iki login bileşeni, `storage/`, auth middleware, seed, env.

- [x] F01-01 Public ilan DTO'sunu açık alan listesiyle kur; `carrier_name`, özel iletişim, IP ve özel kullanıcı alanlarını çıkar. Kabul: anonim liste/detay/önbellek yanıtında özel bilgi yok; TypeScript Public/Owner/Reveal tipleri ayrılmış.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F01-02 Reveal/kişisel liste/yönetim erişimini sahiplik ve satın alma kaydıyla test et. Kabul: anonim 401; başka kullanıcının erişimi reddedilir; doğru alıcıya snapshot açılır.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F01-03 Frontend girişindeki otomatik demo hesabını ve gömülü bilgileri kaldır. Kabul: üretim HTML/JS bundle'ında hızlı giriş ve bilinir hesap bilgisi yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F01-04 Ayrı admin `auth/_components/login-form.tsx` içindeki Hızlı giriş (test) kodunu kaldır. Kabul: admin bundle'ı ve canlı giriş ekranı aynı kontrolden geçer; sadece düğmeyi CSS ile gizlemek yeterli değildir.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F01-05 Etkilenmiş demo/varsayılan hesapları ve oturumları kontrollü incele; doğrulanmış etkilenen hesapların sır/oturum yenilemesini işletim planıyla tamamla. Kabul: eski erişim geçersiz; gerçek kullanıcı erişimi korunmuş; secret rapora/Git'e yazılmamış.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F01-06 Storage upload için auth, rol, bucket/sahiplik kontrolü ekle. Kabul: anonim 401/403, kullanıcı admin varlığını değiştiremez; izinli kullanım çalışır.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F01-07 Upload boyut/tür/içerik sınırlarını ve güvenli adlandırmayı uygula; sağlayıcı yazımı öncesi kontrolleri tamamla. Kabul: izin dışı dosya reddedilir; çakışma mevcut varlığı izinsiz ezmez; 501 stub'lar çalışan özellik gibi sunulmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F01-08 Seed debug SQL yazımını ve varsayılan parolaları kaldır; üretim hedefi/drop korumasını açık hale getir. Kabul: secret dökümü yok, yanlış hedefte seed reddedilir, temiz test kurulumu çalışır.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F01-09 JWT/cookie ve etkin ödeme sağlayıcısı yapılandırmasını fail-closed doğrula; pasif sağlayıcı için gereksiz sır isteme. Kabul: eksik etkin ayar sessizce sandbox'a veya boş anahtara düşmez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F01-10 Auth route'larının ortak korumasını, refresh/logout ve güvenli return URL davranışını düzenle. Kabul: dış URL'ye yönlendirme yok; süresi dolan oturumda sonsuz döngü/özel içerik parlaması yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F01-11 Çalışan Next sürümüne uygun sunucu route korumasını build çıktısıyla doğrula; CSP'yi ödeme/Maps gereksinimleriyle uygulama düzeyinde tasarla. Kabul: gerçek response/manifest kanıtı, yalnız `proxy.ts` dosya varlığına güvenilmez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F01-12 Admin token depolamasını ve auth yaşam döngüsünü tehdit/uygulama modeliyle gözden geçir; seçilen güvenli yöntemi frontend/backend birlikte uygula. Kabul: giriş, refresh, logout, CSRF/oturum senaryoları testli; geçişte yönetim erişimi kaybolmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | bundle-auth-audit.json, account-exposure-audit.json, auth-session-test.log, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F02 — Ödeme ve iletişim erişimi bütünlüğü

Kaynaklar: `purchases/{repository.ts,payment.repository.ts,payment.controller.ts,schema.ts}`, `PaymentModal.tsx`, `odeme-sonuc/page.tsx`.

- [x] F02-01 Etkin sağlayıcıyı gerçek yapılandırmadan belirle; tek sağlayıcı hedefi/uyumluluk dönemini kaydet. Kabul: ürün seçeneği, ayar ekranı, callback ve doküman aynı kararı izler.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F02-02 Ödeme başlangıcı, sağlayıcı tahsilatı, erişim teslimi ve telafi durumlarını ayrı bir durum tablosuyla tanımla. Kabul: başarısız teslim başarılı tahsilatı silmez; her geçişin kaynağı belli.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F02-03 Tek alıcı yarışı için süreli rezervasyon veya eşdeğer kontrollü tahsilat stratejisini uygula. Kabul: aynı ilana iki alıcı erişim alamaz; süre aşımı ve geç callback testleri geçer.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F02-04 Tahsilat olup erişim teslim edilemeyen işlem için takip edilebilir telafi/mutabakat akışı ekle. Kabul: işlem sahipsiz `failed` kalmaz; nakit otomatik ve habersiz kontöre çevrilmez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F02-05 Callback'i sağlayıcıdaki işlem kimliği, beklenen sipariş, tutar, para birimi ve durumla eşleştir. Kabul: farklı sipariş/tutar ve geçersiz bildirim erişim/hak oluşturamaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F02-06 Tekrar, sırası değişmiş ve eşzamanlı callback'leri idempotent yap. Kabul: tek ledger etkisi, tek purchase ve tekrar çağrıda tutarlı sonuç; ilk bakiye satırı yarışları da kapsanır.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F02-07 Repository tamamlaması başarısızsa controller'ın başarıya yönlenmesini düzelt. Kabul: unavailable/not_found/failed dalları başarı ekranı üretmez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F02-08 Sahiplik kontrollü ödeme durum sorgusu ekle/var olanı kullan; sonuç sayfasını buraya bağla. Kabul: yalnız `?status=success&amount=...` ile ödeme başarılı veya bakiye eklenmiş gösterilemez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F02-09 Tekil satın alma ve paket sonucunu ayır; gecikmiş callback için bekliyor/yenile/yardım durumları oluştur. Kabul: tekil işlem kullanıcıyı aldığı ilana, paket işlemi haklarına veya başladığı ilana götürür.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F02-10 Fiyat ve paket validasyonunu pozitif/tamsayı/para hassasiyeti kurallarıyla tamamla. Kabul: eksik/bozuk fiyat ücretsiz işleme dönüşmez; tutar sunucudan, hak adedi doğrulanmış kayıttan alınır.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F02-11 Hak düşme, ledger ve iletişim snapshot işlemlerinin atomikliğini koru; tekrar satın alma yerine mevcut erişimi döndür. Kabul: yetersiz hakta eksilme yok; eski alıcı yeni ücret ödemez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F02-12 Eski TL deposit akışını yeni başlatmaya kapatırken bekleyen gerçek bildirimleri kaybetmeyen geçiş planı uygula. Kabul: eski callback'ler mutabakat bitmeden körlemesine silinmez; yeni satın alma yalnız yeni modelden başlar.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | ODEME-VE-ESKI-MODEL-KARARLARI.md, backend-tests-final.log, buyer-e2e.json, interaction-tests.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [ ] F02-13 Test matrisini tamamla: hakla alım, kartla alım, paket, ret, timeout, iptal/kapatma, tekrar callback, iki alıcı, satılmış/expired/own ilan. Kabul: DB bakiyesi/ledger/purchase ve ekrandaki durum birlikte doğrulanmış.
  - Durum: DIŞ BAĞIMLILIK: Gerçek sağlayıcı anahtarları/checkout ortamı yok. Hakla satın alma, yarış, tekrar callback ve gerçek 20 sn timeout testleri geçti; sağlayıcı kart kabul/ret/3DS testi tamamlanmadı. Tahsilat disabled.

## F03 — Gerçek veri, ilan ömrü ve moderasyon

Kaynaklar: `ilanlar/`, `user_credits`, `credit_ledger`, `wallets`, ödeme tabloları. Gerçek veri değişikliği öncesinde F00/F13 korumaları gerekir.

- [x] F03-01 23 kullanıcı/16 ilan/5 pending ödeme/11 cüzdan başlangıcını güncel, salt okunur envanterle yenile. Kabul: test/gerçek/belirsiz sınıflaması; alan adına bakarak kesin silme yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | live-inventory.json, backend-tests-final.log, e2e-results.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F03-02 İlan statü geçişlerini tanımla: incelemede, aktif, satıldı, süresi doldu, kaldırıldı; mevcut şemayla uyumlu eşleme yap. Kabul: izinli aktörler ve geçişler backend tarafından uygulanır.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | live-inventory.json, backend-tests-final.log, e2e-results.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F03-03 Hareket zamanını ve ürünün saat dilimini açıkça belirle. Kabul: DB/API/SSR/tarayıcı aynı anı gösterir; geçmiş ilan varsayılan aramada görünmez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | live-inventory.json, backend-tests-final.log, e2e-results.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F03-04 Süre bitişini sorgu kuralı ve gerekiyorsa sunucuda çalışan görevle uygula. Kabul: cron çalışmasa bile geçmiş ilan satın alınamaz; scheduler varsa host/timezone/log kanıtı var.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | live-inventory.json, backend-tests-final.log, e2e-results.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F03-05 14 geçmiş aktif ve 2 geçmiş bekleyen ilanı envantere göre düzenle/arşivle. Kabul: güncel liste/ana sayfa/admin sayaçları tutarlı; kişisel erişim geçmişi kaybolmaz.
  - Kanıt: 2026-09-09 | d058642 | production-maintenance.json, live-inventory-after.json: 16 expired; eski erişim ve bakiyeler korundu. | canlı.
- [ ] F03-06 5 eski pending ödemeyi sağlayıcı kanıtıyla sonuçlandır; başarısızlık nedenini kaydet. Kabul: yaş/tutar tek başına iptal veya gelir kararı üretmez; belirsiz kayıt iş kuyruğunda görünür.
  - Durum: DIŞ BAĞIMLILIK: 1 tekil + 4 paket ödemesinin sağlayıcı makbuzu yok. 775 TL pending kayıt gelir sayılmadı; yönetimde inceleme kuyruğuna alındı. Sonuçlandırma için sağlayıcı hareket dökümü gerekir.
- [ ] F03-07 3.425 TL görünen eski bakiyenin kaynağını belirle; arşiv/dönüşüm kararını ayrı uygula. Kabul: otomatik TL/50 dönüşümü yok; öncesi/sonrası toplam ve sahiplik mutabık.
  - Durum: DIŞ BAĞIMLILIK: 11 cüzdan toplamı 3.425 TL; wallet_transactions boş. Kaynağı kanıtlanamadığından toplam/hesap sahipliği korundu, hakka çevrilmedi. Muhasebe/sağlayıcı hareket dökümü gerekir.
- [x] F03-08 Seed ve fixture'ları gerçek üretim içeriklerinden ayır; tarihli demo ilanlar yalnız testte oluşsun. Kabul: yeniden seed üretime sahte kullanıcı/istatistik/ilan eklemez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | live-inventory.json, backend-tests-final.log, e2e-results.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F03-09 Moderasyon sonucu ve yayında olma durumunu kullanıcıya doğru aktar; eski verideki onay kuyruğunu temizleme planı oluştur. Kabul: “gönderildi” ekranı onaylanmadan “yayında” demez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | live-inventory.json, backend-tests-final.log, e2e-results.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F04 — Eski model ve mimari temizlik

Kaynaklar: `backend/src/routes.ts`, eski modüller, frontend `/admin`, config/barrel/locale dosyaları. Silme öncesi import, endpoint ve veri bağımlılığı çıkarılır.

- [x] F04-01 Bookings, booking-messages, ratings, subscription, carrier-agreements ve wallet için kullanım haritası çıkar. Kabul: canlı tüketici, ortak helper ve korunacak callback belli; toplu klasör silme yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | unused-frontend-files.json, ODEME-VE-ESKI-MODEL-KARARLARI.md, üç build çıktısı | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F04-02 Eski route'ları kontrollü emekli et; gerekli arşiv ve eski bağlantı davranışını koru. Kabul: yeni modelde eski para/rezervasyon başlatılamaz; geçiş endpoint'leri belgeli.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | unused-frontend-files.json, ODEME-VE-ESKI-MODEL-KARARLARI.md, üç build çıktısı | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F04-03 Frontend içindeki admin'in işlevlerini ayrı adminle karşılaştır; eksik destek/SSS/içerik/SEO işlerini F10'a taşı. Kabul: sadece URL yönlendirmekle işlev kaybı oluşmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | unused-frontend-files.json, ODEME-VE-ESKI-MODEL-KARARLARI.md, üç build çıktısı | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F04-04 Kullanılmayan sayfa/bileşen/test/endpoint/locale/barrel öğelerini kullanım kanıtıyla kaldır. Kabul: yeni purchases akışı için kapsama korunur; tsc geçirmek için aktif test körlemesine silinmez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | unused-frontend-files.json, ODEME-VE-ESKI-MODEL-KARARLARI.md, üç build çıktısı | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F04-05 Wallet controller DB sorgularını, modül kalıyorsa repository'ye taşı; emekli olacak dosyayı gereksiz yeniden yazma. Kabul: controller HTTP, repository DB sınırı sağlanır.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | unused-frontend-files.json, ODEME-VE-ESKI-MODEL-KARARLARI.md, üç build çıktısı | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F04-06 Yaşayan modüllerde 200 satır ve router 30 satır sınırını uygula; ortak kod `_shared/` altında. Kabul: yeni dosyalar modül düzenini bozmaz; handler hata yönetimi tutarlı.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | unused-frontend-files.json, ODEME-VE-ESKI-MODEL-KARARLARI.md, üç build çıktısı | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F04-07 Şema, temiz seed ve canlı yükseltmeyi ayrı doğrula; yinelenen seed prefix/placeholder sorunlarını geçmiş uygulama kayıtlarını bozmadan çöz. Kabul: boş DB kurulumu ve mevcut DB yükseltmesi ayrı test edilir.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | unused-frontend-files.json, ODEME-VE-ESKI-MODEL-KARARLARI.md, üç build çıktısı | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F04-08 Route/API sabitleri ve admin barrel'larını temizle; kalan eski adları geçiş açıklamasıyla işaretle. Kabul: yeni path'ler config'te, bozuk menü/link/import yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | unused-frontend-files.json, ODEME-VE-ESKI-MODEL-KARARLARI.md, üç build çıktısı | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F05 — Tasarım sistemi ve görsel referanslar

Kaynaklar: tasarım yönergesi, `globals.css`, tema provider'ları, `components/ui`, admin Shadcn. Mevcut Next/React, Zustand ve RTK Query korunur.

- [x] F05-01 Marka/renk/ikon/font envanterini çıkar; adminin farklı renk ailesi ve alternatif logolarını ortak yönde birleştir. Kabul: logo değişmeden public/panel/admin akraba görünür.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | TASARIM-KARSILASTIRMA-2026-09-09.md, visual-matrix.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F05-02 Ana sayfanın tüm ana bölümleri için okunaklı Image Gen konseptleri hazırla. Kabul: yalnız hero değil arama, ilanlar, çalışma adımları ve footer tasarlanmış; uydurma metrik yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | TASARIM-KARSILASTIRMA-2026-09-09.md, visual-matrix.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F05-03 Liste/detay, form, kullanıcı paneli, haklar, admin liste/detay ve ödeme durumları için masaüstü/mobil referansları oluştur. Kabul: boyutlar, metinler, durumlar ve dosya yolları kayıtlı.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | TASARIM-KARSILASTIRMA-2026-09-09.md, visual-matrix.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F05-04 Seçilen tasarım yönünü kesinleştir; renk/typography/boşluk/radius/ikon kurallarını ortak token haritasına aktar. Kabul: okunabilir referans ve karar kaydı uygulamaya temel olur.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | TASARIM-KARSILASTIRMA-2026-09-09.md, visual-matrix.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F05-05 Button, Input, Select/Combobox, Checkbox, Badge, Alert, EmptyState, Skeleton, Dialog, Pagination ailelerini mevcut bileşenlerden standardize et. Kabul: varyant/state tablosu; sayfaya özel kopyalar yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | TASARIM-KARSILASTIRMA-2026-09-09.md, visual-matrix.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F05-06 Gövde/etiket/başlık ağırlıklarını sadeleştir; küçük ve kalın metin yaygınlığını azalt. Kabul: Türkçe uzun metinlerde okunabilirlik, ölçülü 400–700 ağırlık kullanımı.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | TASARIM-KARSILASTIRMA-2026-09-09.md, visual-matrix.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F05-07 Tema token'larının frontend/admin karşılığını belirle; açık/koyu kontrast ve logo görünümünü doğrula. Kabul: doğrudan hex kullanan yeni UI yok; `data-theme` davranışı korunur.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | TASARIM-KARSILASTIRMA-2026-09-09.md, visual-matrix.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F05-08 Hareket/video/harita/ikon kullanım bütçesini belirle. Kabul: zorunlu intro yok; dekorasyon arama/form işini engellemez; reduced-motion çalışır.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | TASARIM-KARSILASTIRMA-2026-09-09.md, visual-matrix.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F05-09 Komponent örnek ekranı ve görsel kontrol matrisi hazırla. Kabul: normal/hover/focus/disabled/loading/error/success aynı sistemde karşılaştırılabilir.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | TASARIM-KARSILASTIRMA-2026-09-09.md, visual-matrix.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F06 — Header, ana sayfa ve footer

Kaynaklar: `Header.tsx`, `HeroSearch.tsx`, `SplashLoader.tsx`, `(public)/page.tsx`, `Footer.tsx`, siteSettings.

- [x] F06-01 İlk açılış videosunu ana içeriği kapatmayan isteğe bağlı gösterime çevir veya kaldır. Kabul: ilk ziyarette kullanıcı beklemeden arama yapar; video hata verirse ekran kilitlenmez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | home-390/1440-light/dark.png, interaction-tests.json, 057/060/062 migration | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F06-02 Masaüstü header'ı logo, az sayıda bağlantı ve tek ana işlemle sadeleştir. Kabul: tekrar CTA'lar azaltılmış, giriş ve hesap işlemleri ikincil.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | home-390/1440-light/dark.png, interaction-tests.json, 057/060/062 migration | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F06-03 Mobil header'a klavye/odak yönetimli menü ekle. Kabul: 360/390 px'de düğmeler kırılmaz; genel bağlantılar kaybolmaz; girişli kullanıcı da sığar.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | home-390/1440-light/dark.png, interaction-tests.json, 057/060/062 migration | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F06-04 Hero'da kısa, modele uygun başlık ve görünür aramayı öne çıkar. Kabul: ağır logo/video arka planı metinle yarışmaz; arama mobilde varsayılan açık.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | home-390/1440-light/dark.png, interaction-tests.json, 057/060/062 migration | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F06-05 Paket Takip ve tekrarlanan ilan açma sekmesini kaldır; taşıyıcı ilan verme çağrısını ayrı sade alana taşı. Kabul: kullanıcı olmayan takip hizmetini beklemez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | home-390/1440-light/dark.png, interaction-tests.json, 057/060/062 migration | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F06-06 Kaynaksız 1.200+/48.000+/%98 sayılarını ve en hızlı ağ iddiasını kaldır. Kabul: varsa her metrik tanımlı sorgu/zaman aralığından; gerçek veri yoksa metrik bloğu görünmez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | home-390/1440-light/dark.png, interaction-tests.json, 057/060/062 migration | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F06-07 Nasıl çalışır bölümünü ilan bul/iletişimi aç/görüş akışına uyarla. Kabul: rezervasyon, platform teslim garantisi veya ödeme aktarımı anlatılmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | home-390/1440-light/dark.png, interaction-tests.json, 057/060/062 migration | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F06-08 Güncel ilan alanını yeni kart sistemine ve F03 filtrelerine bağla. Kabul: boş veri dürüst mesaj verir; örnek ilan canlıya sokulmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | home-390/1440-light/dark.png, interaction-tests.json, 057/060/062 migration | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F06-09 Footer'daki şirket/iletişim/sosyal bilgileri gerçek kayıtla doğrula; placeholder telefonu kaldır/düzelt. Kabul: linkler çalışır, unvan ve iletişim bilgileri doğrulanmış kaynaktan gelir.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | home-390/1440-light/dark.png, interaction-tests.json, 057/060/062 migration | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F06-10 Ana sayfa tüm bölümlerini ve footer'ı mobil/masaüstü konseptle karşılaştır. Kabul: bölüm ritmi, metin, ilk ekran ve CTA hiyerarşisi uyumlu.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | home-390/1440-light/dark.png, interaction-tests.json, 057/060/062 migration | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F07 — Arama, ilan listesi, detay ve erişim

Kaynaklar: `CityAutocomplete.tsx`, `IlanCard.tsx`, `ilanlar-client.tsx`, `IlanDetailClient.tsx`, `RevealAside.tsx`.

- [x] F07-01 İl seçimini semantik ve klavyeyle kullanılabilir combobox yap. Kabul: Türkçe arama, oklar/Enter/Escape, seçili değer/odak ve ekran okuyucu durumu çalışır.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F07-02 Rota/tarih/araç filtrelerini tutarlı boyut ve etiketle sun. Kabul: mobil alanlar okunaklı; tarih/sıfır sonuç/temizle davranışı açık.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F07-03 Filtre/sayfalama state'ini URL ile eşleştir; eski isteğin yeni sonucu ezmesini önle. Kabul: geri/ileri, yenile, hızlı filtre değişimi ve sayfa sınırı testli.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F07-04 API hatasını boş sonuçtan ayır. Kabul: hata halinde tekrar dene ve açıklama; gerçek sıfır sonuçta filtre önerisi; mevcut filtreler kaybolmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F07-05 İlan kartlarını rota/tarih/araç önceliğiyle yeniden düzenle; mobilde işlem satırını ayır. Kabul: büyük CTA şehir adını sıkıştırmaz; uzun şehir/ilçe ve yıl gösterimi sığar.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F07-06 Koşulsuz yeşil nokta ve gerçek adı türeten avatarları kaldır/değiştir. Kabul: satın alma öncesi kimlik ipucu ve dayanağı olmayan online/doğrulama göstergesi yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F07-07 Fiyatı “iletişim erişimi” olarak etiketle; kartta gezinme ve satın alma eylemini ayır. Kabul: kullanıcı 50 TL'yi taşıma ücreti sanmaz; fiyat ayarlardan gelir.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F07-08 Detayda rota, durum ve erişim özetini üstte tut; haritayı ikincil/lazy yap. Kabul: yavaş/başarısız haritada metin ve ana işlem kullanılabilir.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F07-09 Mobil detayda işlem alanına erişimi iyileştir. Kabul: kısa özet ve gerekirse alt işlem çubuğu; klavye/safe-area/checkbox içerikleri örtülmez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F07-10 Ziyaretçi/yeterli hak/yetersiz hak/ilan sahibi/satıldı/expired/önceden alınmış durumlarını açık render et. Kabul: yetersiz hakkı yalnız hata metni içinde arayan `error.includes` koşulu yerine tipli API durumu kullanılır.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F07-11 Beyan/fiyat ayarı yüklenme ve hata durumunu ayır. Kabul: sonsuz “yükleniyor” yok, tekrar dene var; eksik zorunlu beyan veya fiyatla satın alma başlamaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F07-12 Açılan iletişimi erişilebilir telefon/e-posta/kopyala eylemleriyle sun. Kabul: doğru alıcıya kalıcı erişim, başka kullanıcıya DOM/API/cache sızıntısı yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, backend-tests-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F08 — Giriş, kayıt, ilan formu ve ödeme arayüzü

Kaynaklar: auth sayfaları, `IlanVerForm.tsx`, ilan düzenleme sayfası, `PaymentModal.tsx`.

- [x] F08-01 Giriş/kayıt/şifre ekranlarını ortak logo/form kabuğuna geçir. Kabul: tek tip etiket, boşluk, düğme ve hata dili; demo erişim yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | e2e-results.json, auth-session-test.log, password-reset.test.ts, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F08-02 Return URL ile arama/ilan/ödeme niyetini koru. Kabul: oturum açınca başladığı işe döner; dış domain URL reddedilir; özel beyan verisi URL'ye yazılmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | e2e-results.json, auth-session-test.log, password-reset.test.ts, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F08-03 Üyelik onaylarını okunaklı ve ayrı tut; sürüm/zaman kayıtlarını koru. Kabul: boş varsayılan checkbox, backend doğrulaması ve gerçek metin bağlantısı.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | e2e-results.json, auth-session-test.log, password-reset.test.ts, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F08-04 Şifre görünürlüğü, otomatik doldurma, hata özeti, reset token/süresi senaryolarını düzenle. Kabul: form ekran okuyucu/klavye ile tamamlanır; tekrar submit kontrolü var.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | e2e-results.json, auth-session-test.log, password-reset.test.ts, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F08-05 İlan formunu rota/tarih, araç/açıklama, özel iletişim ve önizleme bölümlerine ayır. Kabul: satıcının değil alıcının beyanı satın alma adımında; gereksiz alan yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | e2e-results.json, auth-session-test.log, password-reset.test.ts, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F08-06 Geçmiş tarih, varış/kalkış sırası, il/ilçe ve iletişim validasyonunu backend/frontend birlikte uygula. Kabul: alan hataları açık; kötü input ile kayıt oluşmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | e2e-results.json, auth-session-test.log, password-reset.test.ts, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F08-07 Gönderme, moderasyon, yeniden düzenleme ve başarısız kaydetme durumlarını ekle. Kabul: hata formu silmez; tekrar tıklama çift ilan üretmez; yayın durumu doğru.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | e2e-results.json, auth-session-test.log, password-reset.test.ts, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F08-08 İlanlarım'dan düzenlemeyi erişilebilir yap; mevcut eski düzenleme URL'sini uyumlulukla taşı. Kabul: sahiplik kontrolü, doğru ön dolum ve satılan ilan için izinli alan kuralları.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | e2e-results.json, auth-session-test.log, password-reset.test.ts, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F08-09 Ödeme modalını erişilebilir dialog bileşenine geçir. Kabul: focus trap, Escape, odak dönüşü, kaydırma kilidi, iframe başlığı ve mobil boyut testli.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | e2e-results.json, auth-session-test.log, password-reset.test.ts, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F08-10 Sağlayıcı script/iframe yüklenememesi ve modal kapanmasını tasarla. Kabul: timeout/yeniden dene açık; kapanma ödeme iptal kanıtı sayılmaz; F02 sorgusu gerçek durumu getirir.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | e2e-results.json, auth-session-test.log, password-reset.test.ts, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F09 — Kullanıcı paneli

Kaynaklar: `panel-shell.tsx`, panel sayfaları, purchases/notification/profile servisleri.

- [x] F09-01 Büyük gradyanlı/pill menüleri sade sidebar ve mobil menüyle yenile. Kabul: ortak logo/ikon/boyut, aktif bağlantı görünür; tüm işler mobilde erişilebilir.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F09-02 Özeti gerçek işlere göre kur: ilgili ana işlem, ilanlar, satın almalar, kalan haklar, son hareketler. Kabul: rolüyle ilgisiz baskın CTA ve gereksiz büyük hoş geldin alanı yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F09-03 Panel API hatalarını sıfır değerlerden ayır. Kabul: bakiye veya satış servisi çökerse “0” gösterilmez; her blokta açıklama/yenile mevcut.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F09-04 İlanlarım'ı durum sekmeleri/filtreleri, düzenle ve izinli kapatma işlemleriyle düzenle. Kabul: bekleyen/satılan/süresi dolan ilanların eylemleri farklı ve backend ile tutarlı.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F09-05 Satın Aldıklarım'da rota, alım zamanı ve iletişime dönüşü öne çıkar. Kabul: satılmış/expired ilan için kazanılmış erişim kaybolmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F09-06 Haklar ekranında bakiye, paket seçenekleri ve hareket geçmişini ayır. Kabul: TL cüzdan/payout dili yok; paket fiyatları DB'den; yüklenme/hata/sıfır durumu açık.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F09-07 Bildirim okunma/boş liste/hata ve profil kaydetme/oturum durumlarını standardize et. Kabul: değişiklik geri bildirimi ve tekrar açmada tutarlılık.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F09-08 Taşıma kuralları ve destek bağlantılarını ikincil erişimde tut; eski panel URL'lerini anlamlı hedefe yönlendir. Kabul: abonelik/booking'e geri düşen akış yok; eski ödeme referansı kaybolmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | visual-matrix.json, buyer-e2e.json, interaction-tests.json, final-browser.json | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F10 — Admin paneli ve operasyon ekranları

Kaynaklar: `admin_panel/src/navigation/`, `integrations/`, `(main)/admin/` ve eski frontend `/admin/` işlev envanteri.

- [x] F10-01 Menü gruplarını görev odaklı sadeleştir; kullanıcılar ve finansı ayır. Kabul: masaüstü/mobil menü, rol görünürlüğü ve gerçek route'lar eşleşir.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-02 Genel bakışı yeni model KPI'larına geçir. Kabul: iletişim satışı, paket tahsilatı, hak kullanımı, bekleyen ödeme ayrı; hakla erişim ikinci defa gelir sayılmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-03 Ortak liste düzeni kur: başlık, filtreler, tablo, sayfalama, boş/hata/yüklenme. Kabul: aynı davranış ilan/kullanıcı/satış ekranlarında; mobil tablo verisi erişilebilir.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-04 İlan listesi/detayında moderasyon, sold/expired bilgisi ve işlem geçmişi göster. Kabul: satış alıcısı yalnız yetkili admin görür; satılan ilan yanlışlıkla yeniden satılamaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-05 Satın almalar ekranını tarih/rota/yöntem/statü ve detayla güçlendir. Kabul: kayda bağlanabilen rakamlar; CSV varsa rol/PII/formül enjeksiyonu kontrolü.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-06 Ödeme mutabakat ekranına yaşlanan pending ve telafi bekleyen durumları ekle. Kabul: sağlayıcı referansı, son durum, işlem sahibi, neden ve denetim izi; tekrar işleme çift hak yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-07 Eski wallet ekranını ayrı arşiv + gerçek kontör yönetimi olarak düzenle. Kabul: manuel hak değişikliği gerekçe/rol/audit ile; TL ve adet karışmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-08 Fiyat/paket/ödeme ayarlarında validasyon, maskeli sır ve kaydetme sonucunu standardize et. Kabul: aktif sağlayıcı ve kullanıcıya görünen paketler tutarlı.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-09 Eski frontend admin'deki destek/SSS/sayfa/SEO/şablon işlerini karşıla; eksikleri mevcut modüllerle taşı. Kabul: ayrı admin geçişinde hiçbir yaşayan yönetim işi kaybolmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-10 Sözleşme/aydınlatma gövdesi ve versiyon yönetimini mevcut içerik modeline bağla. Kabul: geçmiş onay snapshot'ları değişmez; yayımlanan sürümün kaydı belli.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-11 Site ayarları/tema/depolama ekranlarını sade sekmelere ve küçük bileşenlere ayır. Kabul: önizleme, hata, kaydedilmemiş değişiklik uyarısı; büyük dosya sınırları iyileşmiş.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-12 `/admin/mail`, `/admin/notifications`, seller auth ve iki farklı kaynak `/admin` sayfasını kullanım/build kanıtıyla sonuçlandır. Kabul: 404 olması tek başına yeni özellik açma gerekçesi değildir; ihtiyaca göre mevcut ekrana yönlenir/kaldırılır/tamamlanır; belirsiz route çakışması yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-13 İhtilaf, audit ve rapor metinlerini lead modeline çevir; teknik log verisini yalnız yetkili alanda tut. Kabul: escrow/taşıyıcıya payout vaatleri ve gereksiz hassas veri yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F10-14 İşlev eşliği sağlanan eski frontend admin sayfalarını güvenli şekilde `panel.paketjet.com` hedeflerine yönlendir. Kabul: token URL'ye taşınmaz; karşılığı olmayan ekran kapatılmadan önce çözülür.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | final-browser.json, backend-tests-final.log, admin-build-final.log, content-revisions.test.ts | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F11 — İçerik, SEO ve metin tutarlılığı

Kaynaklar: siteSettings/customPages, `sitemap.ts`, robots/llms, metadata/JsonLd, README ve görev belgeleri.

- [x] F11-01 Tüm kamu/panel/admin metinlerini taşıyıcı ilanı → gönderici iletişim satın alımı modeline eşitle. Kabul: llms, hero, adımlar, giriş, destek, e-posta ve metadata çelişmez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, README.md, 057/061/062 migration, frontend-build-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F11-02 Fiyat ve ticari metinleri mevcut DB/admin içerik kaynağına bağla; gereksiz TSX fallback'lerini azalt. Kabul: tek değişiklik ilgili ekranların tümünde tutarlı görünür.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, README.md, 057/061/062 migration, frontend-build-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F11-03 Üç soft-404 örneğini yerel düzeltmeyle doğrula; streaming/notFound sınırlarını yeniden test et. Kabul: olmayan blog/rota/ilan HTTP 404, geçerli içerik 200.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, README.md, 057/061/062 migration, frontend-build-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F11-04 Sitemap'i gerçek yayınlanmış içerikten üret; canonical ve filtre URL davranışını belirle. Kabul: silinmiş/örnek/private URL yok; her sitemap URL'si geçerli hedefe gider.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, README.md, 057/061/062 migration, frontend-build-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F11-05 Structured data ve title/description'ı gerçek ürünle eşleştir. Kabul: sahte review/teslimat sayısı/taşıma hizmeti iddiası yok; sayfa başlıkları mükerrer marka eklemiyor.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, README.md, 057/061/062 migration, frontend-build-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F11-06 Blog/rota/hakkımızda/iletişim/destek/yasal ekranlarını ortak okunabilir içerik şablonuna geçir. Kabul: tek H1, mantıklı başlıklar, görsel/bağlantı ve mobil okunabilirlik.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, README.md, 057/061/062 migration, frontend-build-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F11-07 Site ve admin gizli alanlarının indekslenme politikasını doğrula. Kabul: auth ve noindex uygun; robots kuralı erişim kontrolü yerine kullanılmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, README.md, 057/061/062 migration, frontend-build-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F11-08 README'de gerçek klasör, PM2/domain/port ve geçerli komutları belgele; eski çeklistlerle kapanış bağlantılarını senkronla. Kabul: “kaynak yok/admin deploy yok” ifadeleri güncel kaynak diye okunmaz; korunan dosyalara dokunulmaz.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | route-audit.json, README.md, 057/061/062 migration, frontend-build-final.log | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F12 — Test, erişilebilirlik ve görsel kalite kapıları

Her uygulama fazında ilgili kontrol çalışır; testler son güne bırakılmaz. Dekoratif düşük etkili değişikliğe anlamsız unit test yerine görsel kontrol uygulanır.

- [x] F12-01 Frontend'in 9 başlangıç tsc hatasını yaşayan akış testleriyle çöz. Kabul: booking/wallet testleri ya doğru yeni hedefe taşınmış ya kullanım kanıtıyla emekli; kritik kapsam eksilmemiş.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | backend-tests-final.log (86), auth-session-test.log (1), frontend-tests-final.log (13), üç build ve tarayıcı JSON | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F12-02 Gizlilik, sahiplik, kontör atomikliği, callback tekrarı ve yarış regresyonlarını izole DB'de çalıştır. Kabul: F01/F02 negatif senaryoları dahil sonuç dosyası.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | backend-tests-final.log (86), auth-session-test.log (1), frontend-tests-final.log (13), üç build ve tarayıcı JSON | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F12-03 İki temel uçtan uca senaryoyu tamamla: taşıyıcı ilan verir/yönetir; gönderici arar/satın alır/iletişime döner. Kabul: masaüstü ve mobil test kimlikleriyle gerçek API akışı.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | backend-tests-final.log (86), auth-session-test.log (1), frontend-tests-final.log (13), üç build ve tarayıcı JSON | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F12-04 Üç uygulamada typecheck/build; admin Biome; frontend sürümüne uygun lint; backend testlerini çalıştır. Kabul: doğru komutlar exit 0; hata gizleme/ignoreBuildErrors yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | backend-tests-final.log (86), auth-session-test.log (1), frontend-tests-final.log (13), üç build ve tarayıcı JSON | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F12-05 Liste sayfasındaki React #418 hatasını geliştirme ortamında ayrıntılı yeniden üret. Kabul: sunucu/tarayıcı locale-timezone farkı dahil kök neden kanıtlanmış; reload ve gezinmede hata yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | backend-tests-final.log (86), auth-session-test.log (1), frontend-tests-final.log (13), üç build ve tarayıcı JSON | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F12-06 Klavye/ekran okuyucu/kontrast/odak kontrollerini yap. Kabul: combobox, menü, form, ödeme dialog'u kullanılabilir; gerekli alan/yanlış alan ilişkileri açık.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | backend-tests-final.log (86), auth-session-test.log (1), frontend-tests-final.log (13), üç build ve tarayıcı JSON | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F12-07 360/390/768/1280/1440 px, açık/koyu tema ve %200 zoom matrisi uygula. Kabul: yatay taşma, kesik CTA, okunamayan mikro metin ve örtülen alan yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | backend-tests-final.log (86), auth-session-test.log (1), frontend-tests-final.log (13), üç build ve tarayıcı JSON | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F12-08 Her yeni ekranı seçilen konseptle aynı viewport'ta görüntüleyip karşılaştır. Kabul: tipografi/boşluk/renk/ikon/hiyerarşi/mobil sıra için fark kaydı ve kapanış kanıtı.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | backend-tests-final.log (86), auth-session-test.log (1), frontend-tests-final.log (13), üç build ve tarayıcı JSON | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F12-09 Yavaş ağ, API 401/403/404/429/500, boş veri, uzun metin ve sağlayıcı hata durumlarını dene. Kabul: hata “0 kayıt” veya sahte başarıya dönüşmez; geri dönüş/tekrar dene çalışır.
  - Kanıt: 2026-09-09 | e9317bb | error-matrix.json, interaction-tests.json, visual-matrix.json:401/403/404/429/500, gerçek20 sn ödeme timeout, boş veri ve uzun metin; hata sıfır bakiyeye dönüşmez. | yerel/izole tarayıcı.
- [x] F12-10 Performans başlangıcı ve sonunu aynı koşulda ölç. Kabul: video/harita yükü ve layout shift iyileşmiş; hedef LCP≤2,5 sn, INP≤200 ms, CLS≤0,1 için ölçüm yöntemi kaydedilmiş; laboratuvar sonucu saha metriği diye sunulmaz.
  - Kanıt: 2026-09-09 | d058642 | performance-before.json / performance-after.json: aynı mobil laboratuvar koşulu, üç ölçüm; ortanca LCP 5,612 → 0,728 sn, CLS 0,19056 → 0,00211. Saha INP ölçülmedi. | canlı.
- [x] F12-11 Route envanteri, internal linkler ve admin menüsünü otomatik kontrol et. Kabul: tüm dinamik fixture'lar ve eski yönlendirmeler dahil; 88 kaynak kaydı için sonuç.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | backend-tests-final.log (86), auth-session-test.log (1), frontend-tests-final.log (13), üç build ve tarayıcı JSON | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F12-12 CI'ya anlamlı type/test/build kapıları ekle; secret/dependency denetimini gerçek bulgu bazında takip et. Kabul: bozuk değişiklik yayın adayına dönüşmez; kilit dosyaları tutarlı.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | backend-tests-final.log (86), auth-session-test.log (1), frontend-tests-final.log (13), üç build ve tarayıcı JSON | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F13 — İşletim ve dağıtım hazırlığı

Kaynak: canlı PM2 `/var/www/paketjet`, mevcut docs/runbook/env örnekleri. İnceleme/plan ayrı, canlı değişiklik yürütme kapsamı ayrıdır.

- [x] F13-01 DB ve gerekli upload/konfigürasyon yedeğinin yerini, erişimini ve saklama politikasını doğrula. Kabul: yedek dosyası yanında izole geri yükleme testi ve tarihli kanıt.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | restore-test.txt, upload-restore.txt, source-restore.json, backup-script-test.txt, ISLETIM-VE-YAYIN-2026-09-09.md | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F13-02 Migration için ön kontrol, yedek, dry-run ve geri dönüş planı hazırla. Kabul: üretimde drop/seed-fresh çalıştırılmadan kontrollü yükseltme mümkün.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | restore-test.txt, upload-restore.txt, source-restore.json, backup-script-test.txt, ISLETIM-VE-YAYIN-2026-09-09.md | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [x] F13-03 PM2 süreçleri, portlar, env yükleme yolu ve build komutlarını güncel runbook'a yaz. Kabul: aynı sürüm tekrarlanabilir; Docker varsayımı yok.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | restore-test.txt, upload-restore.txt, source-restore.json, backup-script-test.txt, ISLETIM-VE-YAYIN-2026-09-09.md | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.
- [ ] F13-04 SMTP/MX/SPF/DKIM/DMARC, gönderici kimliği ve gerekli entegrasyon ayarlarını güncel kanıtla doğrula. Kabul: yetkili test gönderiminin teslimi; eksik DNS selector'ı tahminle “yok” sayılmaz.
  - Durum: DIŞ BAĞIMLILIK: SMTP gerçek kimliği/parolası ve DKIM selector bilgisi yok; paketjet.com MX/TXT yanıtı yok, .net SPF/MX mevcut. Yetkili teslim testi kanıtlanamadı; mail-dns.json ve private-config-presence.json kayıtlı.
- [ ] F13-05 Maps domain/kota/billing ve aktif ödeme ortamını doğrula. Kabul: üretimde yanlış sandbox/fallback yok; servis hatası kullanıcı akışını kilitlemez.
  - Durum: DIŞ BAĞIMLILIK: Maps browser anahtarı boş, domain/kota/billing konsol kanıtı yok; PayTR anahtarları eksik, Iyzico test ayarı. Canlı ödeme sağlayıcısı açıkça disabled; sahte başarı/fallback yok.
- [ ] F13-06 Health alarmı, ödeme kuyruğu alarmı ve hata takibini doğrula; loglarda sır/iletişim alanlarını maskele. Kabul: kontrollü test alarmı ilgili kanala ulaşır; health HTTP ve gövde hataları doğru değerlendirilir.
  - Durum: DIŞ BAĞIMLILIK: Sunucu health/ödeme kuyruğu kontrolü, disk eşiği ve syslog hata kaydı kurulu. Harici alarm alıcısı/kanalı ve Sentry DSN yok; dış kanala kontrollü teslim kanıtı yok.
- [x] F13-07 Scheduler/cron, logrotate ve disk izlemeyi gerçek host üzerinde doğrula. Kabul: ilan süre işi varsa son çalışma/timezone ve başarısızlık alarmı kayıtlı; yerel oturuma bağlı değil.
  - Kanıt: 2026-09-09 | d058642 | scheduler-proof.txt: vps-paketjet UTC cron, 5 dakikalık health/bakım, günlük/haftalık yedek, logrotate, disk eşiği; yerel syslog alarmı. Harici teslim F13-06 açık. | canlı.
- [x] F13-08 Root PM2 çalışmasının azaltılması ve gereken HTTP başlıkları için etkisi belli mimari plan hazırla. Kabul: dosya izinleri/port/geri dönüş hesabı yapılmış; Docker/Nginx otomatik değiştirilmez.
  - Kanıt: 2026-09-09 | d058642 (ana uygulama) | restore-test.txt, upload-restore.txt, source-restore.json, backup-script-test.txt, ISLETIM-VE-YAYIN-2026-09-09.md | yerel/izole test kanıtı; canlı yayın ve uçtan uca kapsam F14 kayıtlarında.

## F14 — Yayın ve tamamlanma

Bu faz uygulanırken yayın kapsamı açık olmalı; plan talebi tek başına deploy yetkisi değildir. Kullanıcının sonraki açık yürütme/yayın talimatı esas alınır.

- [x] F14-01 Yayın adayı diff, test sonuçları, migration etkisi ve geri dönüş komutlarını tek pakette hazırla. Kabul: incelenebilir somut sürüm; mevcut kullanıcı değişiklikleri kapsam dışına karışmamış.
  - Kanıt: 2026-09-09 | e9317bb | d058642/e9317bb diff, validation-summary.json, restore kanıtları, ISLETIM-VE-YAYIN geri dönüş ve özel sunucuda hazır rollback-ecosystem.json. Başlangıç kullanıcı değişiklikleri ayrı. | yerel ve sunucu hazırlığı.
- [x] F14-02 Yayın kapsamı içinde commit/push ve dağıtımı tamamla; canlı commit/build/PM2 eşleşmesini kaydet. Kabul: eski iki yerel düzeltmenin yeni sürümde bulunduğu doğrulanmış.
  - Kanıt: 2026-09-09 | e9317bb | release-final.json, live-pm2.json: e9317bb5cb810092b5a3083e172a218c1605293b; push, üç sunucu build,03:00:50 UTC yayın, üç doğru cwd/online/0 restart. | canlı / kapanış.
- [x] F14-03 Canlı ana sayfa/liste/detay/login/admin/API ve üç 404 örneğini tekrar ölç. Kabul: doğru HTTP, doğru güncel içerik ve beklenen auth davranışı.
  - Kanıt: 2026-09-09 | e9317bb | live-http.json:14 kontrol +14 sitemap URL, üç gerçek404, private settings404, anonim özel API401; gizli ayar sızıntısı yok. | canlı / kapanış.
- [x] F14-04 Canlı masaüstü/mobil görsel turu ve tanımlı kontrollü işlem testini tamamla. Kabul: özel verisiz ekran kanıtı; test işlemi mutabık; yeni UI gerçek akışla çalışıyor.
  - Kanıt: 2026-09-09 | e9317bb | live-browser.json, live-admin-login-final.json:390/1440 ekran turu; gerçek kontrollü kayıt/özel ilan/düzenleme/panel/arşiv/çıkış; live-test-cleanup.json ile0 satın alma/ledger ve test hesabı inactive. | canlı / kapanış.
- [ ] F14-05 Yayın sonrası 24 saat ve 7 gün izlemesini gerçek sunucu/izleme sistemi üzerinde planla ve sonuçlarını kaydet. Kabul: ödeme beklemeleri, hata oranı, güncel ilan sayısı ve kullanıcı akışı sapmaları açıklanmış.
  - Durum: ZAMAN BEKLİYOR: UTC 10 Eylül 2026 02:43 ve 16 Eylül 2026 02:43 kontrolleri gerçek sunucu cron’una kuruldu. Tarih gelmediği için sonuçlar açık; yerel oturuma bağlı değil. Harici bildirim teslimi F13-06 bağımlılığı.
- [x] F14-06 Bu çeklisti, durum raporunu, eski görev bağlantılarını ve deploy bekleyen notunu gerçek sonuca göre güncelle. Kabul: kod/test/canlı durumu ayrı; açık P0/P1 ve kanıtsız tamamlanma yok.
  - Kanıt: 2026-09-09 | e9317bb | DURUM-RAPORU, YURUTME-KAYDI, ISLETIM-VE-YAYIN, README, SAYFA-ENVANTERI ve tarihsel görev bağlantıları güncellendi;138 kapalı/7 gerekçeli açık. Kod/test/canlı kapsamı ayrı kayıtlı. | canlı / kapanış.

## 2. Tasarım durum matrisi

| Ekran ailesi | Tasarlanacak/doğrulanacak durumlar | İlgili faz |
| --- | --- | --- |
| Menü | anonim, girişli, mobil açık/kapalı, klavye, dark | F05/F06/F09 |
| Arama/liste | ilk yüklenme, filtreli, boş, API hata, sayfalama, geri dönüş | F07 |
| İlan detay | kilitli, sahibi, alıcısı, satılmış, süresi dolmuş, bulunamadı | F07 |
| Erişim formu | beyan boş/geçersiz, fiyat yok, hak var/yok, çift submit | F02/F07/F08 |
| Ödeme | iframe yükleniyor/hata, callback bekliyor, başarılı teslim, ret, telafi | F02/F08 |
| İlan formu | yeni, düzenleme, alan hatası, yükleme hatası, incelemede | F08 |
| Kişisel panel | sıfır kayıt, gerçek kayıt, parçalı API hatası, oturum süresi | F09 |
| Admin | boş/çok kayıt, filtre, kayıt detayı, kaydetme hatası, yetkisiz | F10 |
| İçerik | uzun metin, görselsiz, olmayan slug, dar ekran | F11 |

## 3. Eski görevlerin yeni karşılıkları ve düzeltilen varsayımlar

| Eski kaynak | Yeni karşılık / karar |
| --- | --- |
| DENETIM K1/K2/K5/K6, Opus Faz 1 | F01; admin hızlı giriş ve carrier_name sızıntısı kapsamı genişletildi |
| K3, Y1/Y2/Y3, Opus Faz 2–3 | F02–04; tahsilatı otomatik kontöre çevirme ve doğrudan tablo silme yok |
| K4, Y8, Opus Faz 4.1 | Gerçek canlı PM2; Docker/Nginx değişikliği ayrı mimari kapsam, yeni admin domaini yok |
| Codex Blok A/D | F04/F12; kullanım kanıtı ve yeni test kapsamı olmadan silme yok |
| Codex Blok B | F07/F08/F11 |
| Codex Blok C | F10; mevcut admin purchases ekranı genişletilir, sıfırdan kopyalanmaz |
| Codex Blok E, Opus Faz 5 | F12/F14 |
| AGENTS 22 modül/8 test bilgisi | Envanter 29 klasör/13 backend test; AGENTS kuralları geçerli, sayım güncel rapordan alınır |
| YAPILACAKLAR açık sağlayıcı/env/mail işleri | F00/F02/F13 |
| YAPILACAKLAR ikon üretimi | F05; önce ikon ailesi seçilir, eski listede var diye gereksiz 13 görsel üretilmez |
| proxy.ts aktif/CSP var iddiası | F01-11; gerçek build ve başlıkla kanıtlanır |
| Public tipte kg alanları zaten yok varsayımı | Canlı API eski kg alanlarını içeriyor; F01/F04 kontrat değişimi tüketicilerle birlikte yapılır |

## 4. Son kabul

**Son durum:138/145 tamamlandı;7 madde dış bağımlılık veya gelecek izleme tarihi nedeniyle açık.** Ana uygulama `d058642`, son admin düzeltmesi `e9317bb`; Git push tamamlandı. Son canlı yayın9 Eylül2026 03:00:50 UTC, üç sunucu build'i başarılı, üç PM2 süreci doğru yeni cwd'de online ve0 restart. Kanıt: `release-final.json`, `live-pm2.json`, `live-health.json`.

Açık maddeler: F02-13 gerçek kart matrisi; F03-06 eski ödeme makbuzları; F03-07 eski bakiye kaynağı; F13-04 mail teslimi; F13-05 Maps/sağlayıcı ortamı; F13-06 harici alarm teslimi; F14-05 zamanı gelmemiş24 saat/7 gün sonuçları. Hiçbiri kanıtsız tamamlandı olarak işaretlenmedi.

Ürün, yalnız güzel ekranlar veya yeşil build ile bitmiş sayılmaz. Güncel ilan bulma, doğru fiyat/beyanla erişim satın alma, kalıcı iletişime dönüş, ücretsiz ilan verme/moderasyon ve yönetim operasyonu birlikte çalışmalı. Bu sonuç masaüstü/mobilde, doğru yetkilendirmeyle ve mutabık veriyle kanıtlanmalıdır.
