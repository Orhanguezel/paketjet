# PaketJet — Yapılacaklar (Temiz Başlangıç · Pazar Yeri / Lead Modeli)

> **Bu dosya tek geçerli yapılacaklar listesidir (2026-05-30).**
> Eski `docs/yapilacaklar.md`, `docs/remaining-work-plan.md`, `docs/cp22-plan.md` ve kök `CLAUDE.md` içindeki CP-1…CP-20 listesi **arşiv kabul edilir** — referans için durur, ama iş buradan takip edilir.

---

## 0. İŞ MODELİ — NET TANIM (Kesinleşti)

PaketJet bir **ilan (lead / iletişim erişimi) satış pazar yeridir.** Kargo taşıma hizmeti **satmaz**, taşımanın tarafı **değildir**.

| Konu | Karar |
|------|-------|
| İlanı açan | **Gönderici** (kargosu olan kişi). Açmak **ÜCRETSİZ**. |
| İlanda gizli kalan | Göndericinin **adı + telefonu + adresi** (satın alınana kadar görünmez). |
| İlanı satın alan | **Taşıyıcı** — Göndericinin iletişim bilgilerine erişmek için ödeme yapar. |
| Satın alma bedeli | **50 TL** (satın alan = Taşıyıcı öder). İlan açan ödemez. |
| Satılan şey | **"İlan sahibinin iletişim bilgilerine anlık erişim hizmeti"** — kargo taşıma değil. |
| Taşıma ücreti | **Taşıyıcı ↔ Müşteri arasında**, PaketJet karışmaz, komisyon almaz. |
| PaketJet geliri | **Sadece ilan/lead satışı** (50 TL × satın alma). Başka kesinti yok. |
| Para hareketi | PaketJet kimseye **ödeme/payout yapmaz** → komisyon, alt üye işyeri (sub-merchant), taşıyıcıya aktarım, iade mekanizmaları **GEREKSİZ**. |
| Bakiye birimi | **"Cüzdan" KALDIRILIYOR** → yerine **"İlan Alma Hakkı"** (para değil, kontör/hak). |
| Ürün değeri | Gönderici eşyanın **tahmini değerini (TL)** yazmak zorunda — kayıp/hasarda ödetme/hukuki süreç bu tutar üzerinden. |
| Anlaşmazlık | Mümkün olduğunca baştan önlenecek (sözleşme imzası, içerik onayı, değer beyanı). |
| Sözleşmeler | Üyelikte **mutlaka onaylatılacak** (checkbox + KVKK açık rıza). |

> ⚠️ **Pivot uyarısı:** Mevcut kod eski "taşıyıcı güzergah/kapasite (kg) ilanı + rezervasyon + komisyon + cüzdan + teslim onayı" modeline göre yazılmış. Yeni modelde ilanın sahibi **Gönderici**, satılan şey **iletişim erişimi**. Bu, `ilanlar`, `bookings`, `wallet` modüllerinin **anlamsal olarak yeniden ele alınmasını** gerektirir. Aşağıdaki maddeler bunu kapsar.

---

## 0.1 ÇALIŞMA PRENSİBİ — HARD-CODE YASAK (Kesin Kural)

> **Kodun içine asla sabit (magic value) yazılmaz.** Tüm yapılandırılabilir değerler **veritabanında** tutulur ve **admin panelden düzenlenebilir** olur.

| Değer türü | Nerede durur | Düzenleme |
|------------|--------------|-----------|
| Fiyatlar, kontör paketleri, komisyon/ücret sabitleri | **DB** (seed SQL = varsayılan) | **Admin panel** |
| İçerik/metin (sayfa, sözleşme, SSS, uyarı metinleri) | **DB** | **Admin panel** |
| Görseller, logo, ikonlar | **`backend/uploads/` + storage modülü (DB kayıtlı)** | **Admin panel CRUD** |
| Ortama özel sırlar/URL (API key, DB, JWT) | **`.env`** | Deploy |
| Varsayılan tohum verisi | **seed `.sql`** | İlk kurulum |

