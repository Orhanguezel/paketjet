import type {ArticleContent, ContentSource} from './content.type';

const publishedAt='2026-03-30T09:00:00.000Z';
const updatedAt='2026-10-04T00:00:00.000Z';
const newPublishedAt='2026-10-04T00:00:00.000Z';

/** Resmî kaynaklar (mevzuat.gov.tr ve kurum siteleri). */
const SRC: Record<string, ContentSource> = {
  karayolu: {label:'4925 sayılı Karayolu Taşıma Kanunu',url:'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=4925&MevzuatTur=1&MevzuatTertip=5',note:'Ticari eşya taşımacılığı ve yetki belgeleri'},
  tuketici: {label:'6502 sayılı Tüketicinin Korunması Hakkında Kanun',url:'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6502&MevzuatTur=1&MevzuatTertip=5',note:'Mesafeli satış ve dijital hizmetler'},
  kvkk: {label:'6698 sayılı Kişisel Verilerin Korunması Kanunu',url:'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5',note:'İletişim bilgilerinin işlenmesi'},
  kvkkKurum: {label:'Kişisel Verileri Koruma Kurumu',url:'https://www.kvkk.gov.tr',note:'Veri sahibi hakları ve başvuru yolları'},
  uab: {label:'T.C. Ulaştırma ve Altyapı Bakanlığı',url:'https://www.uab.gov.tr',note:'Karayolu taşımacılığı düzenlemeleri'},
};

