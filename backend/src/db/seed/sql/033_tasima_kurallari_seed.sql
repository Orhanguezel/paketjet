-- 026: Tasima Kurallari custom page seed
INSERT IGNORE INTO custom_pages (id, module_key, is_published, display_order, created_at, updated_at)
VALUES ('55555555-5555-4555-8555-555555555555', 'yasal', 1, 10, NOW(), NOW());

INSERT IGNORE INTO custom_pages_i18n (page_id, locale, title, slug, content, summary, meta_title, meta_description)
VALUES (
  '55555555-5555-4555-8555-555555555555',
  'tr',
  'Taşıma Kuralları',
  'tasima-kurallari',
  '<h2>1. Genel Kurallar</h2>
<p>PaketJet platformu üzerinden gerçekleştirilen tüm taşıma işlemleri aşağıdaki kurallara tabidir. Platformu kullanan tüm taşıyıcı ve müşteriler bu kuralları kabul etmiş sayılır.</p>

<h2>2. Yasaklı Eşyalar</h2>
<p>Aşağıdaki ürünlerin taşınması kesinlikle yasaktır:</p>
<ul>
  <li>Yanıcı, patlayıcı ve tehlikeli maddeler</li>
  <li>Uyuşturucu ve yasadışı maddeler</li>
  <li>Silah ve mühimmat</li>
  <li>Canlı hayvanlar (özel izin olmadan)</li>
  <li>Bozulabilir gıda maddeleri (soğuk zincir garantisi olmadan)</li>
  <li>Değerli evrak, nakit para, mücevher</li>
</ul>

<h2>3. Paketleme Kuralları</h2>
<ul>
  <li>Tüm eşyalar taşımaya uygun şekilde paketlenmelidir.</li>
  <li>Kırılgan eşyalar mutlaka "KIRILACAK EŞYA" etiketi ile işaretlenmelidir.</li>
  <li>Sıvı maddeler sızdırmaz ambalaj içinde olmalıdır.</li>
  <li>Paketleme müşterinin sorumluluğundadır.</li>
</ul>

<h2>4. Ağırlık ve Boyut Sınırları</h2>
<ul>
  <li>Tek bir paket en fazla 30 kg olabilir.</li>
  <li>Taşıyıcı, ilan verirken belirttiği kapasitenin üzerinde yük kabul edemez.</li>
  <li>Gerçek ağırlık ile beyan edilen ağırlık arasında %10\'dan fazla fark olması durumunda taşıyıcı taşımayı reddedebilir.</li>
</ul>

<h2>5. Sorumluluk ve Sigorta</h2>
<ul>
  <li>Taşıyıcı, teslim aldığı eşyaları varış noktasına güvenli bir şekilde ulaştırmakla yükümlüdür.</li>
  <li>Hasar veya kayıp durumunda taşıyıcı sorumlu tutulur.</li>
  <li>Platform, taşıyıcı ve müşteri arasındaki anlaşmazlıklarda arabuluculuk yapabilir.</li>
  <li>PaketJet, eşyaların sigortalanmasını teşvik eder ancak zorunlu kılmaz.</li>
</ul>

<h2>6. Teslimat Kuralları</h2>
<ul>
  <li>Taşıyıcı, belirtilen tahmini varış tarihine uymakla yükümlüdür.</li>
  <li>Teslimat sırasında alıcının kimlik doğrulaması yapılmalıdır.</li>
  <li>Alıcı bulunamadığında taşıyıcı müşteriyle iletişime geçmelidir.</li>
  <li>Teslim edilemeyen kargolar için ek ücret talep edilebilir.</li>
</ul>

<h2>7. İptal ve İade</h2>
<ul>
  <li>PaketJet üzerinden satın alınan hizmet, kargo taşıma hizmeti değil iletişim bilgilerine erişim hizmetidir.</li>
  <li>İlan sahibinin iletişim bilgileri açıldıktan sonra erişim hizmeti tamamlanmış sayılır.</li>
  <li>Taşıma bedeli taraflar arasında ayrıca kararlaştırılır; PaketJet taşıma parasını tahsil etmez veya iade etmez.</li>
</ul>

<h2>8. Platform Ücreti</h2>
<p>PaketJet, ilan sahibinin iletişim bilgilerine erişim için ilan alma hakkı veya tekil erişim ücreti alır. Taşıyıcıya ödeme aktarımı, komisyon kesintisi veya platform içi taşıma bedeli akışı yoktur.</p>',
  'PaketJet platformunda taşıma işlemleri için geçerli kurallar, yasaklı eşyalar, paketleme gereksinimleri ve sorumluluklar.',
  'Taşıma Kuralları | PaketJet',
  'PaketJet platformunda taşıma kuralları, yasaklı eşyalar, paketleme ve teslimat kuralları hakkında bilgi.'
);
