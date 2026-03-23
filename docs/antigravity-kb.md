# Antigravity Knowledge Base — PaketJet

## Proje

PaketJet: P2P kargo pazaryeri platformu.
- Tasiyicilar guzergah/kapasite ilani acar
- Musteriler kargo alani satin alir
- Platform: rezervasyon, odeme, takip, degerlendirme

## URL'ler

| Uygulama | Lokal URL | Canli URL |
|----------|-----------|-----------|
| Frontend | http://localhost:3000 | https://paketjet.com |
| Backend API | http://localhost:8078 | https://api.paketjet.com |
| Admin Panel | http://localhost:3030 | https://admin.paketjet.com |
| Swagger Docs | http://localhost:8078/api/docs | https://api.paketjet.com/api/docs |
| Health Check | http://localhost:8078/api/health | https://api.paketjet.com/api/health |

## Test Kullanicilari

| Rol | Email | Sifre |
|-----|-------|-------|
| Musteri | test@customer.com | (seed'den kontrol et) |
| Tasiyici | test@carrier.com | (seed'den kontrol et) |
| Admin | admin@paketjet.com | (seed'den kontrol et) |

## Sayfa Haritasi

### Public Sayfalar
| Sayfa | URL | Kontrol Edilecekler |
|-------|-----|---------------------|
| Anasayfa | `/` | Hero arama, son ilanlar, istatistikler |
| Ilanlar | `/ilanlar` | Filtreler (sehir, tarih), pagination, skeleton loading |
| Ilan Detay | `/ilanlar/[id]` | Harita, kapasite, fiyat hesaplama, rezervasyon formu |
| Ilan Ver | `/ilan-ver` | 4 adimli wizard (guzergah → kapasite → iletisim → onizleme) |
| Giris | `/giris` | Email/sifre, hata mesajlari, `?next=` redirect |
| Uye Ol | `/uye-ol` | Rol secimi (tasiyici/musteri), form validation |
| Fiyatlandirma | `/fiyat` | Plan kartlari (Free/Starter/Pro/Business) |
| Iletisim | `/iletisim` | Contact form |

### Musteri Paneli (auth gerekli)
| Sayfa | URL | Kontrol Edilecekler |
|-------|-----|---------------------|
| Dashboard | `/panel/musteri` | Istatistikler, booking listesi, iptal butonu |
| Cuzdan | `/panel/cuzdan` | Bakiye karti, deposit form, islem gecmisi |
| Bildirimler | `/panel/bildirimler` | Okunmamis vurgulu, "tumunu oku" |
| Profil | `/panel/profil` | Isim/telefon guncelleme |

### Tasiyici Paneli (auth gerekli)
| Sayfa | URL | Kontrol Edilecekler |
|-------|-----|---------------------|
| Dashboard | `/panel/tasiyici` | "Gelen Talepler" + "Ilanlarim" tab |
| Ilan Duzenle | `/panel/tasiyici/ilanlar/[id]/duzenle` | Pre-filled form, kaydet |

### Admin Panel (admin auth gerekli)
| Sayfa | URL | Kontrol Edilecekler |
|-------|-----|---------------------|
| Dashboard | `/admin` | Ozet istatistikler |
| Ilanlar | `/admin/ilanlar` | Filtre, durum degistirme |
| Bookings | `/admin/bookings` | Status workflow |
| Kullanicilar | `/admin/users` | Rol etiketleri (Turkce) |
| Cuzdan | `/admin/cuzdan` | Bakiye yonetimi |
| Raporlar | `/admin/raporlar` | KPI raporu |

## Dogrulama Senaryolari

### Senaryo 1: Tam Booking Akisi
```
1. /uye-ol → musteri hesabi olustur
2. /panel/cuzdan → bakiye yukle (deposit)
3. /ilanlar → bir ilan sec
4. /ilanlar/[id] → kg gir, "Rezerve Et"
5. /panel/musteri → booking goruntule (pending)

6. (Tasiyici olarak giris yap)
7. /panel/tasiyici → "Gelen Talepler" → "Onayla"
8. Booking durumu: confirmed

9. /panel/tasiyici → "Yola Cikti" → "Teslim Edildi"
10. Tasiyicinin cuzdanina odeme gectii?
```

### Senaryo 2: Responsive Kontrol
```
Her sayfa icin 3 gorunum:
- Mobil: 375px
- Tablet: 768px
- Desktop: 1280px

Ozellikle kontrol:
- Header: hamburger menu (mobil) vs full nav (desktop)
- IlanCard grid: 1 sutun (mobil) vs 3 sutun (desktop)
- Panel sidebar: bottom nav (mobil) vs sidebar (desktop)
- Ilan-ver wizard: tek sutun (mobil) vs genis form (desktop)
```

### Senaryo 3: Dark Mode
```
1. Tema toggle butonuna tikla
2. Tum sayfalarda kontrast kontrolu
3. Token class'lar dogru calisiyor mu?
4. Grafik/chart'lar okunabiliyor mu?
```

### Senaryo 4: Hata Durumlari
```
1. Bos form submit → Zod hata mesajlari (Turkce)
2. Yanlis sifre → "Email veya sifre hatali"
3. Yetersiz bakiye → "Yetersiz bakiye" mesaji
4. 404 sayfa → Ozel not-found sayfasi
5. API down → Error boundary / fallback
```

### Senaryo 5: Lighthouse
```
Hedefler:
- Anasayfa: Performance 80+, Accessibility 90+, SEO 90+
- /ilanlar: Performance 75+, Accessibility 90+
- /panel/musteri: Performance 75+, Accessibility 85+
```

## Rapor Formati

```markdown
## PaketJet Dogrulama Raporu

**Tarih:** YYYY-MM-DD
**Branch:** xxx
**Test Eden:** Antigravity

### Sonuclar
| Sayfa | Gorsel | Responsive | Dark Mode | Lighthouse |
|-------|--------|-----------|-----------|------------|
| Anasayfa | OK/FAIL | OK/FAIL | OK/FAIL | P:XX A:XX |
| /ilanlar | OK/FAIL | OK/FAIL | OK/FAIL | P:XX A:XX |
| ...

### Bulunan Sorunlar
1. [KRITIK/ORTA/DUSUK] Aciklama + screenshot
2. ...

### Aksiyonlar
- [ ] Fix gorevi 1 → Codex'e ver
- [ ] Fix gorevi 2 → Copilot ile duzelt
```