export const BLOG_POSTS:ArticleContent[]=[
 {slug:'p2p-kargo-nedir',seoKey:'blog_p2p_kargo_nedir',eyebrow:'Rehber',title:'P2P kargo nedir?',metaTitle:'P2P kargo nedir? Taşıyıcıyla doğrudan gönderi',cluster:'urun',summary:'P2P kargo, güzergâhını paylaşan taşıyıcı ile gönderi sahibinin aracı kargo şirketi olmadan doğrudan anlaştığı taşıma modelidir.',description:'P2P kargo nedir, kargo şirketinden farkı ne? Taşıyıcı ilanı bulma, iletişime erişim ve taşıyıcıyla doğrudan anlaşma adımlarını öğren.',publishedAt,updatedAt,categoryLabel:'Ürün rehberi',canonicalPath:'/blog/p2p-kargo-nedir',
  keyFacts:['İlan vermek ücretsizdir; ücret yalnız iletişim erişimi içindir.','İletişim erişim bedeli taşıma ücretini kapsamaz.','Taşıma ücreti, teslim noktası ve zamanı taraflar arasında belirlenir.'],
  sections:[
  {title:'P2P kargo: güzergâhını paylaşan taşıyıcı, uygun ilanı arayan gönderici',paragraphs:['P2P (eşler arası) kargo, zaten bir güzergâhta yolculuk yapan taşıyıcının aracındaki boş kapasiteyi, aynı yöne gönderisi olan kişiyle paylaşmasıdır. Taşıyıcılar çıkış ve varış şehirlerini, hareket tarihini, araç tipini ve güzergâh açıklamasını ilan olarak paylaşır; gönderi sahipleri bu ilanları inceleyerek ihtiyaçlarına uygun taşıyıcıyı bulur.','İlan vermek ücretsizdir. İletişim bilgileri kamuya açık listede gösterilmez. Gönderici, bir ilan alma hakkı kullanarak veya kartla ödeme yaparak tek bir ilanın iletişim bilgilerine erişir.']},
  {title:'P2P kargo ile kargo şirketi arasındaki fark',paragraphs:['Kargo şirketinde gönderi şubeye veya kuryeye teslim edilir, fiyatı firmanın tarifesi belirler ve takip numarası verilir. P2P kargoda ise gönderiyi taşıyıcı bizzat alır; fiyatı, teslim noktasını ve zamanı gönderici ile taşıyıcı birlikte belirler.'],table:[['Konu','Kargo şirketi','P2P kargo'],['Fiyat','Firma tarifesi (desi/ağırlık)','Taraflar arasında görüşülür'],['Teslim alma','Şube veya kurye','Taşıyıcıyla kararlaştırılan nokta'],['Uygun gönderi','Standart koli','Hacimli eşya, aynı gün yolda olan rota'],['Platformun rolü','Taşımayı yapar','İletişim erişimi sağlar']]},
  {title:'Ödenen ücret ne içindir?',paragraphs:['Platform üzerinden alınan hizmet, ilanın iletişim bilgilerine erişimdir. Bu ücret taşıma bedeli değildir. Gönderinin kabulü, taşıma ücreti, teslim noktaları ve zamanlamayı gönderici ile taşıyıcı doğrudan görüşerek belirler.','Platform üzerinden taşıma rezervasyonu, paket takibi, emanet ödeme veya taşıyıcıya ödeme aktarımı yapılmaz. İletişim erişimi, gönderinin taşınacağını ya da teslim edileceğini garanti etmez.']},
  {title:'P2P kargoda ilanı seçmeden önce',paragraphs:['Kalkış tarihini ve güzergâhı kontrol et. Gönderinin türünü, boyutlarını ve özel ihtiyaçlarını açıkça tarif etmeye hazır ol. İletişimi açmadan önce gönderi değeri ve içerik beyanını doğru doldur; taşıma kurallarını oku.','İletişim açıldıktan sonra kayıt Satın aldıklarım ekranında saklanır. İlanın süresi dolsa da kazandığın iletişim erişimi için yeniden hak harcaman gerekmez.']},
 ],
 faqs:[
  {question:'P2P kargo güvenli mi?',answer:'Güvenlik, taraflar arasında yapılan anlaşmanın açıklığına bağlıdır. Taşıyıcının kimliğini ve araç bilgisini teyit etmek, teslim fotoğrafı almak ve yasaklı madde göndermemek riski azaltır. Platform teslim garantisi vermez.'},
  {question:'P2P kargoda fiyat nasıl belirlenir?',answer:'Taşıma ücreti taşıyıcı ile gönderici arasında görüşülerek belirlenir. Platforma ödenen iletişim erişim bedeli bu ücrete dahil değildir.'},
  {question:'Hangi gönderiler P2P kargoya uygundur?',answer:'Taşıyıcının aracına sığan, yasaklı madde içermeyen ve taşıma kurallarına uygun koli ve eşyalar. Hacimli veya şehirlerarası acil gönderilerde taşıyıcının zaten o rotada olması avantaj sağlar.'},
 ],
 sources:[SRC.karayolu,SRC.tuketici],
 },
 {slug:'paketjet-nasil-kullanilir',seoKey:'blog_paketjet_nasil_kullanilir',eyebrow:'Rehber',title:'PaketJet nasıl kullanılır?',metaTitle:'PaketJet nasıl kullanılır? Adım adım rehber',cluster:'urun',summary:'İlan arama, iletişim açma ve ücretsiz güzergâh paylaşımı için adım adım kullanım rehberi.',description:'PaketJet nasıl kullanılır? İlan arama, iletişim bilgilerine erişim, taşıyıcıyla görüşme ve ücretsiz ilan verme adımlarını bu rehberde öğren.',publishedAt,updatedAt,categoryLabel:'Kullanım rehberi',canonicalPath:'/blog/paketjet-nasil-kullanilir',
  keyFacts:['Arama sonuçları yalnız hareket zamanı geçmemiş ilanları gösterir.','Yeni ve düzenlenen ilanlar yayına girmeden önce incelenir.','Satın alınan iletişim bilgisi hesapta kalıcı olarak saklanır.'],
  sections:[
  {title:'1. Güncel güzergâhları ara',paragraphs:['İlanlar sayfasında çıkış ve varış adresini, ardından tarihi seç. Köy, mahalle veya açık adres yazabilir, harita destekli önerilerden seçim yapabilirsin. Gerekiyorsa araç tipine göre filtrele. Arama sonuçları yalnız hareket zamanı geçmemiş, yayında olan ilanları gösterir.','Tam adreste uygun ilan yoksa aynı ildeki ilanlar, tarih ve araç tercihin korunarak alternatif olarak gösterilebilir. Alternatiflerin kesin buluşma noktasını taşıyıcıyla görüş. Bir rotada ilan bulunması veya düzenli sefer yapılması garanti değildir.']},
  {title:'2. İlanı ve erişim koşullarını incele',paragraphs:['İlanın açıklamasını ve hareket saatini oku. Giriş yaptıktan sonra erişim fiyatını ve mevcut haklarını görebilirsin. İletişimi açmak için gerekli gönderi değeri ve içerik beyanını tamamla.','Hakla alım başarılı olunca bir hak düşer. Kartla alımda ödeme Shopier güvenli ödeme sayfasında, 3D Secure doğrulamasıyla alınır; sonuç sunucunun doğruladığı ödeme kaydından gelir. Ekranı kapatmak bir ödemeyi iptal etmez; bekleyen işlemde tekrar ödeme yapmadan durumu kontrol et.']},
  {title:'3. Taşıyıcıyla doğrudan görüş',paragraphs:['Açılan telefon veya e-posta bilgisiyle taşıyıcıya ulaş. Gönderi içeriğini ve ölçülerini, teslim noktalarını, zamanlamayı ve taşıma bedelini birlikte netleştir. İletişim erişim bedeli bu taşıma bedelinden ayrıdır.','Satın aldıklarım ekranından iletişime yeniden dönebilirsin. Ödeme veya erişim sorunu varsa işlem referansını destek talebine ekle; kart bilgisi veya parola paylaşma.']},
  {title:'Taşıyıcı olarak ücretsiz ilan ver',paragraphs:['Ücretsiz ilan ver düğmesini seç. Rota ve tarihleri, araç bilgilerini, açıklamanı ve özel iletişim alanlarını doldur. Önizlemeyi kontrol edip incelemeye gönder.','İncelemeye gönderilen ilan hemen yayında sayılmaz. Durumunu İlanlarım ekranından takip edebilir, uygun ilanları düzenleyebilir veya durdurabilirsin. Düzenlenen ilan tekrar incelemeye alınır; satılmış ilan yeniden satışa açılmaz. Düzenli seferleri olan firmalar ilanlarını API ile kendi sistemlerinden de açabilir.']},
 ],
 faqs:[
  {question:'Üye olmadan ilanları görebilir miyim?',answer:'Evet. İlanlar herkese açıktır; iletişim bilgilerine erişmek ve ilan vermek için üyelik gerekir. Google hesabınla da üye olabilirsin.'},
  {question:'İlanım ne zaman yayına girer?',answer:'İlan incelemeye gönderildikten sonra onaylanınca yayına girer. Düzenlenen ilan yeniden incelemeye alınır.'},
  {question:'Satın aldığım iletişim bilgisine nereden ulaşırım?',answer:'Hesabındaki Satın aldıklarım ekranından. Aynı ilan için yeniden ödeme veya hak gerekmez.'},
 ],
 sources:[SRC.kvkk,SRC.tuketici],
 },
 {slug:'sehirlerarasi-esya-gonderme-rehberi',seoKey:'blog_sehirlerarasi_esya',eyebrow:'Gönderici rehberi',title:'Şehirlerarası eşya gönderme rehberi',metaTitle:'Şehirlerarası eşya gönderme: kontrol listesi',cluster:'gonderici',summary:'Koli veya hacimli eşyayı başka bir şehre taşıyıcıyla göndermeden önce yapılacakların kontrol listesi.',description:'Şehirlerarası eşya gönderme öncesi paketleme, ölçü ve ağırlık, değer beyanı, yasaklı maddeler ve teslim adımlarını içeren pratik kontrol listesi.',publishedAt:newPublishedAt,updatedAt,categoryLabel:'Gönderici rehberi',canonicalPath:'/blog/sehirlerarasi-esya-gonderme-rehberi',
  keyFacts:['Ölçüleri santimetre, ağırlığı kilogram olarak not et.','Hacim ağırlığı (desi) = en × boy × yükseklik (cm) ÷ 3000.','Taşıyıcıya teslimde paketin fotoğrafını çek.'],
  sections:[
  {title:'Şehirlerarası eşya göndermeden önce gönderiyi tanımla',paragraphs:['Taşıyıcı, aracına neyi alacağına gönderinin tarifine bakarak karar verir. Eşyanın ne olduğunu, kaç parça olduğunu, ölçülerini ve yaklaşık ağırlığını önceden yazmak hem doğru ilanı bulmanı hem de hızlı anlaşmanı sağlar.'],list:['İçerik: ne gönderiyorsun, kırılacak veya sıvı içeriyor mu?','Parça sayısı ve her parçanın ölçüsü (en × boy × yükseklik, cm).','Yaklaşık ağırlık (kg) ve hacim ağırlığı (desi).','Yaklaşık piyasa değeri (değer beyanı için).','Teslim alma ve teslim etme adresleri, uygun saat aralığı.']},
  {title:'Paketleme: taşıma sırasında hasarı önle',paragraphs:['Kırılacak eşyayı ayrı ayrı sar, boşlukları doldur ve kolinin dışına "kırılacak" yaz. Sıvı içeren ürünleri sızdırmaz şekilde kapat. Paketlemenin göndericinin sorumluluğunda olduğunu unutma.']},
  {title:'Değer beyanı ve yasaklı maddeler',paragraphs:['İletişim erişimi alırken gönderinin yaklaşık değerini dürüstçe beyan edersin; olası bir uyuşmazlıkta bu beyan tavan kabul edilebilir. Patlayıcı, yanıcı, silah, uyuşturucu, nakit para, ziynet eşyası, kıymetli evrak ve mevzuatla yasaklanmış ürünler hiçbir koşulda gönderilemez. Ayrıntılar için taşıma kurallarını oku.']},
  {title:'Taşıyıcıyla anlaşma ve teslim',paragraphs:['Taşıma ücretini, teslim alma ve teslim etme noktasını ve zamanını yazılı olarak (mesaj) netleştir. Teslim ederken paketin fotoğrafını çek; alıcıya teslimde de fotoğraf veya teslim onayı iste. Bu kayıtlar olası bir sorunda en güçlü kanıttır.']},
 ],
 faqs:[
  {question:'Şehirlerarası eşya gönderirken fiyatı ne belirler?',answer:'P2P taşımada fiyatı taşıyıcı ile birlikte belirlersin. Mesafe, ölçü, ağırlık, aracın boş kapasitesi ve teslim noktalarının rotaya uzaklığı belirleyicidir.'},
  {question:'Hacimli eşyayı nasıl ölçmeliyim?',answer:'En, boy ve yüksekliği santimetre cinsinden ölç. Hacim ağırlığı için çarpımı 3000’e böl: 60 × 40 × 40 cm bir koli 32 desi eder.'},
 ],
 sources:[SRC.karayolu,SRC.uab],
 },
 {slug:'desi-nedir-nasil-hesaplanir',seoKey:'blog_desi_hesaplama',eyebrow:'Gönderici rehberi',title:'Desi nedir, nasıl hesaplanır?',metaTitle:'Desi nedir, nasıl hesaplanır? Örneklerle',cluster:'gonderici',summary:'Desi (hacim ağırlığı), gönderinin kapladığı yeri ağırlık cinsinden ifade eder. Formül ve örnek hesaplar.',description:'Desi nedir, nasıl hesaplanır? En × boy × yükseklik ÷ 3000 formülü, örnek koli hesapları ve taşıyıcıyla görüşürken desi bilgisinin önemi.',publishedAt:newPublishedAt,updatedAt,categoryLabel:'Gönderici rehberi',canonicalPath:'/blog/desi-nedir-nasil-hesaplanir',
  keyFacts:['Desi = en (cm) × boy (cm) × yükseklik (cm) ÷ 3000.','Taşımada genellikle desi ile gerçek ağırlıktan büyük olanı dikkate alınır.','1 desi yaklaşık 1 kg hacim ağırlığına karşılık gelir.'],
  sections:[
  {title:'Desi nedir?',paragraphs:['Desi, bir gönderinin araçta kapladığı hacmi ağırlık birimiyle ifade eden ölçüdür. Hafif ama büyük bir koli, ağır ama küçük bir koliden daha fazla yer kaplar; desi bu farkı hesaba katar. Türkiye’de kargo ve taşımacılıkta yaygın kullanılan formül, santimetre cinsinden en, boy ve yüksekliğin çarpımının 3000’e bölünmesidir.']},
  {title:'Desi nasıl hesaplanır? Örnek koliler',paragraphs:['Ölçüleri dış yüzeyden, en geniş noktadan al ve yukarı yuvarla. Aşağıdaki tablo formülün farklı koli boyutlarına uygulanmış halidir.'],table:[['Koli ölçüsü (cm)','Hacim (cm³)','Desi'],['30 × 20 × 15','9.000','3'],['50 × 40 × 30','60.000','20'],['60 × 40 × 40','96.000','32'],['80 × 60 × 50','240.000','80'],['120 × 80 × 60','576.000','192']]},
  {title:'Desi mi, gerçek ağırlık mı?',paragraphs:['Taşımada genellikle desi ile kilogram cinsinden gerçek ağırlıktan büyük olanı esas alınır. 20 desilik ama 8 kg gelen bir koli için hacim belirleyicidir; 5 desilik ama 25 kg gelen bir koli için ağırlık belirleyicidir.','P2P taşımada sabit bir desi tarifesi yoktur; ancak taşıyıcıya desi ve ağırlığı birlikte söylemek, aracında yer olup olmadığını hızlıca değerlendirmesini sağlar.']},
 ],
 faqs:[
  {question:'Desi hesabında hangi ölçü kullanılır?',answer:'Santimetre cinsinden en, boy ve yükseklik. Çarpım 3000’e bölünür ve sonuç desi olarak ifade edilir.'},
  {question:'Yuvarlak veya düzensiz eşyada desi nasıl hesaplanır?',answer:'Eşyayı içine alan en küçük kutunun ölçüleri kullanılır; en geniş noktalardan ölçüm alınır.'},
 ],
 sources:[SRC.karayolu],
 },
 {slug:'tasiyiciyla-gorusurken-sorulacak-sorular',seoKey:'blog_tasiyici_sorulari',eyebrow:'Gönderici rehberi',title:'Taşıyıcıyla görüşürken sorulacak sorular',metaTitle:'Taşıyıcıyla görüşürken sorulacak 10 soru',cluster:'gonderici',summary:'İletişim bilgisine eriştikten sonra taşıyıcıyla anlaşmayı netleştirmek için sorulacak sorular.',description:'Taşıyıcıyla görüşürken sorulacak 10 soru: kimlik ve araç bilgisi, teslim noktası, zamanlama, ücret, ödeme anı ve teslim kanıtı gibi konuları netleştir.',publishedAt:newPublishedAt,updatedAt,categoryLabel:'Gönderici rehberi',canonicalPath:'/blog/tasiyiciyla-gorusurken-sorulacak-sorular',
  keyFacts:['Anlaşmayı mesajla yazılı hale getir.','Teslim ve alım anında fotoğraf kaydı al.','Taşımacılık faaliyeti için gerekli belgeler taşıyıcının sorumluluğundadır.'],
  sections:[
  {title:'Taşıyıcıyla görüşürken netleştirilecek 10 soru',paragraphs:['İletişim bilgilerine eriştikten sonraki ilk görüşme, anlaşmanın sağlıklı ilerlemesi için en önemli adımdır. Aşağıdaki soruları sorup cevapları mesajla teyit etmen önerilir.'],list:['Adınız, aracın plakası ve modeli nedir?','Kalkış saati ve varış için tahmini süre nedir?','Gönderiyi hangi noktadan teslim alabilirsiniz?','Varışta teslim noktası ve alıcı bilgisi nasıl olacak?','Ölçü ve ağırlığı söylediğim gönderi aracınıza sığar mı?','Taşıma ücreti ne kadar, neyi kapsıyor?','Ödeme ne zaman ve hangi yolla yapılacak?','Teslim alırken ve teslim ederken fotoğraf paylaşır mısınız?','Yolda gecikme olursa nasıl haber vereceksiniz?','Ticari taşımacılık için gerekli yetki belgeleriniz ve sigortanız var mı?']},
  {title:'Ödeme anını dikkatle belirle',paragraphs:['Taşıma ücretinin ödeme zamanı (teslim alımda, teslimde ya da ikiye bölünmüş) taraflar arasında kararlaştırılır. Platform taşıma ücretine aracılık etmez ve emanet ödeme sunmaz. Ödemeyi yaptığın kişinin ilandaki taşıyıcı olduğundan emin ol.']},
  {title:'Şüpheli durumlar',paragraphs:['Taşıyıcı ilandan farklı bir kişiye ödeme isterse, gönderinin içeriğini değiştirmeni veya yasaklı bir ürünü taşımayı teklif ederse görüşmeyi sonlandır ve destek ekibine bildir.']},
 ],
 faqs:[
  {question:'Taşıyıcının belgelerini sormak gerekli mi?',answer:'Ticari taşımacılıkta yetki belgeleri ve sigorta taşıyıcının yükümlülüğüdür; sormak, anlaşmanın şeffaf olmasını sağlar.'},
  {question:'Anlaşmayı nasıl kayıt altına alırım?',answer:'Ücret, teslim noktası ve saati mesajla yazılı olarak teyit et; teslim anlarında fotoğraf çek.'},
 ],
 sources:[SRC.karayolu,SRC.uab],
 },
 {slug:'tasiyici-ilan-verme-rehberi',seoKey:'blog_tasiyici_ilan_rehberi',eyebrow:'Taşıyıcı rehberi',title:'Taşıyıcı ilanı verme rehberi',metaTitle:'Taşıyıcı ilanı verme: boş kapasiteyi değerlendir',cluster:'tasiyici',summary:'Aracındaki boş kapasiteyi etkili bir ilana dönüştürmek için doldurulacak alanlar ve öneriler.',description:'Taşıyıcı ilanı verme rehberi: rota ve tarih, kapasite (kg), araç tipi, fiyat ve açıklama alanlarını doğru doldurarak boş kapasiteni göndericilere ulaştır.',publishedAt:newPublishedAt,updatedAt,categoryLabel:'Taşıyıcı rehberi',canonicalPath:'/blog/tasiyici-ilan-verme-rehberi',
  keyFacts:['İlan vermek ücretsizdir.','Kapasite 0–50.000 kg, fiyat kg başına girilebilir.','Yeni ve düzenlenen ilanlar yayına girmeden önce incelenir.'],
  sections:[
  {title:'Taşıyıcı ilanı neden işe yarar?',paragraphs:['Zaten yapacağın bir yolculukta aracındaki boş alan, aynı yöne gönderisi olan biri için çözüm olabilir. İlan, göndericilerin seni rota ve tarihe göre bulmasını sağlar; iletişim bilgilerin yalnız erişim alan kullanıcıya açılır.']},
  {title:'Taşıyıcı ilanında doldurulacak alanlar',paragraphs:['Göndericiler ilanı bu alanlara göre filtreler; eksik veya belirsiz bilgi ilanın görünürlüğünü ve güvenilirliğini düşürür.'],table:[['Alan','Öneri'],['Rota','Çıkış ve varış şehri; uğrayabileceğin ilçeleri açıklamaya yaz'],['Tarih','Hareket ve tahmini varış tarihi'],['Kapasite','Kilogram cinsinden boş kapasite (0–50.000 kg)'],['Araç tipi','Otomobil, kamyonet, kamyon, motosiklet veya diğer'],['Fiyat','Kg başına fiyat veya pazarlığa açık'],['Açıklama','Kabul etmediğin gönderiler, teslim esnekliği']]},
  {title:'İnceleme ve yayın',paragraphs:['Gönderdiğin ilan incelemeden sonra yayına girer. İlanlarım ekranından durumunu izleyebilir, düzenleyebilir veya durdurabilirsin. Düzenli seferleri olan firmalar ilanlarını Partner API ile kendi sistemlerinden otomatik oluşturabilir.']},
  {title:'Yasal sorumluluklar',paragraphs:['Ticari eşya taşımacılığı yapan taşıyıcılar, mevzuatın gerektirdiği yetki belgelerine, sürücü belgesine ve sigortalara sahip olmakla yükümlüdür. Yasaklı maddeleri taşımak kesinlikle yasaktır.']},
 ],
 faqs:[
  {question:'Taşıyıcı ilanı vermek ücretli mi?',answer:'Hayır. İlan vermek ücretsizdir; ücret, ilanın iletişim bilgilerine erişmek isteyen gönderici tarafından ödenir.'},
  {question:'İlanımı birden fazla sefer için kullanabilir miyim?',answer:'Her sefer için ayrı ilan oluşturman önerilir; tarih ve kapasite bilgisi doğru kalır. Firmalar bunu API ile otomatikleştirebilir.'},
 ],
 sources:[SRC.karayolu,SRC.uab],
 },
];