- [ ] Hiçbir fiyat/sabit/metin TSX/TS/JS dosyasına gömülmez — `siteSettings` veya ilgili config tablosundan okunur.
- [ ] Yeni bir ayrı tutulması gereken sabit çıktığında: DB tablosu/satırı + admin formu + API ile çözülür.

---

## 1. TEMEL PİVOT — İlan & İletişim Açma (Lead Reveal)

> **Detaylı backend tasarımı (veri modeli + API kontratı): `docs/backend-pivot-veri-modeli-ve-api.md`.** (§1–§5 burayı uygular.)
> ⚠️ İlk iş güvenlik: `ilanlar` public sorguları şu an `contact_phone/email` sızdırıyor — alan whitelist'i ile kapat.

### 1.1 İlan (Gönderici talebi olarak yeniden tanım)
- [ ] İlan veri modelini gözden geçir: ilan = **Gönderici'nin kargo gönderme talebi** (güzergah, eşya tanımı, tahmini değer, gizli iletişim).
- [ ] Kapasite/kg bazlı alanları (total_capacity_kg / available_capacity_kg / price_per_kg) modelden **kaldır veya gizle** — yeni modelde kapasite satışı yok. (DB sütunu kalabilir, UI/akıştan çıkar.)
- [ ] İlan açma **ücretsiz** — herhangi bir ödeme/hak kontrolü olmadan yayınlanır.

### 1.2 Gizlilik / Maskeleme
- [x] **Backend whitelist (Claude):** Public `GET /api/ilanlar` + `/api/ilanlar/:id` artık `contact_phone/email/name/address` döndürmüyor (`stripIlanContact`, cevapta `contact_locked:true`). Cache de temiz. Canlı doğrulandı. ✅
- [x] Satın alınmış ilan için ayrı endpoint: `GET /api/ilanlar/:id/iletisim` (yalnızca satın alan + auth + hak kontrolü) — Codex.
- [x] Frontend: maskeli görünüm + "İletişimi Gör — 50 TL" CTA (reveal sonrası göster).

### 1.3 Satın Alma = İletişim Açma
- [ ] "Rezervasyon/booking" akışını **"İlan Satın Alma (iletişim açma)"** akışına dönüştür.
- [x] Satın alma → `purchase` kaydı (kim, hangi ilan, ne zaman, ödenen 50 TL / kullanılan 1 hak).
- [x] Satın aldıktan sonra ilan içeriği (iletişim) **kalıcı olarak** o taşıyıcıya açık (tekrar ödeme istemez).
- [ ] **KARAR: Tek taşıyıcı (ilk alan).** İlan ilk satın alınınca **kapanır / "dolu" (sold) işaretlenir** — başka taşıyıcı satın alamaz, listede pasifleşir.
  - [x] İlan durumuna `sold/closed` state ekle; satın alındığında atomik olarak kilitle (race condition: iki taşıyıcı aynı anda almasın — DB transaction + unique kısıt).
  - [x] Listede satılan ilanlar gösterilmez (veya "Satıldı" rozetiyle pasif).

---

## 2. "İLAN ALMA HAKKI" (Cüzdan Kaldırma)

- [x] Frontend `/panel/cuzdan` route'u → **"İlan Alma Hakkı"** olarak yeniden adlandır (route + nav + tüm UI metinleri).
- [x] "Bakiye / TL" gösterimi → **"Kalan İlan Alma Hakkı: N adet"** gösterimine çevir.
- [ ] Backend `wallet` modülü: DB tablo adına **dokunma** (live veri riski), ama API path / kavram / response alanlarını "hak/kontör" diline çevir.
- [ ] İşlem geçmişi: "para yükleme/harcama" → "hak satın alma / hak kullanımı".
- [ ] Locale dosyaları (tr/en/de) — "cüzdan/bakiye/wallet/balance" geçen tüm anahtarları güncelle.
- [ ] **KARAR: Her iki satın alma yöntemi de sunulur:**
  - [ ] **Tekil:** Taşıyıcı bir ilan için anında **50 TL** öder (hakkı yoksa direkt ödeme akışı).
  - [ ] **Kontör paketi:** Önceden indirimli paket alır (örn. 5 hak = 250 TL → **[fiyatlandırma netleştirilecek]**), her ilanda 1 hak düşer.
  - [ ] Satın alma anında öncelik: önce kontör hakkı varsa onu kullan, yoksa tekil 50 TL ödeme öner.
  - [x] Kontör paketleri admin'den tanımlanabilir/fiyatlanabilir olsun (hardcode etme).

