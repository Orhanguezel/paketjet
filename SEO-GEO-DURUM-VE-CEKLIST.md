# PaketJet SEO ve GEO denetimi — 9 Eylül 2026

GEO bu raporda yapay zekâ destekli aramalarda bulunabilirlik anlamındadır. Kodla giderilebilen sorunlar ile harici hesap/DNS gerektiren işler ayrı takip edilir. İndekslenme, sıralama ve yapay zekâ yanıtlarında kaynak gösterilme garanti edilemez.

## Canlı başlangıç bulguları

| Öncelik | Bulgu | Etki / yapılan işlem |
|---|---|---|
| P1 | Genel robots kuralı `/_next/` kaynaklarını engelliyordu | Tarayıcının ihtiyacı olan JS/CSS/görsel kaynakları açıldı; özel alanlar hariç tutuldu |
| P1 | Ana sayfa açıklamasında rezervasyon vaadi, destekte eski rezervasyon metni vardı | Gerçek ilan/iletişim erişimi modeline uygun sayfa açıklamaları yazıldı |
| P1 | `og-default.png` dosyası yok; çoğu sayfada OG görseli de yoktu | 1200×630 ortak paylaşım kartı ve metadata birleştirme düzeltmesi |
| P1 | Hakkımızda canonical eksikti | Kendisine işaret eden canonical eklendi |
| P1 | İlan listesinin ikinci sayfası ilk sayfayı canonical gösteriyordu; sayfalama düğmeydi | Her liste sayfasına kendi canonical'ı ve taranabilir önceki/sonraki bağlantıları |
| P1 | Filtre URL'leri indekslemeye açıktı | Arama/filtre sonuçlarında noindex, follow; ana liste indekslenebilir |
| P2 | Blog ve iki rota rehberi ana gezintiden kopuktu | Footer → blog → dört rehber; rehberler arası ve güncel ilanlara bağlantılar |
| P2 | Article metadata override'ı başlık/görsel alanlarını düşürüyordu | OG/Twitter alanları son sayfa başlık/açıklamasıyla birleştirildi |
| P2 | Kullanılmayan Service/Offer şemaları yanlış model/satıcı anlatıyordu; SearchAction yanlış parametreye gidiyordu | Yanlış ve kullanılmayan şemalar kaldırıldı; Organization/WebSite kimlikleri bağlandı |
| P2 | Makine metni sadece şehir seçimini anlatıyordu | Görünür beş soru/yanıt ile llms.txt ortak ürün kaynağına taşındı |
| P2 | Sitemap API hatasında sessizce eksik başarılı XML döndürüyordu | Hata durumunda başarısız yanıt; geçerli tarih, örnek ilan hariç tutma ve sayfalama için regresyon testi |
| P1 içerik | KVKK, gizlilik ve kullanım koşullarında aynı 9.853 karakterlik ana metin | Üç metnin SHA-256 öneki `6b8fd453f312d60d`; onaylı işletmeci bilgileriyle ayrı belgeler hazırlanmalı. Canonical ile farklı yasal amaçlar gizlenmedi |
| Dış | www.paketjet.com DNS sorgusu NXDOMAIN | DNS kaydı ve ardından HTTPS yönlendirmesi için dış bağımlılık |

Başlangıç sitemap'inde 14 URL vardı: 10 genel sayfa, 2 blog yazısı, 2 rota rehberi. Örnek ilanlar sitemap'e alınmıyordu; bu davranış korundu. Sahte bulunamayan blog/rota/ilan adreslerinde gerçek HTTP 404 doğrulandı. Giriş ve üyelik noindex, özel panel oturum korumalı. HTTP ana alan adı HTTPS'e 301 döndürüyor.

## Uygulama çeklisti

- [x] Kamuya açık logo/menü/footer ayarlarında 5 dakika sunucu önbelleği; kişisel veriler bu önbelleğe alınmaz.
- [x] Robots: render kaynakları açık, özel alanlar kapalı; OAI-SearchBot açık ve diğer botlarla aynı özel alan sınırları.
- [x] Canonical, başlık, açıklama, OG ve Twitter için ortak, testli metadata katmanı.
- [x] Sosyal paylaşımda var olmayan görsel yerine çalışan PNG kartı.
- [x] Ana sayfa/destekte yanlış rezervasyon vaadinin kaldırılması.
- [x] Örnek veya aktif olmayan ilan detayında noindex; örnek ilanlarda yeni görünür uyarı eklenmedi.
- [x] Sayfalama: bağlantı ve sayfaya özgü canonical; filtre sonuçları noindex, olmayan liste sayfası gerçek 404.
- [x] Sitemap: örnek ilan hariç, gerçek içerik tarihleri, API hata kontrolü.
- [x] JSON-LD: parse kontrolü, görünür FAQ ile birebir eşleşme, tutarlı kuruluş kimliği ve Article görseli.
- [x] Ana sayfada ürün tanımı ve beş doğrudan yanıt; JavaScript olmadan HTML'de mevcut.
- [x] Blog/rota keşfi, ilgili rehberler ve ilan listesine bağlantı; yazılarda okunur paragraf/başlık düzeni.
- [x] llms.txt: görünür ürün tanımı ve yanıtların ortak kaynağı; güncel rehber/yasal bağlantılar.
- [x] Google doğrulama meta etiketi için opsiyonel `GOOGLE_SITE_VERIFICATION` desteği; gerçek değer uydurulmadı.
- [x] Tekrar çalıştırılabilir SEO taraması: `cd frontend && bun run seo:audit https://paketjet.com /tmp/paketjet-seo-audit.json`.
- [x] Son yayın ve canlı doğrulama kaydı.

