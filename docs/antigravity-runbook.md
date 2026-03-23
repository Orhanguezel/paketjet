# Antigravity Runbook

Bu dosya Fraz 4 dogrulamasini tek akista yurutmek icin hazirlandi.

Referanslar:
- `docs/antigravity-kb.md`
- `docs/orkestra-sefi-rehberi.md`

---

## 1. On Kosullar

- [ ] Backend ayakta
- [ ] Frontend ayakta
- [ ] Admin panel ayakta
- [ ] Production veya lokal hedef URL'ler net
- [ ] Test kullanici bilgileri hazir
- [ ] PD-1 env tamamladi
- [ ] IG-2 monitoring kuruldu veya planlandi

Lokal URL'ler:
- Backend: `http://localhost:8078`
- Frontend: `http://localhost:3000`
- Admin: `http://localhost:3030`

Canli URL'ler:
- Backend: `https://api.paketjet.com`
- Frontend: `https://paketjet.com`
- Admin: `https://admin.paketjet.com`

---

## 2. Hazir Prompt

```text
PaketJet dogrulama gorevi.

Baglam:
- Proje: PaketJet
- Frontend: https://paketjet.com
- Backend API: https://api.paketjet.com
- Admin Panel: https://admin.paketjet.com
- Swagger: https://api.paketjet.com/api/docs
- Health: https://api.paketjet.com/api/health

Gorevler:
1. Health endpoint'i ac:
   - https://api.paketjet.com/api/health
   - HTTP 200 donuyor mu?
   - JSON icinde status/db/redis alanlarini kontrol et
   - Screenshot al

2. Frontend anasayfayi ac:
   - https://paketjet.com
   - Sayfa yukleniyor mu?
   - Responsive kontrol yap: 375px, 768px, 1280px
   - Screenshot al

3. Swagger kontrolu:
   - https://api.paketjet.com/api/docs
   - Swagger UI aciliyor mu?
   - En az 20 endpoint gorunuyor mu?
   - Authorize butonu var mi?
   - Screenshot al

4. Ilanlar akis kontrolu:
   - /ilanlar sayfasina git
   - Ilan listesi yukleniyor mu?
   - Filtreler calisiyor mu?
   - Bir ilan detayina gecis calisiyor mu?

5. Login ve panel akisi:
   - Musteri hesabiyla giris yap
   - /panel/musteri aciliyor mu?
   - Tasiyici hesabiyla giris yap
   - /panel/tasiyici aciliyor mu?
   - Gelen Talepler ve Ilanlarim alanlari gorunuyor mu?

6. Error state kontrolu:
   - Bilinmeyen bir route ac ve not-found ekranini kontrol et
   - Mumkunse hata fallback / error boundary davranisini not et

7. Lighthouse:
   - Anasayfa
   - /ilanlar
   - /panel/musteri
   - Skorlari raporla

8. Rapor:
   - Bulunan sorunlari KRITIK / ORTA / DUSUK diye sinifla
   - Her sorun icin kisa aciklama ver
   - Mumkunse screenshot veya sayfa linki ekle
```

---

## 3. Kontrol Listesi

### Fraz 1 Dogrulamasi
- [ ] `/api/health` 200 dondu
- [ ] Response icinde `status`, `db`, `redis` goruldu
- [ ] Anasayfa yuklendi
- [ ] Responsive kontrol yapildi
- [ ] Login akisi test edildi
- [ ] Anasayfa Lighthouse sonucu alindi

### Fraz 2 Dogrulamasi
- [ ] Swagger UI acildi
- [ ] En az 20 endpoint goruldu
- [ ] Authorize butonu goruldu
- [ ] `/ilanlar` sayfasi yuklendi
- [ ] Filtreler test edildi
- [ ] Ilan detay gecisi calisti
- [ ] Tasiyici paneli temel akis kontrol edildi
- [ ] Ilgili Lighthouse sonuclari alindi

### Fraz 3 Dogrulamasi
- [ ] Sentry kurulumuna dair gozlemsel hata yok
- [ ] Error boundary sayfalari beklendigi gibi gorundu
- [ ] `not-found` sayfasi beklendigi gibi gorundu

---

## 4. Hedef Skorlar

- [ ] Anasayfa: Performance `80+`
- [ ] Anasayfa: Accessibility `90+`
- [ ] `/ilanlar`: Performance `75+`
- [ ] `/ilanlar`: Accessibility `90+`
- [ ] `/panel/musteri`: Performance `75+`
- [ ] `/panel/musteri`: Accessibility `85+`

---

## 5. Sonuc Siniflandirma

### KRITIK
- Uygulama acilmiyor
- Login calismiyor
- Booking / panel ana akis bloklu
- Health endpoint bozuk

### ORTA
- Responsive kirilimlar
- Swagger eksik ama API calisiyor
- Error boundary beklenenden farkli
- Lighthouse ciddi dusuk ama akis calisiyor

### DUSUK
- Metin / spacing / gorsel hizalama
- Kucuk icon / button / skeleton sorunlari

---

## 6. Rapor Taslagi

```md
## PaketJet Antigravity Raporu

Tarih: YYYY-MM-DD
Ortam: local | production
Test Eden: Antigravity

### Kontrol Ozeti
- Health: OK / FAIL
- Frontend: OK / FAIL
- Swagger: OK / FAIL
- Musteri Panel: OK / FAIL
- Tasiyici Panel: OK / FAIL
- Error Pages: OK / FAIL

### Lighthouse
- Anasayfa: P:__ A:__ BP:__ SEO:__
- /ilanlar: P:__ A:__ BP:__ SEO:__
- /panel/musteri: P:__ A:__ BP:__ SEO:__

### Bulunan Sorunlar
1. [KRITIK|ORTA|DUSUK] Aciklama
2. [KRITIK|ORTA|DUSUK] Aciklama

### Sonraki Aksiyon
- [ ] Codex fix gorevi ac
- [ ] Copilot ile kucuk duzeltme yap
- [ ] Merge icin uygun
```

---

## 7. Kapanis

- [ ] Antigravity raporu alindi
- [ ] Sorunlar severity bazli ayrildi
- [ ] Gerekirse fix gorevleri acildi
- [ ] Orkestra sefi checklist'inde ilgili kutular isaretlenebilir