/** Güzergâh rehberleri: yaklaşık karayolu mesafesi, kullanılan güzergâha göre değişir. */
const ROUTES:[string,string,string,number][]=[
 ['istanbul-ankara','İstanbul','Ankara',450],
 ['istanbul-izmir','İstanbul','İzmir',480],
 ['istanbul-bursa','İstanbul','Bursa',155],
 ['ankara-izmir','Ankara','İzmir',590],
 ['istanbul-antalya','İstanbul','Antalya',710],
 ['ankara-konya','Ankara','Konya',260],
];
export const ROUTE_GUIDES:ArticleContent[]=ROUTES.map(([slug,from,to,km])=>({
 slug,seoKey:`rota_${slug.replaceAll('-','_')}`,eyebrow:'Güzergâh rehberi',title:`${from} – ${to}`,metaTitle:`${from} ${to} taşıyıcı ilanları ve rehber`.slice(0,49),cluster:'guzergah',summary:`${from} ile ${to} arasındaki taşıyıcı ilanlarını değerlendirirken dikkat edilecekler. Yaklaşık karayolu mesafesi ${km} km.`,description:`${from} ${to} taşıyıcı ilanlarını ara, iletişim bilgilerine eriş ve doğrudan görüş. Yaklaşık ${km} km'lik güzergâhta gönderi öncesi dikkat edilecekler.`,publishedAt:['istanbul-ankara','istanbul-izmir'].includes(slug)?publishedAt:newPublishedAt,updatedAt,categoryLabel:'Güzergâh',canonicalPath:`/rota/${slug}`,
 keyFacts:[`Yaklaşık karayolu mesafesi: ${km} km (güzergâha göre değişir).`,'Kesin buluşma noktası taşıyıcıyla görüşülerek belirlenir.','İletişim erişim bedeli taşıma ücretinden ayrıdır.'],
 sections:[
  {title:`${from} – ${to} güncel taşıyıcı ilanlarını kontrol et`,paragraphs:[`${from} çıkışlı ve ${to} varışlı ilanları arama ekranında filtreleyebilirsin. Kalkış tarihini kontrol et; bu rehber rotada sürekli veya belirli sayıda ilan bulunduğu anlamına gelmez.`,'Şehir bilgisi tek başına teslim noktasını belirlemez. İlçe, buluşma noktası ve taşıyıcının rotadan sapıp sapamayacağı gibi ayrıntıları doğrudan görüşmede netleştir.']},
  {title:'Gönderini açıkça tarif et',paragraphs:[`Yaklaşık ${km} km’lik bir yolculukta gönderinin içeriği, ölçüsü, ağırlığı ve paketleme durumu taşıyıcının kabul kararını etkiler. Ölçüleri santimetre, ağırlığı kilogram olarak paylaş; hacimli gönderilerde desi bilgisini ekle. Taşıma kurallarındaki sınırlamaları dikkate al.`]},
  {title:'İletişim bedeli ile taşıma bedeli ayrıdır',paragraphs:['Platformda satın aldığın şey ilanın iletişim bilgilerine erişimdir. Taşıma ücreti ve teslim koşulları gönderici ile taşıyıcı arasında belirlenir. Platform üzerinden taşıma rezervasyonu veya teslim garantisi verilmez.']},
 ],
 faqs:[
  {question:`${from} – ${to} arası kaç km?`,answer:`Karayoluyla yaklaşık ${km} km’dir; kullanılan güzergâha ve teslim noktalarına göre değişir.`},
  {question:`${from} – ${to} taşıma ücreti ne kadar?`,answer:'P2P taşımada ücret taşıyıcı ile birlikte belirlenir; mesafe, ölçü, ağırlık ve teslim noktaları belirleyicidir.'},
 ],
 sources:[SRC.karayolu],
}));

export const ALL_GUIDES=[...BLOG_POSTS,...ROUTE_GUIDES];
export const getBlogPostBySlug=(slug:string)=>BLOG_POSTS.find(post=>post.slug===slug);
export const getRouteGuideBySlug=(slug:string)=>ROUTE_GUIDES.find(post=>post.slug===slug);
/** Önce aynı konu kümesi, sonra diğerleri. */
export const relatedGuides=(item:ArticleContent,limit=6)=>[...ALL_GUIDES.filter(x=>x.slug!==item.slug&&x.cluster===item.cluster),...ALL_GUIDES.filter(x=>x.slug!==item.slug&&x.cluster!==item.cluster)].slice(0,limit);
export const readingMinutes=(item:ArticleContent)=>Math.max(2,Math.round(item.sections.reduce((n,s)=>n+s.paragraphs.join(' ').split(/\s+/).length+(s.list??[]).join(' ').split(/\s+/).length,0)/200));
