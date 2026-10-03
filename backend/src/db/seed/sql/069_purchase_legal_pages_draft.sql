-- Mesafeli satis sozlesmesi + iptal/iade kosullari TASLAKLARI (is_published=0).
-- Admin panelden satici bilgileri doldurulup yayina alinir. Mevcut kayit varsa DOKUNULMAZ (INSERT IGNORE).
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
INSERT IGNORE INTO custom_pages (id, module_key, is_published, display_order) VALUES ('55555555-5555-4555-8555-5555555555a1', 'yasal', 0, 20);
INSERT IGNORE INTO custom_pages_i18n (page_id, locale, title, slug, content, summary, meta_title, meta_description) VALUES ('55555555-5555-4555-8555-5555555555a1', 'tr', 'Mesafeli Satış Sözleşmesi', 'mesafeli-satis-sozlesmesi', '<p><strong>TASLAK — yayınlamadan önce: köşeli parantezli satıcı bilgilerini doldurun ve metni hukuk danışmanınıza kontrol ettirin. Bu kutuyu silin.</strong></p>
<h2>1. Taraflar</h2>
<p><strong>Satıcı / Hizmet Sağlayıcı:</strong> [Ad Soyad veya Ticari Unvan]<br>
<strong>Adres:</strong> [Açık adres]<br>
<strong>Vergi Dairesi / No (veya T.C. Kimlik No):</strong> [Bilgi]<br>
<strong>E-posta:</strong> destek@paketjet.net · <strong>Telefon:</strong> +90 507 863 72 72<br>
<strong>Web sitesi:</strong> https://paketjet.com</p>
<p><strong>Alıcı:</strong> paketjet.com üzerinde üyelik oluşturarak sipariş veren kişi. Alıcının ad, e-posta ve telefon bilgileri üyelik kaydından alınır.</p>
<h2>2. Sözleşmenin konusu</h2>
<p>Bu sözleşme, Alıcının paketjet.com üzerinden elektronik ortamda satın aldığı dijital hizmetlere ilişkin tarafların hak ve yükümlülüklerini 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerine göre düzenler.</p>
<p>Satılan hizmetler: (a) bir taşıma ilanının iletişim bilgilerine erişim, (b) İlan Alma Hakkı paketleri (her hak bir ilanın iletişim bilgilerine erişim sağlar). Taşıma hizmetinin kendisi Satıcı tarafından verilmez; taşıma, ücreti ve koşulları Alıcı ile taşıyıcı arasında doğrudan kararlaştırılır.</p>
<h2>3. Hizmet bedeli ve ödeme</h2>
<p>Hizmet bedelleri, vergiler dahil olarak satın alma ekranında gösterilir. Kartla ödemeler Shopier güvenli ödeme altyapısı üzerinden alınır; kart bilgileri Satıcıya iletilmez ve Satıcı tarafından saklanmaz. Havale/EFT ile ödemede hizmet, ödemenin Satıcı hesabında doğrulanmasından sonra tanımlanır.</p>
<h2>4. Hizmetin ifası</h2>
<p>Ödeme onaylandığında satın alınan hak Alıcının hesabına tanımlanır veya ilgili ilanın iletişim bilgileri Alıcının hesabında görüntülenir. Hizmet elektronik ortamda anında ifa edilir.</p>
<h2>5. Cayma hakkı</h2>
<p>Mesafeli Sözleşmeler Yönetmeliği madde 15/1-(ğ) uyarınca elektronik ortamda anında ifa edilen hizmetlerde ve tüketiciye anında teslim edilen gayrimaddi mallarda cayma hakkı kullanılamaz. Alıcı, ödemeyi onaylamadan önce bu durumu bildiğini ve hizmetin anında ifasına onay verdiğini kabul eder.</p>
<p>Cayma hakkının bulunmadığı hâllerde dahi, <a href="/iptal-ve-iade-kosullari">İptal ve İade Koşulları</a> sayfasında sayılan teknik hata ve hizmetin sağlanamaması durumlarında bedel iade edilir.</p>
<h2>6. Alıcının yükümlülükleri</h2>
<p>Alıcı, erişim sağladığı iletişim bilgilerini yalnızca ilgili taşıma talebi için kullanır; üçüncü kişilerle paylaşmaz ve <a href="/kullanim-kosullari">Kullanım Koşulları</a> ile <a href="/kvkk">KVKK Aydınlatma Metni</a>ne uyar.</p>
<h2>7. Uyuşmazlıkların çözümü</h2>
<p>Bu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığınca her yıl ilan edilen parasal sınırlar dahilinde Alıcının yerleşim yerindeki veya işlemin yapıldığı yerdeki Tüketici Hakem Heyetleri, bu sınırları aşan durumlarda Tüketici Mahkemeleri yetkilidir.</p>
<h2>8. Yürürlük</h2>
<p>Alıcı, ödeme adımında bu sözleşmeyi elektronik ortamda onaylamakla sözleşmenin tüm hükümlerini kabul etmiş sayılır. Sözleşme, sipariş tarihinde yürürlüğe girer ve elektronik kaydı Satıcı tarafından saklanır.</p>', 'paketjet.com üzerinden satın alınan dijital hizmetlere ilişkin mesafeli satış sözleşmesi.', 'Mesafeli Satış Sözleşmesi', 'paketjet.com üzerinden satın alınan dijital hizmetlere ilişkin mesafeli satış sözleşmesi.');
INSERT IGNORE INTO custom_pages (id, module_key, is_published, display_order) VALUES ('55555555-5555-4555-8555-5555555555a2', 'yasal', 0, 21);
INSERT IGNORE INTO custom_pages_i18n (page_id, locale, title, slug, content, summary, meta_title, meta_description) VALUES ('55555555-5555-4555-8555-5555555555a2', 'tr', 'İptal ve İade Koşulları', 'iptal-ve-iade-kosullari', '<p><strong>TASLAK — yayınlamadan önce: köşeli parantezli satıcı bilgilerini doldurun ve metni hukuk danışmanınıza kontrol ettirin. Bu kutuyu silin.</strong></p>
<p>Bu sayfa, paketjet.com üzerinden satın alınan dijital hizmetlerin (ilan iletişim erişimi ve İlan Alma Hakkı paketleri) iptal ve iade koşullarını açıklar. Taşıma ücreti taşıyıcı ile doğrudan görüşülür; taşıma bedelinin iadesi bu sayfanın kapsamında değildir.</p>
<h2>1. Genel kural</h2>
<p>Satın alınan hizmetler elektronik ortamda anında ifa edildiğinden, Mesafeli Sözleşmeler Yönetmeliği madde 15/1-(ğ) uyarınca cayma hakkı bulunmamaktadır. Kullanıcı kusuru, ihmali veya sözleşme ihlali nedeniyle tamamlanamayan işlemlerde hizmet bedeli iade edilmez.</p>
<h2>2. Bedelin iade edildiği durumlar</h2>
<ul>
<li>Aynı işlem için birden fazla kez ücret alınması (mükerrer çekim).</li>
<li>Ödeme alındığı hâlde hakkın hesaba tanımlanmaması veya iletişim bilgilerinin açılmaması.</li>
<li>Teknik bir hata nedeniyle satın alınan iletişim bilgilerine erişilememesi.</li>
<li>Erişilen iletişim bilgilerinin ilan sahibine ait olmadığının veya geçersiz olduğunun inceleme sonucunda doğrulanması.</li>
</ul>
<h2>3. İade talebi</h2>
<p>İade talebinizi, ödeme tarihinden itibaren 14 gün içinde <strong>destek@paketjet.net</strong> adresine veya sitedeki destek sayfasından; işlem referansını ve talebinizin nedenini belirterek iletebilirsiniz. Talepler en geç 7 iş günü içinde sonuçlandırılır.</p>
<h2>4. İade süreci</h2>
<ul>
<li>Onaylanan iadeler, ödemenin yapıldığı karta Shopier üzerinden tam tutar olarak yapılır. Tutarın kartınıza yansıma süresi bankanıza bağlıdır (genellikle 2–10 iş günü).</li>
<li>Havale/EFT ile yapılan ödemelerin iadesi, ödemenin geldiği hesaba yapılır.</li>
<li>İade edilen bir İlan Alma Hakkı paketinde, hesabınızda kullanılmamış duran haklar iade ile birlikte hesabınızdan düşülür.</li>
<li>İade edilen bir ilan iletişim erişiminde, ilgili ilanın iletişim bilgilerine erişiminiz kapanır.</li>
</ul>
<h2>5. İletişim</h2>
<p>E-posta: destek@paketjet.net · Telefon: +90 507 863 72 72</p>', 'İlan iletişim erişimi ve İlan Alma Hakkı satın alımlarında iptal ve iade koşulları.', 'İptal ve İade Koşulları', 'İlan iletişim erişimi ve İlan Alma Hakkı satın alımlarında iptal ve iade koşulları.');
