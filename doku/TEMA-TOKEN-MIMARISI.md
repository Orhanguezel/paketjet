# Tema token mimarisi

Tema kaydı backend `theme_config` tablosunda iki ayrı kapsamda tutulur: `storefront` ve `admin-panel`. Her kapsam aynı şemayı kullanır; kaydedilmemiş tema için API `enabled: false` ve kapsamın varsayılanlarını döndürür.

- Renklerin veri kaynağı: `backend/src/modules/theme/scoped-defaults.ts` ve kaydedilmiş kapsam satırı.
- Site CSS üreticisi: `frontend/src/lib/storefront-theme-css.ts`. Sunucu ilk HTML'de, istemci yenilemede aynı fonksiyonu kullanır.
- Panel CSS üreticisi: `admin_panel/src/lib/managed-admin-theme.ts`. Açık ve koyu palet aynı renk girdilerinden üretilir.
- CSS yedek değerleri: her uygulamanın `src/app/globals.css` dosyası. API erişilemediğinde veya tema kaydı bulunmadığında görünüm buradan gelir.
- Sayfa stilleri semantik CSS değişkenlerini ve Tailwind token sınıflarını kullanır. Köşe ölçüleri `--radius` üzerinden ölçeklenir; yüzdeyle tanımlanan daireler ve tam yuvarlak şekiller geometrik istisnadır.
- Ödeme markası görselleri, belge/medya önizlemesi ve yazdırma görünümü kendi tuval renklerini adlandırılmış tokenlarla korur.

Yeni arayüz rengi veya köşe değeri eklerken ilgili tema tokenını tanımlayın; bileşene doğrudan HEX/HSL, Tailwind palet tonu veya piksel köşe değeri eklemeyin. Kontrol: `node tools/check-theme-tokens.mjs`.
