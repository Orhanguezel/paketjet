# PaketJet tasarım yenileme yönergesi — 9 Eylül 2026

> **9 Eylül tasarım ikinci tur:** Kullanıcının fazla beyaz/sade bulduğu görünüm lavanta–açık mavi yüzeyler, güçlü lacivert başlıklar, hareketli rota ve mevcut marka videosuyla yenilendi. Güncel görsel kararlar ve testler [tasarım ikinci tur kaydında](output/design-v2/DESIGN.md). Son uygulama kodu `6115399`; canlı yayın kanıtı `output/design-v2/release.json`. Önceki beyaz ağırlıklı ekranlar ilk turun tarihsel kanıtıdır.

Durum: Uygulama öncesi tasarım önerisi. Bu dosya onaylanmış görsel konsept veya uygulanmış arayüz değildir. Uygulama işleri [ana çeklistte](CEKLIST-IYILESTIRME-VE-TASARIM.md), mevcut durum [raporda](DURUM-RAPORU-2026-09-09.md), sayfa kapsamı [envanterde](SAYFA-ENVANTERI-2026-09-09.csv).

## Tasarım amacı

Kullanıcı ilk bakışta iki şeyi anlamalı: taşıyıcı ücretsiz güzergâh ilanı açar; gönderici uygun ilanı bulup iletişim erişimi satın alır. Arayüz bu iki işi kolaylaştırmalı. Gönderi takibi, platform üzerinden taşıma rezervasyonu ve taşıyıcıya ödeme gibi eski model vaatleri kaldırılmalı.

Görsel yön: **aydınlık, sade, güven veren bir pazaryeri.** Mevcut logo ve mor marka ailesi korunur; yeniden markalama yapılmaz. Beyaz ana yüzeyler, hafif nötr bölüm ayrımı, koyu okunaklı metin, ince kenarlıklar ve az gölge kullanılır. Turuncu yalnız gerçekten gerekli vurgu olarak ele alınır; mor ve turuncu aynı bölgede birden çok birincil işlem için yarışmaz. Lacivert büyük bloklar azaltılır. Dark mode korunur ve aynı hiyerarşiyle ayrıca tasarlanır.

## Canlı incelemede görülenler

9 Eylül, Playwright Chromium; masaüstü 1440×1000, mobil 390×844. Anonim gezildi; giriş yapılmadı, form gönderilmedi, ödeme başlatılmadı.

| Gözlem | Kanıt / kaynak | Tasarım karşılığı |
| --- | --- | --- |
| İlk ziyarette tüm ekranı kaplayan video | İlk snapshot yalnız video/ses/geç kontrollerini içeriyor; `SplashLoader.tsx` | Ana içerik beklemeden görünür; tanıtım videosu isteğe bağlı |
| Aynı ilk ekranda çok sayıda ilan açma çağrısı | Üst menü, hero düğmesi ve arama sekmesi | Bölge başına tek ana işlem |
| Mobil menü düğmeleri iki satıra kırılıyor; genel nav gizli, yerine menü yok | `home-mobile.png`, `Header.tsx` | Logo + tek kısa işlem + açılır menü |
| Mobilde arama alanları varsayılan kapalı | `home-mobile.png`, `HeroSearch.tsx` | Nereden/nereye/tarih ilk ekranda erişilebilir |
| Hero arka planındaki büyük logo metinle yarışıyor | `home-desktop.png` | Sakin arka plan, güçlü metin/arama hiyerarşisi |
| Mobil ilan kartında CTA rotayı sıkıştırıyor | `list-mobile.png`, `IlanCard.tsx` | Önce rota ve tarih; işlem ayrı alt satır |
| Avatar yanında koşulsuz yeşil nokta var | `IlanCard.tsx` | Gerçek çevrimiçi/doğrulama verisi yoksa gösterilmez |
| “1.200+ / 48.000+ / %98” sabitleri yayında | Home snapshot, `(public)/page.tsx` | Kaynaksız istatistikler kaldırılır |
| Liste yüklenirken React #418 hatası kaydedildi | `browser-observations.json`; SSR snapshot saat 01:29, sonraki görüntü 03:29 | Zaman dilimi/SSR tarih üretimi incelenir; kök neden henüz kesin değil |
| Detayda satın alma alanı mobil ilk ekranın altında | `detail-mobile.png` | Fiyat/erişim özeti üstte, detaylar sonra; gerekirse erişilebilir alt işlem çubuğu |
| Detay haritası masaüstü ilk yakalamada henüz dolmamış, sonraki mobil görüntüde dolu | İki detay ekran görüntüsü | Yüklenme boyutu sabit, hata halinde rota metni; “harita bozuk” diye raporlanmaz |
| Girişte başka logo sunumu, emoji ikonlar ve demo giriş var | `login-mobile.png` | Ortak logo, tek ikon ailesi, gerçek giriş akışı |
| Ödeme sonucu query string'e göre başarı gösteriyor | `odeme-sonuc/page.tsx` kaynak incelemesi | Backend işlem durumu doğrulanmadan başarı gösterilmez |
| API hatası “ilan yok” gibi sunuluyor | `ilanlar-client.tsx` catch bloğu | Hata, boş sonuç ve yüklenme ayrı görünümler |
| Beyan metni alınamazsa süresiz “yükleniyor” | `RevealAside.tsx` catch/state | Açıklayıcı hata, tekrar dene; geçersiz beyanla ödeme açılmaz |

