SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `custom_pages` (`id`, `module_key`, `is_published`, `display_order`)
VALUES
  ('55555555-5555-4555-8555-555555555551', 'kurumsal', 1, 1),
  ('55555555-5555-4555-8555-555555555552', 'yasal', 1, 2),
  ('55555555-5555-4555-8555-555555555553', 'yasal', 1, 3),
  ('55555555-5555-4555-8555-555555555554', 'yasal', 1, 4),
  ('55555555-5555-4555-8555-555555555555', 'yasal', 1, 5)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `is_published` = VALUES(`is_published`),
  `display_order` = VALUES(`display_order`);

INSERT INTO `custom_pages_i18n`
  (`page_id`, `locale`, `title`, `slug`, `content`, `summary`, `meta_title`, `meta_description`)
VALUES
  (
    '55555555-5555-4555-8555-555555555551',
    'tr',
    'Hakkımızda',
    'hakkimizda',
    '{"html": "<h2>PaketJet Nedir?</h2><p>PaketJet, şehirler arası hareket eden taşıyıcılar ile kargo göndermek isteyen kullanıcıları aynı platformda buluşturan bir <strong>P2P kargo pazaryeridir</strong>. BlaBlaCar modelini kargo dünyasına uyarlayan platform, mevcut taşıma kapasitesini dijital olarak görünür hale getirir.</p><p>Geleneksel kargo servislerinde sabit operasyon, sınırlı rota tercihleri ve yüksek fiyatlar sıkça karşılaşılan sorunlardır. PaketJet bu noktada taşıyıcıların boş kapasitesini değerlendirmesini, göndericilerin ise daha esnek ve uygun fiyatlı seçenekler bulmasını sağlar.</p><hr/><h2>Nasıl Çalışır?</h2><ol><li><strong>Rota Ara</strong> — Göndereceğin şehri, tarihi ve ağırlığı gir. Sana uygun taşıyıcıları listeleyelim.</li><li><strong>Taşıyıcı Seç</strong> — Fiyat, araç tipi ve taşıyıcı puanına göre en iyi seçimi yap.</li><li><strong>Paketini Gönder</strong> — Rezervasyonunu onayla, taşıyıcıyla buluş, kargoyu teslim et.</li></ol><hr/><h2>Neden PaketJet?</h2><ul><li><strong>81 ilde aktif ağ</strong> — Türkiye genelinde binlerce taşıyıcı seni bekliyor.</li><li><strong>Şeffaf fiyatlandırma</strong> — Güzergah, tarih ve kapasite bilgileri açıkça gösterilir.</li><li><strong>Güvenli ödeme</strong> — Platform üzerinden kontrollü ödeme ve teslimat akışı.</li><li><strong>Taşıyıcı puanlama</strong> — Geçmiş taşımalara göre taşıyıcı değerlendirmesi.</li><li><strong>Kolay ilan yönetimi</strong> — Taşıyıcılar dakikalar içinde ilan açabilir.</li></ul><hr/><h2>Marka Yaklaşımımız</h2><p>PaketJet, <strong>güven, şeffaflık ve operasyonel sadelik</strong> ilkeleriyle hareket eder. Kullanıcı deneyimi tasarlanırken ilan açma, ilan inceleme, rezervasyon oluşturma, ödeme tamamlama ve destek sürecinin herkes için anlaşılır olması hedeflenir.</p><p>Güven yaklaşımımızın merkezinde ilan verisinin açık şekilde sunulması bulunur. Güzergah, tarih, kapasite, fiyat ve araç tipi gibi alanlar kullanıcıların karar vermesini kolaylaştırır.</p><hr/><h2>Hangi Gönderilere Uygun?</h2><p>PaketJet, özellikle şu tür gönderiler için idealdir:</p><ul><li>Öğrenci eşyası ve kişisel koli</li><li>Evrak ve doküman gönderimi</li><li>Parça eşya ve küçük hacimli gönderiler</li><li>Şehirler arası acil olmayan teslimatlar</li><li>Hediye ve paket gönderimi</li></ul><hr/><h2>Vizyonumuz</h2><p>Uzun vadede hedefimiz, Türkiye genelinde mikro lojistik ve şehirler arası taşıma kapasitesini daha akıllı hale getiren, farklı kullanıcı tiplerine güven veren ve dijital olarak referans gösterilebilir bir platform olmaktır.</p><p>PaketJet yalnızca bir başlangıç girişimi değil, <strong>kargo hareketliliğini daha verimli ve daha okunabilir hale getiren bir altyapıdır.</strong></p>"}',
    'PaketJet, şehirler arası taşıma kapasitesini görünür hale getiren ve gönderici ile taşıyıcıyı güvenli şekilde buluşturan P2P kargo platformudur.',
    'Hakkımızda',
    'PaketJet hakkında kurumsal bilgi, nasıl çalışır, neden PaketJet ve marka yaklaşımı.'
  ),
  (
    '55555555-5555-4555-8555-555555555552',
    'tr',
    'Gizlilik Politikası',
    'gizlilik-politikasi',
    '{"html":"<p>Kişisel verileriniz, hizmet sunumu ve yasal yükümlülükler kapsamında işlenir.</p><p>Veri güvenliği için teknik ve idari tedbirler uygulanır.</p>"}',
    'PaketJet gizlilik ilkeleri ve veri işleme yaklaşımı.',
    'Gizlilik Politikası | PaketJet',
    'PaketJet gizlilik politikası ve veri koruma yaklaşımı.'
  ),
  (
    '55555555-5555-4555-8555-555555555553',
    'tr',
    'KVKK Aydınlatma Metni',
    'kvkk',
    '{"html":"<p>6698 sayılı KVKK kapsamında veri sorumlusu olarak PaketJet, kişisel verilerinizi açık rıza veya kanuni sebepler doğrultusunda işler.</p>"}',
    'KVKK kapsamında aydınlatma metni.',
    'KVKK | PaketJet',
    'PaketJet KVKK aydınlatma metni.'
  ),
  (
    '55555555-5555-4555-8555-555555555554',
    'tr',
    'Kullanım Koşulları',
    'kullanim-kosullari',
    '{"html":"<p>PaketJet platformunu kullanan tüm taraflar, ilan ve rezervasyon süreçlerinde dürüst ve güncel bilgi sağlamayı kabul eder.</p>"}',
    'PaketJet platform kullanım koşulları.',
    'Kullanım Koşulları | PaketJet',
    'PaketJet hizmet kullanım koşulları ve platform kuralları.'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'tr',
    'Taşıma Kuralları',
    'tasima-kurallari',
    '{"html":"<h2>Taşıma Kuralları</h2><p>PaketJet platformu üzerinden taşınacak kargolar için aşağıdaki kurallar geçerlidir:</p><ul><li>Tehlikeli maddeler, yanıcı ve patlayıcı içerikler kesinlikle yasaktır.</li><li>Yasadışı maddeler ve taşınması kanunen yasak olan ürünler kabul edilmez.</li><li>Canlı hayvan taşıması özel izne tabidir.</li><li>Kırılacak eşyaların paketlenmesi göndericinin sorumluluğundadır.</li></ul>"}',
    'PaketJet taşıma kuralları ve yasaklı maddeler listesi.',
    'Taşıma Kuralları | PaketJet',
    'PaketJet taşıma kuralları, yasaklı maddeler ve sorumluluklar.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `content` = VALUES(`content`),
  `summary` = VALUES(`summary`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);