## Dış bağımlılıklar ve ölçüm sınırı

| İş | Kanıt / mevcut durum | Tamamlanma koşulu |
|---|---|---|
| Search Console | Repo, sunucu ortamı ve bu oturumun araçlarında PaketJet'e yetkili GSC bağlantısı bulunamadı; Google login anahtarları GSC yetkisi değildir | Alan adı mülkünün doğrulanması, yetkili API/hesap erişimi; sitemap gönderimi, URL Inspection ve son 28 gün sorgu/sayfa verisi |
| www | Kamu DNS sorgusunda Status 3 / NXDOMAIN | Yetkili DNS hesabıyla www kaydı; sertifika kapsamı ve HTTPS 301/308 ana alan adı yönlendirmesi. Nginx değişikliği proje kuralı gereği bu çalışma kapsamında yapılmadı |
| Gerçek kullanıcı performansı | PageSpeed API 429 kota hatası; CrUX saha verisi doğrulanamadı | Yetkili PSI/CrUX erişimi veya GSC Core Web Vitals. Yerel Chrome LCP/CLS örnekleri saha p75 değerleri değildir |
| Organik/GEO dönüşüm ölçümü | GA4/Bing/GSC kimlikleri veya yetkili bağlantıları bulunamadı | Onaylı mülk kimlikleri ve mevcut gizlilik tercihleriyle ölçüm. Arama → ilan görüntüleme → hesap → iletişim erişimi dönüşümleri takip edilmeli |
| Yasal metin ayrıştırma | KVKK, gizlilik ve kullanım koşulları ana metinleri birebir aynı | Doğrulanmış işletmeci/veri işleme bilgileriyle ayrı ve onaylı metinler; yalnız görünüm/metadata düzeltmesi bu işi tamamlamaz |
| Kurumsal güven / yasal kaynak | Canlı iletişim formu ve destek e-postası mevcut; doğrulanmış ticaret unvanı/adresini bu denetim kanıtlamıyor | İşletmeci bilgileri ve yasal metinlerin yetkili kişi tarafından doğrulanması. Sahte adres, rating veya LocalBusiness şeması eklenmedi |

Google/Bing sonuçlarında eski sitenin rezervasyon/takip anlatımı ve eski kurumsal metinleri görüldü. Bunlar arama önbelleği bulgusudur, bugünkü canlı sayfa içeriği olarak alınmadı. Yeniden tarama ve indeks değişimi yayın anında doğrulanamaz. `site:` araması indeks kapsamı veya sıralama raporu değildir.

## Arama niyeti ve içerik eşleşmesi

| Niyet / hedef sorgu grubu | Ana hedef | Değerlendirme |
|---|---|---|
| Taşıyıcı ilanları, güzergâh ilanları | Ana sayfa ve /ilanlar | İş modelini açıklayan tanım ve ilan keşfi; örnek arz indekse alınmaz |
| P2P kargo nedir? | /blog/p2p-kargo-nedir | İletişim erişimi ile taşıma ayrımı açıklanır |
| PaketJet nasıl kullanılır? | /blog/paketjet-nasil-kullanilir | Gönderici/taşıyıcı akışı; köy/adres ve aynı il alternatifleri güncellendi |
| İstanbul–Ankara / İstanbul–İzmir taşıyıcı | Mevcut iki rota rehberi | Kalıcı sefer, fiyat, süre veya mevcut taşıyıcı sayısı uydurulmaz; güncel listeye yönlendirir |
| Ücretsiz taşıyıcı ilanı | Ana sayfa ve kullanım rehberi | /ilan-ver oturum gerektirir, indeks hedefi değildir |
| İletişim ücreti / taşıma bedeli / köy araması | Ana sayfa soruları ve destek | Görünür yanıtlar, ilgili rehberler ve ortak makine metni |

Bu eşleştirme ürün ve arama niyetinden türetilmiştir; arama hacmi veya anahtar kelime sıralaması ölçülmüş değildir. Benzer 81 il sayfası topluca üretilmedi: gerçek içerik, güncel ilan ve özgün fayda olmadan çoğaltmak bu açığı kapatmaz. Site dışı otorite/backlink verisi GSC/harici yetkili veri olmadan değerlendirilemedi; dış platformlara tanıtım, mesaj veya sahte yorum gönderilmedi. Sosyal hesapların doğrulanmış sahipliği kanıtlanmadığı için Organization şemasına sameAs eklenmedi.