390 px ölçümünde ana sayfa/liste document scrollWidth 390 idi; yatay sayfa taşması gözlenmedi. Sorun alanların sıkışması ve bilgi önceliği. 320/360/768 px ve dark tema bu turda görsel test edilmedi.

## Önerilen bilgi mimarisi

| Yüzey | Birincil amaç | Önerilen yapı |
| --- | --- | --- |
| Genel site | İlan bulmak veya ilan açmak | İlanlar, Nasıl çalışır bölüm bağlantısı, Destek; birincil “Ücretsiz İlan Ver”; Giriş ikincil |
| Gönderici akışı | İletişim satın almak | Ara → ilanı incele → giriş gerekiyorsa dön → beyan/ücret → hak veya kart → doğrulanmış erişim |
| Taşıyıcı akışı | İlan yayınlamak ve yönetmek | Giriş → rota/araç/tarih → özel iletişim → önizleme → gönder → moderasyon sonucu |
| Kullanıcı paneli | Kişisel işlemler | Özet, İlanlarım, Satın Aldıklarım, İlan Haklarım, Bildirimler, Profil; destek/yasal metinler ikincil |
| Admin | İşlem takibi ve yönetim | Genel Bakış; İlanlar/Satışlar; Kullanıcılar; Haklar/Ödemeler; İçerik/Destek; Sistem |

Kullanıcı rolleri backend yetkileriyle eşleştirilir. Aynı hesabın her iki işi yapabilmesi mevcut iş kuralına göre korunur; tasarım gerekçesiyle yeni rol engeli getirilmez. URL'ler sırf daha güzel adlandırma için değiştirilmez; görünen “İlan Haklarım” etiketi mevcut `/panel/ilan-alma-hakki` adresini kullanabilir.

## Tasarım sistemi önerisi

Bunlar başlangıç ölçüleridir; okunaklı masaüstü/mobil konseptten sonra kesinleşir.

| Unsur | Hedef |
| --- | --- |
| Sayfa genişliği | Genel site 1120–1200 px; okuma sayfaları 680–760 px; formlar 480–640 px; admin veri yoğunluğuna göre geniş |
| Kenar boşluğu | Mobil 16–20 px, masaüstü 24–32 px |
| Dikey ritim | 4/8 tabanlı ölçek; alanlar arası 16–24, bölüm arası 48–80 px |
| Font | Mevcut DM Sans korunur; gerçek font yüklemesi doğrulanır |
| Metin | Gövde 16 px; etiket 14 px; ikincil metin çoğunlukla en az 13–14 px |
| Başlık | Mobil H1 yaklaşık 30–36 px; masaüstü 40–48 px; hero gerekiyorsa 48–56 px |
| Ağırlık | Gövde 400/500, etiket 500/600, başlık 600/700; yaygın font-black kaldırılır |
| Kontroller | Form ve ana düğme yüksekliği 44–48 px; mobil dokunma hedefi en az 44×44 px |
| Köşe | Kontrol 8–12, içerik kutusu 12–16 px; her alanı 32 px yuvarlak kart içine alma alışkanlığı bırakılır |
| İkon | Aynı çizgi/dolgu ailesi; kontrollerde 18–20 px; emoji/PNG/SVG karışımı sadeleşir |
| Gölge | Liste/alanlarda ince sınır; açılır menü/modal gibi katmanlarda ölçülü gölge |
| Durumlar | Renk + metin + gerektiğinde ikon; satıldı/süresi doldu/incelemede farklı anlamlar taşır |
| Tema | `bg-brand`, `text-foreground` gibi mevcut token'lar; dark için `data-theme="dark"` |
| Hareket | Kısa durum geçişleri; reduced-motion desteği; zorunlu intro/autoplay yok |

Görsel değerler ortak tema katmanında; fiyat/paket/içerik gibi iş ayarları DB + mevcut admin düzenleme mekanizmasında; ortam sırları env/güvenli depoda tutulur. Tasarım sabitleri için gereksiz yeni DB tablosu açılmaz.

## Ekranların hedef kompozisyonu

### Ana sayfa

1. Küçük, tek satırlı header; mobilde erişilebilir menü.
2. Kısa başlık önerisi: “Gönderine uygun taşıyıcıyı bul.” Alt açıklama iletişim hizmetini anlatır; kesin metin DB içerik kaydıyla yönetilir.
3. Görünür rota araması: Nereden, Nereye, Tarih, “İlan Ara”. Paket takip sekmesi kaldırılır.
4. Güncel ilanlar; gerçek ilan yoksa dürüst boş durum. Sahte istatistik veya örnek ilan yayımlanmaz.
5. Üç adım: İlanı bul → İletişimi aç → Taşıyıcıyla görüş. Taşıma ücretinin taraflarca belirlendiği kısa açıklama.
6. Taşıyıcılar için ayrı, daha sakin ücretsiz ilan verme çağrısı; kısa SSS ve sade footer.