---

## 3. ÖDEME & SATIN ALMA AKIŞI (Sadeleştirme)

- [ ] **Komisyon sistemini kaldır:** `wallet/commission.ts`, `GET /admin/reports/commissions`, komisyon kesintisi mantığı — pasifleştir/çıkar.
- [ ] **Iyzico sub-merchant (alt üye işyeri) akışını kaldır:** Artık taşıyıcıya payout yok → `iyzico.ts` sadece **tek yönlü tahsilat** (50 TL / hak paketi) için kalır.
- [ ] KYC onayında otomatik sub-merchant oluşturma adımını **kaldır** (KYC kalsa bile sub-merchant gereksiz — bkz. §6).
- [ ] Teslim onayı / "taşıyıcıya ödeme aktarımı" / "müşteriye iade" akışlarını **kaldır** — PaketJet taşıma parasını tutmuyor.
- [ ] Ödeme sağlayıcı sadeleştirmesi: tek çekim (50 TL veya hak paketi). **[NETLEŞTİRİLECEK]** Iyzico mı PayTR mi tek sağlayıcı olsun?

### 3.1 Hizmet Tanımı Vurgusu (proje sahibi notu)
- [ ] Satın alma / ödeme ekranının üzerine net uyarı kutusu:
  > **"Satın aldığınız hizmet, kargo taşıma hizmeti değil; ilan sahibinin iletişim bilgilerine anlık erişim hizmetidir."**

---

## 4. SÖZLEŞME & YASAL ONAYLAR

### 4.1 Sözleşme Sayfaları (içerik hazır)
- [ ] `sozlesme/KULLANICI-SOZLESMESI-SON.md` ve `sozlesme/SOZLESME.md` içeriklerini ilgili public sayfalara bağla (`/kullanim-kosullari`, `/kvkk`, `/gizlilik-politikasi`).
- [ ] Sözleşmelerin **versiyon + onay zamanı** kaydı tutulsun (kim, hangi versiyon, ne zaman onayladı).

### 4.2 Üyelik Adımı — İki Ayrı Checkbox (proje sahibi notu)
- [ ] Kayıt formuna iki ayrı checkbox:
  - [ ] ☐ **"Kullanıcı Sözleşmesi ve Gizlilik Politikası'nı okudum, onaylıyorum."** (zorunlu)
  - [ ] ☐ **"KVKK Aydınlatma Metni kapsamında, iletişim ve adres bilgilerimin ilan bedelini ödeyen üçüncü kişi taşıyıcılarla paylaşılmasına AÇIK RIZA veriyorum."**
- [ ] İkinci kutu **boş (işaretsiz) gelmeli** — kullanıcı kendi işaretlemeli (KVKK açık rıza şartı).
- [ ] Onaylar olmadan kayıt tamamlanmasın; backend'de de doğrula (`users.rules_accepted` + ayrı `kvkk_explicit_consent` alanı).

### 4.3 İlan Yayınlama — İçerik Onayı Pop-up (proje sahibi notu)
- [ ] Gönderici "İlanı Yayınla"ya basmadan **hemen önce** pop-up:
  > **"Paketimin içinde uyuşturucu, silah, yanıcı madde veya kaçak ürün bulunmadığını, tüm cezai sorumluluğun bana ait olduğunu kabul ediyorum."**
- [x] Tek "Tamam/Kabul Ediyorum" butonuyla geçilir; onaylanmadan ilan oluşturulmaz (Frontend pop-up — Codex).
- [x] **Backend (Claude):** `content_declared` zorunlu; onay **tarih + IP** ile ilan kaydında saklanıyor (`content_declared_at/ip` — HMK delil). Test edildi.

