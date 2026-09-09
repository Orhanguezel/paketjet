# Tasarım uygulama ve karşılaştırma kaydı

Referanslar `output/imagegen/` altında; uygulama ekranları `output/verification/2026-09-09/` altında. Yapay görseller ürün ekranı veya canlı veri kanıtı değildir. Marka logosu korunur; beyaz yüzey, lacivert metin/sidebar, mor işlem rengi, ölçülü kenarlık ve boşluk uygulanır.

| Aile | Referans | Uygulama ve bilinçli fark |
| --- | --- | --- |
| Ana sayfa | home-final.png, mobile-final.png | Arama ilk ekranda, video örtüsü yok. Gerçek aktif ilan yoksa örnek kart üretilmez; dürüst boş durum. Footer 5 sütundan mobil 1/2 sütuna geçer. |
| Liste | listing-final.png | Rota/tarih/araç önceliği; filtreler URL'de. Kartta iletişim ücreti taşıma bedelinden ayrılır. Gerçek ad/avatar ve yeşil online noktası kaldırıldı. |
| Detay | detail-final.png | Üstte rota/durum, yanında erişim. Mobilde tek kolon; harita ikincil. Alıcıya telefon/e-posta ve kalıcı snapshot gösterilir. |
| İlan formu | form-final.png | Rota/tarih → araç/açıklama → özel iletişim → önizleme; incelemeye gönderme sonucu açık. |
| Kullanıcı paneli | panel-final.png | Kompakt sidebar/mobil menü; bakiye, kişisel ilan ve alımlar ayrı. Haklar ekranında paket, kalan adet ve ledger ayrılır. |
| Admin | admin-final.png | Lacivert sidebar, beyaz içerik, mor işlemler. Gerçek ödeme/mutabakat KPI'ları; liste/detayda filtre ve geçmiş. Arşiv TL ikinci defa gelir sayılmaz. |
| Ödeme/komponent | ui-preview (yalnız geliştirme) | Referansın renk/boşluk sistemi Button/Input/Combobox/Dialog normal, disabled, loading, error ve success durumlarına uygulanır. Üretimde örnek ekran 404'tür. |

## Ortak kararlar

- 4/8 tabanlı boşluk; gövde 14–16 px, kısa etiket 14 px; 400/500/600 ve sınırlı 700 ağırlık. Ana ekran metinlerinde gereksiz mikro/bold bloklar azaltıldı.
- İşlem arka planı `bg-action`, metin/ikon vurgusu `text-brand`; koyu temada beyaz düğme metninin kontrastı için ayrı action token. Arka plan/yüzey/kenarlık token'ları frontend ve admin karşılıklarıyla uygulanır.
- Yuvarlatma ağırlıklı 8–12 px; gölge yalnız katman/menüde. İkonlar Lucide, logo özgün medya varlığı. Destek sayfasındaki emoji/dekoratif ofis haritası kaldırıldı.
- `data-theme="dark"` frontend temasıdır. Admin mevcut Shadcn tema altyapısını korur. Screenshot tema değişiminden 300 ms sonra alınır; geçişin ortası karşılaştırılmaz.
- 360/390/768/1280/1440 px ve %200 zoom matrisi `visual-matrix.json` içinde. Screenshot tek başına klavye kanıtı değildir; combobox ArrowDown/Enter, dialog focus/Escape/focus return ve mobil menü Escape ayrı test edilir.
- Hareket kullanıcı görevini durdurmaz; reduced-motion CSS geçiş/animasyonları azaltır. Harita ve ödeme sağlayıcısı hatası ana sayfayı veya formu kilitlemez.

## Kontrol yöntemi

Konsept ve uygulama; başlık hiyerarşisi, CTA sırası, kolon düzeni, renk ailesi, logo ve boşluk yönünden karşılaştırılır. Üretilmiş görseldeki gerçek olmayan rakamlar ve metin hataları kopyalanmaz. Son kabul; görünür ekran, gerçek API senaryosu ve yatay taşma/hata matrisi birlikte geçince verilir. Ekran görüntüleri test kullanıcılarıyla alınır.

## Canlı son tur

`live-home/list/login/contact-390.png` ve1440 karşılıkları gerçek üretim ekranlarıdır. Yeni admin girişi tek kart, gerçek PaketJet logosu, belirgin başlık,48px alan/düğme ve parola görünürlüğü kullanır; çalışmayan30 gün hatırla vaadi kaldırıldı. `admin-login-final.json` gerçek yerel admin hesabıyla giriş ve satın alma ekranına dönüşü, `live-admin-login-final.json` son canlı ekranı doğrular.

Aynı Chrome mobil laboratuvar koşulunda üç koşunun ortancası: LCP5,612sn →0,728sn; CLS0,19056 →0,00211. Otomatik video sayısı4 →0. Transfer boyutu574.423 →568.397 bayt; büyük bir JavaScript boyut düşüşü iddiası yok. Saha INP verisi ölçülmedi. Kanıt `performance-before.json`, `performance-after.json`.
