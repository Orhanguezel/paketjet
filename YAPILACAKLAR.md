# PaketJet — Yapılacaklar (Temiz Başlangıç · Pazar Yeri / Lead Modeli)

> **Bu dosya tek geçerli yapılacaklar listesidir (2026-05-30).**
> Eski `docs/yapilacaklar.md`, `docs/remaining-work-plan.md`, `docs/cp22-plan.md` ve kök `CLAUDE.md` içindeki CP-1…CP-20 listesi **arşiv kabul edilir** — referans için durur, ama iş buradan takip edilir.

---

## 0. İŞ MODELİ — NET TANIM (Kesinleşti)

PaketJet bir **ilan (lead / iletişim erişimi) satış pazar yeridir.** Kargo taşıma hizmeti **satmaz**, taşımanın tarafı **değildir**.

| Konu                | Karar                                                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| İlanı açan       | **Taşıyıcı** (güzergah/taşıma kapasitesi olan kişi). Açmak **ÜCRETSİZ**.                                                                      |
| İlanda gizli kalan | Taşıyıcının**adı + telefonu + adresi** (satın alınana kadar görünmez).                                                                               |
| İlanı satın alan | **Gönderici / kargo sahibi** — Taşıyıcının iletişim bilgilerine erişmek için ödeme yapar.                                                           |
| Satın alma bedeli  | **50 TL** (satın alan = Gönderici öder). İlan açan ödemez.                                                                                               |
| Satılan şey       | **"İlan sahibinin iletişim bilgilerine anlık erişim hizmeti"** — kargo taşıma değil.                                                                   |
| Taşıma ücreti    | **Taşıyıcı ↔ Müşteri arasında**, PaketJet karışmaz, komisyon almaz.                                                                                  |
| PaketJet geliri     | **Sadece ilan/lead satışı** (50 TL × satın alma). Başka kesinti yok.                                                                                     |
| Para hareketi       | PaketJet kimseye**ödeme/payout yapmaz** → komisyon, alt üye işyeri (sub-merchant), taşıyıcıya aktarım, iade mekanizmaları **GEREKSİZ**.       |
| Bakiye birimi       | **"Cüzdan" KALDIRILIYOR** → yerine **"İlan Alma Hakkı"** (para değil, kontör/hak).                                                                 |
| Ürün değeri      | Satın alan gönderici/kargo sahibi eşyanın**tahmini değerini (TL)** satın alma akışında bildirir — kayıp/hasarda hukuki süreç bu tutar üzerinden. |
| Anlaşmazlık       | Mümkün olduğunca baştan önlenecek (sözleşme imzası, içerik onayı, değer beyanı).                                                                         |
| Sözleşmeler       | Üyelikte**mutlaka onaylatılacak** (checkbox + KVKK açık rıza).                                                                                            |

> ⚠️ **Model uyarısı (2026-05-30 düzeltmesi):** İlan sahibi **taşıyıcıdır**; kargo değeri/içerik beyanı ilan açarken alınmaz, satın alan gönderici/kargo sahibi tarafından satın alma akışında verilir. Satılan şey **iletişim erişimi**dir; PaketJet taşıma hizmeti satmaz.

---

## 0.1 ÇALIŞMA PRENSİBİ — HARD-CODE YASAK (Kesin Kural)

> **Kodun içine asla sabit (magic value) yazılmaz.** Tüm yapılandırılabilir değerler **veritabanında** tutulur ve **admin panelden düzenlenebilir** olur.

| Değer türü                                             | Nerede durur                                                     | Düzenleme                 |
| --------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------- |
| Fiyatlar, kontör paketleri, komisyon/ücret sabitleri    | **DB** (seed SQL = varsayılan)                            | **Admin panel**      |
| İçerik/metin (sayfa, sözleşme, SSS, uyarı metinleri) | **DB**                                                     | **Admin panel**      |
| Görseller, logo, ikonlar                                 | **`backend/uploads/` + storage modülü (DB kayıtlı)** | **Admin panel CRUD** |
| Ortama özel sırlar/URL (API key, DB, JWT)               | **`.env`**                                               | Deploy                     |
| Varsayılan tohum verisi                                  | **seed `.sql`**                                          | İlk kurulum               |

- [ ] Hiçbir fiyat/sabit/metin TSX/TS/JS dosyasına gömülmez — `siteSettings` veya ilgili config tablosundan okunur.
- [ ] Yeni bir ayrı tutulması gereken sabit çıktığında: DB tablosu/satırı + admin formu + API ile çözülür.

---

