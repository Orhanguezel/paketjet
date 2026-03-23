# CP-21 + CP-22 — Antigravity UI/UX Dogrulama Talimati

**Tarih:** 2026-03-21
**Gorev:** Panel gelistirmeleri, cuzdan yeniden yapisi, para cekme, kayit onay
**Branch:** mevcut (main)

---

## Faz 1 — CP-21 (Hazir, test edilebilir)

CP-21 ile yapilan degisiklikler:

1. Tasiyici paneli 4 tab'a ayrildi: Gelen Talepler / Ilanlarim / Gecmis / Finans
2. Finans tab: bekleyen kazanc banner, banka hesabi CRUD formu, alinan odemeler
3. Gecmis tab: teslim edilen + iptal edilen bookings (read-only)
4. Musteri paneli parcalandi: BookingList + RatingForm + Tasima Kurallari banner
5. Tasima Kurallari public sayfasi: `/tasima-kurallari`
6. Banka hesabi formu: TR IBAN validasyonu

### 1. Tasiyici Paneli — `/panel/tasiyici`

**Genel:**
- [ ] 4 tab goruntuleniyor mu: Gelen Talepler, Ilanlarim, Gecmis, Finans
- [ ] Tab gecisleri sorunsuz calisiyor mu
- [ ] Bekleyen talep sayisi badge olarak goruntuleniyor mu
- [ ] Stat kartlari dogru: Aktif Ilan, Bekleyen Talep, Toplam Rezerv., Bakiye, Bekleyen Kazanc

**Gelen Talepler tab:**
- [ ] Pending → Onayla / Reddet butonlari calisiyor mu
- [ ] Confirmed → Yola Cikti / Iptal butonlari calisiyor mu
- [ ] In_transit → Teslim Edildi butonu calisiyor mu
- [ ] Hakedis tutari dogru hesaplaniyor mu (total_price - commission_amount)
- [ ] Delivered ve cancelled bookings bu tab'da gorunmuyor (Gecmis tab'da olmali)

**Gecmis tab:**
- [ ] Sadece delivered + cancelled bookings goruntuleniyor
- [ ] Delivered kartlar yesil border, cancelled kartlar kirmizi border
- [ ] Kazanc tutari delivered bookings'te gosteriliyor
- [ ] Butonlar yok (read-only)

**Finans tab:**
- [ ] Bekleyen kazanc banner goruntuleniyor (varsa): tutar + adet + aciklama
- [ ] Banka Hesabim karti:
  - Hesap yoksa "Banka Hesabi Ekle" CTA goruntuleniyor
  - IBAN inputu max 26 karakter, otomatik buyuk harf + bosluk temizleme
  - Gecersiz IBAN'da hata mesaji: "Gecerli bir TR IBAN giriniz (TR + 24 rakam)"
  - Account holder min 3, bank name min 2 karakter validasyonu
  - Kaydet/Vazgec butonlari calisiyor
  - Kayitli hesap: IBAN (mono font), hesap sahibi, banka adi goruntuleniyor
  - Duzenle ve Sil butonlari calisiyor
- [ ] Alinan Odemeler listesi: tarih + tutar + aciklama

### 2. Musteri Paneli — `/panel/musteri`

- [ ] Stat kartlari dogru: Aktif, Toplam, Bakiye
- [ ] Tasima Kurallari banner goruntuleniyor: baslik + aciklama + "Oku →" linki
- [ ] "Oku →" linki `/tasima-kurallari` sayfasina yonlendiriyor
- [ ] Booking listesi: durum badge, fiyat, tarih, iptal butonu
- [ ] Kargo takip adimlari (step indicator): Onaylandi → Yolda → Teslim
- [ ] Degerlendirme formu: yildiz secimi + yorum + gonder

### 3. Tasima Kurallari — `/tasima-kurallari`

- [ ] Sayfa yuklenebiliyor (CustomPage slug: `tasima-kurallari`)
- [ ] Baslik ve icerik goruntuleniyor
- [ ] Prose stilleri okunakli (h2, h3, ul, ol, p, strong)
- [ ] Dark mode'da kontrast yeterli