## İzleme planı

Yetkili Search Console erişimi sağlandığında sitemap gönder; ana sayfa, liste, rehberler ve gerçek aktif ilanlardan örnek URL Inspection al. 7 ve 28 gün sonra indekslenen URL, gösterim, tıklama, CTR, sorgu ve dönüşüm kırılımlarını aynı dönemlerle karşılaştır. Yapay zekâ kaynak trafiğini mevcut analiz sisteminde referrer ile izlemek, görünmeyen/aktarılmayan yönlendirmeleri ölçmez. Yapay zekâ yanıtlarında kaynak gösterimini sabit sorgu setiyle tarih/ürün/oturum bilgisi tutarak gözlemle; birkaç yanıtı genel başarı oranı sayma.

## Dayanaklar

- [Google AI özellikleri ve site uygunluğu](https://developers.google.com/search/docs/appearance/ai-features): temel SEO ve indeks/snippet uygunluğu; ayrı AI dosyası veya özel şema zorunlu değil. llms.txt yardımcı dokümandır, sıralama garantisi değildir.
- [Google sayfalama rehberi](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading): taranabilir bağlantılar ve sayfaya özgü canonical.
- [Google sitemap rehberi](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): canonical URL ve doğrulanabilir lastmod.
- [OpenAI botları](https://developers.openai.com/api/docs/bots): OAI-SearchBot arama keşfi için ayrı kullanıcı ajanıdır; GPTBot eğitim taramasıyla aynı amaçta değildir.
- [FAQ/HowTo sonuç değişiklikleri](https://developers.google.com/search/blog/2023/08/howto-faq-changes): bu platform için FAQ zengin sonuç vaadi verilmez. Şema yalnız görünür içerikle tutarlılık için kullanılır.

## Doğrulama notları

İlk hızlı yerel tarama canlı API'nin aynı IP istek kotasına takıldı; bir kısım detay sayfası geçici 500 döndürdü. Sonraki tarama aralığı sınırlandırıldı; tekrarlanan kamu ayarı istekleri sunucu önbelleğine alındı. Bu test gürültüsü, kalıcı sayfa hatası olarak sayılmadı. Denetim paylaşım görselinin gerçekten bulunmadığını ve iki yasal sayfanın OG override eksikliğini yakaladı; bunlar düzeltildi.

Yerel son doğrulama: 40 test / 13 dosya geçti; üretim derlemesi başarılı. 14 sitemap adresi ve iç bağlantılarla keşfedilen toplam 46 sayfa sıfır denetim hatasıyla geçti. Chrome 1440/390 px: soru-cevap açılması, footer → blog → rota geçişi, taşma ve JS hata kontrolleri geçti. JavaScript kapalı ana sayfada beş yanıt HTML içinde mevcut. Kanıtlar `output/seo-geo/`.

## Yayın ve kapanış

Kod sürümü `9877e4fbb74dca14c09fe778c41deb62f166c49f`, 9 Eylül 2026 **15:48:52 UTC** yayında. Üç PM2 servisi yeni sürümde online; ana site, API ve admin giriş sağlık kontrolleri geçti. Bu yayında migration, seed veya veri bakımı çalıştırılmadı.

Canlı son tarama: **46 sayfa, 14 sitemap adresi, 0 denetim hatası**. 30 örnek ilanın noindex durumu, filtre noindex'i, ikinci sayfanın canonical'ı ve olmayan sayfanın 404'ü doğrulandı. Paylaşım PNG'si HTTP 200 ve image/png döndürüyor. Googlebot, bingbot, OAI-SearchBot, PerplexityBot ve Claude-SearchBot kullanıcı ajanlarıyla HTTP 200 ve aynı görünür içerik alındı. Bu bir kullanıcı ajanı simülasyonudur; gerçek bot IP'sinden tarama veya indekslenme kanıtı değildir.

Chrome canlı örnekleri: 1440 px LCP 1.148 ms / CLS 0,00013; 390 px LCP 516 ms / CLS 0,00068. Bunlar ağ/CPU kısıtlamasız iki laboratuvar örneğidir, gerçek kullanıcı p75 değerleri veya Lighthouse puanı değildir. Soru-cevap açılması, rehber gezinmesi, tek H1, taşma ve JavaScript hatası kontrolleri geçti. Görünür yanıtlar JavaScript kapalıyken de okunur.

**Durum:** teknik uygulama, yayın ve tanımlı regresyon kontrolleri tamamlandı. DNS/alan adı erişimi, Search Console ve ölçüm hesabı yetkileri, saha performans verisi ve birbirinin aynısı olan üç yasal belgenin doğrulanarak ayrıştırılması açık dış işlerdir. Bu başlıklar tamamlanmadan tüm SEO/GEO çalışmasına yüzde 100 tamamlandı denmez. Öncelik sırası: yasal metinlerin doğrulanması → www DNS/HTTPS → Search Console ve ölçüm bağlantısı → 7/28 günlük indeks/performans takibi.