## 1. TEMEL PİVOT — İlan & İletişim Açma (Lead Reveal)

> **Detaylı backend tasarımı (veri modeli + API kontratı): `docs/backend-pivot-veri-modeli-ve-api.md`.** (§1–§5 burayı uygular.)
> ⚠️ İlk iş güvenlik: `ilanlar` public sorguları şu an `contact_phone/email` sızdırıyor — alan whitelist'i ile kapat.

### 1.1 İlan (Taşıyıcı ilanı olarak korundu)

- [X] İlan veri modelini gözden geçir: ilan = **Taşıyıcı'nın güzergah/taşıma ilanı**. Kargo değeri ve içerik beyanı ilan açarken alınmaz; satın alan müşteri/paket sahibi bildirir.
- [X] Kapasite/kg bazlı alanları (total_capacity_kg / available_capacity_kg / price_per_kg) UI/akıştan gizle. (DB sütunu kalabilir.)
- [X] İlan açma **ücretsiz** — herhangi bir ödeme/hak kontrolü olmadan yayınlanır.

### 1.2 Gizlilik / Maskeleme

- [X] **Backend whitelist (Claude):** Public `GET /api/ilanlar` + `/api/ilanlar/:id` artık `contact_phone/email/name/address` döndürmüyor (`stripIlanContact`, cevapta `contact_locked:true`). Cache de temiz. Canlı doğrulandı. ✅
- [X] Satın alınmış ilan için ayrı endpoint: `GET /api/ilanlar/:id/iletisim` (yalnızca satın alan + auth + hak kontrolü) — Codex.
- [X] Frontend: maskeli görünüm + "İletişimi Gör — 50 TL" CTA (reveal sonrası göster).

### 1.3 Satın Alma = İletişim Açma

- [X] "Rezervasyon/booking" akışını **"İlan Satın Alma (iletişim açma)"** akışına dönüştür. (Aktif ilan detay akışı purchases/lead-reveal üzerinden çalışır.)
- [X] Satın alma → `purchase` kaydı (kim, hangi ilan, ne zaman, ödenen 50 TL / kullanılan 1 hak).
- [X] Satın aldıktan sonra ilan içeriği (iletişim) **kalıcı olarak** o taşıyıcıya açık (tekrar ödeme istemez).
- [X] **KARAR: Tek taşıyıcı (ilk alan).** İlan ilk satın alınınca **kapanır / "dolu" (sold) işaretlenir** — başka taşıyıcı satın alamaz, listede pasifleşir.
  - [X] İlan durumuna `sold/closed` state ekle; satın alındığında atomik olarak kilitle (race condition: iki taşıyıcı aynı anda almasın — DB transaction + unique kısıt).
  - [X] Listede satılan ilanlar gösterilmez (veya "Satıldı" rozetiyle pasif).

---

## 2. "İLAN ALMA HAKKI" (Cüzdan Kaldırma)

