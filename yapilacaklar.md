# PaketJet — Yapılacaklar

## Tamamlanan İşler (Bu Oturum)

### KYC Doğrulama Sistemi
- [x] DB: `carrier_kyc_documents` tablosu + `users` KYC alanları
- [x] Backend: `carrier-kyc/` modülü (upload, status, delete) + admin modülü (onay/red/Iyzico)
- [x] Backend: İlan açma KYC kontrolü (`kyc_required`)
- [x] Frontend: "Doğrulama" tab (taşıyıcı paneli) + ilan açma KYC engeli
- [x] Admin Panel: KYC sayfası (`/admin/kyc`) + detay + sidebar

### Profil & Panel
- [x] Profil: Şifre değiştirme (mevcut şifre doğrulama)
- [x] Profil: Avatar yükleme URL düzeltmesi
- [x] Panel: Footer/header standardizasyonu

### Booking Akışı
- [x] Rezervasyon 500 hatası → `400 insufficient_balance`
- [x] Label düzeltmeleri: "Kargoyu Aldım" / "Teslim Ettim"
- [x] İptal takibi: `cancellation_count` + otomatik sayaç
- [x] Karşılıklı profil: Onaylanan booking'de taşıyıcı adı görünür

### Teslim Onay Akışı
- [x] `awaiting_delivery_confirmation` status eklendi
- [x] Taşıyıcı "Teslim Ettim" → müşteri onayı bekleniyor
- [x] Müşteri "Teslim Aldım" → ödeme taşıyıcıya aktarılıyor
- [x] Backend: `PATCH /bookings/:id/confirm-delivery` endpoint
- [x] Frontend: 4 adımlı kargo takip (Onaylandı → Kargo Alındı → Teslim Onayı → Tamamlandı)

### Mesajlaşma & Anlaşmazlık
- [x] DB: `booking_messages` + `disputes` tabloları (`038_messages_schema.sql`)
- [x] Backend: `booking-messages/` modülü (GET/POST mesajlar, okundu işaretleme)
- [x] Backend: `disputes/` modülü (açma, listeleme, admin çözüm)
- [x] Frontend: `BookingChat` bileşeni (15sn polling)
- [x] Frontend: `DisputeSection` bileşeni (anlaşmazlık açma/görüntüleme)
- [x] Her iki panelde (müşteri + taşıyıcı) mesaj/dispute entegrasyonu
- [x] Admin Panel: Dispute yönetim sayfası (`/admin/disputes`) + sidebar

### Build & Altyapı
- [x] KYC durum değişikliğinde bildirim (onay/red)
- [x] Backend type-check temiz
- [x] Frontend build başarılı
- [x] ArticleSchema prop düzeltmeleri (blog + rota)
- [x] Iyzico SDK type fix

---

## Kalan İşler

### Deploy
- [ ] DB seed çalıştırma (036, 037, 038)
- [ ] Commit + push + canlı deploy (frontend + backend + admin panel build)

### Sonraki Sprint
- [ ] Iyzico gerçek API entegrasyonu (sub-merchant create/update)
- [ ] Taşıyıcı bakiye çekme talebi → admin onayı (3-5 gün süre)
- [ ] Komisyon kesintisi detay raporları
- [ ] Admin panel categories key/value düzeltmesi