---

## 5. ÜRÜN DEĞERİ & ANLAŞMAZLIK / HUKUKİ SÜREÇ

- [x] **Backend (Claude):** `estimated_value` create validation'da zorunlu (Zod→Fastify), DB'ye kaydediliyor. Test edildi.
- [x] İlan açma formuna **"Ürünün Tahmini Değeri (TL)"** alanı — **zorunlu** (Frontend — Codex).
- [x] Bu değer ilan detayında (satın alındıktan sonra) ve satın alma kaydında görünür → kayıp/hasarda **tavan tutar** olarak referans.
- [ ] Anlaşmazlık (dispute) modülünü yeni modele göre yeniden çerçevele: PaketJet'in tuttuğu para üzerinden değil, **beyan edilen ürün değeri** üzerinden taraflar arası süreç.
- [ ] Anlaşmazlığı baştan önleme: değer beyanı + içerik onayı + sözleşme + maskeleme zaten bu amaca hizmet ediyor — admin tarafında ihtilaf kaydı/raporu tutulsun.

---

## 6. KYC / KİMLİK DOĞRULAMA — ✅ TAMAMEN KALDIRILIYOR

> **Karar (2026-05-30):** KYC gereksiz. PaketJet **kimseye para ödemiyor** — herkes sadece para verip ilan satın alıyor. Doğrulanmış "taşıyıcı/kargo firması" diye ayrı bir aktör **yok**; satın alan herkes sıradan kullanıcıdır. Dolayısıyla kimlik/belge/banka doğrulamasına gerek yok.
> **Temizlik çeklisti:** `docs/temizlik-codex-ceklisti.md` (frontend + admin_panel UI kalıntıları → Codex).
- [x] **Backend wave-1 (Claude):** `carrier-kyc/` + `carrier-bank/` + `withdrawal/` modülleri silindi, routes.ts unregister, ilan açma KYC engeli kaldırıldı. Boot + type-check temiz. ✅
- [ ] **Frontend temizliği** (Codex): modüller + dogrulama/cekim sayfaları + ParaCekTab/KycTab/FinansTab + api-endpoints + admin-shell nav + IlanVerForm KYC engeli.
- [ ] **Admin panel temizliği** (Codex): kyc/ sayfaları + endpoints + sidebar-items + permissions + locale + tags.
- [ ] Iyzico **sub-merchant** → wave-2 (§3, payment sadeleştirme).
- [ ] **Korunur (KYC değil):** sözleşme onayı + KVKK açık rıza + içerik onayı + ürün değeri beyanı (yasal/ihtilaf için — §4, §5).

---

## 7. DASHBOARD BİRLEŞTİRME (Tek Hesap · Çift Rol)

- [ ] `/panel/musteri` + `/panel/tasiyici` → **tek panel**, eylem bazlı.
- [ ] Bir kullanıcı hem ilan açabilsin (Gönderici) hem ilan satın alabilsin (Taşıyıcı) — tek hesap, rol seçimi olmadan.
- [ ] Panelde iki sekme/blok: **"İlanlarım"** (açtıklarım) + **"Satın Aldıklarım"** (eriştiğim iletişimler).
- [ ] `/panel` yönlendirmesini ve role göre ayrışan UI'yı sadeleştir.

---

## 8. İLETİŞİM / MAIL

- [ ] Tüm sistem mailleri **`info@paketjet.net`** adresinden gönderilsin (`MAIL_FROM` env güncelle).
- [ ] `info@paketjet.net` için **SPF / DKIM / DMARC** kayıtları kurulu mu kontrol et, eksikse ekle.

---

## 9. UI/UX — Hızlı İlan Aç & Görünürlük

- [x] Anasayfa hero'sunda **"Hızlı İlan Aç"** butonu (ücretsiz olduğu vurgulansın).
- [x] Header'da kalıcı (sticky) CTA — mobilde de görünür.
- [x] Boş listelerde ("Henüz ilanın yok") inline CTA.
- [x] Panel dashboard'ında merkezî büyük CTA.
- [x] İlan kartlarında "İletişimi Gör — 50 TL" tarzı net satın alma CTA'sı (maskeli bilgiyle birlikte).