Ana sayfa bölüm sırası, hero dışındaki alanlar dahil konseptlerde gösterilir. Her bölüm tekrar üç karttan oluşmaz; açık metin, liste ve sınırlı görsel kullanılır.

### Liste ve detay

Liste: başlık/sonuç sayısı, tutarlı filtreler, okunaklı satırlar. Rota en belirgin alan; tarih-saat ve araç ikincil. CTA “İlanı İncele” olabilir; iletişim fiyatı ayrıca açıkça etiketlenir. Mobilde ücret/CTA alt satıra geçer. Sahte avatar/online göstergesi yok.

Detay: rota ve gerçek durum → tarih/araç → iletişim erişiminin kapsamı/fiyatı → beyan ve ödeme yöntemi → açıklama/opsiyonel harita. Masaüstünde sağda işlem alanı; mobilde özet üstte, işlem alanına kolay erişim. Kilitli veri yalnız görsel maske ile korunmaz.

### Satın alma ve ödeme

Anonim, oturum açmış, yeterli hak, yetersiz hak, ilan sahibi, satılmış, süresi dolmuş, işlem sürüyor, callback bekliyor, tamamlandı, başarısız ve telafi bekliyor durumları ayrı çizilir. Query string başarı kanıtı değildir. Tekil ödeme sonucunun ana düğmesi alınan ilana/iletişime; paket sonucunun ana düğmesi haklara veya geldiği ilana döner.

Modal: semantik dialog, başlık, odak sınırı, Escape/odak dönüşü, sayfa kaydırma kilidi, iframe başlığı, sağlayıcı yüklenme/hata/yeniden deneme. İşlem kapanınca tahsilatın iptal edildiği varsayılmaz.

### Formlar ve panel

Giriş/kayıt/şifre işlemleri aynı form kabuğunu kullanır. Sabit etiket, yardımcı metin, alan yanında hata ve gerektiğinde hata özeti vardır. Login sonrası güvenli return URL ile ilk işe dönülür.

İlan verme: rota/tarih, araç/açıklama, özel iletişim, önizleme/onay olmak üzere anlamlı bölümler. Sırf tasarım için gereksiz çok adımlı sihirbaz eklenmez. Moderasyon sonrası “gönderildi” ve “yayında” ayrılır.

Panel: büyük hoş geldin kartı ve yoğun ikonlar yerine kısa başlık, ilgili ana işlem, gerçek sayaçlar, son işlemler. Hata değerleri sıfır gibi gösterilmez. Mobilde küçük yatay ikon şeridi yerine okunabilir menü; bildirim ve profil kolay erişilir.

### Admin

Mevcut RTK Query ve Shadcn/Radix korunur. Ortak sayfa başlığı + filtre çubuğu + tablo + sayfalama kullanılır; her sayfa ayrı kart dili üretmez. İlan moderasyonu, satış/hak hareketleri ve ödeme sorunları önceliklidir. Site ayarları “Marka, Ana sayfa, İçerik/SEO, İletişim, Entegrasyonlar” gibi mevcut sekmelerden sade gruplara ayrılır. Secret alanları maskeli, kaydetme/hata durumu açık olur.

Önerilen tek admin domaini mevcut `panel.paketjet.com`'dur. Eski frontend admin sayfaları eşdeğer işlev taşındıktan sonra güvenli yönlenir; destek/SSS/sayfa yönetimi gibi yalnız orada bulunan işlevler kaybedilmez.

## Konsept ve görsel doğrulama teslimleri

Uygulama aşamasında Image Gen ile okunaklı konseptler hazırlanır: ana sayfanın ana bölümleri, ilan listesi/detayı, giriş/kayıt, ilan formu, panel özeti/haklar ve admin liste/detay örneği. Ana işlem ekranlarının mobil varyantları ve ödeme durumları ayrıca gösterilir. Tek uzun, okunamayan görsel yeterli kabul edilmez.

Konsept kaydında dosya yolu, ekran/durum, viewport, kesin metinler ve değişiklik notu bulunur. Görseller arayüzün kendisi olarak kullanılmaz; gerçek metin ve kontroller kodla oluşturulur. Tasarım yönü kesinleşince implementasyon bu referansla karşılaştırılır.

Görsel kabul: 360/390/768/1280/1440 genişlikler, açık/koyu tema, %200 zoom, uzun Türkçe metin, sıfır/çok kayıt, klavye ve azaltılmış hareket. Konsept/render karşılaştırmasında en az hiyerarşi, tipografi, boşluk, renk, ikon, mobil sıra ve durum bileşenleri kontrol edilir. Özel panel/admin ekranları gerçek müşteri verisi yerine kontrollü test verisiyle görüntülenir.
