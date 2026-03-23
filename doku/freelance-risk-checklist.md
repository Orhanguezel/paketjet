# 🛡️ Freelance Yazılımcı — Risk Kontrol Listesi

> Bu dökümanı her yeni proje başında gözden geçir.

---

## ✅ PROJE BAŞLAMADAN ÖNCE

### Sözleşme
- [ ] Yazılı freelance/geliştirme sözleşmesi imzalandı mı?
- [ ] Sözleşmede "platform yönetimi müşteriye aittir" maddesi var mı?
- [ ] Sözleşmede "yasal uyumluluk müşterinin sorumluluğundadır" yazıyor mu?
- [ ] Ödeme koşulları net mi? (ön ödeme, milestone, teslimde ödeme)
- [ ] Teslim kapsamı (scope) net tanımlandı mı? Kapsam dışı ne?

### Müşteri Tanıma
- [ ] Müşterinin kim olduğunu biliyor musun? (isim, iletişim, şirket)
- [ ] Proje amacı makul ve yasal görünüyor mu?
- [ ] Teklif çok iyi mi geliyor? (çok yüksek ücret + garip proje = dikkat)

---

## 🚨 KOD YAZARKEN — BUNLARI İSTERSE DUR

Müşteri aşağıdakileri isterse **hemen dur, sözleşmeyi feshet:**

- ❌ Kullanıcı takibini gizle / log tutma
- ❌ KYC / kimlik doğrulamayı devre dışı bırak
- ❌ Ödeme sistemini yasal dışı yönlendir
- ❌ Yasak içeriği filtreden geçir
- ❌ Şifreli / gizli veri taşıma modülü
- ❌ Banka, devlet, başka platform gibi görün (phishing)
- ❌ Botnet, spam, scraping (izinsiz)
- ❌ Kullanıcı verisini izinsiz üçüncü tarafa sat

> Bu isteklerden herhangi birini yaparsan "bilerek katkı sağladın" sayılırsın.
> Sözleşme seni korumaz.

---

## ⚠️ RİSKLİ PROJE TİPLERİ — EKSTRA DİKKAT

### Marketplace / İlan Siteleri
- [ ] Kullanıcı içerik sorumluluğu sözleşmede müşteride mi?
- [ ] İçerik moderasyon sistemi müşteri tarafından yönetilecek mi?
- [ ] İhbar/şikayet mekanizması tasarıma dahil edildi mi?
- [ ] Kötüye kullanım senaryoları müşteriyle konuşuldu mu?

### Ödeme / Fintech Sistemleri
- [ ] Ödeme altyapısı lisanslı sağlayıcıdan mı? (iyzico, Stripe vs.)
- [ ] Para akışı direkt sana üzerinden geçmiyor mu?
- [ ] Escrow sistemi varsa yasal danışmanlık alındı mı?

### Kullanıcı Veri Sistemleri
- [ ] KVKK uyumu müşterinin sorumluluğunda mı?
- [ ] Hassas veri (TC kimlik, sağlık, konum) nasıl saklanacak?
- [ ] Veri ihlali durumunda sorumluluk kime ait?

### Taşımacılık / Lojistik Platformları
- [ ] Taşımacılık lisansı (K belgesi) sorumluluğu müşteride mi?
- [ ] Yasadışı yük beyanı sorumluluğu sözleşmede kullanıcıda mı?
- [ ] KYC zorunlu mu tasarımda?

---

## 📋 TESLİMAT SIRASINDA

- [ ] Teslim ettiğin kod dokümante edildi mi?
- [ ] "Ben geliştirdim, teslim ettim" yazılı onayı aldın mı?
- [ ] Kaynak kodu teslimini yazılı belgeledin mi?
- [ ] Sonraki bakım/destek kapsamı netleştirildi mi?

---

## 💡 GENEL HATIRLATMALAR

```
Seni koruyan şey:
  ✓ İyi yazılmış sözleşme
  ✓ Müşterinin kim olduğunu bilmek
  ✓ Açıkça yasadışı isteklere "hayır" demek
  ✓ Teslim belgesi

Seni korumayan şey:
  ✗ "Para iyi geliyordu"
  ✗ "Müşteri iyi biri gibiydi"
  ✗ "Sadece kod yazdım zaten"  ← yasadışı istek varsa geçersiz
```

---

*Son güncelleme: 2026 — Türk hukuku bağlamında hazırlanmıştır.*
*Bu döküman hukuki tavsiye değildir, genel bir hatırlatma listesidir.*