---

## 10. TEKNİK BORÇ & TEMİZLİK (Eski listelerden taşınan, hâlâ geçerli)

- [ ] **Deprecated `middleware`** kaldır (Next.js middleware deprecation — eski notta belirtilmiş).
- [x] Admin **`categories` key/value** eksikliği: `admin.categories.modules.ilanlar` anahtarlarının karşılığı yok — düzelt.
- [x] Admin **site-settings SEO tab'ı** mevcut sayfalardan farklı/generic — PaketJet'e uygun şekilde yeniden yaz.
- [ ] Üretim env finalize (eski PD-1): gerçek SMTP, güçlü `JWT_SECRET`, prod `CORS_ORIGIN`, Maps key billing.

---

## 12. UI / TASARIM SİSTEMİ & DASHBOARD YENİDEN TASARIMI

> Detaylı plan: **`docs/ui-tasarim-plani.md`** (mimari) · Görevler: `docs/dashboard-redesign-antigravity-gorevleri.md` (Antigravity) + `docs/dashboard-redesign-codex-ceklisti.md` (Codex).
> Referans: kullanıcı mockup'ı + `images/` ikon seti.

### 12.1 Tutarlı İkon Seti
- ✅ **KARAR — Stil: parlak 3D mor rozet** (mevcut `profil`, `tasima-kurallari`, `dogrulama` görsellerindeki cam/3D mor dil). Tüm ikonlar bu stile çekilir.
- ✅ **KARAR — Format: PNG** (transparan zemin, yüksek çözünürlük). SVG değil.
- [ ] `images/` içindeki ikonlar iki stilde karışık + eksik → hepsini **tek tutarlı 3D mor stilde** yeniden tasarla (Antigravity).
- [ ] 9 nav + 4 CTA ikonu üret (manifest: ui-tasarim-plani §3).
- [ ] ⚠️ "İlan Alma Hakkı" ikonu **cüzdan değil** → bilet/kontör teması (yasal).
- [x] **Görseller hazır:** kaynak referanslar `backend/uploads/icons/*.png` olarak anlamlı isimlerle kondu (profil, tasima-kurallari, dogrulama, ilanlarim, bildirimler, ilan-alma-hakki, satin-aldiklarim, cikis-yap, +mavi alternatifler).
- [x] **Teslim & servis:** Tüm ikon/logo görselleri `backend/uploads/` altında durur, **storage modülü** ile dinamik servis edilir (Cloudinary değil, local/DB kayıtlı). Frontend ikonları **statik import değil**, storage'dan çeker.
- [x] Admin panelden ikon/logo **ekleme / değiştirme / silme** (storage CRUD).

### 12.2 Dashboard Yeniden Tasarımı (mockup'a göre)
- [x] Yumuşak mavi degrade zemin + beyaz yuvarlak köşeli kartlar.
- [x] Sidebar: logo üstte + **yuvarlak rozet nav** (aktif=mor, pasif=açık mavi).
- [x] "Hoş geldiniz, {ad}!" + "Gönderi Özeti" istatistik kartları (gerçek veri).
- [x] Merkezî "Hızlı İlan Aç" CTA.
- [x] Bileşenler: `Icon`, `NavBadge`, `StatCard` (Codex).

### 12.3 Renk Yönü — ✅ KARAR VERİLDİ
- **Ana tema: mavi/mor (tüm site).** Turuncu **sadece kritik CTA vurgusu** olarak kalır (örn. "İletişimi Gör — 50 TL" / "Satın Al").
- [x] Token mimarisi: birincil/brand → mavi-mor; turuncu → `--color-cta-accent` (yalnızca satın alma/önemli aksiyon).
- [x] Anasayfa + header + butonlar mavi/mor'a güncellenecek (Codex + Antigravity — geniş rework).
- [x] "İletişimi Gör — 50 TL" ve "Satın Al" butonları turuncu vurgu rengiyle öne çıkar.

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
