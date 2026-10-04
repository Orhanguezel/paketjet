-- SEO ve icerik (Tanitio SEO katalogu 2026-10-04): sayfa basliklari/aciklamalari, Hakkimizda ve Tasima Kurallari
-- icerigi, yeni SSS'ler, eski modelden kalan 'rezervasyon' ifadeleri. Yonetici duzenlemeleri EZILMEZ:
-- icerik yalniz kisa varsayilan metin duruyorsa, SSS INSERT IGNORE ile eklenir.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
UPDATE custom_pages_i18n SET content='<h2>Hakkımızda: ne yapıyoruz?</h2>
<p>PaketJet, gönderi sahiplerini güzergâhını paylaşan taşıyıcılarla buluşturan bir taşıyıcı ilanı ve iletişim platformudur. Zaten yola çıkacak bir taşıyıcının aracındaki boş kapasite, aynı yöne gönderisi olan biri için çözüm olabilir; biz bu iki tarafın birbirini bulmasını sağlarız.</p>
<h2>Platform nasıl çalışır?</h2>
<ul>
<li><strong>Taşıyıcı ilan verir:</strong> çıkış ve varış, hareket tarihi, araç tipi, boş kapasite (kg) ve açıklama ile ücretsiz ilan oluşturur. İlan incelendikten sonra yayına girer.</li>
<li><strong>Gönderici ilanı bulur:</strong> rota, tarih ve araç tipine göre arama yapar; ilanları ücretsiz inceler.</li>
<li><strong>İletişime erişir:</strong> uygun ilanın iletişim bilgilerini ilan alma hakkı kullanarak veya kartla ödeme yaparak açar.</li>
<li><strong>Doğrudan görüşür:</strong> taşıma ücretini, teslim noktasını ve zamanını taşıyıcıyla birlikte belirler.</li>
</ul>
<h2>Ücret modeli</h2>
<p>İlan vermek ve ilanlara göz atmak ücretsizdir. Ücret yalnızca bir ilanın iletişim bilgilerine erişim içindir ve taşıma bedelini kapsamaz. Güncel tek ilan ve paket fiyatları İlan alma hakkı sayfasında gösterilir. Kartla ödemeler güvenli ödeme sayfasında 3D Secure doğrulamasıyla alınır; kart bilgileri sitemize iletilmez.</p>
<h2>Neyi yapmıyoruz?</h2>
<p>Taşımayı biz yapmayız. Platform üzerinden taşıma rezervasyonu, paket takibi, emanet ödeme veya taşıyıcıya ödeme aktarımı yapılmaz; iletişim erişimi bir taşımanın gerçekleşeceğini garanti etmez. Taşıma, taraflar arasında kurulan ayrı bir ilişkidir.</p>
<h2>İlkelerimiz</h2>
<ul>
<li><strong>İnceleme:</strong> yeni ve düzenlenen ilanlar yayına girmeden önce incelenir; kurallara aykırı ilanlar yayınlanmaz.</li>
<li><strong>Gizlilik:</strong> taşıyıcının iletişim bilgileri herkese açık listede gösterilmez; yalnızca erişim alan kullanıcıya açılır ve 6698 sayılı KVKK kapsamında işlenir.</li>
<li><strong>Şeffaf ücret:</strong> ödediğin tutarın neyi kapsadığı her adımda açıkça yazılır.</li>
<li><strong>Kurallar:</strong> yasaklı maddelerin taşınmasına aracılık edilmez; taşıma kuralları herkes için geçerlidir.</li>
</ul>
<h2>Firmalar için</h2>
<p>Düzenli seferleri olan taşıyıcı ve lojistik firmaları, ilanlarını Partner API ile kendi sistemlerinden otomatik olarak oluşturabilir ve güncelleyebilir.</p>
<h2>Bize ulaşın</h2>
<p>Soruların, önerilerin veya iş birliği taleplerin için iletişim sayfasındaki formu kullanabilirsin.</p>' WHERE slug='hakkimizda' AND locale='tr' AND CHAR_LENGTH(COALESCE(content,''))<1200;
UPDATE custom_pages_i18n SET content='<p>Bu sayfa, platform üzerinden ilanı verilen ve taşınan gönderiler için geçerli taşıma kurallarının özetidir. Bağlayıcı hükümler Kullanım Koşulları’nda yer alır; çelişki halinde Kullanım Koşulları esas alınır.</p>
<h2>Kesin yasaklı maddeler</h2>
<p>Aşağıdaki maddelerin ilanının verilmesi, taşınması veya taşınmasına yeltenilmesi kesinlikle yasaktır:</p>
<ul>
<li>Uyuşturucu ve uyarıcı maddeler</li>
<li>Ateşli silahlar, mühimmat ve patlayıcılar</li>
<li>Yanıcı, parlayıcı veya radyoaktif kimyasallar</li>
<li>Kaçak ve bandrolsüz ürünler, tütün ve alkol ürünleri</li>
<li>Nakit para, döviz, ziynet eşyası ve kıymetli evrak</li>
<li>Taşınması yürürlükteki mevzuat ve karayolları kanunlarınca yasaklanmış her türlü tehlikeli veya yasa dışı nesne</li>
</ul>
<h2>Kısıtlı gönderiler: özel izin veya önceden görüşme</h2>
<ul>
<li>Canlı hayvan taşıması özel izne tabidir.</li>
<li>Bozulabilir gıda, sıvı içeren ürünler ve kırılacak eşyalar için taşıyıcıyla önceden açıkça görüşülmelidir.</li>
</ul>
<h2>Paketleme ve değer beyanı</h2>
<p>Kırılacak eşyaların ve tüm gönderilerin uygun şekilde paketlenmesi göndericinin sorumluluğundadır. Gönderici, gönderinin yaklaşık piyasa değerini dürüstlük kuralına uygun olarak beyan eder; olası bir tazminat durumunda, aksi somut delillerle ispat edilmedikçe bu beyan tavan sınır kabul edilir.</p>
<h2>Taşıyıcının yükümlülükleri</h2>
<p>Taşıma faaliyetinde bulunan kullanıcılar; mevzuatın gerektirdiği yetki belgelerine (K1, K2, K3), SRC belgelerine, geçerli sürücü belgesine, zorunlu trafik ve yük sigortalarına sahip olduklarını ve araç muayenelerinin tam olduğunu taahhüt eder. Gönderi, taşıyıcı tarafından teslim alındığı andan alıcıya teslim edildiği ana kadar taşıyıcının sorumluluğundadır.</p>
<h2>Teslim kanıtı</h2>
<p>Teslim alma ve teslim etme anlarında fotoğraf, teslim tutanağı veya alıcı onayı gibi kanıtlar alınması önerilir. Kayıp veya hasar durumunda taraflar iddialarını bu tür somut delillerle ispat eder.</p>
<h2>Kural ihlalleri</h2>
<p>Kurallara aykırı ilanlar yayından kaldırılır, ilgili hesaplar kapatılabilir. Yasaklı madde taşıma teşebbüslerinde kullanıcı bilgileri mevzuat çerçevesinde yetkili makamlarla paylaşılabilir. Yasaklı madde trafiğine karışan kullanıcılar doğacak tüm cezai, hukuki ve idari sonuçlardan şahsen sorumludur.</p>' WHERE slug='tasima-kurallari' AND locale='tr' AND CHAR_LENGTH(COALESCE(content,''))<1000;
UPDATE custom_pages_i18n SET meta_title='Hakkımızda: taşıyıcı ilanı ve iletişim platformu | PaketJet', meta_description='Hakkımızda: taşıyıcı ilanı ve iletişim platformu olarak göndericileri güzergâhını paylaşan taşıyıcılarla buluşturuyoruz. Nasıl çalıştığımızı oku.' WHERE slug='hakkimizda' AND locale='tr';
UPDATE custom_pages_i18n SET meta_title='Taşıma kuralları: yasaklı ve kısıtlı gönderiler | PaketJet', meta_description='Taşıma kuralları: yasaklı ve kısıtlı gönderiler, paketleme ve değer beyanı, taşıyıcı belgeleri ve teslim kanıtı. Gönderi öncesi bilmen gereken kurallar.' WHERE slug='tasima-kurallari' AND locale='tr';
UPDATE custom_pages_i18n SET meta_title='KVKK aydınlatma metni ve kişisel veriler | PaketJet', meta_description='KVKK aydınlatma metni: kişisel verilerin hangi amaçla işlendiği, kimlerle paylaşıldığı ve veri sahibi olarak başvuru hakların hakkında bilgi edin.' WHERE slug='kvkk' AND locale='tr';
UPDATE custom_pages_i18n SET meta_title='Gizlilik politikası ve veri koruma | PaketJet', meta_description='Gizlilik politikası: kişisel verilerin işlenme amaçları, paylaşım ve saklama esasları, güvenlik önlemleri ve kullanıcı hakları hakkında bilgiler.' WHERE slug='gizlilik-politikasi' AND locale='tr';
UPDATE custom_pages_i18n SET meta_title='Kullanım koşulları ve kullanıcı sözleşmesi | PaketJet', meta_description='Kullanım koşulları: platformun rolü, ilan ve iletişim erişimi kuralları, yasaklı maddeler, taraf sorumlulukları ve uyuşmazlık hükümlerini içeren sözleşme.' WHERE slug='kullanim-kosullari' AND locale='tr';
INSERT IGNORE INTO support_faqs (id, category, display_order, is_published) VALUES ('66666666-6666-4666-8666-666666666607', 'odeme', 7, 1);
INSERT IGNORE INTO support_faqs_i18n (faq_id, locale, question, answer) VALUES ('66666666-6666-4666-8666-666666666607', 'tr', 'Ödemeyi nasıl yaparım, kart bilgilerim güvende mi?', 'Kartla ödemeler güvenli ödeme sayfasında 3D Secure doğrulamasıyla alınır; kart bilgileri sitemize iletilmez ve saklanmaz. Ödeme tamamlanınca iletişim bilgisi veya ilan alma hakkı hesabına otomatik tanımlanır.');
INSERT IGNORE INTO support_faqs (id, category, display_order, is_published) VALUES ('66666666-6666-4666-8666-666666666608', 'odeme', 8, 1);
INSERT IGNORE INTO support_faqs_i18n (faq_id, locale, question, answer) VALUES ('66666666-6666-4666-8666-666666666608', 'tr', 'İade alabilir miyim?', 'İletişim erişimi anında ifa edilen dijital bir hizmet olduğu için genel kural olarak cayma hakkı bulunmaz. Mükerrer ödeme veya teknik bir hata nedeniyle erişimin sağlanamaması gibi durumlarda işlem referansıyla destek talebi oluştur; onaylanan iadeler ödemenin yapıldığı karta yapılır ve iade edilen erişim kapatılır.');
INSERT IGNORE INTO support_faqs (id, category, display_order, is_published) VALUES ('66666666-6666-4666-8666-666666666609', 'odeme', 9, 1);
INSERT IGNORE INTO support_faqs_i18n (faq_id, locale, question, answer) VALUES ('66666666-6666-4666-8666-666666666609', 'tr', 'İlan alma hakkı nedir?', 'İlan alma hakkı, bir ilanın iletişim bilgilerini açmak için kullanılan kredidir. Paket olarak alınabilir; her erişimde bir hak düşer. Daha önce açtığın iletişim için yeniden hak harcamazsın.');
INSERT IGNORE INTO support_faqs (id, category, display_order, is_published) VALUES ('66666666-6666-4666-8666-66666666660a', 'hesap', 10, 1);
INSERT IGNORE INTO support_faqs_i18n (faq_id, locale, question, answer) VALUES ('66666666-6666-4666-8666-66666666660a', 'tr', 'Google hesabımla üye olabilir miyim?', 'Evet. Giriş ve kayıt sayfalarındaki Google düğmesiyle üye olabilirsin. İlk girişte Kullanıcı Sözleşmesi ve KVKK onayını vermen istenir; profil fotoğrafın Google hesabından alınır ve istediğinde değiştirilebilir.');
INSERT IGNORE INTO support_faqs (id, category, display_order, is_published) VALUES ('66666666-6666-4666-8666-66666666660b', 'kargo', 11, 1);
INSERT IGNORE INTO support_faqs_i18n (faq_id, locale, question, answer) VALUES ('66666666-6666-4666-8666-66666666660b', 'tr', 'İlanım neden henüz yayında değil?', 'Yeni ve düzenlenen ilanlar yayına girmeden önce incelenir. İlanın durumunu panelindeki İlanlarım ekranından takip edebilirsin; kurallara uygun ilanlar onaylandıktan sonra listede görünür.');
INSERT IGNORE INTO support_faqs (id, category, display_order, is_published) VALUES ('66666666-6666-4666-8666-66666666660c', 'kargo', 12, 1);
INSERT IGNORE INTO support_faqs_i18n (faq_id, locale, question, answer) VALUES ('66666666-6666-4666-8666-66666666660c', 'tr', 'Firmalar ilanlarını otomatik verebilir mi?', 'Evet. Düzenli seferleri olan firmalar panelden API anahtarı oluşturup Partner API ile ilanlarını kendi sistemlerinden otomatik oluşturabilir, güncelleyebilir ve kapatabilir. Ayrıntılar Geliştiriciler sayfasındadır.');
INSERT IGNORE INTO support_faqs (id, category, display_order, is_published) VALUES ('66666666-6666-4666-8666-66666666660d', 'genel', 13, 1);
INSERT IGNORE INTO support_faqs_i18n (faq_id, locale, question, answer) VALUES ('66666666-6666-4666-8666-66666666660d', 'tr', 'Kişisel verilerim nasıl korunuyor?', 'Taşıyıcıların iletişim bilgileri herkese açık listede gösterilmez; yalnızca erişim alan kullanıcıya açılır. Kişisel veriler 6698 sayılı KVKK kapsamında işlenir; haklarına ilişkin bilgi KVKK aydınlatma metnindedir.');
UPDATE site_settings SET value=JSON_SET(value,'$.descriptionTemplate','{{from_city}} → {{to_city}} taşıyıcı ilanı: kalkış tarihi, araç ve kapasite bilgisi. İletişim bilgilerine eriş, taşıma koşullarını taşıyıcıyla doğrudan görüş.') WHERE `key`='seo_pages_listing_detail' AND JSON_EXTRACT(value,'$.descriptionTemplate') LIKE '%rezervasyon%';
UPDATE site_settings SET value=JSON_SET(value,'$.description','Taşıyıcı ilanlarına göz at, güzergâhına uygun taşıyıcının iletişim bilgilerine eriş ve doğrudan görüş. Taşıyıcılar için ilan vermek ücretsizdir.') WHERE `key`='seo_pages_home' AND JSON_EXTRACT(value,'$.description') LIKE '%rezervasyon%';
UPDATE site_settings SET value=JSON_SET(value,'$.description','Sıkça sorulan sorular: ilan verme, iletişim erişimi, ilan alma hakkı, güvenli ödeme, iade ve hesap işlemleri hakkında yanıtlar.') WHERE `key`='seo_pages_faq' AND JSON_EXTRACT(value,'$.description') LIKE '%rezervasyon%';
UPDATE site_settings SET value=JSON_SET(value,'$.description','Taşıyıcı olarak güzergâhını ücretsiz ilan ver: rota, tarih, araç ve boş kapasiteni paylaş, göndericiler seni bulsun.') WHERE `key`='seo_pages_ilan_ver' AND JSON_EXTRACT(value,'$.description') LIKE '%kargo taleplerini%';