- [X] Frontend `/panel/cuzdan` route'u → **"İlan Alma Hakkı"** olarak yeniden adlandır (route + nav + tüm UI metinleri).
- [X] "Bakiye / TL" gösterimi → **"Kalan İlan Alma Hakkı: N adet"** gösterimine çevir.
- [X] Backend `wallet` modülü: DB tablo adına **dokunma** (live veri riski), ama API path / kavram / response alanlarını "hak/kontör" diline çevir. (Teknik `/wallet` path geriye uyumluluk için korundu; response'a `credit_balance`, `remaining_rights`, `unit: "hak"` eklendi.)
- [X] İşlem geçmişi: "para yükleme/harcama" → "hak satın alma / hak kullanımı".
- [X] Locale/UI metinleri — "cüzdan/bakiye/wallet/balance" görünen kalıntıları "İlan Hakkı / Kalan Hak" diline çekildi. (Mevcut locale yapısında yalnız TR dosyaları var.)
- [X] **KARAR: Her iki satın alma yöntemi de sunulur:**
  - [X] **Tekil:** Taşıyıcı bir ilan için anında **50 TL** öder (hakkı yoksa direkt ödeme akışı).
  - [X] **Kontör paketi:** Önceden indirimli paket alır (örn. 5 hak = 250 TL → **[fiyatlandırma netleştirilecek]**), her ilanda 1 hak düşer.
  - [X] Satın alma anında öncelik: önce kontör hakkı varsa onu kullan, yoksa tekil 50 TL ödeme öner.
  - [X] Kontör paketleri admin'den tanımlanabilir/fiyatlanabilir olsun (hardcode etme).

---

## 3. ÖDEME & SATIN ALMA AKIŞI (Sadeleştirme)

- [X] **Komisyon sistemini kaldır:** `wallet/commission.ts`, `GET /admin/reports/commissions`, komisyon kesintisi mantığı — pasifleştir/çıkar.
- [X] **Iyzico sub-merchant (alt üye işyeri) akışını kaldır:** Artık taşıyıcıya payout yok → `iyzico.ts` sadece **tek yönlü tahsilat** (50 TL / hak paketi) için kalır.
- [X] KYC onayında otomatik sub-merchant oluşturma adımını **kaldır** (KYC kalsa bile sub-merchant gereksiz — bkz. §6).
- [X] Teslim onayı / "taşıyıcıya ödeme aktarımı" / "müşteriye iade" akışlarını **kaldır** — PaketJet taşıma parasını tutmuyor.
- [ ] Ödeme sağlayıcı sadeleştirmesi: tek çekim (50 TL veya hak paketi). **[NETLEŞTİRİLECEK]** Iyzico mı PayTR mi tek sağlayıcı olsun?

### 3.1 Hizmet Tanımı Vurgusu (proje sahibi notu)

- [X] Satın alma / ödeme ekranının üzerine net uyarı kutusu:
  > **"Satın aldığınız hizmet, kargo taşıma hizmeti değil; ilan sahibinin iletişim bilgilerine anlık erişim hizmetidir."**
  >

---

## 4. SÖZLEŞME & YASAL ONAYLAR

### 4.1 Sözleşme Sayfaları (içerik hazır)

- [X] `sozlesme/KULLANICI-SOZLESMESI-SON.md` ve `sozlesme/SOZLESME.md` içeriklerini ilgili public sayfalara bağla (`/kullanim-kosullari`, `/kvkk`, `/gizlilik-politikasi`).
- [X] Sözleşmelerin **versiyon + onay zamanı** kaydı tutulsun (kim, hangi versiyon, ne zaman onayladı).

### 4.2 Üyelik Adımı — İki Ayrı Checkbox (proje sahibi notu)

- [X] Kayıt formuna iki ayrı checkbox:
  - [X] ☐ **"Kullanıcı Sözleşmesi ve Gizlilik Politikası'nı okudum, onaylıyorum."** (zorunlu)
  - [X] ☐ **"KVKK Aydınlatma Metni kapsamında, iletişim ve adres bilgilerimin ilan bedelini ödeyen üçüncü kişi taşıyıcılarla paylaşılmasına AÇIK RIZA veriyorum."**
- [X] İkinci kutu **boş (işaretsiz) gelmeli** — kullanıcı kendi işaretlemeli (KVKK açık rıza şartı).
- [X] Onaylar olmadan kayıt tamamlanmasın; backend'de de doğrula (`users.rules_accepted` + ayrı `kvkk_explicit_consent` alanı).

### 4.3 Satın Alma — İçerik Onayı (proje sahibi notu)

- [X] Satın alan kişi iletişim erişimini açmadan **hemen önce** beyan verir: _(2026-05-30 model kararı: ilan açan taşıyıcıdır; içerik beyanı ilan create'ten kaldırıldı, satın alma/purchases akışına taşındı.)_
  > **"Paketimin içinde uyuşturucu, silah, yanıcı madde veya kaçak ürün bulunmadığını, tüm cezai sorumluluğun bana ait olduğunu kabul ediyorum."**
  >
- [X] Onay kutusu işaretlenmeden iletişim erişimi açılmaz / ödeme başlatılmaz.
- [X] **Backend:** `content_declared` satın alma/purchases akışında zorunlu olacak; ilan create'te alınmayacak.

---

## 5. ÜRÜN DEĞERİ & ANLAŞMAZLIK / HUKUKİ SÜREÇ

- [X] **Backend:** `estimated_value` satın alma/purchases akışında zorunlu olacak; ilan create validation'da alınmayacak.
- [X] Satın alma formuna **"Ürünün Tahmini Değeri (TL)"** alanı — **zorunlu**.
- [X] Bu değer satın alma kaydında görünür → kayıp/hasarda **tavan tutar** olarak referans.
- [X] Anlaşmazlık (dispute) modülünü yeni modele göre yeniden çerçevele: PaketJet'in tuttuğu para üzerinden değil, **beyan edilen ürün değeri** üzerinden taraflar arası süreç.
- [X] Anlaşmazlığı baştan önleme: değer beyanı + içerik onayı + sözleşme + maskeleme zaten bu amaca hizmet ediyor — admin tarafında ihtilaf kaydı/raporu tutulsun.

---

## 6. KYC / KİMLİK DOĞRULAMA — ✅ TAMAMEN KALDIRILIYOR

> **Karar (2026-05-30):** KYC gereksiz. PaketJet **kimseye para ödemiyor** — herkes sadece para verip ilan satın alıyor. Doğrulanmış "taşıyıcı/kargo firması" diye ayrı bir aktör **yok**; satın alan herkes sıradan kullanıcıdır. Dolayısıyla kimlik/belge/banka doğrulamasına gerek yok.
> **Temizlik çeklisti:** `docs/temizlik-codex-ceklisti.md` (frontend + admin_panel UI kalıntıları → Codex).

- [X] **Backend wave-1 (Claude):** `carrier-kyc/` + `carrier-bank/` + `withdrawal/` modülleri silindi, routes.ts unregister, ilan açma KYC engeli kaldırıldı. Boot + type-check temiz. ✅
- [X] **Frontend temizliği** (Codex): modüller + dogrulama/cekim sayfaları + ParaCekTab/KycTab/FinansTab + api-endpoints + admin-shell nav + IlanVerForm KYC engeli.
- [X] **Admin panel temizliği** (Codex): kyc/ sayfaları + endpoints + sidebar-items + permissions + locale + tags.
- [X] Iyzico **sub-merchant** → wave-2 (§3, payment sadeleştirme).
- [X] **Korunur (KYC değil):** sözleşme onayı + KVKK açık rıza + içerik onayı + ürün değeri beyanı (yasal/ihtilaf için — §4, §5).

---

## 7. DASHBOARD BİRLEŞTİRME (Tek Hesap · Çift Rol)

- [X] `/panel/musteri` + `/panel/tasiyici` → **tek panel**, eylem bazlı.
- [X] Bir kullanıcı hem ilan açabilsin (Gönderici) hem ilan satın alabilsin (Taşıyıcı) — tek hesap, rol seçimi olmadan.
- [X] Panelde iki sekme/blok: **"İlanlarım"** (açtıklarım) + **"Satın Aldıklarım"** (eriştiğim iletişimler).
- [X] `/panel` yönlendirmesini ve role göre ayrışan UI'yı sadeleştir.

---

## 8. İLETİŞİM / MAIL

- [X] Tüm sistem mailleri **`info@paketjet.net`** adresinden gönderilsin (`MAIL_FROM` env güncelle).
- [ ] `info@paketjet.net` için **SPF / DKIM / DMARC** kayıtları kurulu mu kontrol et, eksikse ekle. (2026-05-30: SPF + DMARC + MX var; yaygın DKIM selector'ları kayıt döndürmedi.)

---

## 9. UI/UX — Hızlı İlan Aç & Görünürlük

- [X] Anasayfa hero'sunda **"Hızlı İlan Aç"** butonu (ücretsiz olduğu vurgulansın).
- [X] Header'da kalıcı (sticky) CTA — mobilde de görünür.
- [X] Boş listelerde ("Henüz ilanın yok") inline CTA.
- [X] Panel dashboard'ında merkezî büyük CTA.
- [X] İlan kartlarında "İletişimi Gör — 50 TL" tarzı net satın alma CTA'sı (maskeli bilgiyle birlikte).

---

## 10. TEKNİK BORÇ & TEMİZLİK (Eski listelerden taşınan, hâlâ geçerli)

- [X] **Deprecated `middleware`** kaldır (Next.js middleware deprecation — eski notta belirtilmiş) — frontend `src/proxy.ts` formatına taşındı.
- [X] Admin **`categories` key/value** eksikliği: `admin.categories.modules.ilanlar` anahtarlarının karşılığı yok — düzelt.
- [X] Admin **site-settings SEO tab'ı** mevcut sayfalardan farklı/generic — PaketJet'e uygun şekilde yeniden yaz.
- [ ] Üretim env finalize (eski PD-1): gerçek SMTP, güçlü `JWT_SECRET`, prod `CORS_ORIGIN`, Maps key billing.

---

## 12. UI / TASARIM SİSTEMİ & DASHBOARD YENİDEN TASARIMI

> Detaylı plan: **`docs/ui-tasarim-plani.md`** (mimari) · Görevler: `docs/dashboard-redesign-antigravity-gorevleri.md` (Antigravity) + `docs/dashboard-redesign-codex-ceklisti.md` (Codex).
> Referans: kullanıcı mockup'ı + `images/` ikon seti.

### 12.1 Tutarlı İkon Seti

- ✅ **KARAR — Stil: parlak 3D mor rozet** (mevcut `profil`, `tasima-kurallari`, `dogrulama` görsellerindeki cam/3D mor dil). Tüm ikonlar bu stile çekilir.
- ✅ **KARAR — Format: PNG** (transparan zemin, yüksek çözünürlük). SVG değil.

- [X] `images/` içindeki ikonlar iki stilde karışık + eksik → hepsini **tek tutarlı 3D mor stilde** yeniden tasarla (Antigravity).
- [ ] 9 nav + 4 CTA ikonu üret (manifest: ui-tasarim-plani §3).
- [ ] ⚠️ "İlan Alma Hakkı" ikonu **cüzdan değil** → bilet/kontör teması (yasal).
- [X] **Görseller hazır:** kaynak referanslar `backend/uploads/icons/*.png` olarak anlamlı isimlerle kondu (profil, tasima-kurallari, dogrulama, ilanlarim, bildirimler, ilan-alma-hakki, satin-aldiklarim, cikis-yap, +mavi alternatifler).
- [X] **Teslim & servis:** Tüm ikon/logo görselleri `backend/uploads/` altında durur, **storage modülü** ile dinamik servis edilir (Cloudinary değil, local/DB kayıtlı). Frontend ikonları **statik import değil**, storage'dan çeker.
- [X] Admin panelden ikon/logo **ekleme / değiştirme / silme** (storage CRUD).

### 12.2 Dashboard Yeniden Tasarımı (mockup'a göre)

- [X] Yumuşak mavi degrade zemin + beyaz yuvarlak köşeli kartlar.
- [X] Sidebar: logo üstte + **yuvarlak rozet nav** (aktif=mor, pasif=açık mavi).
- [X] "Hoş geldiniz, {ad}!" + "Gönderi Özeti" istatistik kartları (gerçek veri).
- [X] Merkezî "Hızlı İlan Aç" CTA.
- [X] Bileşenler: `Icon`, `NavBadge`, `StatCard` (Codex).

### 12.3 Renk Yönü — ✅ KARAR VERİLDİ

- **Ana tema: mavi/mor (tüm site).** Turuncu **sadece kritik CTA vurgusu** olarak kalır (örn. "İletişimi Gör — 50 TL" / "Satın Al").

- [X] Token mimarisi: birincil/brand → mavi-mor; turuncu → `--color-cta-accent` (yalnızca satın alma/önemli aksiyon).
- [X] Anasayfa + header + butonlar mavi/mor'a güncellenecek (Codex + Antigravity — geniş rework).
- [X] "İletişimi Gör — 50 TL" ve "Satın Al" butonları turuncu vurgu rengiyle öne çıkar.

---

## 13. NETLEŞTİRİLECEKLER (Açık Sorular)

> **KARAR VERİLDİ:** ~~Çoklu satış~~ → **Tek taşıyıcı (ilk alan), ilan satılınca kapanır.** ~~Hak modeli~~ → **Tekil 50 TL + kontör paketi birlikte.**

1. ~~Kontör fiyatlandırması nasıl saklanır~~ → ✅ **KARAR: DB tablosu + admin panel** (hard-code YOK, bkz. §0.1). Kalan: başlangıç/varsayılan kademeleri (seed) ne olsun? (tekil 50 TL referans; paketler admin'den değiştirilebilir.)
2. ~~KYC kapsamı~~ → ✅ **KARAR: KYC tamamen kaldırıldı** (kimseye payout yok, doğrulama gereksiz — bkz. §6).
3. **Ödeme sağlayıcı:** Tek tahsilat için Iyzico mı PayTR mı kalsın?
4. **Eski veri:** Live'da eski model (booking/cüzdan/komisyon) verisi var mı? Varsa migrasyon/arşiv stratejisi gerekir.

---

## Sıra Önerisi (Mimari)

1. Model & gizlilik (§1) — çünkü her şeyin temeli; iletişim maskeleme bir güvenlik meselesi.
2. Yasal onaylar & pop-up & checkbox & hizmet tanımı (§4, §3.1) — düşük riskli, hızlı, hukuken kritik.
3. Cüzdan → İlan Alma Hakkı (§2) + ödeme sadeleştirme (§3).
4. Dashboard birleştirme (§7) + **UI/ikon yeniden tasarım (§12)** + UI CTA (§9).
5. KYC revize (§6) + dispute/değer (§5).
6. Mail (§8) + temizlik (§10).

> UI/tasarım işi (§12) model işiyle paralel yürüyebilir — Antigravity ikonları üretirken Codex backend/model üzerinde çalışabilir.
