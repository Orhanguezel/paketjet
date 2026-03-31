# PaketJet — Yapılacaklar

## Tamamlanan İşler

### KYC Doğrulama Sistemi
- [x] DB: `carrier_kyc_documents` tablosu + `users` KYC alanları
- [x] Backend: `carrier-kyc/` modülü + admin modülü (onay/red/Iyzico)
- [x] Backend: İlan açma KYC kontrolü (`kyc_required`)
- [x] Frontend: "Doğrulama" tab + ilan açma KYC engeli
- [x] Admin Panel: KYC sayfası (`/admin/kyc`) + detay + sidebar

### Profil & Panel
- [x] Profil: Şifre değiştirme (mevcut şifre doğrulama)
- [x] Profil: Avatar yükleme URL düzeltmesi
- [x] Panel: Footer/header standardizasyonu

### Booking Akışı
- [x] Rezervasyon 500 → `400 insufficient_balance`
- [x] Label düzeltmeleri: "Kargoyu Aldım" / "Teslim Ettim"
- [x] İptal takibi: `cancellation_count` + otomatik sayaç
- [x] Karşılıklı profil: Onaylanan booking'de taşıyıcı adı

### Teslim Onay Akışı
- [x] `awaiting_delivery_confirmation` status
- [x] Müşteri "Teslim Aldım" → ödeme taşıyıcıya aktarılıyor
- [x] `PATCH /bookings/:id/confirm-delivery` endpoint
- [x] 4 adımlı kargo takip

### Mesajlaşma & Anlaşmazlık
- [x] `booking_messages` + `disputes` tabloları
- [x] `booking-messages/` + `disputes/` backend modülleri
- [x] `BookingChat` + `DisputeSection` frontend bileşenleri
- [x] Admin Panel: Dispute yönetim sayfası (`/admin/disputes`)

### Iyzico & Raporlar
- [x] Iyzico gerçek sub-merchant API (create/update/retrieve)
- [x] KYC onayında otomatik Iyzico sub-merchant oluşturma
- [x] Komisyon kesintisi detay raporu (`GET /admin/reports/commissions`)

### Build & Deploy
- [x] KYC durum bildirim (onay/red)
- [x] Backend type-check temiz
- [x] Frontend + admin panel build başarılı
- [x] DB seed'ler çalıştırıldı (036, 037, 038)
- [x] Canlı deploy tamamlandı

---

## Kalan İşler

### Sonraki Sprint
- [ ] Header/Footer tek kaynak: root layout'ta tüm sayfalara (login/register hariç)
- [ ] Admin panel categories key/value düzeltmesi