### 4. Responsive (3 gorunum)

- **Mobil (375px):** Tab bar yatay scroll, kart icerigi tasmiyor, form inputlari tam genislik
- **Tablet (768px):** Stat grid 3-4 sutun, banka hesabi grid 2 sutun
- **Desktop (1280px):** Tum icerik tam gorunum

Ozellikle:
- [ ] Tasiyici tab bar: mobilde yatay scroll, overflow-x-auto calisiyor mu
- [ ] Finans tab banka formu: mobilde tek sutun, desktop'ta 3 sutun grid
- [ ] Gecmis tab kartlari: mobilde responsive mi

### 5. Dark Mode

- [ ] Finans tab: bekleyen kazanc banner (brand/10 + brand/30 border)
- [ ] Banka formu: input bg-bg-alt, border-border, focus:ring-brand
- [ ] Gecmis tab: border-success/30 ve border-danger/30 dark mode gorunurluk
- [ ] Tasima Kurallari: prose HTML dark mode okunaklilik

### 6. Hata Durumlari

- [ ] Banka: bos form submit → Zod hata mesajlari
- [ ] Banka: gecersiz IBAN → hata mesaji
- [ ] Finans tab: API hata durumunda crash yok
- [ ] Tasima Kurallari: slug bulunamazsa 404

---

## Faz 2 — CP-22 (Kod tamamlandiktan sonra test edilecek)

CP-22 ile yapilacak degisiklikler:

1. Tasiyici para cekme talebi (wallet → banka hesabi)
2. Cuzdan sayfasi yeniden yapisi (role-aware, tab sistemi)
3. Panel'de Tasima Kurallari embed sayfasi (hem musteri hem tasiyici)
4. Kayit formunda kural onay checkbox'u
5. Admin para cekim yonetimi sayfasi

### 7. Cuzdan Sayfasi — `/panel/cuzdan`

**Genel:**
- [ ] Bakiye karti goruntuleniyor: bakiye, toplam kazanc, toplam cekim
- [ ] Tab sistemi role-aware: musteri 2 tab (Bakiye Yukle + Islemler), tasiyici 3 tab (+ Para Cek)
- [ ] Tab gecisleri sorunsuz

**Bakiye Yukle tab:**
- [ ] Iyzico deposit formu calisiyor (tutar gir → odeme modal)
- [ ] Minimum 10 TL validasyonu
- [ ] Basarili yuklemede bakiye guncelleniyor

**Islemler tab:**
- [ ] Tum islemler listeleniyor: yukleme, odeme, kazanc, iade, cekim
- [ ] Filtre calisiyor: type + purpose
- [ ] Pagination calisiyor
- [ ] Her islemde: tip badge, tutar (yesil/kirmizi), tarih, aciklama

