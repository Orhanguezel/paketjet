-- =============================================================
-- FILE: src/db/seed/sql/042_legal_pages_content.sql
-- Legal sayfa icerikleri (sozlesme/*.md -> customPages, hardcode degil).
-- Kaynak: sozlesme/KULLANICI-SOZLESMESI-SON.md (Kullanici Sozlesmesi + KVKK Aydinlatma)
-- Admin panelden duzenlenebilir; bu seed yalnizca varsayilan icerigi yukler.
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

UPDATE custom_pages_i18n SET content = '<h1
id="www.paketjet.com-kullanici-sözleşmesi-ve-kvkk-aydinlatma-metni">www.paketjet.com
KULLANICI SÖZLEŞMESİ VE KVKK AYDINLATMA METNİ</h1>
<h2 id="taraflar-tanimlar-ve-platformun-hukuki-rolü">1. TARAFLAR,
TANIMLAR VE PLATFORMUN HUKUKİ ROLÜ</h2>
<p><strong>1.1. Taraflar:</strong> İşbu Kullanıcı Sözleşmesi (Bundan
sonra “Sözleşme” olarak anılacaktır), <strong>www.paketjet.com</strong>
internet sitesinin ve mobil uygulamalarının (Bundan sonra “Platform”
olarak anılacaktır) sahibi olan şirket ile Platform’u üye olmak, ilan
vermek, ilan kabul etmek, ziyaret etmek veya her ne amaçla olursa olsun
kullanmak suretiyle bizzat erişen gerçek veya tüzel kişi
“<strong>Kullanıcı</strong>” (Gönderi Sahibi/Gönderici,
Taşıyıcı/Kurye/Nakliyeci, Alıcı vb. olarak anılacaktır) arasında
akdedilmiştir.</p>
<p><strong>1.2. Teknoloji Aracılığı ve Pazar Yeri Rolü:</strong>
Platform; gönderi sahipleri (Gönderici) ile bağımsız taşımacılık hizmeti
sunan kişileri (Taşıyıcı) dijital ortamda bir araya getiren, ilan
yayınlanmasına imkan tanıyan bağımsız bir teknoloji altyapısı ve
elektronik pazar yeridir. Platform; taşıma, lojistik, kurye veya kargo
faaliyetinin hiçbir aşamasında yer alan bir taraf, acente, komisyoncu,
iş ortağı, işveren, taşeron veya çalışan sıfatına sahip değildir.</p>
<h2
id="yer-sağlayici-beyani-ve-sözleşmesel-ilişkinin-reddi-kusursuzluk">2.
YER SAĞLAYICI BEYANI VE SÖZLEŞMESEL İLİŞKİNİN REDDİ (KUSURSUZLUK)</h2>
<p><strong>2.1. Yer Sağlayıcı Statüsü:</strong> Platform, 5651 sayılı
Kanun uyarınca münhasıran bir “<strong>Yer Sağlayıcı</strong>”dır.
Kullanıcıların Platform üzerinde bağımsız olarak paylaştığı ilanların,
mesajların, görsellerin, fiyat tekliflerinin veya verilerin doğruluğunu,
hukuka uygunluğunu, güvenliğini veya güvenilirliğini kontrol etme,
araştırma veya garanti etme yükümlülüğü ve sorumluluğu
bulunmamaktadır.</p>
<p><strong>2.2. Sözleşmesel İlişkinin Reddi:</strong> Platform üzerinde
yayınlanan ilanlar veya içerikler, Türk Borçlar Kanunu (TBK) anlamında
Platform tarafından yapılmış bir “icap” (teklif) veya “kabul” olarak
nitelendirilemez. Taşımacılık faaliyetinden doğan tüm sözleşmesel
borçlar, edimler ve hukuki ilişkiler (TBK’nın eser, vekalet ve
taşımacılık hükümleri uyarınca) münhasıran ilanı veren Gönderici ile işi
kabul eden Taşıyıcı arasında doğrudan kurulur.</p>
<p><strong>2.3. Platform’un Mutlak Kusursuzluğu ve Bağışıklığı:</strong>
Platform; taraflar arasındaki bu hukuki ve ticari ilişkide hiçbir
kusura, ihmale, taahhüde veya müteselsil sorumluluğa sahip değildir.
Türk Borçlar Kanunu’nun haksız fiil, sözleşmeye aykırılık veya kusursuz
sorumluluk hallerine ilişkin hiçbir hükmü Platform’a teşmil edilemez ve
Platform’a karşı ileri sürülemez. Platform, hizmetin kesintisizliği,
hatasızlığı veya ilan edilen taşıma işinin başarıyla tamamlanacağı
konusunda hiçbir garanti vermez. Taraflar arasındaki her türlü
anlaşmazlık, ödeme ihtilafı ve uyuşmazlıklarda Platform hiçbir şekilde
taraf veya muhatap değildir.</p>
<h2 id="yasakli-maddeler-taşima-engelleri-ve-adli-bildirim-yetkisi">3.
YASAKLI MADDELER, TAŞIMA ENGELLERİ VE ADLİ BİLDİRİM YETKİSİ</h2>
<p><strong>3.1. Kesin Yasaklı Maddeler:</strong> Uyuşturucu ve uyarıcı
maddeler, ateşli silahlar, mühimmat, patlayıcı, yanıcı, parlayıcı veya
radyoaktif kimyasallar, kaçak ve bandrolsüz ürünler, tütün ve alkol
ürünleri, nakit para, döviz, ziynet eşyası, kıymetli evrak ve taşınması
yürürlükteki mevzuat ve karayolları kanunlarınca yasaklanmış her türlü
tehlikeli, illegal nesnenin Platform üzerinden ilanının verilmesi,
taşınması veya taşınmasına yeltenilmesi kesinlikle yasaktır.</p>
<p><strong>3.2. Tam Sorumluluk Beyanı:</strong> Yasaklı madde trafiğine
doğrudan veya dolaylı olarak karışan, bu maddeleri taşımaya veren,
taşıyan veya taşınmasına yeltenen kullanıcılar, doğacak tüm cezai,
hukuki ve idari sonuçlardan münhasıran ve şahsen sorumludur.</p>
<p><strong>3.3. Adli İşbirliği ve İhbar Yetkisi:</strong> Şüpheli veya
yasadışı durumlarda, yasaklı madde taşıma teşebbüslerinde Platform;
taraflar arasındaki herhangi bir gizlilik kuralına veya mahkeme kararına
bağlı kalmaksızın, suçu önlemek adına kullanıcı bilgilerini (IP adresi,
Konum, Kimlik Bilgileri, Mesajlaşma Dökümleri) derhal ve re’sen ilgili
emniyet birimlerine ve adli makamlara bildirme yetkisine sahiptir.</p>
<h2 id="ticari-mali-ve-vergisel-yükümlülükler">4. TİCARİ, MALİ VE
VERGİSEL YÜKÜMLÜLÜKLER</h2>
<p><strong>4.1. Mali ve Vergisel Sorumluluk:</strong> Platform üzerinden
gerçekleştirilen her türlü taşıma, gönderim ve ticari faaliyetten doğan
Katma Değer Vergisi (KDV), Gelir Vergisi, Damga Vergisi, Stopaj, resim,
harç ve benzeri tüm mali yükümlülükler münhasıran Kullanıcıların
sorumluluğundadır. Platform, taraflar arasındaki kazançlara ilişkin
vergi danışmanlığı yapmaz ve mali sorumluluk üstlenmez.</p>
<p><strong>4.2. Yasal Belgeler ve Mesleki Yeterlilik:</strong> Taşıma
faaliyetinde bulunan Kullanıcılar; yasal olarak taşımacılık yapabilmek
için gerekli olan K1, K2, K3 Yetki Belgelerine, SRC belgelerine, geçerli
sürücü belgesine (ehliyet), zorunlu trafik ve yük sigortalarına sahip
olduklarını ve araç muayenelerinin tam olduğunu taahhüt ederler. Eksik,
süresi geçmiş veya sahte belgeden doğacak idari para cezalarından ve
hukuki yaptırımlardan Platform sorumlu tutulamaz.</p>
<p><strong>4.3. Fatura ve İrsaliye Düzenleme:</strong> Kullanıcılar,
kendi aralarındaki ticari ve lojistik işlemin yasal mevzuata uygun
faturasını, sevk irsaliyesini veya taşıma belgesini düzenlemekle bizzat
yükümlüdür.</p>
<h2 id="hasar-kayip-ürün-beyani-ve-tazminat-şartlari">5. HASAR, KAYIP,
ÜRÜN BEYANI VE TAZMİNAT ŞARTLARI</h2>
<p><strong>5.1. Risk Devri ve Sorumluluk Süresi:</strong> Gönderi;
Taşıyıcı tarafından teslim alındığı andan itibaren, varış noktasında
Alıcıya güvenle teslim edildiği ana kadar geçen süreçteki her türlü risk
(zayi, kayıp, hasar, deformasyon, gecikme) münhasıran Taşıyıcı
Kullanıcı’ya geçer.</p>
<p><strong>5.2. Ürün Değeri Beyan Zorunluluğu:</strong> Gönderici,
Platform üzerinde ilan oluştururken taşınacak ürünün yaklaşık piyasa
değerini dürüstlük kuralına uygun olarak beyan etmekle yükümlüdür. Olası
bir tazminat durumunda, aksi somut delillerle ispat edilmedikçe, bu
beyan tavan sınır kabul edilir. Yanlış veya fahiş değer beyanlarından
doğan uyuşmazlıklarda Platform sorumlu değildir.</p>
<p><strong>5.3. Kanıt Mekanizması ve Fotoğraf Yükleme
Zorunluluğu:</strong> Taşıyıcı, paketi teslim ederken sistem üzerinden
“<strong>Teslimat Anı Fotoğrafı</strong>” yüklemek veya Alıcıdan alacağı
“<strong>Dijital Teslimat Kodu</strong>”nu sisteme girmek zorundadır.
Paketin kaybedilmesi veya zarar görmesi durumunda Taşıyıcı; hasarın
kendisinden kaynaklanmadığını Platform sistemine yüklenecek somut ve
hukuken geçerli delillerle (teslimat anı fotoğrafı, video, teslimat
tutanağı) ispat edemediği sürece, ürün bedelini ve doğacak zararı hak
sahibine ödemeyi peşinen kabul ve taahhüt eder.</p>
<p><strong>5.4. Platformun Tazminat Bağışıklığı:</strong> Platform;
hiçbir hasar, kayıp, hırsızlık veya zayi olayında bir ödeme merci,
tazminat sorumlusu, garanti sağlayıcı veya sigorta şirketi değildir.
Platform yalnızca adli süreçlere esas teşkil etmek üzere veri tabanı
kayıtlarını yetkili makamlarla paylaşır.</p>
<h2 id="hizmet-disiplini-sistem-kurallari-ve-üyelik-iptali">6. HİZMET
DİSİPLİNİ, SİSTEM KURALLARI VE ÜYELİK İPTALİ</h2>
<p><strong>6.1. Taahhüt İhlali ve Hesap Silme:</strong> Platform
üzerinden bir ilanı veya taşıma işini makul ve mücbir bir sebep
olmaksızın yerine getirmeyen, işi yarıda bırakan, haksız iptal eden veya
ilan şartlarına aykırı davranarak diğer kullanıcıları mağdur eden
Kullanıcıların hesapları, Platform tarafından hiçbir ihbara veya
bildirime gerek kalmaksızın tek taraflı olarak askıya alınabilir veya
tamamen silinebilir.</p>
<p><strong>6.2. Hizmet Bedeli İade Politikası:</strong> Kullanıcıların
kendi kusurları, ihmalleri veya Sözleşme ihlalleri nedeniyle iptal
edilen/tamamlanamayan işlemlerde, Platform’un tahsil ettiği hizmet veya
aracılık bedelleri kesinlikle iade edilmez.</p>
<h2 id="kvkk-aydinlatma-ve-gizlilik-hükümleri">7. KVKK AYDINLATMA VE
GİZLİLİK HÜKÜMLERİ</h2>
<p><strong>7.1. Veri İşleme Amaç ve Esasları:</strong> Kullanıcılara ait
kişisel veriler (Ad-soyad, telefon, e-posta, anlık konum, IP adresi ve
cihaz logları); 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
kapsamında, münhasıran Platform hizmetlerinin ifası, tarafların
eşleştirilmesi, güvenliğin sağlanması ve yasal zorunlulukların yerine
getirilmesi amacıyla işlenmektedir.</p>
<p><strong>7.2. Veri Aktarımı:</strong> Kullanıcı verileri; kamu
güvenliği, vergi mevzuatı veya adli/idari soruşturmalar kapsamında
yetkili resmi kurum ve kuruluşlardan (Savcılık, Emniyet, Mahkemeler,
Maliye) gelen yasal talepler doğrultusunda mevzuata uygun olarak
paylaşılabilecektir.</p>
<h2 id="hmk-uyarinca-delil-sözleşmesi">8. HMK UYARINCA DELİL
SÖZLEŞMESİ</h2>
<p><strong>8.1. Kesin ve Münhasır Delil Şartı:</strong> Kullanıcı,
Platform’un kullanımı ile ilgili olarak doğabilecek her türlü
uyuşmazlıkta, Platform’un kendi veri tabanında, sunucularında tuttuğu
sistem kayıtlarının, log kayıtlarının, dijital teslimat verilerinin,
mesajlaşma geçmişinin ve sistem dökümlerinin, 6100 sayılı Hukuk
Muhakemeleri Kanunu (HMK) m. 193 uyarınca “<strong>Kesin ve Münhasır
Delil</strong>” niteliğinde olduğunu, bunlara karşı her türlü itiraz ve
def’i haklarından peşinen feragat ettiğini kabul ve beyan eder.</p>
<h2 id="mücbir-sebepler-ve-diğer-şartlar">9. MÜCBİR SEBEPLER VE DİĞER
ŞARTLAR</h2>
<p><strong>9.1. Mücbir Sebep:</strong> Doğal afetler (deprem, sel vb.),
savaş, terör eylemleri, salgın hastalıklar, hükümet kısıtlamaları, genel
elektrik veya internet altyapı kesintileri gibi Platform’un kontrolü
dışında gelişen mücbir sebeplerden kaynaklanan gecikmelerden veya hizmet
kesintilerinden Platform sorumlu tutulamaz.</p>
<p><strong>9.2. Fikri Mülkiyet ve Görseller:</strong> İlanlarda
kullanılan her türlü görsel ve metnin telif haklarından ve hukuka
uygunluğundan doğrudan ilanı yükleyen Kullanıcı sorumludur. Üçüncü
kişilerin telif hakkı ihlali iddialarından doğacak zararlar Kullanıcı’ya
rücu edilir.</p>
<p><strong>9.3. Yaş Sınırı:</strong> Platform’a üye olmak ve sunulan
hizmetleri kullanabilmek için 18 yaşını doldurmuş (reşit) olmak
zorunludur.</p>
<h2 id="rücu-hakki-yürürlük-ve-kabul">10. RÜCU HAKKI, YÜRÜRLÜK VE
KABUL</h2>
<p><strong>10.1. Rücu Hakkı:</strong> Kullanıcının işbu Sözleşme
hükümlerini, vergi yükümlülüklerini veya yasal mevzuatı ihlal etmesi
(yasaklı madde taşıma, eksik belge vb.) nedeniyle Platform’un herhangi
bir idari para cezasına çarptırılması, tazminat ödemesi veya zarara
uğraması durumunda; ödenen tüm tutarlar, avukatlık ücretleri, faiz ve
tüm ferileriyle birlikte ihlali gerçekleştiren Kullanıcı’dan doğrudan
tahsil (rücu) edilir.</p>
<p><strong>10.2. Yürürlük ve Kesin Kabul:</strong> Kullanıcı,
<strong>www.paketjet.com</strong> adresine eriştiği, mobil uygulamaları
cihazına indirdiği, sisteme kayıt olduğu, ilan verdiği veya bir ilanı
kabul ettiği andan itibaren işbu Sözleşme’nin tüm maddelerini hiçbir
itirazı olmaksızın okuduğunu, anladığını, mali ve cezai sorumlulukların
tamamen kendisine ait olduğunu bilerek peşinen kabul, beyan ve taahhüt
etmiş sayılır.</p>
' WHERE slug = 'kullanim-kosullari' AND locale = 'tr';

UPDATE custom_pages_i18n SET content = '<h1
id="www.paketjet.com-kullanici-sözleşmesi-ve-kvkk-aydinlatma-metni">www.paketjet.com
KULLANICI SÖZLEŞMESİ VE KVKK AYDINLATMA METNİ</h1>
<h2 id="taraflar-tanimlar-ve-platformun-hukuki-rolü">1. TARAFLAR,
TANIMLAR VE PLATFORMUN HUKUKİ ROLÜ</h2>
<p><strong>1.1. Taraflar:</strong> İşbu Kullanıcı Sözleşmesi (Bundan
sonra “Sözleşme” olarak anılacaktır), <strong>www.paketjet.com</strong>
internet sitesinin ve mobil uygulamalarının (Bundan sonra “Platform”
olarak anılacaktır) sahibi olan şirket ile Platform’u üye olmak, ilan
vermek, ilan kabul etmek, ziyaret etmek veya her ne amaçla olursa olsun
kullanmak suretiyle bizzat erişen gerçek veya tüzel kişi
“<strong>Kullanıcı</strong>” (Gönderi Sahibi/Gönderici,
Taşıyıcı/Kurye/Nakliyeci, Alıcı vb. olarak anılacaktır) arasında
akdedilmiştir.</p>
<p><strong>1.2. Teknoloji Aracılığı ve Pazar Yeri Rolü:</strong>
Platform; gönderi sahipleri (Gönderici) ile bağımsız taşımacılık hizmeti
sunan kişileri (Taşıyıcı) dijital ortamda bir araya getiren, ilan
yayınlanmasına imkan tanıyan bağımsız bir teknoloji altyapısı ve
elektronik pazar yeridir. Platform; taşıma, lojistik, kurye veya kargo
faaliyetinin hiçbir aşamasında yer alan bir taraf, acente, komisyoncu,
iş ortağı, işveren, taşeron veya çalışan sıfatına sahip değildir.</p>
<h2
id="yer-sağlayici-beyani-ve-sözleşmesel-ilişkinin-reddi-kusursuzluk">2.
YER SAĞLAYICI BEYANI VE SÖZLEŞMESEL İLİŞKİNİN REDDİ (KUSURSUZLUK)</h2>
<p><strong>2.1. Yer Sağlayıcı Statüsü:</strong> Platform, 5651 sayılı
Kanun uyarınca münhasıran bir “<strong>Yer Sağlayıcı</strong>”dır.
Kullanıcıların Platform üzerinde bağımsız olarak paylaştığı ilanların,
mesajların, görsellerin, fiyat tekliflerinin veya verilerin doğruluğunu,
hukuka uygunluğunu, güvenliğini veya güvenilirliğini kontrol etme,
araştırma veya garanti etme yükümlülüğü ve sorumluluğu
bulunmamaktadır.</p>
<p><strong>2.2. Sözleşmesel İlişkinin Reddi:</strong> Platform üzerinde
yayınlanan ilanlar veya içerikler, Türk Borçlar Kanunu (TBK) anlamında
Platform tarafından yapılmış bir “icap” (teklif) veya “kabul” olarak
nitelendirilemez. Taşımacılık faaliyetinden doğan tüm sözleşmesel
borçlar, edimler ve hukuki ilişkiler (TBK’nın eser, vekalet ve
taşımacılık hükümleri uyarınca) münhasıran ilanı veren Gönderici ile işi
kabul eden Taşıyıcı arasında doğrudan kurulur.</p>
<p><strong>2.3. Platform’un Mutlak Kusursuzluğu ve Bağışıklığı:</strong>
Platform; taraflar arasındaki bu hukuki ve ticari ilişkide hiçbir
kusura, ihmale, taahhüde veya müteselsil sorumluluğa sahip değildir.
Türk Borçlar Kanunu’nun haksız fiil, sözleşmeye aykırılık veya kusursuz
sorumluluk hallerine ilişkin hiçbir hükmü Platform’a teşmil edilemez ve
Platform’a karşı ileri sürülemez. Platform, hizmetin kesintisizliği,
hatasızlığı veya ilan edilen taşıma işinin başarıyla tamamlanacağı
konusunda hiçbir garanti vermez. Taraflar arasındaki her türlü
anlaşmazlık, ödeme ihtilafı ve uyuşmazlıklarda Platform hiçbir şekilde
taraf veya muhatap değildir.</p>
<h2 id="yasakli-maddeler-taşima-engelleri-ve-adli-bildirim-yetkisi">3.
YASAKLI MADDELER, TAŞIMA ENGELLERİ VE ADLİ BİLDİRİM YETKİSİ</h2>
<p><strong>3.1. Kesin Yasaklı Maddeler:</strong> Uyuşturucu ve uyarıcı
maddeler, ateşli silahlar, mühimmat, patlayıcı, yanıcı, parlayıcı veya
radyoaktif kimyasallar, kaçak ve bandrolsüz ürünler, tütün ve alkol
ürünleri, nakit para, döviz, ziynet eşyası, kıymetli evrak ve taşınması
yürürlükteki mevzuat ve karayolları kanunlarınca yasaklanmış her türlü
tehlikeli, illegal nesnenin Platform üzerinden ilanının verilmesi,
taşınması veya taşınmasına yeltenilmesi kesinlikle yasaktır.</p>
<p><strong>3.2. Tam Sorumluluk Beyanı:</strong> Yasaklı madde trafiğine
doğrudan veya dolaylı olarak karışan, bu maddeleri taşımaya veren,
taşıyan veya taşınmasına yeltenen kullanıcılar, doğacak tüm cezai,
hukuki ve idari sonuçlardan münhasıran ve şahsen sorumludur.</p>
<p><strong>3.3. Adli İşbirliği ve İhbar Yetkisi:</strong> Şüpheli veya
yasadışı durumlarda, yasaklı madde taşıma teşebbüslerinde Platform;
taraflar arasındaki herhangi bir gizlilik kuralına veya mahkeme kararına
bağlı kalmaksızın, suçu önlemek adına kullanıcı bilgilerini (IP adresi,
Konum, Kimlik Bilgileri, Mesajlaşma Dökümleri) derhal ve re’sen ilgili
emniyet birimlerine ve adli makamlara bildirme yetkisine sahiptir.</p>
<h2 id="ticari-mali-ve-vergisel-yükümlülükler">4. TİCARİ, MALİ VE
VERGİSEL YÜKÜMLÜLÜKLER</h2>
<p><strong>4.1. Mali ve Vergisel Sorumluluk:</strong> Platform üzerinden
gerçekleştirilen her türlü taşıma, gönderim ve ticari faaliyetten doğan
Katma Değer Vergisi (KDV), Gelir Vergisi, Damga Vergisi, Stopaj, resim,
harç ve benzeri tüm mali yükümlülükler münhasıran Kullanıcıların
sorumluluğundadır. Platform, taraflar arasındaki kazançlara ilişkin
vergi danışmanlığı yapmaz ve mali sorumluluk üstlenmez.</p>
<p><strong>4.2. Yasal Belgeler ve Mesleki Yeterlilik:</strong> Taşıma
faaliyetinde bulunan Kullanıcılar; yasal olarak taşımacılık yapabilmek
için gerekli olan K1, K2, K3 Yetki Belgelerine, SRC belgelerine, geçerli
sürücü belgesine (ehliyet), zorunlu trafik ve yük sigortalarına sahip
olduklarını ve araç muayenelerinin tam olduğunu taahhüt ederler. Eksik,
süresi geçmiş veya sahte belgeden doğacak idari para cezalarından ve
hukuki yaptırımlardan Platform sorumlu tutulamaz.</p>
<p><strong>4.3. Fatura ve İrsaliye Düzenleme:</strong> Kullanıcılar,
kendi aralarındaki ticari ve lojistik işlemin yasal mevzuata uygun
faturasını, sevk irsaliyesini veya taşıma belgesini düzenlemekle bizzat
yükümlüdür.</p>
<h2 id="hasar-kayip-ürün-beyani-ve-tazminat-şartlari">5. HASAR, KAYIP,
ÜRÜN BEYANI VE TAZMİNAT ŞARTLARI</h2>
<p><strong>5.1. Risk Devri ve Sorumluluk Süresi:</strong> Gönderi;
Taşıyıcı tarafından teslim alındığı andan itibaren, varış noktasında
Alıcıya güvenle teslim edildiği ana kadar geçen süreçteki her türlü risk
(zayi, kayıp, hasar, deformasyon, gecikme) münhasıran Taşıyıcı
Kullanıcı’ya geçer.</p>
<p><strong>5.2. Ürün Değeri Beyan Zorunluluğu:</strong> Gönderici,
Platform üzerinde ilan oluştururken taşınacak ürünün yaklaşık piyasa
değerini dürüstlük kuralına uygun olarak beyan etmekle yükümlüdür. Olası
bir tazminat durumunda, aksi somut delillerle ispat edilmedikçe, bu
beyan tavan sınır kabul edilir. Yanlış veya fahiş değer beyanlarından
doğan uyuşmazlıklarda Platform sorumlu değildir.</p>
<p><strong>5.3. Kanıt Mekanizması ve Fotoğraf Yükleme
Zorunluluğu:</strong> Taşıyıcı, paketi teslim ederken sistem üzerinden
“<strong>Teslimat Anı Fotoğrafı</strong>” yüklemek veya Alıcıdan alacağı
“<strong>Dijital Teslimat Kodu</strong>”nu sisteme girmek zorundadır.
Paketin kaybedilmesi veya zarar görmesi durumunda Taşıyıcı; hasarın
kendisinden kaynaklanmadığını Platform sistemine yüklenecek somut ve
hukuken geçerli delillerle (teslimat anı fotoğrafı, video, teslimat
tutanağı) ispat edemediği sürece, ürün bedelini ve doğacak zararı hak
sahibine ödemeyi peşinen kabul ve taahhüt eder.</p>
<p><strong>5.4. Platformun Tazminat Bağışıklığı:</strong> Platform;
hiçbir hasar, kayıp, hırsızlık veya zayi olayında bir ödeme merci,
tazminat sorumlusu, garanti sağlayıcı veya sigorta şirketi değildir.
Platform yalnızca adli süreçlere esas teşkil etmek üzere veri tabanı
kayıtlarını yetkili makamlarla paylaşır.</p>
<h2 id="hizmet-disiplini-sistem-kurallari-ve-üyelik-iptali">6. HİZMET
DİSİPLİNİ, SİSTEM KURALLARI VE ÜYELİK İPTALİ</h2>
<p><strong>6.1. Taahhüt İhlali ve Hesap Silme:</strong> Platform
üzerinden bir ilanı veya taşıma işini makul ve mücbir bir sebep
olmaksızın yerine getirmeyen, işi yarıda bırakan, haksız iptal eden veya
ilan şartlarına aykırı davranarak diğer kullanıcıları mağdur eden
Kullanıcıların hesapları, Platform tarafından hiçbir ihbara veya
bildirime gerek kalmaksızın tek taraflı olarak askıya alınabilir veya
tamamen silinebilir.</p>
<p><strong>6.2. Hizmet Bedeli İade Politikası:</strong> Kullanıcıların
kendi kusurları, ihmalleri veya Sözleşme ihlalleri nedeniyle iptal
edilen/tamamlanamayan işlemlerde, Platform’un tahsil ettiği hizmet veya
aracılık bedelleri kesinlikle iade edilmez.</p>
<h2 id="kvkk-aydinlatma-ve-gizlilik-hükümleri">7. KVKK AYDINLATMA VE
GİZLİLİK HÜKÜMLERİ</h2>
<p><strong>7.1. Veri İşleme Amaç ve Esasları:</strong> Kullanıcılara ait
kişisel veriler (Ad-soyad, telefon, e-posta, anlık konum, IP adresi ve
cihaz logları); 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
kapsamında, münhasıran Platform hizmetlerinin ifası, tarafların
eşleştirilmesi, güvenliğin sağlanması ve yasal zorunlulukların yerine
getirilmesi amacıyla işlenmektedir.</p>
<p><strong>7.2. Veri Aktarımı:</strong> Kullanıcı verileri; kamu
güvenliği, vergi mevzuatı veya adli/idari soruşturmalar kapsamında
yetkili resmi kurum ve kuruluşlardan (Savcılık, Emniyet, Mahkemeler,
Maliye) gelen yasal talepler doğrultusunda mevzuata uygun olarak
paylaşılabilecektir.</p>
<h2 id="hmk-uyarinca-delil-sözleşmesi">8. HMK UYARINCA DELİL
SÖZLEŞMESİ</h2>
<p><strong>8.1. Kesin ve Münhasır Delil Şartı:</strong> Kullanıcı,
Platform’un kullanımı ile ilgili olarak doğabilecek her türlü
uyuşmazlıkta, Platform’un kendi veri tabanında, sunucularında tuttuğu
sistem kayıtlarının, log kayıtlarının, dijital teslimat verilerinin,
mesajlaşma geçmişinin ve sistem dökümlerinin, 6100 sayılı Hukuk
Muhakemeleri Kanunu (HMK) m. 193 uyarınca “<strong>Kesin ve Münhasır
Delil</strong>” niteliğinde olduğunu, bunlara karşı her türlü itiraz ve
def’i haklarından peşinen feragat ettiğini kabul ve beyan eder.</p>
<h2 id="mücbir-sebepler-ve-diğer-şartlar">9. MÜCBİR SEBEPLER VE DİĞER
ŞARTLAR</h2>
<p><strong>9.1. Mücbir Sebep:</strong> Doğal afetler (deprem, sel vb.),
savaş, terör eylemleri, salgın hastalıklar, hükümet kısıtlamaları, genel
elektrik veya internet altyapı kesintileri gibi Platform’un kontrolü
dışında gelişen mücbir sebeplerden kaynaklanan gecikmelerden veya hizmet
kesintilerinden Platform sorumlu tutulamaz.</p>
<p><strong>9.2. Fikri Mülkiyet ve Görseller:</strong> İlanlarda
kullanılan her türlü görsel ve metnin telif haklarından ve hukuka
uygunluğundan doğrudan ilanı yükleyen Kullanıcı sorumludur. Üçüncü
kişilerin telif hakkı ihlali iddialarından doğacak zararlar Kullanıcı’ya
rücu edilir.</p>
<p><strong>9.3. Yaş Sınırı:</strong> Platform’a üye olmak ve sunulan
hizmetleri kullanabilmek için 18 yaşını doldurmuş (reşit) olmak
zorunludur.</p>
<h2 id="rücu-hakki-yürürlük-ve-kabul">10. RÜCU HAKKI, YÜRÜRLÜK VE
KABUL</h2>
<p><strong>10.1. Rücu Hakkı:</strong> Kullanıcının işbu Sözleşme
hükümlerini, vergi yükümlülüklerini veya yasal mevzuatı ihlal etmesi
(yasaklı madde taşıma, eksik belge vb.) nedeniyle Platform’un herhangi
bir idari para cezasına çarptırılması, tazminat ödemesi veya zarara
uğraması durumunda; ödenen tüm tutarlar, avukatlık ücretleri, faiz ve
tüm ferileriyle birlikte ihlali gerçekleştiren Kullanıcı’dan doğrudan
tahsil (rücu) edilir.</p>
<p><strong>10.2. Yürürlük ve Kesin Kabul:</strong> Kullanıcı,
<strong>www.paketjet.com</strong> adresine eriştiği, mobil uygulamaları
cihazına indirdiği, sisteme kayıt olduğu, ilan verdiği veya bir ilanı
kabul ettiği andan itibaren işbu Sözleşme’nin tüm maddelerini hiçbir
itirazı olmaksızın okuduğunu, anladığını, mali ve cezai sorumlulukların
tamamen kendisine ait olduğunu bilerek peşinen kabul, beyan ve taahhüt
etmiş sayılır.</p>
' WHERE slug = 'kvkk' AND locale = 'tr';

UPDATE custom_pages_i18n SET content = '<h1
id="www.paketjet.com-kullanici-sözleşmesi-ve-kvkk-aydinlatma-metni">www.paketjet.com
KULLANICI SÖZLEŞMESİ VE KVKK AYDINLATMA METNİ</h1>
<h2 id="taraflar-tanimlar-ve-platformun-hukuki-rolü">1. TARAFLAR,
TANIMLAR VE PLATFORMUN HUKUKİ ROLÜ</h2>
<p><strong>1.1. Taraflar:</strong> İşbu Kullanıcı Sözleşmesi (Bundan
sonra “Sözleşme” olarak anılacaktır), <strong>www.paketjet.com</strong>
internet sitesinin ve mobil uygulamalarının (Bundan sonra “Platform”
olarak anılacaktır) sahibi olan şirket ile Platform’u üye olmak, ilan
vermek, ilan kabul etmek, ziyaret etmek veya her ne amaçla olursa olsun
kullanmak suretiyle bizzat erişen gerçek veya tüzel kişi
“<strong>Kullanıcı</strong>” (Gönderi Sahibi/Gönderici,
Taşıyıcı/Kurye/Nakliyeci, Alıcı vb. olarak anılacaktır) arasında
akdedilmiştir.</p>
<p><strong>1.2. Teknoloji Aracılığı ve Pazar Yeri Rolü:</strong>
Platform; gönderi sahipleri (Gönderici) ile bağımsız taşımacılık hizmeti
sunan kişileri (Taşıyıcı) dijital ortamda bir araya getiren, ilan
yayınlanmasına imkan tanıyan bağımsız bir teknoloji altyapısı ve
elektronik pazar yeridir. Platform; taşıma, lojistik, kurye veya kargo
faaliyetinin hiçbir aşamasında yer alan bir taraf, acente, komisyoncu,
iş ortağı, işveren, taşeron veya çalışan sıfatına sahip değildir.</p>
<h2
id="yer-sağlayici-beyani-ve-sözleşmesel-ilişkinin-reddi-kusursuzluk">2.
YER SAĞLAYICI BEYANI VE SÖZLEŞMESEL İLİŞKİNİN REDDİ (KUSURSUZLUK)</h2>
<p><strong>2.1. Yer Sağlayıcı Statüsü:</strong> Platform, 5651 sayılı
Kanun uyarınca münhasıran bir “<strong>Yer Sağlayıcı</strong>”dır.
Kullanıcıların Platform üzerinde bağımsız olarak paylaştığı ilanların,
mesajların, görsellerin, fiyat tekliflerinin veya verilerin doğruluğunu,
hukuka uygunluğunu, güvenliğini veya güvenilirliğini kontrol etme,
araştırma veya garanti etme yükümlülüğü ve sorumluluğu
bulunmamaktadır.</p>
<p><strong>2.2. Sözleşmesel İlişkinin Reddi:</strong> Platform üzerinde
yayınlanan ilanlar veya içerikler, Türk Borçlar Kanunu (TBK) anlamında
Platform tarafından yapılmış bir “icap” (teklif) veya “kabul” olarak
nitelendirilemez. Taşımacılık faaliyetinden doğan tüm sözleşmesel
borçlar, edimler ve hukuki ilişkiler (TBK’nın eser, vekalet ve
taşımacılık hükümleri uyarınca) münhasıran ilanı veren Gönderici ile işi
kabul eden Taşıyıcı arasında doğrudan kurulur.</p>
<p><strong>2.3. Platform’un Mutlak Kusursuzluğu ve Bağışıklığı:</strong>
Platform; taraflar arasındaki bu hukuki ve ticari ilişkide hiçbir
kusura, ihmale, taahhüde veya müteselsil sorumluluğa sahip değildir.
Türk Borçlar Kanunu’nun haksız fiil, sözleşmeye aykırılık veya kusursuz
sorumluluk hallerine ilişkin hiçbir hükmü Platform’a teşmil edilemez ve
Platform’a karşı ileri sürülemez. Platform, hizmetin kesintisizliği,
hatasızlığı veya ilan edilen taşıma işinin başarıyla tamamlanacağı
konusunda hiçbir garanti vermez. Taraflar arasındaki her türlü
anlaşmazlık, ödeme ihtilafı ve uyuşmazlıklarda Platform hiçbir şekilde
taraf veya muhatap değildir.</p>
<h2 id="yasakli-maddeler-taşima-engelleri-ve-adli-bildirim-yetkisi">3.
YASAKLI MADDELER, TAŞIMA ENGELLERİ VE ADLİ BİLDİRİM YETKİSİ</h2>
<p><strong>3.1. Kesin Yasaklı Maddeler:</strong> Uyuşturucu ve uyarıcı
maddeler, ateşli silahlar, mühimmat, patlayıcı, yanıcı, parlayıcı veya
radyoaktif kimyasallar, kaçak ve bandrolsüz ürünler, tütün ve alkol
ürünleri, nakit para, döviz, ziynet eşyası, kıymetli evrak ve taşınması
yürürlükteki mevzuat ve karayolları kanunlarınca yasaklanmış her türlü
tehlikeli, illegal nesnenin Platform üzerinden ilanının verilmesi,
taşınması veya taşınmasına yeltenilmesi kesinlikle yasaktır.</p>
<p><strong>3.2. Tam Sorumluluk Beyanı:</strong> Yasaklı madde trafiğine
doğrudan veya dolaylı olarak karışan, bu maddeleri taşımaya veren,
taşıyan veya taşınmasına yeltenen kullanıcılar, doğacak tüm cezai,
hukuki ve idari sonuçlardan münhasıran ve şahsen sorumludur.</p>
<p><strong>3.3. Adli İşbirliği ve İhbar Yetkisi:</strong> Şüpheli veya
yasadışı durumlarda, yasaklı madde taşıma teşebbüslerinde Platform;
taraflar arasındaki herhangi bir gizlilik kuralına veya mahkeme kararına
bağlı kalmaksızın, suçu önlemek adına kullanıcı bilgilerini (IP adresi,
Konum, Kimlik Bilgileri, Mesajlaşma Dökümleri) derhal ve re’sen ilgili
emniyet birimlerine ve adli makamlara bildirme yetkisine sahiptir.</p>
<h2 id="ticari-mali-ve-vergisel-yükümlülükler">4. TİCARİ, MALİ VE
VERGİSEL YÜKÜMLÜLÜKLER</h2>
<p><strong>4.1. Mali ve Vergisel Sorumluluk:</strong> Platform üzerinden
gerçekleştirilen her türlü taşıma, gönderim ve ticari faaliyetten doğan
Katma Değer Vergisi (KDV), Gelir Vergisi, Damga Vergisi, Stopaj, resim,
harç ve benzeri tüm mali yükümlülükler münhasıran Kullanıcıların
sorumluluğundadır. Platform, taraflar arasındaki kazançlara ilişkin
vergi danışmanlığı yapmaz ve mali sorumluluk üstlenmez.</p>
<p><strong>4.2. Yasal Belgeler ve Mesleki Yeterlilik:</strong> Taşıma
faaliyetinde bulunan Kullanıcılar; yasal olarak taşımacılık yapabilmek
için gerekli olan K1, K2, K3 Yetki Belgelerine, SRC belgelerine, geçerli
sürücü belgesine (ehliyet), zorunlu trafik ve yük sigortalarına sahip
olduklarını ve araç muayenelerinin tam olduğunu taahhüt ederler. Eksik,
süresi geçmiş veya sahte belgeden doğacak idari para cezalarından ve
hukuki yaptırımlardan Platform sorumlu tutulamaz.</p>
<p><strong>4.3. Fatura ve İrsaliye Düzenleme:</strong> Kullanıcılar,
kendi aralarındaki ticari ve lojistik işlemin yasal mevzuata uygun
faturasını, sevk irsaliyesini veya taşıma belgesini düzenlemekle bizzat
yükümlüdür.</p>
<h2 id="hasar-kayip-ürün-beyani-ve-tazminat-şartlari">5. HASAR, KAYIP,
ÜRÜN BEYANI VE TAZMİNAT ŞARTLARI</h2>
<p><strong>5.1. Risk Devri ve Sorumluluk Süresi:</strong> Gönderi;
Taşıyıcı tarafından teslim alındığı andan itibaren, varış noktasında
Alıcıya güvenle teslim edildiği ana kadar geçen süreçteki her türlü risk
(zayi, kayıp, hasar, deformasyon, gecikme) münhasıran Taşıyıcı
Kullanıcı’ya geçer.</p>
<p><strong>5.2. Ürün Değeri Beyan Zorunluluğu:</strong> Gönderici,
Platform üzerinde ilan oluştururken taşınacak ürünün yaklaşık piyasa
değerini dürüstlük kuralına uygun olarak beyan etmekle yükümlüdür. Olası
bir tazminat durumunda, aksi somut delillerle ispat edilmedikçe, bu
beyan tavan sınır kabul edilir. Yanlış veya fahiş değer beyanlarından
doğan uyuşmazlıklarda Platform sorumlu değildir.</p>
<p><strong>5.3. Kanıt Mekanizması ve Fotoğraf Yükleme
Zorunluluğu:</strong> Taşıyıcı, paketi teslim ederken sistem üzerinden
“<strong>Teslimat Anı Fotoğrafı</strong>” yüklemek veya Alıcıdan alacağı
“<strong>Dijital Teslimat Kodu</strong>”nu sisteme girmek zorundadır.
Paketin kaybedilmesi veya zarar görmesi durumunda Taşıyıcı; hasarın
kendisinden kaynaklanmadığını Platform sistemine yüklenecek somut ve
hukuken geçerli delillerle (teslimat anı fotoğrafı, video, teslimat
tutanağı) ispat edemediği sürece, ürün bedelini ve doğacak zararı hak
sahibine ödemeyi peşinen kabul ve taahhüt eder.</p>
<p><strong>5.4. Platformun Tazminat Bağışıklığı:</strong> Platform;
hiçbir hasar, kayıp, hırsızlık veya zayi olayında bir ödeme merci,
tazminat sorumlusu, garanti sağlayıcı veya sigorta şirketi değildir.
Platform yalnızca adli süreçlere esas teşkil etmek üzere veri tabanı
kayıtlarını yetkili makamlarla paylaşır.</p>
<h2 id="hizmet-disiplini-sistem-kurallari-ve-üyelik-iptali">6. HİZMET
DİSİPLİNİ, SİSTEM KURALLARI VE ÜYELİK İPTALİ</h2>
<p><strong>6.1. Taahhüt İhlali ve Hesap Silme:</strong> Platform
üzerinden bir ilanı veya taşıma işini makul ve mücbir bir sebep
olmaksızın yerine getirmeyen, işi yarıda bırakan, haksız iptal eden veya
ilan şartlarına aykırı davranarak diğer kullanıcıları mağdur eden
Kullanıcıların hesapları, Platform tarafından hiçbir ihbara veya
bildirime gerek kalmaksızın tek taraflı olarak askıya alınabilir veya
tamamen silinebilir.</p>
<p><strong>6.2. Hizmet Bedeli İade Politikası:</strong> Kullanıcıların
kendi kusurları, ihmalleri veya Sözleşme ihlalleri nedeniyle iptal
edilen/tamamlanamayan işlemlerde, Platform’un tahsil ettiği hizmet veya
aracılık bedelleri kesinlikle iade edilmez.</p>
<h2 id="kvkk-aydinlatma-ve-gizlilik-hükümleri">7. KVKK AYDINLATMA VE
GİZLİLİK HÜKÜMLERİ</h2>
<p><strong>7.1. Veri İşleme Amaç ve Esasları:</strong> Kullanıcılara ait
kişisel veriler (Ad-soyad, telefon, e-posta, anlık konum, IP adresi ve
cihaz logları); 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
kapsamında, münhasıran Platform hizmetlerinin ifası, tarafların
eşleştirilmesi, güvenliğin sağlanması ve yasal zorunlulukların yerine
getirilmesi amacıyla işlenmektedir.</p>
<p><strong>7.2. Veri Aktarımı:</strong> Kullanıcı verileri; kamu
güvenliği, vergi mevzuatı veya adli/idari soruşturmalar kapsamında
yetkili resmi kurum ve kuruluşlardan (Savcılık, Emniyet, Mahkemeler,
Maliye) gelen yasal talepler doğrultusunda mevzuata uygun olarak
paylaşılabilecektir.</p>
<h2 id="hmk-uyarinca-delil-sözleşmesi">8. HMK UYARINCA DELİL
SÖZLEŞMESİ</h2>
<p><strong>8.1. Kesin ve Münhasır Delil Şartı:</strong> Kullanıcı,
Platform’un kullanımı ile ilgili olarak doğabilecek her türlü
uyuşmazlıkta, Platform’un kendi veri tabanında, sunucularında tuttuğu
sistem kayıtlarının, log kayıtlarının, dijital teslimat verilerinin,
mesajlaşma geçmişinin ve sistem dökümlerinin, 6100 sayılı Hukuk
Muhakemeleri Kanunu (HMK) m. 193 uyarınca “<strong>Kesin ve Münhasır
Delil</strong>” niteliğinde olduğunu, bunlara karşı her türlü itiraz ve
def’i haklarından peşinen feragat ettiğini kabul ve beyan eder.</p>
<h2 id="mücbir-sebepler-ve-diğer-şartlar">9. MÜCBİR SEBEPLER VE DİĞER
ŞARTLAR</h2>
<p><strong>9.1. Mücbir Sebep:</strong> Doğal afetler (deprem, sel vb.),
savaş, terör eylemleri, salgın hastalıklar, hükümet kısıtlamaları, genel
elektrik veya internet altyapı kesintileri gibi Platform’un kontrolü
dışında gelişen mücbir sebeplerden kaynaklanan gecikmelerden veya hizmet
kesintilerinden Platform sorumlu tutulamaz.</p>
<p><strong>9.2. Fikri Mülkiyet ve Görseller:</strong> İlanlarda
kullanılan her türlü görsel ve metnin telif haklarından ve hukuka
uygunluğundan doğrudan ilanı yükleyen Kullanıcı sorumludur. Üçüncü
kişilerin telif hakkı ihlali iddialarından doğacak zararlar Kullanıcı’ya
rücu edilir.</p>
<p><strong>9.3. Yaş Sınırı:</strong> Platform’a üye olmak ve sunulan
hizmetleri kullanabilmek için 18 yaşını doldurmuş (reşit) olmak
zorunludur.</p>
<h2 id="rücu-hakki-yürürlük-ve-kabul">10. RÜCU HAKKI, YÜRÜRLÜK VE
KABUL</h2>
<p><strong>10.1. Rücu Hakkı:</strong> Kullanıcının işbu Sözleşme
hükümlerini, vergi yükümlülüklerini veya yasal mevzuatı ihlal etmesi
(yasaklı madde taşıma, eksik belge vb.) nedeniyle Platform’un herhangi
bir idari para cezasına çarptırılması, tazminat ödemesi veya zarara
uğraması durumunda; ödenen tüm tutarlar, avukatlık ücretleri, faiz ve
tüm ferileriyle birlikte ihlali gerçekleştiren Kullanıcı’dan doğrudan
tahsil (rücu) edilir.</p>
<p><strong>10.2. Yürürlük ve Kesin Kabul:</strong> Kullanıcı,
<strong>www.paketjet.com</strong> adresine eriştiği, mobil uygulamaları
cihazına indirdiği, sisteme kayıt olduğu, ilan verdiği veya bir ilanı
kabul ettiği andan itibaren işbu Sözleşme’nin tüm maddelerini hiçbir
itirazı olmaksızın okuduğunu, anladığını, mali ve cezai sorumlulukların
tamamen kendisine ait olduğunu bilerek peşinen kabul, beyan ve taahhüt
etmiş sayılır.</p>
' WHERE slug = 'gizlilik-politikasi' AND locale = 'tr';