**Para Cek tab (sadece carrier):**
- [ ] Banka hesabi bilgisi goruntuleniyor (yoksa uyari + Finans tab'a yonlendirme)
- [ ] Cekim tutari inputu: pozitif sayi, bakiyeyi asmamali
- [ ] "Para Cek" butonu: basarida liste guncellenir
- [ ] Yetersiz bakiye → hata mesaji
- [ ] Cekim gecmisi listesi:
  - Pending: sari badge "Isleniyor"
  - Completed: yesil badge "Tamamlandi"
  - Rejected: kirmizi badge "Reddedildi" + admin notu
- [ ] Cekim tarihleri goruntuleniyor

### 8. Panel Tasima Kurallari — `/panel/tasima-kurallari`

- [ ] Sayfa panel icinde yuklenebiliyor (sidebar aktif, header/footer mevcut)
- [ ] CustomPage icerigi dogru goruntuleniyor
- [ ] Sidebar nav'da "Tasima Kurallari" linki hem musteri hem tasiyici goruyor
- [ ] Mobil bottom nav'da da goruntuleniyor

### 9. Kayit Formu — `/uye-ol`

- [ ] Checkbox goruntuleniyor: "Tasima Kurallari ve Kullanim Kosullarini okudum ve kabul ediyorum"
- [ ] "Tasima Kurallari" linki yeni sekmede `/tasima-kurallari` aciyor
- [ ] "Kullanim Kosullari" linki yeni sekmede `/kullanim-kosullari` aciyor
- [ ] Checkbox isaretlenmeden submit → Zod hata mesaji: "Kurallari kabul etmeniz gerekiyor"
- [ ] Checkbox isaretli + form gecerli → kayit basarili
- [ ] Responsive: checkbox + metin mobilde tasmıyor

### 10. Admin Para Cekim — `/admin/cekim`

- [ ] Tum cekim talepleri listeleniyor: kullanici adi, tutar, banka (IBAN), durum, tarih
- [ ] Pending talepler: "Onayla" + "Reddet" butonlari
- [ ] Reddet: admin_notes textarea goruntuleniyor (neden zorunlu)
- [ ] Onaylanan talepler: "Tamamlandi" badge + islem tarihi
- [ ] Reddedilen talepler: "Reddedildi" badge + admin notu + islem tarihi
- [ ] Admin nav'da "Para Cekim" linki goruntuleniyor

### 11. CP-22 Responsive

- [ ] Cuzdan tab bar: mobilde yatay scroll
- [ ] Para Cek formu: mobilde tam genislik
- [ ] Cekim gecmisi kartlari: mobilde responsive
- [ ] Kayit checkbox: mobilde satir basi yapiyor, link tiklaniyor
- [ ] Admin cekim listesi: mobilde yatay scroll veya kart gorunumu

### 12. CP-22 Dark Mode

- [ ] Cuzdan bakiye karti: brand renk + beyaz yazi dark mode'da okunuyor mu
- [ ] Para Cek formu: input/button dark mode uyumu
- [ ] Cekim gecmisi badge renkleri: dark mode gorunurluk
- [ ] Kayit checkbox: label + link renkleri dark mode'da yeterli kontrast
- [ ] Admin cekim sayfasi: tablo/kart dark mode uyumu

### 13. CP-22 Hata Durumlari

- [ ] Para Cek: bakiyeden fazla tutar → "Yetersiz bakiye" mesaji
- [ ] Para Cek: banka hesabi yokken → uyari + yonlendirme
- [ ] Para Cek: 0 veya negatif tutar → validasyon hatasi
- [ ] Kayit: checkbox bos + submit → hata mesaji
- [ ] Admin: reddet butonuna tiklarken notes bos → uyari

---

## Dosya Haritasi

### CP-21 (mevcut)
| Dosya | Icerik |
|-------|--------|
| `app/panel/tasiyici/page.tsx` | Shell: stats + 4 tab |
| `app/panel/tasiyici/_components/TaleplerTab.tsx` | Aktif bookings + aksiyonlar |
| `app/panel/tasiyici/_components/IlanlarimTab.tsx` | Ilan yonetimi |
| `app/panel/tasiyici/_components/GecmisTab.tsx` | Teslim/iptal bookings |
| `app/panel/tasiyici/_components/FinansTab.tsx` | Kazanc + banka CRUD + odemeler |
| `app/panel/musteri/page.tsx` | Shell: stats + banner + BookingList |
| `app/panel/musteri/_components/BookingList.tsx` | Booking listesi + kargo takip |
| `app/panel/musteri/_components/RatingForm.tsx` | Yildiz + yorum formu |
| `app/(public)/tasima-kurallari/page.tsx` | CustomPageView render |

### CP-22 (yeni)
| Dosya | Icerik |
|-------|--------|
| `app/panel/cuzdan/page.tsx` | Shell: bakiye + tab (role-aware) |
| `app/panel/cuzdan/_components/BakiyeCard.tsx` | Bakiye + kazanc + cekim ozet |
| `app/panel/cuzdan/_components/IslemlerTab.tsx` | Filtreli islem listesi |
| `app/panel/cuzdan/_components/ParaCekTab.tsx` | Cekim formu + gecmis |
| `app/panel/cuzdan/_components/DepositTab.tsx` | Iyzico bakiye yukleme |
| `app/panel/tasima-kurallari/page.tsx` | Panel icinde CustomPageView |
| `app/panel/layout.tsx` | Nav'a Tasima Kurallari ekleme |
| `app/uye-ol/page.tsx` | Kural onay checkbox |
| `app/admin/cekim/page.tsx` | Admin para cekim yonetimi |
| `app/admin/layout.tsx` | Nav'a Para Cekim ekleme |
| `modules/withdrawal/` | Tip + servis (2 dosya) |

---

## Rapor Formati

```markdown
## CP-21 + CP-22 Dogrulama Raporu

**Tarih:** YYYY-MM-DD
**Test Eden:** Antigravity
**Faz:** 1 (CP-21) / 2 (CP-22)

### Sonuclar
| # | Sayfa | Gorsel | Responsive | Dark Mode | Notlar |
|---|-------|--------|-----------|-----------|--------|
| 1 | /panel/tasiyici (Talepler) | OK/FAIL | OK/FAIL | OK/FAIL | |
| 2 | /panel/tasiyici (Gecmis) | OK/FAIL | OK/FAIL | OK/FAIL | |
| 3 | /panel/tasiyici (Finans) | OK/FAIL | OK/FAIL | OK/FAIL | |
| 4 | /panel/musteri | OK/FAIL | OK/FAIL | OK/FAIL | |
| 5 | /tasima-kurallari | OK/FAIL | OK/FAIL | OK/FAIL | |
| 6 | /panel/cuzdan (Yukle) | OK/FAIL | OK/FAIL | OK/FAIL | |
| 7 | /panel/cuzdan (Islemler) | OK/FAIL | OK/FAIL | OK/FAIL | |
| 8 | /panel/cuzdan (Para Cek) | OK/FAIL | OK/FAIL | OK/FAIL | |
| 9 | /panel/tasima-kurallari | OK/FAIL | OK/FAIL | OK/FAIL | |
| 10 | /uye-ol (checkbox) | OK/FAIL | OK/FAIL | OK/FAIL | |
| 11 | /admin/cekim | OK/FAIL | OK/FAIL | OK/FAIL | |

### Bulunan Sorunlar
1. [KRITIK/ORTA/DUSUK] Aciklama + screenshot
2. ...

### Aksiyonlar
- [ ] Fix gorevi → atanacak arac
```

---

## Test Senaryolari

### Senaryo A: Tasiyici Para Cekme (E2E)
```
1. Tasiyici hesabina giris yap
2. /panel/tasiyici → Finans tab → banka hesabi ekle (IBAN, ad, banka)
3. /panel/cuzdan → Para Cek tab
4. Cekim tutari gir → "Para Cek" tikla
5. Cekim listesinde "Isleniyor" badge goruntuleniyor mu?
6. Bakiye dusmus mu?

7. Admin hesabina giris yap
8. /admin/cekim → pending talep goruntuleniyor mu?
9. "Onayla" tikla → durum "Tamamlandi" oldu mu?

10. Alternatif: "Reddet" tikla → not gir → bakiye geri yazildi mi?
```

### Senaryo B: Kayit + Kural Onay (E2E)
```
1. /uye-ol → formu doldur, checkbox isaretleme → submit → hata mesaji
2. Checkbox isaretli → submit → basarili kayit
3. "Tasima Kurallari" linkine tikla → yeni sekmede sayfa aciliyor mu?
```

### Senaryo C: Cuzdan Role-Aware (E2E)
```
1. Musteri giris → /panel/cuzdan → sadece "Bakiye Yukle" + "Islemler" tab
2. Tasiyici giris → /panel/cuzdan → "Bakiye Yukle" + "Islemler" + "Para Cek" tab
3. Musteri "Para Cek" tab gormuyor
```
